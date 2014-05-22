import sys
from .models import Article
from .models import Author
from .models import STATUS_VALUE_DICT
from rest_framework import status

def check_article_create_permissions(user, DATA):
    user_permissions = user.user_permissions
    
    if "status" not in DATA or not DATA["status"]:
        DATA["status"] = "draft"


    if "create_articles" not in user_permissions:
        if not (has_attr(user, "num_drafts") and has_attr(user, "invitation_count")):
            return {"ok" : "false"}

        if DATA["status"] == "draft":
            if user.num_drafts < user.invitation_count:
                user.num_drafts = user.num_drafts + 1
            else:
                return { "ok" : "false", "code" : "no_permission", "message" : "You are not allowed more drafts", "status" : status.HTTP_403_FORBIDDEN }
        else:
            if DATA["status"] == "published" and "publish_articles" not in user_permissions:
                return {"ok" : "false", "code" : "no_permission", "message" : "You are not allowed to publish article", "status" : status.HTTP_403_FORBIDDEN }
            if user.invitation_count <= 0:
                return {"ok" : "false", "code" : "no_permission", "message" : "You cannot submit anymore opinions", "status" : status.HTTP_403_FORBIDDEN }
            else:
                user.invitation_count = user.invitation_count - 1

    else:
        if DATA["status"] is "published" and "publish_articles" not in user_permissions:
            return { "ok" : "false", "code" : "no_permission", "message" : "You are not allowed more drafts", "status" : status.HTTP_403_FORBIDDEN }

    
    return {"ok" : "true", "status" : status.HTTP_200_OK}

def check_article_update_permissions(user, DATA, article):
    user_permissions = user.user_permissions

    author = article.author

    if "status" not in DATA or DATA["status"] == None:
        return {"ok" : "false", "code" : "bad_status", "message" : "Opinion cannot have blank status",
                "status" : status.HTTP_400_BAD_REQUEST }

    
    if author.id == user.id:
        if "edit_article" not in user_permissions:
            if author.invitation_count <0:
                return {"ok" : "false", "code" : "no_permission", "message" : "You cannot edit anymore opinions", "status" : status.HTTP_403_FORBIDDEN }
            
            if DATA["status"] == "published":
                check_status_permission(user_permissions, "published")
            if article.status == "published" or article.status == "pending_review":
                return {"ok" : "false", "code" : "bad_status", "message" : "You cannot edit opinion that is " + STATUS_VALUE_DICT[article.status],
                "status" : status.HTTP_400_BAD_REQUEST }
    else:
        skipattrs = ["id", "status"]
        if "edit_others_articles" not in user_permissions and has_values_changed(article, DATA, skipattrs):
            return {"ok" : "false", "code" : "no_permission", "message" : "You do not have the permission to edit others Opinions",
                "status" : status.HTTP_403_FORBIDDEN }
        
        logic_array = get_status_change_logic(article, DATA)
        if logic_array == None:
            return {"ok" : "false", "code" : "status_change_not_allowed", "message" : "Opinion status not allowed",
                "status" : status.HTTP_400_BAD_REQUEST }

        for logic in logic_array.split(","):
            this_module = sys.modules[__name__]
            logic_check = getattr(this_module, logic)(user, author, status)
            if logic_check["ok"] == "false":
                return logic_check

        #log to file

    return { "ok" : "true" }
        

edit_article_dict = {
    "status_logic_array": [
        {
            "edit.article.other.old.status": "ready for review",
            "edit.article.other.new.status": "draft",
            "edit.article.other.logic": "check_permission"
        },
        {
            "edit.article.other.old.status": "ready for review",
            "edit.article.other.new.status": "published",
            "edit.article.other.logic": "check_status_others_permission,decrement_invitation_count"
        }
    ],
    "status_permission_others_map": {
        "published": "publish_others_articles",
        "draft": "publish_others_articles"
    },
    "status_permission_map": {
        "published": "publish_articles"
    }
}


def has_values_changed(article, DATA, skipattrs):
    for attr in DATA:
        print attr + DATA[attr]
        if attr in skipattrs:
            continue
        if DATA[attr] != getattr(article, attr):
            return True

    return True

def get_status_change_logic(article, DATA):
    status_logic_array = edit_article_dict["status_logic_array"]
    for status_logic_json in status_logic_array:
        if DATA["status"] == status_logic_json["edit.article.other.new.status"] and article.status == status_logic_json["edit.article.other.old.status"]:
            return status_logic_json["edit.article.other.logic"]

    return None


def check_status_permission(user_permissions, status):
    status_permission = None
    try:
        status_permission = edit_article_dict["status_permission_map"][status]
    except Exception:
        return True

    if status_permission in user_permissions:
        return True
    return False
    
def check_status_others_permission(user, author, status):
    user_permissions = user.user_permissions
    status_permission = None
    try:
        status_permission = edit_article_dict["status_permission_others_map"][status]
    except Exception:
        return { "ok" : "true" }


    if status_permission in user_permissions:
        return { "ok" : "true" }
    return { "ok" : "false", "code" : "permission_denied", "message" : "You do not have the permission to set the status" }
    
def decrement_invitation_count(user, author, status):
    author.num_draft = author.num_draft -1
    author.invitation_count = author.invitation_count - 1
    author.save()
    return { "ok" : "true" }

def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

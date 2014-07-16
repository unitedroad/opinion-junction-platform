import sys
import os
import re
import hashlib
from newsoftheworld import settings
from .models import Article
from .models import Author
from .models import STATUS_VALUE_DICT
from .models import Metadata
from rest_framework import status
from allauth.account.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth.models import User


LOCATION_PROFILE_IMAGES = os.path.join(settings.MEDIA_ROOT, 'ojprofileimages')
URL_PROFILE_IMAGES = settings.MEDIA_URL + 'ojprofileimages/' 


def check_valid_object_id(**kwargs):
    if "id" in kwargs:
        return re.match("^[0-9a-fA-F]{24}$", kwargs["id"]) != None
    return False
     

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
        print attr + str(DATA[attr])
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

def check_error_for_logged_in_user(request):
    if request.user and request.user.id:
        pass
    else:
        return {"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in", 
                         "status" : status.HTTP_401_UNAUTHORIZED  }
    
    author_list = Author.objects(id=str(request.user.id))
        
    if len (author_list) < 1:
        return {"ok" : "false", "code" : "user_not_setup_for_oj", 
                "message" : "Your account has not been configured for Opinion Junction, please contact administrator",
                "status" : status.HTTP_400_BAD_REQUEST }

    else:
        return {"ok" : "true", "result": author_list }
        
def get_categories():
    return Metadata.objects.filter(entry_type="category")

def get_articles_by_categories(categories, GET):
    articlesByCategories = []
    
    for category in categories:
        print "category.name: " + category.name
        articlesByCategory = Article.objects(categories__contains=category.name)
        if 'limit_pc' in GET and is_number(GET['limit_pc']):
           articlesByCategory = articlesByCategory.limit(int(GET['limit_pc']))
        articlesByCategories.extend(articlesByCategory)

    return articlesByCategories

def get_articles_by_category(category, GET):
    articlesByCategory = Article.objects(categories__contains=category).filter(status='published').exclude("storytext","storyplaintext","tags")
    if 'after' in GET:
        articlesByCategory = articlesByCategory.filter(id__gt=GET['after'])

    if 'limit' in GET and is_number(GET['limit']):
        articlesByCategory = articlesByCategory.limit(int(GET['limit']))

    return articlesByCategory

default_created_user_permissions = []

@receiver(user_logged_in, dispatch_uid="101")
def create_oj_user_in_nosql(request, user, sociallogin=None, **kwargs):

#    pass
    author = Author()
    
    if len(Author.objects(id=str(user.id))) > 0:
        return
    permissions = default_created_user_permissions
    if 'permissions' in kwargs:
        permissions = kwargs['permissions']
    
    author.id = str(user.id)
    author.author_name = user.username
    author.first_name = user.first_name
    author.last_name = user.last_name
    author.email_address = user.email
    role = 'Subscriber'
    if 'role' in kwargs:
        role = kwargs['role']
    author.user_role = role
    author.user_permissions = permissions

    print "axl gives users true access by giving them identities of authors" 
    author.save()

    if "return_author" in kwargs and kwargs["return_author"] == True:
        return author

def check_permissions(userid, permissions, all_match=True):
    author = Author.objects().get(id=userid)
    if (all_match == True):
        return all(permission in author.user_permissions for permission in permissions)
    
    return any(permission in author.user_permissions for permission in permissions)

def get_image_url_for_selfhosted(image_name):
    return URL_PROFILE_IMAGES + image_name

def save_image(profile_id, image_name, image_data):
    file_name, file_extension = os.path.splitext(image_name)
    file_name = "profile_" + str(profile_id) + file_extension

    with open(os.path.join(LOCATION_PROFILE_IMAGES, file_name), "wb") as file_handler:
        image_data = re.sub("^.*,","",image_data)
        file_handler.write(image_data.decode('base64'))
    return file_name

def get_gravatar_hash(image_id):
    return hashlib.md5(image_id.lower().strip()).hexdigest()

def get_provider_image_persisted_string(image):
        image = image[len(":@#"):]
        image_array = image.split(":")
        if image_array[0].lower() == "gravatar":
            return ":@#gravatar:" + get_gravatar_hash(image_array[1]) + ":" + image_array[1]
 
def process_image(user, data):
    if "update_image" in data and data["update_image"] == "true":
        print "update_image is true"
        image = data["image"]
        if image.startswith(":@#gravatar") != True:
            image_data = data["image_data"]
            saved_image_name = save_image(user.id, image, image_data)
            return get_image_url_for_selfhosted(saved_image_name)
        else:
            return get_provider_image_persisted_string(image)
    
def change_profile(user, data):
    
    #print "data: " + str(data)
    #user = User.objects.get(id=user_id)
    authors = Author.objects(id=str(user.id))

    author = None
    if len(authors) <= 0:
        author = create_oj_user_in_nosql(None, user, None, return_author=True)
    else:
        author = authors[0]

    if user is not None:
        if "first_name" in data:
            first_name = data["first_name"]
            if first_name is None:
                raise Exception("first_name cannot be null")
            user.first_name = first_name
            author.first_name = data["first_name"]
            if "last_name" in data:
                last_name = data["last_name"]
                if last_name is None:
                    raise Exception("last_name cannot be null")
                user.last_name = last_name
                author.last_name = last_name

        if "update_image" in data and data["update_image"] == "true":
            image = process_image(user, data)
            
            author.image = image

        if "gender" in data:
            author.gender = data["gender"]

        user.save()
        author.save()

        return author


#def get_friendly_name(author):
#    return author.first_name + " " + author.last_name

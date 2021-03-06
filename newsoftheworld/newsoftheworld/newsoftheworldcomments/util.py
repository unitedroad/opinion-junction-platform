
from .models import Comment
from newsoftheworldarticles import util as articlesutil
from rest_framework import status
from django.dispatch import receiver
import django.dispatch

log_user_activity_comment = django.dispatch.Signal(providing_args=["type", "id", "userid_from", "userid_to"])

log_user_activity_vote = django.dispatch.Signal(providing_args=["type", "comment", "vote", "text_excerpt", "userid_to"])

class Comments_Save_Handler(object):
    handler_dict = {}
    #handlers = None
    #def __init__(self, **kwargs):
    #    if "handlers" in kwargs and kwargs["handlers"] is not None:
    #        self.__class__.handler_dict = kwargs["handlers"]
    #        self.handler_dict = {}
    #    #self.handlers = self.__class__.handler_dict
    #
    #    self.__class__.handler_dict = {"a"}
    #    self.handler_dict = {}

    def add_handler(self, event_name, handler):
        if event_name not in self.handler_dict:
            self.handler_dict[event_name] = []
        event_handlers = self.handler_dict[event_name]
        event_handlers.append(handler)

    @staticmethod
    def init_class(handlers):
        handler_dict = handlers

csh_obj = Comments_Save_Handler()

def get_comment_for_id(commentid,**kwargs):
    comments = Comment.objects(id=commentid)
    if "return_queryset" in kwargs and kwargs["return_queryset"] is True:
        return comments
    else:
        return comments[0]

def increment_reply_count(comment_queryset, num_new_replies=1):
        comment_queryset.update_one(inc__num_replies=num_new_replies)


        #comment.save()

#def comment_update_article_info(request, comment, **kwargs):
#    if 'postid' in kwargs:
#        from newsoftheworldarticles.models import Article
#        article = Article.objects.get(int(kwargs['postid']))
#        comment.categories = article.categories


#HOUSEKEEPING FUNCTIONS
def update_comment_num_children_all():
    top_comments = Comment.objects(parent_id__exists=False)
    comments = top_comments
    for comment in comments:
        update_comment_num_children(comment)


def update_comment_num_children(comment):
    child_comments = Comment.objects(parent_id=comment.id)
    num_children = len(child_comments)
    comment.num_children = num_children
    comment.save()
    if (num_children > 0):
        for child_comment in child_comments:
            update_comment_num_children(child_comment)

def after_save_comment(comment):
    log_user_activity_comment.send(sender=after_save_comment, comment=comment)


def upvote_comment(comment_id, user_id):
    comments = Comment.objects(id=comment_id) # we don't currently have findAndModify in MongoEngine 
                                              #https://github.com/MongoEngine/mongoengine/issues/408
    if len(comments) < 0:
        return {"ok": "false", "code": "comment_not_found", "message": "Comment not found"}

    comments.update_one(add_to_set__upvotes=user_id, pull__downvotes=user_id)
    log_user_activity_vote.send(sender=upvote_comment, comment=comments[0], vote="upvote", post_type="comment",  userid_from=user_id)
    return Comment.objects(id=comment_id) # I hope there is some way to avoid this

def downvote_comment(comment_id, user_id):
    comments = Comment.objects(id=comment_id)
    if articlesutil.check_permissions(user_id, ['downvote_comment']) !=True: #breaks decoupling between articles and comments apps
        return {"ok": "false", "code": "no_permission", "message": "You don't have privileges to downvote", "status" : status.HTTP_403_FORBIDDEN}
    if len(comments) < 0:
        return {"ok": "false", "code": "comment_not_found", "message": "Comment not found", "status" : status.HTTP_400_BAD_REQUEST}

    log_user_activity_vote.send(sender=upvote_comment, comment=comments[0], vote="upvote", post_type="comment",  userid_from=user_id)
    comments.update_one(add_to_set__downvotes=user_id, pull__upvotes=user_id)
    
    #return {"ok": "true", "code":"user_already_voted", "message": "You have already voted down this comment"}

    log_user_activity_vote.send(sender=downvote_comment, comment=comment, vote="downvote", post_type="comment",  userid_from=user_id)
    return Comment.objects(id=comment_id) # I hope there is some way to avoid this

def unvote_comment(comment_id, user_id):
    comments = Comment.objects(id=comment_id) # we don't currently have findAndModify in MongoEngine 
                                              #https://github.com/MongoEngine/mongoengine/issues/408
    if len(comments) < 0:
        return {"ok": "false", "code": "comment_not_found", "message": "Comment not found"}

    comments.update_one(pull__upvotes=user_id, pull__downvotes=user_id)
    log_user_activity_vote.send(sender=unvote_comment, comment=comments[0], vote="unvote", post_type="comment",  userid_from=user_id)
    return Comment.objects(id=comment_id) # I hope there is some way to avoid this

def get_friendly_name(author):
    friendly_name = ""
    if author.first_name:
        friendly_name = author.first_name + " "
    if author.last_name:
        friendly_name = friendly_name + author.last_name

    friendly_name = friendly_name.strip()
    if friendly_name:
        return friendly_name
    else:
        return author.author_name

def get_comments_all(GET):
        comments = Comment.objects()
        
        if "metadata_string" in GET and GET["metadata_string"] is not None:
            comments = comments.filter(metadata_string__contains=GET['metadata_string'])
        if 'sortBy' in GET and GET['sortBy'] is not None:
            comments = comments.order_by(GET['sortBy'])
        else:
            comments = comments.order_by("-id")

        if "limit" in GET and GET["limit"] is not None:
            comments = comments.limit(int(GET["limit"]))


        return comments

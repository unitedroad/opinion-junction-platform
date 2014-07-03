from .models import Comment

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


def increment_reply_count(commentid, num_new_replies=1):
    comment = Comment.objects(id=commentid)
    if comment is not None:
        comment.update_one(inc__num_replies=num_new_replies)
        comment.save()

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

#HOUSEKEEPING FUNCTIONS
from .models import Comment

def update_comment_num_children(comment):
    child_comments = Comment.objects(parent_id=comment.id)
    num_children = len(child_comments)
    comment.num_replies = num_children
    print comment.id
    print comment.num_replies
    comment.save()
    if (num_children > 0):
        for child_comment in child_comments:
            update_comment_num_children(child_comment)


def update_comment_num_children_all():
    top_comments = Comment.objects(parent_id__exists=False)
    print "num_top_comments: "  + str(len(top_comments))
    comments = top_comments
    for comment in comments:
        update_comment_num_children(comment)

def update_comment_slug_all():
    top_comments = Comment.objects(parent_id__exists=False)
    comments = top_comments
    for comment in comments:
        update_comment_slug(comment, "")

def update_comment_slug(comment, slug_string):
    if slug_string:
        slug_string = slug_string + ":" + str(comment.id)
    else:
        slug_string = str(comment.id)

    if comment.slug:
        pass
    else:
        comment.slug = slug_string

    child_comments = Comment.objects(parent_id=comment.id)
    
    comment.save()

    #num_children = len(child_comments)
    for child_comment in child_comments:
        update_comment_slug(child_comment, slug_string)


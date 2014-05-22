from django.db import models

from mongoengine import *

connect('notwcomments')


class Author(EmbeddedDocument):
    id = StringField(required=True,primary_key=True)
    author_name = StringField()

class Comment(Document):
    discussion_id = StringField(required=True)
    parent_id = ObjectIdField(required=False)
    slug = StringField()
    full_slug= StringField()
    posted = DateTimeField()
    text = StringField()
    author = EmbeddedDocumentField(Author)

    upvotes = ListField(StringField())
    downvotes = ListField(StringField())
    meta = {
        'indexes': [ {'fields' : ['parent_id', 'id'] }]
    }
#class Comment(object):
#    def __init__(self, id, discussion_id, parent_id, slug, full_slug, posted, text):
#        self.id = id
#        self.discussion_id = discussion_id
#        self.parent_id = parent_id
#        self.slug = slug
#        self.full_slug = full_slug
#        self.posted = posted
#        self.text = text

# Create your models here.

from django.db import models

from mongoengine import *

connect('notwcomments')

class Author(EmbeddedDocument):
    id = StringField(required=True,primary_key=True)
    author_name = StringField()
    image = StringField()
    
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

    #num_votes = IntField()
    num_replies = IntField()
    metadata_string = StringField()
    meta = {
        'indexes': [ {'fields' : ['parent_id', 'id'] }, {'fields' : ['metadata_string', 'id']} ]
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

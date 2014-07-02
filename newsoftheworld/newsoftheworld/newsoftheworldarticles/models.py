from django.db import models

# Create your models here.
from mongoengine import *

connect('notwcomments')

class Tags(Document):
    tag_name = StringField()

class Categories(Document):
    category_name = StringField()

class SetField(ListField):
    """ Set field.

        Extends ListField, so that's how it's represented in Mongo.
    """
    def __set__(self, instance, value):
        return super().__set__(instance, set(value))

    def to_mongo(self, value):
        return super().to_mongo(list(value))

    def to_python(self, value):
        return set(super().to_python(value))

    def validate(self, value):
        if not isinstance(value, set):
            self.error('Only sets may be used.')

class Author(Document):
    id = StringField(required=True,primary_key=True)
    author_name = StringField()
    first_name = StringField()
    last_name = StringField()
    email_address = StringField()
    user_bio = StringField()
    user_role = StringField()
    user_permissions = ListField(StringField(), required=False)
    user_image = StringField()
    status = StringField()
    invitation_count = IntField()
    num_draft = IntField()

class Article(Document):
    author = ReferenceField(Author)
    title = StringField(required=True)
    published_date = DateTimeField()
    status = StringField()
    storytext = StringField()
    storyplaintext = StringField()
    excerpt = StringField()
    slug = StringField()
    tags = ListField(StringField(), required=False)
    categories = ListField(StringField(), required=False)

UPORDOWNVOTECHOICES = (('U', 'Up'),
                       ('D', 'Down'))

STATUS_VALUE_DICT = {"draft" : "Draft", "pending_review" : "Pending Review" , "published" : "Published" }

class Activity_Record(EmbeddedDocument):
    type = StringField(required=True)
    commentid = StringField()
    userid = StringField()
    upordownvote = StringField(choices = UPORDOWNVOTECHOICES)

class User_Activity(Document):
    id = StringField(required=True,primary_key=True)
    latest_doc = StringField()
    activity_record = EmbeddedDocumentField(Activity_Record)

class Metadata(models.Model):
    name=models.CharField(max_length=511)
    friendly_name = models.CharField(max_length=511, blank=True)
    ENTRY_TYPE_CHOICES = (("tag","tag"),("category","Category"))
    entry_type=models.CharField(max_length=511,choices=ENTRY_TYPE_CHOICES)
    num_user = models.IntegerField(db_index=True)
    meta = {
        'indexes': [ {'fields' : ['num_user', 'name'] }]
    }

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

GENDER_CHOICES = (("male", "Male"),
                  ("female", "Female"),
                  ("other", "Other"))

class Author(Document):
    id = StringField(required=True,primary_key=True)
    author_name = StringField()
    first_name = StringField()
    last_name = StringField()
    email_address = StringField()
    image = StringField()
    gender = StringField(choices = GENDER_CHOICES)
    user_bio = StringField(max_length=2048, required=False)
    user_role = StringField()
    user_permissions = ListField(StringField(), required=False)
    user_image = StringField()
    status = StringField()
    invitation_count = IntField()
    num_draft = IntField()


class Article_Metadata(EmbeddedDocument):
    robots_tag = StringField()

class Article(Document):
    author = ReferenceField(Author)
    title = StringField(required=True)
    published_date = DateTimeField()
    status = StringField()
    storytext = StringField()
    storyplaintext = StringField()
    storydisplayedtext = StringField()
    primary_image = StringField()
    header_image = StringField()
    thumbnail_image = StringField()
    excerpt = StringField()
    slug = StringField()
    tags = ListField(StringField(), required=False)
    categories = ListField(StringField(), required=False)
    article_metadata = EmbeddedDocumentField(Article_Metadata)

    meta = {
        'indexes': [ {'fields' : ['published_date', 'id'] } ]
    }

UPORDOWNVOTECHOICES = (('U', 'Up'),
                       ('D', 'Down'))


STATUS_VALUE_DICT = {"draft" : "Draft", "pending_review" : "Pending Review" , "published" : "Published" }

class Activity_Record(EmbeddedDocument):
    activity_type = StringField(required=True)
    commentid = StringField()
    userid = StringField()
    upordownvote = StringField(choices = UPORDOWNVOTECHOICES)

class Activity_Article(EmbeddedDocument):
    title = StringField(required=True)
    published_date = DateTimeField()
    excerpt = StringField()
    slug = StringField()

class Activity_Comment(EmbeddedDocument):
    #author_name = StringField()
    text_excerpt = StringField()
    author_id_to = StringField()
    comment_id = StringField()
    comment_slug = StringField()
    article_id = StringField()
    #article_slug = StringField()

class Activity_Vote(EmbeddedDocument):
    author_name = StringField()
    author_id_to = StringField()
    post_type = StringField()
    text_excerpt = StringField()
    slug = StringField()
    vote = StringField()
    article_id = StringField()

class Author_Activity(Document):
    author_id = StringField(required=True,primary_key=True)
    author_name = StringField()
    author_bio = StringField()
    image = StringField()
    latest_articles = ListField(EmbeddedDocumentField(Activity_Article))
    latest_comments = ListField(EmbeddedDocumentField(Activity_Comment))
    latest_votes = ListField(EmbeddedDocumentField(Activity_Vote))
    latest_replies_from = ListField(EmbeddedDocumentField(Activity_Comment))
    latest_votes_from = ListField(EmbeddedDocumentField(Activity_Vote))
    meta = {
        'indexes': [ {'fields' : ['author_id'] }]
    }

#    latest_doc = StringField()
#    activity_record = EmbeddedDocumentField(Activity_Record)

class Metadata(models.Model):
    name=models.CharField(max_length=511)
    friendly_name = models.CharField(max_length=511, blank=True)
    ENTRY_TYPE_CHOICES = (("tag","tag"),("category","Category"))
    entry_type=models.CharField(max_length=511,choices=ENTRY_TYPE_CHOICES)
    num_user = models.IntegerField(db_index=True)
    meta = {
        'indexes': [ {'fields' : ['num_user', 'name'] }]
    }


class ArticleForTagCategory(EmbeddedDocument):
    article_id = StringField(required=True)
    title = StringField()
    slug = StringField()
    author_name = StringField()
    excerpt = StringField()
    categories = StringField()
    thumbnail_image = StringField()


class Category(Document):
    name= StringField(max_length=511)
    friendly_name = StringField(max_length=511, default='')
    num_users = IntField(default=0)
    user_ids = ListField(ObjectIdField())
    users = ListField(EmbeddedDocumentField(ArticleForTagCategory))
    meta = {
        'indexes': [ {'fields' : ['num_users', 'name'] }]
    }

    
class Tag(Document):
    name= StringField(max_length=511)
    num_users = IntField(default=0)
    user_ids = ListField(ObjectIdField())
    users = ListField(EmbeddedDocumentField(ArticleForTagCategory))
    meta = {
        'indexes': [ {'fields' : ['num_users', 'name'] }]
    }



class Author_Settings(Document):
    author_id = StringField(required=True,primary_key=True)
    privacy_hide_own_articles = BooleanField(default=False)
    privacy_hide_own_comments = BooleanField(default=False)
    privacy_hide_own_votes = BooleanField(default=False)
    privacy_hide_others_comments = BooleanField(default=False)
    privacy_hide_others_replies = BooleanField(default=False)
    privacy_hide_others_votes = BooleanField(default=False)

class Team_Author(Document):
    author_id = StringField()
    author_name = StringField()
    first_name = StringField()
    last_name = StringField()
    image = StringField()
    role = StringField()

class Team_Metadata(Document):
    aboutus_message = StringField()

class Team_ContactUs(Document):
    contactus_description = StringField()
    contactus_details = StringField()
    contactus_type = StringField()

from rest_framework import serializers
from .models import Article
from .models import Author
from mongoengine.dereference import DeReference
from bson.objectid import ObjectId
from mongoengine import Document

#creating the following class here to prevent any future cyclic dependencies between modules

def serialisable_object(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

class Extensible_class(object):
    pass

class ArrayTagCategoryArticleSerialiser(serializers.Serializer):
    def field_to_native(self, obj, field_name):
        
        return self.to_native(getattr(obj, field_name))

    def to_native(self, obj):
        obj_return = []

        for member in obj:
            member_return = None
            member_return = self._dict_class()
            member_return.fields = self._dict_class()
            
            member_return["article_id"] = member.article_id
            member_return.fields["article_id"] = "article_id"
            member_return["title"] = member.title
            member_return.fields["title"] = "title"

            member_return["slug"] = member.slug
            member_return.fields["slug"] = "slug"
            
            member_return["author_name"] = member.author_name
            member_return.fields["author_name"] = "author_name"

            member_return["excerpt"] = member.excerpt
            member_return.fields["excerpt"] = "excerpt"

            member_return["categories"] = member.categories
            member_return.fields["categories"] = "categories"


            member_return["thumbnail_image"] = member.thumbnail_image
            member_return.fields["thumnail_image"] = "thumbnail_image"


            obj_return.append(member_return)


        return obj_return

    def to_representation(self, obj):
        obj_return = []

        for member in obj:
            member_return = None
            if hasattr(self, "_dict_class"):
                member_return = self._dict_class()
                member_return.fields = self._dict_class()
            else:
                member_return = {}
                #member_return.fields = Extensible_class()
            member_return["article_id"] = member.article_id
            #member_return.fields.article_id = "article_id"
            
            member_return["title"] = member.title
            #member_return.fields.title = "title"

            member_return["slug"] = member.slug
            #member_return.fields.slug = "slug"
            
            member_return["author_name"] = member.author_name
            #member_return.fields.author_name = "author_name"

            member_return["excerpt"] = member.excerpt
            #member_return.fields.excerpt = "excerpt"

            member_return["categories"] = member.categories
            #member_return.fields.categories = "categories"


            member_return["thumbnail_image"] = member.thumbnail_image
            #member_return.fields.thumnail_image = "thumbnail_image"

            obj_return.append(member_return)


        return obj_return


class HiddenField(serializers.ReadOnlyField):
    def to_representation(self, obj):
        return None

    def get_attribute(self, obj):
        return None


class ArrayField(serializers.ReadOnlyField):
    
    def field_to_native(self, obj, field_name):
        
        return self.to_native(getattr(obj, field_name))

    def to_native(self, obj):
        if len(obj) > 0 and (isinstance(obj[0], ObjectId) or isinstance(obj[0], Document)):
            obj_return = []
            for member in obj:
                obj_return.append(str(member))
            return obj_return
        return obj
    
    def to_representation(self, obj):
        return self.to_native(obj)


class ObjectIdField(serializers.ReadOnlyField):
    def field_to_native(self, obj, field_name):
        
        return self.to_native(getattr(obj, field_name))

    def to_native(self, obj):
        return str(obj)
    
class RelatedDocumentField(serializers.RelatedField):

    def to_representation(self, obj):

        ret = {}
        #ret.fields = {}
        if not hasattr(obj, '_fields'):
            return ret

        print "obj: " + str(obj)

        for field_name,field in obj._fields.iteritems():
            value = obj._data.get(field_name, None)
            if value is not None:
                value = field.to_python(value)
            ret[field_name] = serialisable_object(value)
            #ret.fields[k] = v

        print "ret: " + str(ret)

        return ret


    def to_native(self, obj):
        
        ret = serializers.SortedDictWithMetadata()
        ret.fields = serializers.SortedDictWithMetadata()
        if not hasattr(obj, '_fields'):
            return ret

        for field_name,field in obj._fields.iteritems():
            value = obj._data.get(field_name, None)
            if value is not None:
                value = field.to_python(value)
            ret[field_name] = value
            #ret.fields[k] = v

        return ret


    def field_to_native(self, obj, field_name):

        return self.to_native(getattr(obj, field_name))

class RelatedAuthorDocumentField(RelatedDocumentField):

    def to_representation(self, obj):

        ret = {}
        #ret.fields = {}
        if not hasattr(obj, '_fields'):
            return ret

        for field_name,field in obj._fields.iteritems():
            if field_name == "user_permissions":
                continue

            value = obj._data.get(field_name, None)
            if value is not None:
                value = field.to_python(value)
            ret[field_name] = serialisable_object(value)
            #ret.fields[k] = v

        return ret

    def to_native(self, obj):
        
        ret = serializers.SortedDictWithMetadata()
        ret.fields = serializers.SortedDictWithMetadata()
        if not hasattr(obj, '_fields'):
            return ret

        for field_name,field in obj._fields.iteritems():
            if field_name == "user_permissions":
                continue
            value = obj._data.get(field_name, None)
            if value is not None:
                value = field.to_python(value)
            ret[field_name] = value
            #ret.fields[k] = v

        return ret

class SetField(serializers.ReadOnlyField):
    def to_native(self, obj):
        returnedSet = set()
        for val in obj:
            returnedSet.add(val)
        
        return returnedSet

class ArticleSerialiser(serializers.Serializer):
    id = serializers.CharField()
    author = RelatedAuthorDocumentField(read_only=True)
    title = serializers.CharField(required=True)
    published_date = serializers.DateTimeField()
    status = serializers.CharField()
    storytext = serializers.CharField()
    storyplaintext = serializers.CharField()
    primary_image = serializers.CharField()
    header_image = serializers.CharField()
    thumbnail_image = serializers.CharField()
    excerpt = serializers.CharField()
    slug = serializers.CharField()
    tags = SetField()
    categories = SetField()
    article_metadata = RelatedDocumentField(read_only=True)
#    class Meta:
#        unique_together = ('tags')
#    def restore_object(self, attrs, instance=None):
#        if instance is not None:
#            instance.id=1
#            instance.content=attrs.content
#            return instance
#        
#        return Article()
#
class AuthorSerialiser(serializers.Serializer):
    id = serializers.CharField(required=True)
    author_name = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email_address = serializers.CharField()
    image = serializers.CharField()
    gender = serializers.CharField()
    user_bio = serializers.CharField()
    user_role = serializers.CharField()
    #user_permissions = serializers.WritableField()
    user_permissions = ArrayField()
    user_image = serializers.CharField()

#class AuthorSerialiser2(serializers.Serializer):
#    id = serializers.CharField(required=True)
#    author_name = serializers.CharField()
#    first_name = serializers.CharField()
#    last_name = serializers.CharField()
#    email_address = serializers.CharField()
#    user_bio = serializers.CharField()
#    user_role = serializers.CharField()
#    #user_permissions = serializers.WritableField()
#    user_image = serializers.CharField()

class MetadataSerialiser(serializers.Serializer):
    name = serializers.CharField()
    friendly_name = serializers.CharField()
    entry_type = serializers.CharField()

class CategorySerialiser(serializers.Serializer):
    name = serializers.CharField()
    friendly_name = serializers.CharField()
    num_users = serializers.IntegerField()
    user_ids = ArrayField()
    users = ArrayTagCategoryArticleSerialiser()

class TagSerialiser(serializers.Serializer):
    name = serializers.CharField()
    num_users = serializers.IntegerField()
    user_ids = ArrayField()
    users = ArrayTagCategoryArticleSerialiser()
    #users = serializers.ListField(child=RelatedDocumentField(read_only=True)) #TODO Wil move to this implementation 
                                                                               #once 1.7 upgrade is completely successful for long


class Author_SettingsSerialiser(serializers.Serializer):
    author_id = serializers.CharField()
    privacy_hide_own_articles = serializers.BooleanField()
    privacy_hide_own_comments = serializers.BooleanField()
    privacy_hide_own_votes = serializers.BooleanField()
    privacy_hide_others_comments = serializers.BooleanField()
    privacy_hide_others_replies = serializers.BooleanField()
    privacy_hide_others_votes = serializers.BooleanField()

class Author_ActivitySerialiser(serializers.Serializer):
    author_id = serializers.CharField()
    author_name = serializers.CharField()
    author_bio = serializers.CharField()
    image = serializers.CharField()
#    latest_articles = ListField(EmbeddedDocumentField(Activity_Article))
#    latest_comments = ListField(EmbeddedDocumentField(Activity_Comment))
#    latest_votes = ListField(EmbeddedDocumentField(Activity_Vote))
#    latest_replies_from = ListField(EmbeddedDocumentField(Activity_Comment))
#    latest_votes_from = ListField(EmbeddedDocumentField(Activity_Vote))

class Team_AuthorSerialiser(serializers.Serializer):
    author_id = serializers.CharField()
    author_name = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    image = serializers.CharField()
    role = serializers.CharField()

class Team_MetadataSerialiser(serializers.Serializer):
    aboutus_message = serializers.CharField()

class Team_ContactUsSerialiser(serializers.Serializer):
    id = ObjectIdField()
    contactus_description = serializers.CharField()
    contactus_details = serializers.CharField()
    contactus_type = serializers.CharField()

class Team_All_DataSerialiser(serializers.Serializer):
    team_authors = Team_AuthorSerialiser(many=True)
    team_metadata = Team_MetadataSerialiser(many=False)
    team_contactus = Team_ContactUsSerialiser(many=True)

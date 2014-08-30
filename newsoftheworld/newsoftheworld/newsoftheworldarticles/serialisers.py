from rest_framework import serializers

from .models import Article
from .models import Author
from mongoengine.dereference import DeReference

class RelatedDocumentField(serializers.RelatedField):

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

class SetField(serializers.Field):
    def to_native(self, obj):
        returnedSet = set()
        for val in obj:
            returnedSet.add(val)
        
        return returnedSet

class ArticleSerialiser(serializers.Serializer):
    id = serializers.CharField()
    author = RelatedAuthorDocumentField(Author)
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
    user_permissions = serializers.WritableField()
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

class Author_SettingsSerialiser(serializers.Serializer):
    author_id = serializers.CharField()
    privacy_hide_own_articles = serializers.BooleanField()
    privacy_hide_own_comments = serializers.BooleanField()
    privacy_hide_own_votes = serializers.BooleanField()
    privacy_hide_others_comments = serializers.BooleanField()
    privacy_hide_others_replies = serializers.BooleanField()
    privacy_hide_others_votes = serializers.BooleanField()

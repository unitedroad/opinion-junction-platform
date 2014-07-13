from rest_framework import serializers

from .models import Comment

class Post(object):
    def __init__(self):
        self.id=1
        self.content="First Generic Comment"
        
class PostSerialiser(serializers.Serializer):
    content=serializers.CharField(max_length=200)

    def restore_object(self, attrs, instance=None):
        if instance is not None:
            instance.id=1
            instance.content=attrs.content
            return instance
        
        return Post()
    
class AuthorSerialiser(serializers.Serializer):
    id = serializers.CharField(required=True,max_length=50)
    author_name = serializers.CharField(required=True,max_length=50)
    #pass

    def to_native(self, obj):
        """
        Serialize objects -> primitives.
        """
        ret = self._dict_class()
        ret.fields = self._dict_class()

        ret.fields["id"]="id"
        ret["id"]=obj.id
        ret.fields["name"]="name"
        ret["name"]=obj.author_name
        
        ret.fields["image"]="image"
        ret["image"]=obj.image
 
        return ret

    def field_to_native(self, obj, field_name):
        """
        Override default so that the serializer can be used as a nested field
        across relationships.
        """
 
        return self.to_native(obj.author)

class Num_Votes_Field(serializers.Field):

    def to_native(self, obj):
        num_upvotes = 0
        if obj.upvotes is not None:
            num_upvotes = len(obj.upvotes)

        num_downvotes = 0
        if obj.downvotes is not None:
            num_downvotes = len(obj.downvotes)

        return num_upvotes - num_downvotes

    def field_to_native(self, obj, field_name):
        return self.to_native(obj)


class Vote_Field(serializers.Field):

    def to_native(self, obj):
        #ret = serializers.SortedDictWithMetadata()

        #print self.context
        #print dir(obj)
        
        request = self.context.get('request', None)
        
        if request is None:
            return None

        if request.user.is_authenticated():
            user_id = str(request.user.id)
            if user_id in obj.downvotes:
                return 'down'
            if user_id in obj.upvotes:
                return 'up'

        return 'none'

    def field_to_native(self, obj, field_name):
        return self.to_native(obj)

class CommentSerialiser(serializers.Serializer):
    id = serializers.CharField(required=True,max_length=50)
    discussion_id = serializers.CharField()
    parent_id = serializers.CharField()
    slug = serializers.CharField()
    full_slug= serializers.CharField()
    posted = serializers.DateTimeField()
    text = serializers.CharField()
    author = AuthorSerialiser(required=False)
    num_votes = Num_Votes_Field()
    num_replies = serializers.IntegerField(default=0)
    current_user_voted = Vote_Field()
    metadata_string = serializers.CharField()

#    def __init__(self, instance=None, data=None, files=None,
#                 context=None, partial=False, many=None,
#                 allow_add_remove=False, **kwargs):
#        super(CommentSerialiser, self).__init__( instance, data, files,
#                 context, partial, many,
#                 allow_add_remove, **kwargs))

    def restore_object(self, attrs, instance=None):
        if instance:
            instance.id = attrs.get('id', instance.id)
            instance.discussion_id = attrs.get('discussion_id', instance.discussion_id)
            instance.parent_id = attrs.get('parent_id', instance.parent_id)
            instance.slug = attrs.get('slug', instance.slug)
            instance.full_slug = attrs.get('full_slug', instance.full_slug)
            instance.posted = attrs.get('posted', instance.posted)
            instance.text = attrs.get('text', instance.text)
            if instance.author is None:
                instance.author = attrs.get('author', instance.author)
            #instance.author.author_name = attrs.get('author.author_name', instance.author.author_name)
            #instance.author._id = attrs.get('author._id', instance.author._id)
            return instance
        return Comment(**attrs)


#    def field_to_native(self, obj, field_name):
#        print "context: " + str(self.context)
#        return super(CommentsSerialiser, self).field_to_native(obj, field_name)
#
#    def to_native(self, obj):
#        print "context: " + str(self.context)
#        return super(CommentSerialiser, self).to_native(obj)

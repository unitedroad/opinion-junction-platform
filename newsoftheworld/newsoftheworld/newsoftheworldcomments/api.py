from .serialisers import Post
from .serialisers import PostSerialiser
from .models import Comment
from .models import Author
from newsoftheworldarticles.models import Author as ArticleAuthor #breaks decoupling between articles and comments
from newsoftheworldcomments.util import get_friendly_name 
from .serialisers import CommentSerialiser
from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from bson.objectid import ObjectId

from mongoengine.base import ValidationError

import datetime
import logging

import traceback, sys

from . import db

from .util import Comments_Save_Handler, csh_obj, increment_reply_count, upvote_comment, downvote_comment, unvote_comment

#class PostList(generics.ListCreateAPIView):
#    model = Post
#    serializer_class = PostSerialiser
#    permission_classes = [
#        permissions.AllowAny
#    ]
#
#class CommentsList(generics.ListCreateAPIView):
#    model = Comment
#    serializer_class = CommentSerialiser
#    permission_classes = [
#        permissions.AllowAny
#    ]

class PostList(APIView):
    model = Post
    serializer_class = PostSerialiser
    permission_classes = [
        permissions.AllowAny
    ]
    
    def get(self, request, format=None):

        context = {}
        context['request'] = request

        #for comment in Comment.objects.all():
        serialisedList = CommentSerialiser(Comment.objects.all(), many=True, context=context)
        return Response(serialisedList.data)

    def post(self, request, format=None):
        pass

class PostCommentsList(APIView):

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    #handler_obj = csh_obj

    #view_name = 'post-comment-list'
    #handler_obj.add_handler(view_name + '.get', comment_update_article_info) 

    def get(self, request, postid, format=None):
        #logging.error("request.GET: " + str(request.GET))

        context = {}
        context['request'] = request

        #for comment in Comment.objects.all():
        if u"top" in request.GET and request.GET[u"top"] == "true":
            #serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id__exists=False).order_by("id"), many=True) 
            if "after" in request.GET and request.GET["after"] is not None:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id__exists=False, id__gt=request.GET["after"]).order_by("id"), many=True, context=context)
            else:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id__exists=False).order_by("id"), many=True, context=context)

        elif u"parentid" in request.GET:
            serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id=request.GET["parentid"]).order_by("id"), many=True, context=context)
        else:
            if "after" in request.GET and request.GET["after"] is not None:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid,  id__gt=request.GET["after"]).order_by("id"), many=True, context=context)
            else:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid).order_by("id"), many=True, context=context)
        return Response(serialisedList.data)

    def post(self, request, postid, format=None):
        try:
            author_ext = ArticleAuthor.objects(id=str(request.user.id))[0]
            comment = Comment()
            comment.discussion_id = postid
            parent_id = None
            if u"parent_id" in request.DATA and request.DATA[u"parent_id"] is not None:
                comment.parent_id = ObjectId(request.DATA[u"parent_id"])
                parent_id = request.DATA[u"parent_id"]
            comment.posted = datetime.datetime.now()
            comment.text = request.DATA[u"text"]
            if len(comment.text) == 0:
                raise Exception("Comment text cannot be null!")
            author = Author()
            author.id = author_ext.id
            author.author_name = get_friendly_name(author_ext)
            author.image = author_ext.image
            comment.author = author
            comment.num_votes=0
            comment.num_replies = 0
            if u"metadata_string" in request.DATA and request.DATA[u"metadata_string"] is not None:
                comment.metadata_string = request.DATA[u"metadata_string"]
            comment.save()

            if parent_id is not None:
                increment_reply_count(parent_id, 1)

            if comment.id:
                comment_id = str(comment.id)
            else:
                comment_id = ""

            return Response({"ok" : "true", "parent_id" : parent_id, "id" : comment_id })
        except BaseException as e:
            append_error_string = ""
            if isinstance(e, ValidationError):
                append_error_string = "\nValidationError.errors: " + str(e.errors)
            print " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2])) + append_error_string
            return Response({"ok" : "false " + str(e) + " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2])) + append_error_string}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommentsList(APIView):
    model = Comment
    serializer_class = CommentSerialiser
    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request, format=None):
        
        context = {}
        context['request'] = request

        #for comment in Comment.objects.all():
        serialisedList = CommentSerialiser(Comment.objects.all(), many=True, context=context)
        return Response(serialisedList.data)

    def get(self, request, commentid, format=None):
        #for comment in Comment.objects.all():

        context = {}
        context['request'] = request

        if "children" in request.GET and request.GET["children"] == "true":
            if "after" in request.GET and request.GET["after"] is not None:
                serialisedList = CommentSerialiser(Comment.objects(parent_id=commentid, id__gt=request.GET["after"]), many=True, context=context)
            else:
                serialisedList = CommentSerialiser(Comment.objects(parent_id=commentid), many=True, context=context)
        else:
            serialisedList = CommentSerialiser(Comment.objects(id=commentid), many=True, context=context)
        
        return Response(serialisedList.data)

class CommentsAll(APIView):
    model = CommentSerialiser
    serializer_class = CommentSerialiser
    permission_classes = [
        permissions.AllowAny
    ]
    
    def get(self, request, format=None):
        #for comment in Comment.objects.all():
        comments = Comment.objects()
        
        if "metadata_string" in request.GET and request.GET["metadata_string"] is not None:
            comments = comments.filter(metadata_string__contains=request.GET['metadata_string'])
        if 'sortBy' in request.GET and request.GET['sortBy'] is not None:
            comments = comments.order_by(request.GET['sortBy'])
        else:
            comments = comments.order_by("-id")

        if "limit" in request.GET and request.GET["limit"] is not None:
            comments = comments.limit(int(request.GET["limit"]))

        context = {}
        context['request'] = request

        serialisedList = CommentSerialiser(comments, many=True, context=context)
        return Response(serialisedList.data)

    def post(self, request, format=None):
        pass


class CommentsUpVote(APIView):

    model = Comment
    serializer_class = CommentSerialiser
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
        #permissions.AllowAny
    ]

#    def get(self, request, commentid, format=None):
#        pass

    def post(self, request, commentid, format=None):

        context = {}
        context['request'] = request

        if request.user.is_authenticated() == False:
            return Response({"ok":"false","code":"user_not_logged_in"}, status=HTTP_401_UNAUTHORIZED)
        result = upvote_comment(commentid, str(request.user.id))
        if 'ok' in result and result['ok'] == 'false':
            status_code = status.HTTP_400_BAD_REQUEST
            if result['status'] is not None:
                status_code = result['status']
            return Response(result, status = status_code)

        if len(result) > 0 and isinstance(result[0], Comment):
            serialisedList = CommentSerialiser(result, many=True, context=context)
            return Response(serialisedList.data)
            

        return Response(result)

class CommentsDownVote(APIView):

    model = Comment
    serializer_class = CommentSerialiser
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
        #permissions.AllowAny
    ]

#    def get(self, request, commentid, format=None):
#        pass

    def post(self, request, commentid, format=None):
        
        context = {}
        context['request'] = request

        if request.user.is_authenticated() == False:
            return Response({"ok":"false","code":"user_not_logged_in"}, status=HTTP_401_UNAUTHORIZED)
        result = downvote_comment(commentid, str(request.user.id))
        if 'ok' in result and result['ok'] == 'false':
            status_code = status.HTTP_400_BAD_REQUEST
            if result['status'] is not None:
                status_code = result['status']
            return Response(result, status = status_code)

        if len(result) > 0 and isinstance(result[0], Comment):
            serialisedList = CommentSerialiser(result, many=True, context=context)
            return Response(serialisedList.data)
            
        return Response(result)

class CommentsUnVote(APIView):

    model = Comment
    serializer_class = CommentSerialiser
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
        #permissions.AllowAny
    ]

#    def get(self, request, commentid, format=None):
#        pass

    def post(self, request, commentid, format=None):
        
        context = {}
        context['request'] = request

        if request.user.is_authenticated() == False:
            return Response({"ok":"false","code":"user_not_logged_in"}, status=HTTP_401_UNAUTHORIZED)
        result = unvote_comment(commentid, str(request.user.id))
        if 'ok' in result and result['ok'] == 'false':
            status_code = status.HTTP_400_BAD_REQUEST
            if result['status'] is not None:
                status_code = result['status']
            return Response(result, status = status_code)

        if len(result) > 0 and isinstance(result[0], Comment):
            serialisedList = CommentSerialiser(result, many=True, context=context)
            return Response(serialisedList.data)
            
        return Response(result)

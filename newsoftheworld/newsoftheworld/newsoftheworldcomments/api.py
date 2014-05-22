from .serialisers import Post
from .serialisers import PostSerialiser
from .models import Comment
from .models import Author
from .serialisers import CommentSerialiser
from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from bson.objectid import ObjectId

from mongoengine.base import ValidationError

import datetime
import logging

import traceback, sys

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
        #for comment in Comment.objects.all():
        serialisedList = CommentSerialiser(Comment.objects.all(), many=True)
        return Response(serialisedList.data)

    def post(self, request, format=None):
        pass

class PostCommentsList(APIView):

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get(self, request, postid, format=None):
        logging.error("request.GET: " + str(request.GET))
        #for comment in Comment.objects.all():
        if u"top" in request.GET and request.GET[u"top"] == "true":
            #serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id__exists=False).order_by("id"), many=True) 
            if "after" in request.GET and request.GET["after"] is not None:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id__exists=False, id__gt=request.GET["after"]).order_by("id"), many=True)
            else:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id__exists=False).order_by("id"), many=True)

        elif u"parentid" in request.GET:
            serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid, parent_id=request.GET["parentid"]).order_by("id"), many=True)
        else:
            if "after" in request.GET and request.GET["after"] is not None:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid,  id__gt=request.GET["after"]).order_by("id"), many=True)
            else:
                serialisedList = CommentSerialiser(Comment.objects(discussion_id=postid).order_by("id"), many=True)
        return Response(serialisedList.data)

    def post(self, request, postid, format=None):
        try:
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
            author.id= request.DATA[u"author"][u"id"]
            author.author_name = request.DATA[u"author"][u"name"]
            comment.author = author
            comment.save()

            return Response({"ok" : "true", "parent_id" : parent_id })
        except BaseException as e:
            append_error_string = ""
            if isinstance(e, ValidationError):
                append_error_string = "\nValidationError.errors: " + str(e.errors)
            print " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2])) + append_error_string
            return Response({"ok" : "false " + str(e) + " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2])) + append_error_string})

class CommentsList(APIView):
    model = Comment
    serializer_class = CommentSerialiser
    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request, format=None):
        #for comment in Comment.objects.all():
        serialisedList = CommentSerialiser(Comment.objects.all(), many=True)
        return Response(serialisedList.data)

    def get(self, request, commentid, format=None):
        #for comment in Comment.objects.all():
        if "children" in request.GET and request.GET["children"] == "true":
            if "after" in request.GET and request.GET["after"] is not None:
                serialisedList = CommentSerialiser(Comment.objects(parent_id=commentid, id__gt=request.GET["after"]), many=True)
            else:
                serialisedList = CommentSerialiser(Comment.objects(parent_id=commentid), many=True)
        else:
            serialisedList = CommentSerialiser(Comment.objects(id=commentid), many=True)
        
        return Response(serialisedList.data)


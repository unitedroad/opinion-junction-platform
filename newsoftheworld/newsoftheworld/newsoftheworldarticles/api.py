import datetime
import traceback
import sys
from .models import Article
from .models import Author
from .models import Metadata
from .models import Category
from .models import Tag
from .models import Author_Settings
from .models import Team_Author
from .models import Team_ContactUs
from .models import Team_Metadata
from .serialisers import ArticleSerialiser
from .serialisers import AuthorSerialiser
from .serialisers import MetadataSerialiser
from .serialisers import CategorySerialiser
from .serialisers import TagSerialiser
from .serialisers import Author_SettingsSerialiser
from .serialisers import Author_ActivitySerialiser
from .serialisers import Team_All_DataSerialiser
from .serialisers import Team_AuthorSerialiser
from . import util
#from . import db
#from .serialisers import AuthorSerialiser2
#from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.exceptions import PermissionDenied

import bson

import copy 

class ArticlesList(APIView):
    model = Article
    serializer_class = ArticleSerialiser
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]



    def get(self, request, articleid, format=None):
        #for comment in Comment.objects.all():
        if util.check_valid_object_id(id=articleid) is not True:
            return Response({"ok" : "false", "code" : "incorrect_id", "message" : "Incorrect Article Id", "status" : status.HTTP_400_BAD_REQUEST }, status = status.HTTP_400_BAD_REQUEST)
        serialisedList = ArticleSerialiser(Article.objects(id=articleid).select_related())
        
        return Response(serialisedList.data)

    def post(self, request, articleid, format=None):
        if util.check_valid_object_id(id=articleid) is not True:
            return Response({"ok" : "false", "code" : "incorrect_id", "message" : "Incorrect Article Id", "status" : status.HTTP_400_BAD_REQUEST }, status = status.HTTP_400_BAD_REQUEST)
        articles = Article.objects(id=articleid)
        if len (articles) <= 0:
            return Response({"ok" : "false", "code" : "article_does_not_exist", "message" : "Opinion with this id does not exist, try Create Opinion Option instead", "status" : status.HTTP_400_BAD_REQUEST }, status = status.HTTP_400_BAD_REQUEST)
    
        article = articles[0]
     
        original_article = copy.deepcopy(article)

        article_state = {}

        article_state["original_article"] = original_article

        article_state["changed_fields"] = []

        user_list = Author.objects(id=str(request.user.id))
        
        if len (user_list) < 1:
            return Response({"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in" }, status = status.HTTP_401_UNAUTHORIZED)
        
        user = user_list[0]

        permission_check = util.check_article_update_permissions(user, request.DATA, article)

        if permission_check["ok"] == "false":
            return Response(permission_check, status = permission_check["status"])

        #article.author.save()

        #article = Article.objects(id=articleid)

        
        article.status = request.DATA["status"]

        if article.status == "published":
            article.published_date = datetime.datetime.now()

        article.title = request.DATA["title"]
                    
        #article.storytext = request.DATA["storytext"]
        if "storytext" in request.DATA and request.DATA["storytext"] is not None:
            #article.storytext = util.save_binary_images_in_content(article, request.DATA["storytext"])
            article.storytext = request.DATA["storytext"]
            if article.status == "published" or article.status == "pending_review":
                result = util.save_binary_images_in_content(article, article.storytext)
                if "ok" in result and result["ok"] == "false":
                    return Response(result, status = status.HTTP_400_BAD_REQUEST)
            permission_check["storytext"] = article.storytext
        else:
            article.storytext = ""




        if "storyplaintext" in request.DATA and request.DATA["storyplaintext"] is not None:
            article.storyplaintext = request.DATA["storyplaintext"]
        article.excerpt = request.DATA["excerpt"]
        article.slug = request.DATA[u"slug"]
        article.tags =  util.return_list_stripped_members(request.DATA[u"tags"])
        article.categories = util.return_list_stripped_members(request.DATA[u"categories"])

        article.save()

        save_front_page_info = False

        if "header_image" in request.DATA and request.DATA["header_image"] is not None:
            util.save_front_page_images_in_article(request.DATA["header_image"], article, "header_image")
            save_front_page_info = True
        elif not article.header_image:
           util. save_front_page_images_in_article(article.primary_image, article, "header_image")
           save_front_page_info = True

        if "thumbnail_image" in request.DATA and request.DATA["thumbnail_image"] is not None:
            util.save_front_page_images_in_article(request.DATA["thumbnail_image"], article, "thumbnail_image")
            save_front_page_info = True
        elif not article.thumbnail_image:
            util.save_front_page_images_in_article(article.primary_image, article, "thumbnail_image")
            save_front_page_info = True

        if save_front_page_info:
            article.save()

        util.update_article(article, article_state=article_state, user=request.user)

        permission_check["articleid"] = str(article.id)
        permission_check["message"] = "Successfully Submitted your Opinion!"
        return Response(permission_check, status = status.HTTP_200_OK)


#        if u"title" in request.DATA and request.DATA[u"title"] is not None:
#            article.title = request.DATA[u"title"]
#        if u"status" in request.DATA:
#            article.status = request.DATA[u"status"]
#            if request.DATA[u"status"] == "Published":
#                article.published_date = datetime.datetime.now()
#        if u"storytext" in request.DATA and request.DATA[u"storytext"] is not None:
#            article.storytext = request.DATA[u"storytext"]
#        if u"storyplaintext" in request.DATA and request.DATA[u"storyplaintext"] is not None:
#            article.storyplaintext = request.DATA[u"storyplaintext"]
#        if u"excerpt" in request.DATA and request.DATA[u"excerpt"] is not None:
#            article.excerpt = request.DATA[u"excerpt"]
#        if u"slug" in request.DATA and request.DATA[u"slug"] is not None:
#            article.slug = request.DATA[u"slug"]
#        if u"tags" in request.DATA and request.DATA[u"tags"] is not None:
#            article.tags =  request.DATA[u"tags"]
#        if u"categories" in request.DATA and request.DATA[u"categories"] is not None:
#            article.categories = request.DATA[u"categories"]
##        if u"authorid" in request.DATA and request.DATA[u"authorid"] in not None:
##            author = Author.objects(id=request.DATA[u"authorid"])
##            article.author = author
#
#        article.save()
#    
#        return Response({"ok" : "true"})
#
class ArticlesPost(APIView):
    def get(self, request, format=None):

        try:

            serialisedList = None
            articleslist = None
            if "fromId" in request.GET and request.GET["fromId"]:
                articlesList =  Article.objects(id__gt=bson.objectid.ObjectId(request.GET["fromId"]))
            else:
                articlesList = Article.objects()

            articlesList = articlesList.order_by("published_date")
    
            if "authorId" in request.GET and request.GET["authorId"]:
                articlesList = articlesList.filter(author=request.GET["authorId"])
            #return Response({"ok" : "False", "Message" : "Get is not supported for this API" })
            if "no_content" in request.GET and request.GET["no_content"] == "true":
                articlesList = articlesList.exclude("storytext","storyplaintext","excerpt","tags")
    
            if "limit" in request.GET and util.is_number(request.GET["limit"]):
                articlesList = articlesList.limit(int(request.GET["limit"]))
    
    
            serialisedList = ArticleSerialiser(articlesList.select_related())
            return Response(serialisedList.data)
        except Exception as e:
            "Exception in ArticlesPost: " + str(e)
            return Response({"ok":"false", "message": str(e)})
    

    
    def post(self, request, format=None):

        try:
            author_list = Author.objects(id=str(request.user.id))
            
            if len (author_list) < 1:
                return Response({"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in" }, status = status.HTTP_401_UNAUTHORIZED)
            
            author = author_list[0]
    
            user_permissions = author.user_permissions

            permission_check = util.check_article_create_permissions(author, request.DATA)

            #print permission_check

            if permission_check["ok"] == "false":
                return Response(permission_check, status = permission_check["status"])

            author.save()

            article = Article()
            article.status = ""

            if "status" in request.DATA:
                article.status = request.DATA["status"]
    
            
            if article.status == "published":
                article.published_date = datetime.datetime.now()
    
            article.title = request.DATA["title"]

            if "storytext" in request.DATA and request.DATA["storytext"] is not None:
                article.storytext = request.DATA["storytext"]
                if article.status == "published" or article.status == "pending_review":
                    if util.find_primary_image(article.storytext) == False:
                        return Response({"ok" : "false", "code" : "no_primary_image", "message" : "Primary image not defined!"}, status = status.HTTP_400_BAD_REQUEST)
            else:
                article.storytext = ""
                if article.status == "published" or article.status == "pending_review":
                    return Response({"ok" : "false", "code" : "no_primary_image", "message" : "Primary image not defined!"}, status = status.HTTP_400_BAD_REQUEST)

            if "storyplaintext" in request.DATA and request.DATA["storyplaintext"] is not None:
                article.storyplaintext = request.DATA["storyplaintext"]
            article.excerpt = request.DATA["excerpt"]
            article.slug = request.DATA[u"slug"]
            article.tags =  util.return_list_stripped_members(request.DATA[u"tags"])
            article.categories = util.return_list_stripped_members(request.DATA[u"categories"])
    #        if u"authorid" in request.DATA and request.DATA[u"authorid"] in not None:
    #            author = Author.objects(id=request.DATA[u"authorid"])
    #            article.author = author
            article.author = author
            article.save()

            if article.storytext:
                result = util.save_binary_images_in_content(article, article.storytext)
                if "ok" in result and result["ok"] == "false":
                    return Response(result, status = status.HTTP_400_BAD_REQUEST)
                permission_check["storytext"] = article.storytext
            article.save()

            util.create_article(article,user=request.user)

            #print "article.primary_image: " + article.primary_image


            save_front_page_info = False

            if "header_image" in request.DATA and request.DATA["header_image"] is not None:
                util.save_front_page_images_in_article(request.DATA["header_image"], article, "header_image")
                save_front_page_info = True
            else:
                util.save_front_page_images_in_article(article.primary_image, article, "header_image")
                save_front_page_info = True


            if "thumbnail_image" in request.DATA and request.DATA["thumbnail_image"] is not None:
                util.save_front_page_images_in_article(request.DATA["thumbnail_image"], article, "thumbnail_image")
                save_front_page_info = True
            else:
                util.save_front_page_images_in_article(article.primary_image, article, "thumbnail_image")
                save_front_page_info = True

            if save_front_page_info:
                article.save()

            if article.status == "published":
                util.finalise_published_article(article)
            
            permission_check["articleid"] = str(article.id)
            permission_check["message"] = "Successfully Submitted your Opinion!"
            return Response(permission_check, status = status.HTTP_200_OK)
            
        except Exception as e:
            print "Exception in articlespost: " + str(e)
            print " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2]))
            return Response({"ok" : "false",  "message" : str(e) }, status = status.HTTP_500_INTERNAL_SERVER_ERROR )
    

class ArticlesByCategory(APIView):
    def get(self, request, format=None):
        categories = util.get_categories()

        articlesByCategories = util.get_articles_by_categories(categories, request.GET)

        serialisedList = ArticleSerialiser(articlesByCategories)
        
        return Response(serialisedList.data)
    
class ArticlesByEachCategory(APIView):
    def get(self, request, category, format=None):
        articlesByCategories = util.get_articles_by_category(category, request.GET)

        serialisedList = ArticleSerialiser(articlesByCategories)
        
        return Response(serialisedList.data)

class UpdateProfileSelf(APIView):


    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    def post(self, request, format=None):
        try:
            util.change_profile(request.user, request.DATA)
        except Exception as e:
            print " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2]))

            return Response({"ok":"false","message":str(e),"status":status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"ok":"true"})

class AuthorsList(APIView):
    model = Article
    serializer_class = ArticleSerialiser
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]



    def get(self, request, authorid, format=None):
        #for comment in Comment.objects.all():
        serialisedList = AuthorSerialiser(Author.objects(id=authorid))
        


        return Response(serialisedList.data)



    def post(self, request, format=None):
#        user = Author.objects(id=str(request.user.id))[0]
#        if "create_users" not in user.user_permissions and str(request.user.id) != request.DATA[u"id"]:
#            return Response({"ok" : "false", "message" : "User creation with Provided User Id not allowed!" })
#        if len(Author.objects(id = request.DATA[u"id"])) != 0:
#            return Response({"ok" : "false", "message" : "User already exists!" })
#        author = Author()
#        author.id = request.DATA[u"id"]
#        author.author_name = request.DATA[u"author_name"]
#        author.first_name = request.DATA[u"first_name"]
#        author.last_name = request.DATA[u"last_name"]
#        author.email_address = request.DATA[u"email_address"]
#        author.user_bio = request.DATA[u"user_bio"]
#        author.user_role = request.DATA[u"user_role"]
#        author.user_permissions = request.DATA[u"user_permissions"]
#        if u"user_image" in request.DATA and request.DATA[u"user_image"] is not None:
#            author.user_image = request.DATA[u"user_image"]
#        
#        author.save()
#    
        return Response({"ok" : "true"})

class AuthorListCurrent(APIView):
    model = Article
    serializer_class = ArticleSerialiser
    permission_classes = [
        permissions.AllowAny
    ]


    def get(self, request, format=None):
        #for comment in Comment.objects.all():
        
        author_list = Author.objects(id=str(request.user.id))
        
        if len (author_list) < 1:
            return Response({"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in" }, status = status.HTTP_401_UNAUTHORIZED)
        
        
        serialisedList = AuthorSerialiser(author_list[0], many=False)
        
        return Response(serialisedList.data)


class AuthorsListAll(APIView):
    model = Article
    serializer_class = ArticleSerialiser
    permission_classes = [
        permissions.AllowAny
    ]


    def get(self, request, format=None):
        #for comment in Comment.objects.all():
        authors = Author.objects().all()

        rargs = request.GET
        if "author_name" in rargs and rargs["author_name"] is not None:
            if "use_contains" in rargs and rargs["use_contains"] == "true":
                authors = authors.filter(author_name__contains=rargs["author_name"])
            else:
                authors = authors.filter(author_name=rargs["author_name"])

        serialisedList = AuthorSerialiser(authors)
        return Response(serialisedList.data)


class AuthorsPostPut(APIView):

    permission_classes = [
        permissions.IsAuthenticated
        #permissions.AllowAny
    ]

    def post(self, request, authorid, format=None):

        if util.check_valid_object_id(id=authorid) is not True:
            return Response({"ok" : "false", "code" : "incorrect_id", "message" : "Incorrect Author Id", "status" : status.HTTP_400_BAD_REQUEST }, status = status.HTTP_400_BAD_REQUEST)
        author_list = Author.objects(id=str(request.user.id))
        
        if len (author_list) < 1:
            return Response({"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in" }, status = status.HTTP_401_UNAUTHORIZED)
    
        author = author_list[0]

        if "assign_permissions" not in user.user_permissions:
            return Response({"ok" : "false", "message" : "You are not allowed to assign permissions!" }, status = status.HTTP_403_FORBIDDEN)

        if "user_permissions" in request.DATA and "user_permissions" is not None:
            print request.DATA["user_permissions"]
            pass

        return Response({"ok":"true"})
        
class LoggedInUserDetails(APIView):
    model = Article
    serializer_class = AuthorSerialiser
    permission_classes = [
        #permissions.IsAuthenticated
        permissions.AllowAny
    ]


    @method_decorator(ensure_csrf_cookie)
    def get(self, request,  format=None):

        try:
            author_result = util.check_error_for_logged_in_user(request)
    
            author_list = []
            if ("ok" in author_result and author_result["ok"] == "true"):
                author_list = author_result["result"]
            else:
                if "status" in author_result:
                    return Response(author_result, status = author_result["status"])
                else:
                    return Response(author_result, status = status.HTTP_403_FORBIDDEN)
            
            serialisedList = AuthorSerialiser(author_list[0], many=False)
            
            return Response(serialisedList.data)
    
        except Exception as e:
            print "exception in LoggedInUserDetails: " +  str(e)
            return Response({"ok" : "false", "status" : status.HTTP_500_INTERNAL_SERVER_ERROR }, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class ArticlesByTag(APIView):
    def get(self, request, tag_name, format=None):
        tags = Tag.objects(name=tag_name)
        if len(tags) > 0:
            tag = tags[0]
            serialisedList = TagSerialiser(tag, many=False)
            return Response(serialisedList.data)
        else:
            return Response({"ok":"false","status":status.HTTP_404_NOT_FOUND, "code":"data_not_found","message":"Tag not found!"}, status = status.HTTP_404_NOT_FOUND)

#class ArticlesByTagAll(APIView):
#    def get(self, request, tag_name, format=None):
#        tags = Tag.objects().all()
#        serialisedList = TagSerialiser(tag, many=False)
#        return Response(serialisedList.data)

class TagsList(APIView):

    def get(self, request,  format=None):
        print "in tagslist"
        print "Request.DATA: " + str(request.DATA)
        print "Request.GET: " + str(request.GET)
        tag_list = []
        
        if "popular" in request.GET and request.GET["popular"] == "true":
            num_docs = 10
            if "num_docs" in request.GET:
                num_docs = int(request.GET["num_docs"])
            #print "num_docs = " + str(num_docs) 
            #tag_list = Metadata.objects.filter(entry_type="tag").order_by("num_user")[0:num_docs]
            tag_list = Tag.objects.order_by("-num_users")[0:num_docs]
        else:
            #tag_list = Metadata.objects.filter(entry_type="tag")
            tag_list = Tag.objects()
        if "get_user_fields" not in request.GET or request.GET["get_user_fields"] != "true":
            tag_list = tag_list.exclude("num_users","user_ids", "users")
        serialisedList = TagSerialiser(tag_list)
        return Response(serialisedList.data)

    def post(self, request, format=None):
        #metadata = Metadata()
        #metadata.entry_type = "tag"
        #metadata.name = request.DATA["name"]
        #metadata.num_user = 0
        #metadata.save()
        tag = Tag()
        tag.name = request.DATA["name"]
        tag.num_users = 0
        tag.save()
        return Response({"ok":"true"})
        
class CategoriesList(APIView):

    def get(self, request,  format=None):

        #tag_list = Metadata.objects.filter(entry_type="category")
        #serialisedList = MetadataSerialiser(tag_list)
        category_list = Category.objects().order_by("_id")
        if "get_user_fields" not in request.GET or request.GET["get_user_fields"] != "true":
            category_list = category_list.exclude("num_users","user_ids", "users")
        serialisedList = CategorySerialiser(category_list)

        return Response(serialisedList.data)

    def post(self, request, format=None):
        author_list = Author.objects(id=str(request.user.id))
        
        if len (author_list) < 1:
            return Response({"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in" }, status = status.HTTP_401_UNAUTHORIZED)
        
        author = author_list[0]
    
        user_permissions = author.user_permissions

        if "create_categories" not in user_permissions:
            return Response({"ok" : "false", "code" : "no_permission", "message" : "You don't have permission to create categories" }, status = status.HTTP_403_FORBIDDEN)

        #metadata = Metadata()
        #metadata.entry_type = "category"
        #metadata.name = request.DATA["name"]
        #if "friendly_name" in request.DATA:
        #    metadata.friendly_name = request.DATA["friendly_name"]
        #metadata.num_user = 0
        #metadata.save()
        category = Category()
        category.name = request.DATA["name"]
        if "friendly_name" in request.DATA:
            category.friendly_name = request.DATA["friendly_name"]
        category.num_users = 0
        category.save()
        return Response({"ok":"true"})

class AuthorsSettings(APIView):

    permission_classes = [
        permissions.IsAuthenticated
        #permissions.AllowAny
    ]
    
    def get(self, request,  authorid, format=None):
        #print "request.user.id: " + str(request.user.id)
        if str(request.user.id) != authorid:
            return Response({"ok":"false","code":"other_user_details_not_allowed","message":"You cannot view settings of other authors"}, status=status.HTTP_403_FORBIDDEN)
        author_settings_array = Author_Settings.objects(author_id=authorid)
        if len(author_settings_array) > 0:
            author_settings = author_settings_array[0]
            serialisedList = Author_SettingsSerialiser(author_settings, many=False)
            return Response(serialisedList.data)
        else:
            author_array = Author.objects(id=authorid)
            if len(author_array) > 0:
                return Response({"ok":"true","code":"unconfigured_default_settings","message":"Settings not configured, using default"})
            else:
                return Response({"ok":"false","code":"user_does_not_exist","message":"User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request,  authorid, format=None):
        if str(request.user.id) != authorid:
            return Response({"ok":"false","code":"other_user_details_not_allowed","message":"You cannot modify settings of other authors"}, status=status.HTTP_403_FORBIDDEN)
        author_settings_array = Author_Settings.objects(author_id=authorid)
        author_settings = None
        if len(author_settings_array) > 0:
            author_settings = author_settings_array[0]
        else:
            author_settings = Author_Settings()
        #print str(author_settings.privacy_hide_own_articles)
        author_settings.author_id = authorid
        if "privacy_hide_own_articles" in request.DATA:
            author_settings.privacy_hide_own_articles = request.DATA["privacy_hide_own_articles"]
        if "privacy_hide_own_comments" in request.DATA:
            author_settings.privacy_hide_own_comments = request.DATA["privacy_hide_own_comments"]
        if "privacy_hide_own_votes" in request.DATA:
            author_settings.privacy_hide_own_votes = request.DATA["privacy_hide_own_votes"]
        if "privacy_hide_others_comments" in request.DATA:
            author_settings.privacy_hide_others_comments = request.DATA["privacy_hide_others_comments"]
        if "privacy_hide_others_replies" in request.DATA:
            author_settings.privacy_hide_others_replies = request.DATA["privacy_hide_others_replies"]
        if "privacy_hide_others_votes" in request.DATA:
            #author_settings.privacy_hide_others_votes = util.convert_string_to_boolean(request.DATA["privacy_hide_others_votes"])
            author_settings.privacy_hide_others_votes = request.DATA["privacy_hide_others_votes"]

        author_settings.save()
        
        serialisedList = Author_SettingsSerialiser(author_settings, many=False)
        return Response(serialisedList.data)

class AuthorsActivity(APIView):
    def get(self, request,  authorid, format=None):
        author_activity = util.get_or_initialise_author_activity(authorid)
        if author_activity is not None:
            serialisedList = Author_ActivitySerialiser(author_activity, many=False)
            return Response(serialisedList.data)
        else:
            return Response({"ok":"false", "code": "user_does_not_exist","message":"User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

class AboutUs(APIView):
    def get(self, request, format=None):
        team_object = util.Extensible_class()
        team_object.team_authors = []
        team_object.team_metadata = None
        team_object.team_contactus = []
        if "get_all_information" in request.GET and request.GET["get_all_information"] == "true":
            team_authors = Team_Author.objects()
            if len(team_authors) > 0:
                team_object.team_authors = list(team_authors)
            team_metadata_array = Team_Metadata.objects()
            if len(team_metadata_array) > 0:
                team_metadata = team_metadata_array[0]
                #print "team_metadata: " + team_metadata
                team_object.team_metadata = team_metadata
            else:
                team_metadata = util.Extensible_class()
                team_metadata.aboutus_message = ""
                team_object.team_metadata =  team_metadata
            team_contactus = Team_ContactUs.objects()
            if len(team_contactus) > 0:
                team_object.team_contactus = list(team_contactus)
            serialisedList = Team_All_DataSerialiser(team_object, many=False)
            return Response(serialisedList.data)

        if "get_author_information" in request.GET and request.GET["get_author_information"] == "true":
            team_authors = Team_Author.objects.all()
            print team_authors
            if len(team_authors) > 0:
                team_authorserialisers = []
                #team_object.team_authors = team_authorserialisers
                team_object.team_authors = list(team_authors)

        if "get_metadata_information" in request.GET  and request.GET["get_metadata_information"] == "true":
            team_metadata_array = Team_Metadata.objects()
            if len(team_metadata_array) > 0:
                team_metadata = team_metadata_array[0]
                #print "team_metadata: " + team_metadata
                team_object.team_metadata = team_metadata
            else:
                team_metadata = util.Extensible_class()
                team_metadata.aboutus_message = ""
                team_object.team_metadata =  team_metadata

        if "get_contactus_information" in request.GET  and request.GET["get_contactus_information"] == "true":
            team_contactus = Team_ContactUs.objects()
            if len(team_contactus) > 0:
                team_object.team_contactus = list(team_contactus)
        
        serialisedList = Team_All_DataSerialiser(team_object, many=False)
        return Response(serialisedList.data)

    def post(self, request, format=None):
        try:
            if "update_author_information" in request.DATA and request.DATA["update_author_information"] == "true":
                util.update_aboutus_authors(request.user, **request.DATA)
            if "update_metadata_information" in request.DATA and request.DATA["update_metadata_information"] == "true":
                util.update_aboutus_metadata(request.user, **request.DATA)
            if "update_contactus_information" in request.DATA and request.DATA["update_contactus_information"] == "true":
                util.update_aboutus_contactus(request.user, **request.DATA)
        except PermissionDenied as e:
            return Response({"ok" : "false",  "message" : "You dont have permission to change About Us", "code" : "permission_denied" }, status = status.HTTP_403_FORBIDDEN )
        except Exception as e:
            print "Exception in aboutusspost: " + str(e)
            print " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2]))
            return Response({"ok" : "false",  "message" : str(e) }, status = status.HTTP_500_INTERNAL_SERVER_ERROR )
        return Response({"ok" : "true"})

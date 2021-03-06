import sys
import traceback
import os
import re
import hashlib
import time
import binascii
import io
import urllib
import urllib2
import json
import copy
from newsoftheworld import settings
from .models import Article
from .models import Author
from .models import Article_Metadata
from .models import STATUS_VALUE_DICT
from .models import Metadata
from .models import Author_Activity
from .models import Author_Settings
from .models import Category
from .models import Tag
from .models import ArticleForTagCategory
from .models import Team_Author
from .models import Team_Metadata
from .models import Team_ContactUs
from .models import Role_And_Permissions
from .db import db
from rest_framework import status
from allauth.account.signals import user_logged_in, user_signed_up
from django.dispatch import receiver
from django.contrib.auth.models import User
import django.dispatch
from lxml import etree, html
from PIL import Image, ImageOps, ImageChops
from django.core.exceptions import PermissionDenied
from bson.objectid import ObjectId
from mongoengine import Q
from mongoengine.errors import DoesNotExist


LOCATION_PROFILE_IMAGES = os.path.join(settings.MEDIA_ROOT, 'ojprofileimages')
LOCATION_ARTICLE_IMAGES = os.path.join(settings.MEDIA_ROOT, 'ojarticleimages')
LOCATION_FRONT_PAGE_IMAGES = os.path.join(settings.MEDIA_ROOT, 'ojfrontpageimages')
URL_PROFILE_IMAGES = settings.MEDIA_URL + 'ojprofileimages/' 
URL_ARTICLE_IMAGES = settings.MEDIA_URL + 'ojarticleimages/' 
URL_FRONT_PAGE_IMAGES = settings.MEDIA_URL + 'ojfrontpageimages/' 

profile_updated = django.dispatch.Signal(providing_args=["id", "fields"])
log_user_activity = django.dispatch.Signal(providing_args=["type", "id", "userid_from", "userid_to"])
published_article_finalised = django.dispatch.Signal(providing_args=["article"])
article_published = django.dispatch.Signal(providing_args=["article"])
article_unpublished = django.dispatch.Signal(providing_args=["article"])
roles_updated = django.dispatch.Signal(providing_args=["roles"])

crop_image_dimensions_dict = {"header_image" : (0,0,1280, 400), "thumbnail_image" : (0,0,180, 180)}
fit_image_dimensions_dict = {"header_image" : (1280, 400), "thumbnail_image" : (180, 180)}

image_format_dict = {"JPEG" : "jpg", "PNG" : "png", "GIF" : "gif"}
category_delimiter_for_deser = "%,#@$"
category_name_friendly_name_seperator = "%.#@$"

#NSMAP = {"image" : "http://www.google.com/schemas/sitemap-image/1.1",
#         "news" : "http://www.google.com/schemas/sitemap-news/0.9"}

NSMAP = {"image" : "http://www.google.com/schemas/sitemap-image/1.1"}


IMAGENS = "http://www.google.com/schemas/sitemap-image/1.1"
NEWSNS = "http://www.google.com/schemas/sitemap-news/0.9"


def uses_transparency_filename(filename):
    img = Image.open(filename)
    trans = img.info.get("transparency", None)
    if trans is not None:
        trans *= 3  # convert color number to palette table index
        palette = img.getpalette()
        imgs = []
        for bg in [0, 255]:   # map transparent color first to black, then white
            palette[trans:trans+3] = [bg] * 3
            img.putpalette(palette)
            imgs.append(img.convert("L"))
        return bool(ImageChops.difference(*imgs).getbbox())

def uses_transparency(img):
    trans = img.info.get("transparency", None)
    if trans is not None:
        trans *= 3  # convert color number to palette table index
        palette = img.getpalette()
        imgs = []
        for bg in [0, 255]:   # map transparent color first to black, then white
            palette[trans:trans+3] = [bg] * 3
            img.putpalette(palette)
            imgs.append(img.convert("L"))
        return bool(ImageChops.difference(*imgs).getbbox())


def check_valid_object_id(**kwargs):
    if "id" in kwargs:
        return re.match("^[0-9a-fA-F]{24}$", kwargs["id"]) != None
    return False
     

def check_article_create_permissions(user, DATA):
    user_permissions = user.user_permissions
    
    if "status" not in DATA or not DATA["status"]:
        DATA["status"] = "draft"

    if "articles_admin" in user_permissions:
        return { "ok" : "true" }

    if "create_articles" not in user_permissions:
        if not (has_attr(user, "num_drafts") and has_attr(user, "invitation_count")):
            return {"ok" : "false"}

        if DATA["status"] == "draft":
            if user.num_drafts < user.invitation_count:
                user.num_drafts = user.num_drafts + 1
            else:
                return { "ok" : "false", "code" : "no_permission", "message" : "You are not allowed more drafts", "status" : status.HTTP_403_FORBIDDEN }
        else:
            if DATA["status"] == "published" and "publish_articles" not in user_permissions:
                return {"ok" : "false", "code" : "no_permission", "message" : "You are not allowed to publish article", "status" : status.HTTP_403_FORBIDDEN }
            if user.invitation_count <= 0:
                return {"ok" : "false", "code" : "no_permission", "message" : "You cannot submit anymore opinions", "status" : status.HTTP_403_FORBIDDEN }
            else:
                user.invitation_count = user.invitation_count - 1

    else:
        if DATA["status"] is "published" and "publish_articles" not in user_permissions:
            return { "ok" : "false", "code" : "no_permission", "message" : "You are not allowed more drafts", "status" : status.HTTP_403_FORBIDDEN }

    
    return {"ok" : "true", "status" : status.HTTP_200_OK}

def check_article_update_permissions(user, DATA, article):
    user_permissions = user.user_permissions

    author = article.author

    if "status" not in DATA or DATA["status"] == None:
        return {"ok" : "false", "code" : "bad_status", "message" : "Opinion cannot have blank status",
                "status" : status.HTTP_400_BAD_REQUEST }

    if "articles_admin" in user_permissions:
        return { "ok" : "true" }

    if author.id == user.id:
        if DATA["status"] == "published":
            check_status_permission(user_permissions, "published")
        if article.status == "published" or article.status == "pending_review":
            return {"ok" : "false", "code" : "bad_status", "message" : "You cannot edit opinion that is " + STATUS_VALUE_DICT[article.status],
                    "status" : status.HTTP_400_BAD_REQUEST }

        if "edit_articles" not in user_permissions:
            if author.invitation_count <0:
                return {"ok" : "false", "code" : "no_permission", "message" : "You cannot edit anymore opinions", "status" : status.HTTP_403_FORBIDDEN }
            

    else:
        skipattrs = ["id", "status"]
        if "edit_others_articles" not in user_permissions and has_values_changed(article, DATA, skipattrs):
            return {"ok" : "false", "code" : "no_permission", "message" : "You do not have the permission to edit others Opinions",
                "status" : status.HTTP_403_FORBIDDEN }
        
        logic_array = get_status_change_logic(article, DATA)
        if logic_array == None:
            return {"ok" : "false", "code" : "status_change_not_allowed", "message" : "Opinion status not allowed",
                "status" : status.HTTP_400_BAD_REQUEST }

        for logic in logic_array.split(","):
            this_module = sys.modules[__name__]
            logic_check = getattr(this_module, logic)(user, author, status)
            if logic_check["ok"] == "false":
                return logic_check

        #log to file

    return { "ok" : "true" }
        

edit_article_dict = {
    "status_logic_array": [
        {
            "edit.article.other.old.status": "ready for review",
            "edit.article.other.new.status": "draft",
            "edit.article.other.logic": "check_permission"
        },
        {
            "edit.article.other.old.status": "ready for review",
            "edit.article.other.new.status": "published",
            "edit.article.other.logic": "check_status_others_permission,decrement_invitation_count"
        }
    ],
    "status_permission_others_map": {
        "published": "publish_others_articles",
        "draft": "publish_others_articles"
    },
    "status_permission_map": {
        "published": "publish_articles"
    }
}


def has_values_changed(article, DATA, skipattrs):
    for attr in DATA:
        print attr + str(DATA[attr])
        if attr in skipattrs:
            continue
        if DATA[attr] != getattr(article, attr):
            return True

    return True

def get_status_change_logic(article, DATA):
    status_logic_array = edit_article_dict["status_logic_array"]
    for status_logic_json in status_logic_array:
        if DATA["status"] == status_logic_json["edit.article.other.new.status"] and article.status == status_logic_json["edit.article.other.old.status"]:
            return status_logic_json["edit.article.other.logic"]

    return None


def check_status_permission(user_permissions, status):
    status_permission = None
    try:
        status_permission = edit_article_dict["status_permission_map"][status]
    except Exception:
        return True

    if status_permission in user_permissions:
        return True
    return False
    
def check_status_others_permission(user, author, status):
    user_permissions = user.user_permissions
    status_permission = None
    try:
        status_permission = edit_article_dict["status_permission_others_map"][status]
    except Exception:
        return { "ok" : "true" }


    if status_permission in user_permissions:
        return { "ok" : "true" }
    return { "ok" : "false", "code" : "permission_denied", "message" : "You do not have the permission to set the status" }
    
def decrement_invitation_count(user, author, status):
    author.num_draft = author.num_draft -1
    author.invitation_count = author.invitation_count - 1
    author.save()
    return { "ok" : "true" }

def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

def check_error_for_logged_in_user(request):
    if request.user and request.user.id:
        pass
    else:
        return {"ok" : "false", "code" : "user_not_logged_in", "message" : "You are currently not logged in", 
                         "status" : status.HTTP_401_UNAUTHORIZED  }
    
    author_list = Author.objects(id=str(request.user.id))
        
    if len (author_list) < 1:
        return {"ok" : "false", "code" : "user_not_setup_for_oj", 
                "message" : "Your account has not been configured for Opinion Junction, please contact administrator",
                "status" : status.HTTP_400_BAD_REQUEST }

    else:
        return {"ok" : "true", "result": author_list }
        
def get_categories():
    return Metadata.objects.filter(entry_type="category")

def get_articles_by_categories(categories, GET):
    articlesByCategories = []
    
    for category in categories:
        print "category.name: " + category.name
        articlesByCategory = Article.objects(categories__contains=category.name).order_by('-published_date')
        if 'limit_pc' in GET and is_number(GET['limit_pc']):
           articlesByCategory = articlesByCategory.limit(int(GET['limit_pc']))
        articlesByCategories.extend(articlesByCategory)

    return articlesByCategories

def get_articles_by_category(category, GET):
    articlesByCategory = Article.objects(categories__contains=category).filter(status='published').exclude("storytext","storyplaintext","tags").order_by('-published_date')
    if 'after' in GET:
        articlesByCategory = articlesByCategory.filter(id__gt=GET['after'])

    if 'limit' in GET and is_number(GET['limit']):
        articlesByCategory = articlesByCategory.limit(int(GET['limit']))

    return articlesByCategory

default_created_user_permissions = []

def initialise_author_activity(authorid, **kwargs):
    author = None
    if "author" in kwargs and kwargs["author"] is not None:
        author = kwargs["author"]
    elif "user" in kwargs and kwargs["user"] is not None:
        author = kwargs["user"]
    else:
        authors_array = Author.objects(id=authorid)
        if len(authors_array) > 0:
            author = authors_array[0]

    author_activity = Author_Activity()
    author_activity.author_id = authorid

    if author is not None:
        if isinstance(author, Author):
            author_activity.author_bio = author.user_bio
            author_activity.image = author.image
        if author.first_name or author.last_name:
            author_activity.author_name = author.first_name + author_last_name
            author_activity.author_name = author_activity.author_name.strip()
        else:
            if isinstance(author, Author):
                author_activity.author_name = author.author_name
            elif isinstance(author, User):
                author_activity.author_name = author.username

    author_activity.save()

    return author_activity

#    author = None
#    if "author" in kwargs and kwargs["author"] is not None:
#        author = kwargs["author"]
#    else:
#        author = Author.get(id=authorid)

#    pass


@receiver(user_signed_up, dispatch_uid="108")
def create_oj_user_activity(request, user, **kwargs):
    initialise_author_activity(str(user.id), user=user)

@receiver(user_logged_in, dispatch_uid="101")
def create_oj_user_in_nosql(request, user, sociallogin=None, **kwargs):

#    pass
    author = Author()
    
    if len(Author.objects(id=str(user.id))) > 0:
        return
    permissions = default_created_user_permissions
    if 'permissions' in kwargs:
        permissions = kwargs['permissions']
    
    author.id = str(user.id)
    author.author_name = user.username
    author.first_name = user.first_name
    author.last_name = user.last_name
    author.email_address = user.email
    role = 'Subscriber'
    if 'role' in kwargs:
        role = kwargs['role']
    author.user_role = role
    author.user_permissions = permissions

    print "axl gives users true access by giving them identities of authors" 
    author.save()

    if "return_author" in kwargs and kwargs["return_author"] == True:
        return author

def check_permissions(userid, permissions, all_match=True):
    author = Author.objects().get(id=userid)
    if (all_match == True):
        return all(permission in author.user_permissions for permission in permissions)
    
    return any(permission in author.user_permissions for permission in permissions)

def get_image_url_for_selfhosted(image_name):
    return URL_PROFILE_IMAGES + image_name

def save_image(profile_id, image_name, image_data):
    file_name, file_extension = os.path.splitext(image_name)
    file_name = "profile_" + str(profile_id) + file_extension

    with open(os.path.join(LOCATION_PROFILE_IMAGES, file_name), "wb") as file_handler:
        image_data = re.sub("^.*,","",image_data)
        file_handler.write(image_data.decode('base64'))
    return file_name

def get_gravatar_hash(image_id):
    return hashlib.md5(image_id.lower().strip()).hexdigest()

def get_provider_image_persisted_string(image):
        image = image[len(":@#"):]
        image_array = image.split(":")
        if image_array[0].lower() == "gravatar":
            return ":@#gravatar:" + get_gravatar_hash(image_array[1]) + ":" + image_array[1]
 
def process_image(user, data):
    if "update_image" in data and data["update_image"] == "true":
        print "update_image is true"
        image = data["image"]
        if image.startswith(":@#gravatar") != True:
            image_data = data["image_data"]
            saved_image_name = save_image(user.id, image, image_data)
            return get_image_url_for_selfhosted(saved_image_name)
        else:
            return get_provider_image_persisted_string(image)
    
def change_profile(user, data):
    
    #print "data: " + str(data)
    #user = User.objects.get(id=user_id)
    authors = Author.objects(id=str(user.id))

    author = None
    if len(authors) <= 0:
        author = create_oj_user_in_nosql(None, user, None, return_author=True)
    else:
        author = authors[0]

    updated_fields = []

    if user is not None:
        if "first_name" in data:
            first_name = data["first_name"]
            if first_name is None:
                raise Exception("first_name cannot be null")
            user.first_name = first_name
            if author.first_name != first_name:
                updated_fields.append("first_name")
                author.first_name = data["first_name"]


        if "last_name" in data:
            last_name = data["last_name"]
            if last_name is None:
                raise Exception("last_name cannot be null")
            user.last_name = last_name
            if author.last_name != last_name:
                author.last_name = last_name
                updated_fields.append("last_name")

        if "update_image" in data and data["update_image"] == "true":
            image = process_image(user, data)
            
            author.image = image
            updated_fields.append("image") #tracking image changes not easy, we should control this at client end


        if "gender" in data:
            gender = data["gender"]
            if author.gender != gender:
                author.gender = gender
                updated_fields.append("gender")

        if "user_bio" in data:
            user_bio = data["user_bio"]
            author.user_bio = user_bio
            updated_fields.append(user_bio)

        user.save()
        author.save()

        profile_updated.send_robust(sender=change_profile, id=author.id, fields=updated_fields, author=author)
        return author


def get_friendly_name(author):
#    return author.first_name + " " + author.last_name
    author_name = None
    if author.first_name or author.last_name:
        author_name = author.first_name + " " + author.last_name
        author_name = author_name.strip()
    else:
        author_name = author.author_name

    return author_name


#def convert_image_to_jpg(image):
#    bg = Image.new("RGB", image.size, (255,255,255))
#    bg.paste(image, image)
#    if bg.mode !="RGB":
#        bg.convert("RGB")
#    return bg


def remove_transparency_from_image(image):
    image = image.convert("RGBA")
    alpha = image.split()[-1]
    copy = Image.new("RGB", image.size, (255,255,255))
    copy.paste(image,mask=alpha)
    return copy.convert('RGB')
#    #image = image.convert("RGBA")
#    if image.mode == 'RGBA': #http://stackoverflow.com/questions/1962795/how-to-get-alpha-value-of-a-png-image-with-pil
#        alpha = image.split()[-1]
#    elif image.mode == 'LA' or (image.mode == 'P' and 'transparency' in image.info):
#        image = image.convert("RGBA")
#        alpha = image.split()[-1]
#    else:
#        return image.convert('RGB')
#    alpha = image.split()[-1]
#    alphamap = alpha.load()
#    imagemap = image.load()
#    for x in range(width):
#        for y in range(height):
#            if alphamap[x,y] == 0:
#                imagemap[x,y] = 16777215
#    return image.convert('RGB')

def process_article_image_self_hosted(articleid, image_data, extension):
    directory = os.path.join(LOCATION_ARTICLE_IMAGES, articleid)
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_name = str(os.getpid()) + str(int(round(time.time() * 1000))) + "." + extension


    with open(os.path.join(directory, file_name), "wb") as file_handler:
        file_handler.write(image_data.decode('base64'))
    return file_name

def process_front_page_image(articleid, image_type, image, extension, **kwargs):
    #if image.format is "GIF":
    #    pass
    directory = LOCATION_FRONT_PAGE_IMAGES
    #print "image.format: " + str(image.format)
    if image.format is "PNG" or image.format is "GIF" or not image.format:
        extension = "jpg"
        #print "image.format: " + str(image.format)
        #image = convert_image_to_jpg(image)
        image = remove_transparency_from_image(image)
    if "primary_image_name" in kwargs:
        file_name = image_type + "_" + str(articleid) + "_" + kwargs["primary_image_name"] + "." + extension
        #file_name = image_type + "_" + str(articleid) + "_" + kwargs["primary_image_name"] + "." + "jpg"
    else:
        file_name = image_type + "_" + str(articleid) + "." + extension
        #file_name = image_type + "_" + str(articleid) + "." + "jpg"
    if "quality" not in kwargs or kwargs["quality"] is None:
        image.save(os.path.join(directory,file_name))
    else:
        image.save(os.path.join(directory,file_name), quality=kwargs["quality"])
    
#    with open(os.path.join(directory, file_name), "wb") as file_handler:
#        file_handler.write(image_data.decode('base64'))
    return file_name
    
def check_gif_image_convertible_to_jpg(image, **kwargs): 
    """checks if image is convertible to jpg 
       Searches for frames in the image
          Gets first frame and checks if it has transparency information
              if it has transparency information, then it returns GIF_CONVERTIBLE_TO_PNG
              otherwise, it returns GIF_CONVERTIBLE_TO_JPG instead
    """
    #http://stackoverflow.com/questions/10269099/pil-convert-gif-frames-to-jpg
       
    pass

def check_png_image_convertible_to_jpg(image, **kawrgs):
    pass

def get_article_image_url(articleid, image_name):
    return URL_ARTICLE_IMAGES + articleid + "/" + image_name



def find_primary_image(content):
    root = html.fromstring(content)
    img_elements = root.findall('.//img')
    for img_element in img_elements:
        #print img_element.src
        primary_image_attrib = img_element.attrib.get("primaryimage")
        if primary_image_attrib == "true":
            return True
    return False

def save_binary_images_in_content(article, content, **kwargs):
    articleid = str(article.id)
    article.primary_image = None
    root = html.fromstring(content)
    img_elements = root.findall('.//img')
    for img_element in img_elements:
        #print img_element.src
        #for attr in img_element.attrib:
        #    print attr
        src = img_element.attrib.get("src")
        #print "src: " + str(src)
        if src.startswith("data:image/"):
            image_extension = re.search("(?<=data:image/).*(?=;base64)", src).group(0)
            image_data = re.sub("^.*,","",src)
            saved_image_name = process_article_image_self_hosted(articleid, image_data, image_extension)
            img_element.attrib["src"] = get_article_image_url(articleid, saved_image_name)
        
        primary_image_attrib = img_element.attrib.get("primaryimage")

        if primary_image_attrib == "true":
            article.primary_image = img_element.attrib.get("src")
        
    if article.primary_image is None:
        return {"ok" : "false", "code": "no_primary_image", "message" : "Primary image not defined!"} 

        #file_handler.write(src.decode('base64'))
    #print len(img_elements)
    article.storytext = html.tostring(root, pretty_print=True)
    return {"ok": "true"}

def get_cropped_image_from_data(image_data, image_type):
    crop_dimensions = crop_image_dimensions_dict[image_type]
    fit_dimensions = fit_image_dimensions_dict[image_type]
    fit_width, fit_height = fit_dimensions
    image_data_binary = binascii.a2b_base64(image_data)
    binary_image_ios = io.BytesIO(image_data_binary)
    image = Image.open(binary_image_ios)
    fitted_image = None
    image_width, image_height = image.size
    if (image_height < fit_height) or (image_width < fit_width):
        fitted_image = ImageOps.fit(image, fit_dimensions, Image.ANTIALIAS)
    else:
        fitted_image = ImageOps.fit(image, fit_dimensions)
    return fitted_image
    
def get_cropped_image_from_file(image_file, image_type):
    image = Image.open(image_file)

    fit_dimensions = fit_image_dimensions_dict[image_type]
    fit_width, fit_height = fit_dimensions

    fitted_image = None
    image_width, image_height = image.size
    if (image_height < fit_height) or (image_width < fit_width):
        fitted_image = ImageOps.fit(image, fit_dimensions, Image.ANTIALIAS)
    else:
        fitted_image = ImageOps.fit(image, fit_dimensions)
    return fitted_image

    #return image.crop(crop_dimensions)

def convert_image_url_to_location(image_url): #brittle, has tight coupling between image path and image url, 
                                              #any change to this coupling will have to be reflected here 
                                              #or this code will bomb
    stripped_image_url = None
    root_file_path = None
    if image_url.startswith(URL_PROFILE_IMAGES):
        stripped_image_url = image_url[len(URL_PROFILE_IMAGES):]
        root_file_path = LOCATION_PROFILE_IMAGES
    elif image_url.startswith(URL_ARTICLE_IMAGES):
        stripped_image_url = image_url[len(URL_ARTICLE_IMAGES):]
        root_file_path = LOCATION_ARTICLE_IMAGES
    elif image_url.startswith(URL_FRONT_PAGE_IMAGES):
        stripped_image_url = image_url[len(URL_FRONT_PAGE_IMAGES):]
        root_file_path = LOCATION_FRONT_PAGE_IMAGES
    else:
        return None
        
    stripped_image_path = stripped_image_url.replace("/", os.sep)
    
    full_image_path = os.path.join(root_file_path, stripped_image_path)
    
    return full_image_path

def get_front_page_image_url(image_name, image_type=None):
    return URL_FRONT_PAGE_IMAGES + image_name

def get_cropped_image(image, image_type):
    crop_dimensions = crop_image_dimensions_dict[image_type]
    fit_dimensions = fit_image_dimensions_dict[image_type]
    fit_width, fit_height = fit_dimensions
    fitted_image = None
    image_width, image_height = image.size
    if (image_height < fit_height) or (image_width < fit_width):
        fitted_image = ImageOps.fit(image, fit_dimensions, Image.ANTIALIAS)
    else:
        fitted_image = ImageOps.fit(image, fit_dimensions)
    return fitted_image


def image_from_url(image_url):
    url_ios = urllib2.urlopen(image_url)
    file_ios = io.BytesIO(url_ios.read())
    image = Image.open(file_ios)
    return image

def get_cropped_image_from_url(image_url, image_type):
   image = image_from_url(image_url)
   return get_cropped_image(image, image_type)

def return_clean_file_name(file_name, is_extension=False):
    if not file_name:
        return ''


    extension_period = u""

    if is_extension and file_name.startswith("."):
        extension_period = u"."
        file_name = file_name[1:]
        if not file_name:
            return extension_period

    stripped_name = ''.join([i if ord(i) < 128 else '' for i in file_name]) #remove unicode
    stripped_name = urllib.unquote(stripped_name)
    stripped_name = re.sub(r'\W+', '', stripped_name)


    return extension_period + stripped_name
    
    
def save_front_page_images_in_article(image_attr, article, image_type="header_image", **kwargs):
    articleid = article.id
    image = None
    image_extension = None
    image_data = None
    image_name = None
    if image_attr.startswith("data:image/"):
        image_extension = re.search("(?<=data:image/).*(?=;base64)", image_attr).group(0)
        image_data = re.sub("^.*,","",image_attr)
        image = get_cropped_image_from_data(image_data, image_type)
    else:
        if image_attr.startswith("http:") or image_attr.startswith("https://"): #quick and dirty test to check 
                                                                                # if the file location is external url
            image = get_cropped_image_from_url(image_attr, image_type)
            primary_image_name_base = image_attr.split('/')[-1]
            image_name, image_extension = os.path.splitext(primary_image_name_base)
            if image.format in image_format_dict:
                image_extension = image_format_dict["image.format"]
            if image_extension and image_extension.startswith("."):
                image_extension = image_extension[1:]

            image_name = return_clean_file_name(image_name)
            image_extension = return_clean_file_name(image_extension, True)
        else:
            filename_complete = convert_image_url_to_location(image_attr)
            if filename_complete is None:
                filename_complete = image_attr #maybe we got filepath instead of url, so  trying the rest of code with filename instead
            image = get_cropped_image_from_file(filename_complete, image_type)
            primary_image_name_base = os.path.basename(filename_complete)
            image_name, image_extension = os.path.splitext(primary_image_name_base)
            image_name = return_clean_file_name(image_name)
            image_extension = return_clean_file_name(image_extension, True)

    if "primary_image_name" in kwargs:
        saved_image_name = process_front_page_image(articleid, image_type, image, image_extension, primary_image_name= kwargs["primary_image_name"])
    elif image_name:
        saved_image_name = process_front_page_image(articleid, image_type, image, image_extension, primary_image_name= image_name)
    else:
        saved_image_name = process_front_page_image(articleid, image_type, image, image_extension)

    image_url = get_front_page_image_url(saved_image_name)
    
    if image_type == "header_image":
        article.header_image = image_url
    elif image_type == "thumbnail_image":
        article.thumbnail_image = image_url

    return image_url

    
def convert_string_to_boolean(string):
    if string and string.lower() == "true":
        return True
    return False

def get_category_string_for_deser_objects(categories):
    category_string_ret = ""
    if categories is None:
        return category_string_ret

    if len(categories) > 0:
        category = categories[0]
        categories = categories[1:]
        category_string_ret = category

    for category in categories:
        category_string_ret = category_string_ret + category_delimiter_for_deser + category

    return category_string_ret

def get_articleForTagCategory_from_article(article):
    articleForTagCategory = ArticleForTagCategory()
    articleForTagCategory.article_id = str(article.id)
    articleForTagCategory.title = article.title
    articleForTagCategory.slug = article.slug
    articleForTagCategory.excerpt = article.excerpt
    articleForTagCategory.author_name = get_friendly_name(article.author)
    articleForTagCategory.categories = get_category_string_for_deser_objects(article.categories)
    if article.thumbnail_image:
        articleForTagCategory.thumbnail_image = article.thumbnail_image
    else:
        articleForTagCategory.thumbnail_image = article.primary_image
    return articleForTagCategory

def update_category_users_for_article(article, increment_number=1):
    article_categories = sorted(article.categories)
    #print "article_categories: " + article_categories
    categories_db = Category.objects().order_by("name")
    categories = []
    categories.extend(categories_db)
    #print "update_category_num_users_for_article: increment_number: " + str(increment_number)
    articleForCategoryOrig = get_articleForTagCategory_from_article(article)
    for article_category in article_categories:
        #print "article_category: " + article_category
        for index, category in enumerate(categories):
            if article_category == category.name:
                if increment_number > 0:
                    articleForCategory = copy.copy(articleForCategoryOrig) #since we are persisted this in mongo
                    category.update(add_to_set__users = articleForCategory)
                else:
                    category.update(pull__users = ArticleForTagCategory(article_id=str(article.id)))
                category.save()
                categories = categories[index:]
                break


def update_tag_users_for_article(article, pub_or_unpub=1):
    article_tags = article.tags
    #print "update_tag_num_users_for_article: increment_number: " + str(increment_number)
    if pub_or_unpub == 1:
        articleForTagOrig = get_articleForTagCategory_from_article(article)
        for article_tag in article_tags:
            articleForTag = copy.copy(articleForTagOrig) #since we have persisted this in mongo
            if article_tag and article_tag.strip():
                Tag.objects(name=article_tag).update_one(set__name=article_tag, 
                                                         add_to_set__users = articleForTag)
    else:
        for article_tag in article_tags:
            if article_tag and article_tag.strip():
                Tag.objects(name=article_tag).update_one(set__name=article_tag,
                                                         pull__users = ArticleForTagCategory(article_id=str(article.id)))
                                                     


@receiver(published_article_finalised, dispatch_uid="110")
def handle_finalise_published_article(article, **kwargs):
    update_category_users_for_article(article, 1)
    update_tag_users_for_article(article)

def finalise_published_article(article):
    published_article_finalised.send_robust(sender=finalise_published_article, article=article)

def update_article_displayed_text(article):
    root = html.fromstring(article.storytext)
    img_elements = root.findall('.//img')
    for img_element in img_elements:
        img_element.attrib.pop("primaryimage", None)
        if img_element.attrib.get("alt") is None:
            #img_element.attrib["alt"] = "..."
            img_element_parent = img_element.getparent()
            if not img_element_parent.tag or img_element_parent.tag.lower() != "div":
                img_element.attrib["alt"] = "..."
                continue
            caption_container_array = img_element_parent.xpath("./div[@class='caption-container']")
            if len(caption_container_array) > 0:
                caption_container = caption_container_array[0]
                if caption_container.text:
                    img_element.attrib["alt"] = caption_container.text
                else:
                    img_element.attrib["alt"] = "..."
                    
            else:
                img_element.attrib["alt"] = "..."



    article.storydisplayedtext = html.tostring(root, pretty_print=True)


def create_article(article=None, **kwargs):
    user = kwargs["user"]
    articleid = None
    if article is None:
        if "articleid" not in kwargs:
            return
        else:
            articleid = kwargs["articleid"]
            articles = Article.objects(id=articleid)
            if len(articles) > 0:
                article = articles[0]
            else:
                return
    else:
        articleid = article.id
        
    
    if article.status == "published":
        update_article_displayed_text(article)
        article.save()
        article_published.send_robust(sender=create_article,article=article)

    log_user_activity.send_robust(sender=create_article, id=articleid, userid_to=user.id, userid_from=None)

def update_article(article=None, **kwargs):
    user = kwargs["user"]
    articleid = None
    if article is None:
        if "articleid" not in kwargs:
            return
        else:
            articleid = kwargs["articleid"]
            articles = Article.objects(id=articleid)
            if len(articles) > 0:
                article = articles[0]
            else:
                return
    else:
        articleid = article.id

    if "article_state" in kwargs and kwargs["article_state"] is not None:
        article_state = kwargs["article_state"]
        if article is not None:
            if article.status != "published" and article_state["original_article"].status == "published":
                article_unpublished.send_robust(sender=update_article,article=article)
            elif article.status == "published":
                update_article_displayed_text(article)
                article.save()
                if article_state["original_article"].status != "published":
                    article_published.send_robust(sender=update_article,article=article)
        
        
    
    log_user_activity.send_robust(sender=update_article, id=articleid, userid_to=user.id, userid_from=None)


def update_category_num_users_for_article(article, increment_number=1):
    article_categories = sorted(article.categories)
    #print "article_categories: " + article_categories
    categories_db = Category.objects().order_by("name")
    categories = []
    categories.extend(categories_db)
    #print "update_category_num_users_for_article: increment_number: " + str(increment_number)
    for article_category in article_categories:
        #print "article_category: " + article_category
        for index, category in enumerate(categories):
            if article_category == category.name:
                if increment_number > 0:
                    category.update(inc__num_users=increment_number, add_to_set__user_ids = article.id)
                else:
                    category.update(inc__num_users=increment_number, pull__user_ids = article.id)
                category.save()
                categories = categories[index:]
                break


def update_tag_num_users_for_article(article, increment_number=1):
    article_tags = article.tags
    print "update_tag_num_users_for_article: increment_number: " + str(increment_number)
    for article_tag in article_tags:
        if article_tag and article_tag.strip():
            Tag.objects(name=article_tag).update_one(upsert=True,
                                                     set__name=article_tag,inc__num_users=increment_number, 
                                                     add_to_set__user_ids = article.id )
        #http://stackoverflow.com/questions/14623430/mongoengine-how-to-perform-a-save-new-item-or-increment-counter-operation

@receiver(profile_updated, dispatch_uid="109")
def update_profile_in_author_activity(id, fields, author, **kwargs):
    author_activity = None
    author_activity_array = Author_Activity.objects(author_id=id)
    if len(author_activity_array) > 0:
        author_activity = author_activity_array[0]
    else:
        author_activity = Author_Activity()
        author_activity.author_id = id

    author_activity.author_bio = author.user_bio
    author_activity.image = author.image
    if author.first_name or author.last_name:
        author_activity.author_name = author.first_name + " " + author.last_name
        author_activity.author_name = author_activity.author_name.strip()
    else:
        author_activity.author_name = author.author_name

    author_activity.save()

def populate_or_create_sitemap_url_element(url_element, loc,lastmod,changefreq,priority,**kwargs):
    if url_element is None:
        url_element = etree.Element('url')

    url_element = etree.Element('url')
    loc_element = etree.SubElement(url_element, 'loc')
    loc_element.text = loc
    lastmod_element = etree.SubElement(url_element, 'lastmod')
    lastmod_element.text = lastmod
    if changefreq is not None:
        change_freq_element = etree.SubElement(url_element, 'changefreq')
        change_freq_element.text = changefreq
    if priority is not None:
        priority_element = etree.SubElement(url_element, 'priority')
        priority_element.text = priority

    return url_element


def check_if_article_in_sitemap_root(root, article):
    urlset_element = root.getroot()
    loc_element_for_article_array = urlset_element.xpath("//default:loc[text()='https://www.opinionjunction.com/article/" + str(article.id) + "/" + article.slug + "']", namespaces={"default" : "http://www.sitemaps.org/schemas/sitemap/0.9"})
    return len(loc_element_for_article_array) > 0

def populate_or_create_sitemap_url_element_for_article(article):
    article_element = populate_or_create_sitemap_url_element(None, 'https://www.opinionjunction.com/' + 'article/' + str(article.id) + "/" + article.slug, article.published_date.isoformat()[0:-16], None, None)
    article_image_element = etree.SubElement(article_element, '{%s}image' % IMAGENS)
    article_image_loc_element = etree.SubElement(article_image_element, '{%s}loc' % IMAGENS)
    if article.primary_image and article.primary_image[0] == '/':
        article_image_loc_element.text = 'https://www.opinionjunction.com' + article.primary_image
    else:
        article_image_loc_element.text = article.primary_image
#    article_news_element = etree.SubElement(article_element, '{%s}news' % NEWSNS)
#    article_news_publication_element = etree.SubElement(article_news_element, '{%s}publication' % NEWSNS)
#    article_news_publication_name_element = etree.SubElement(article_news_publication_element, '{%s}name' % NEWSNS)
#    article_news_publication_name_element.text = "Opinion Junction"
#    article_news_publication_language_element = etree.SubElement(article_news_publication_element, '{%s}language' % NEWSNS)
#    article_news_publication_language_element.text = 'en'
#    article_news_title_element = etree.SubElement(article_news_element, '{%s}title' % NEWSNS)
#    article_news_title_element.text = article.title
#    article_news_keywords_element = etree.SubElement(article_news_element, '{%s}keywords' % NEWSNS)
#    article_news_publication_date_element = etree.SubElement(article_news_element, '{%s}publication_date' % NEWSNS)
#    article_news_publication_date_element.text = article.published_date.isoformat()
    return article_element

def add_article_to_sitemap(article):

    article_not_in_sitemap = False

    root = None
    urlset_element = None
    if not os.path.exists("/newsoftheworld/newsoftheworldusr/sitemap.xml"):
       urlset_element = etree.Element('urlset', nsmap = NSMAP, xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")     
       root = etree.ElementTree(urlset_element)
       article_not_in_sitemap = True
    else:
        root = etree.parse("/newsoftheworld/newsoftheworldusr/sitemap.xml")
        urlset_element = root.getroot()
        if not check_if_article_in_sitemap_root(root, article):
            article_not_in_sitemap = True

    #print "article_not_in_sitemap: " + str(article_not_in_sitemap)

    if article_not_in_sitemap == True:
        #print "article not in sitemap, adding it to the sitemap urlset root"
        article_element = populate_or_create_sitemap_url_element_for_article(article)
        urlset_element.append(article_element)

    
    root.write("/newsoftheworld/newsoftheworldusr/sitemap.xml", xml_declaration=True, encoding="utf-8", pretty_print=True)

def remove_article_from_sitemap(article):
    if not os.path.exists("/newsoftheworld/newsoftheworldusr/sitemap.xml"):
        return
    root = etree.parse("/newsoftheworld/newsoftheworldusr/sitemap.xml")
    urlset_element = root.getroot()
    if not check_if_article_in_sitemap_root(root, article):
        return
    loc_element = urlset_element.xpath("//default:loc[text()='https://www.opinionjunction.com/article/" + str(article.id) + "/" + article.slug + "']", namespaces={"default" : "http://www.sitemaps.org/schemas/sitemap/0.9"})[0]

    loc_element.getparent().getparent().remove(loc_element.getparent())

    root.write("/newsoftheworld/newsoftheworldusr/sitemap.xml", xml_declaration=True, encoding="utf-8", pretty_print=True)

@receiver(article_published, dispatch_uid="106")
def handle_article_published(article, **kwargs):
    update_category_num_users_for_article(article, 1)
    update_tag_num_users_for_article(article, 1)
    #update_article_displayed_text(article)
    add_article_to_sitemap(article)

@receiver(article_unpublished, dispatch_uid="107")
def handle_article_unpublished(article, **kwargs):
    update_category_num_users_for_article(article, -1)
    update_tag_num_users_for_article(article, -1)
    remove_article_from_sitemap(article)

@receiver(log_user_activity, dispatch_uid="103")
def update_article_creation_log(id, userid_to, userid_from, **kwargs):

    author_settings_array_me = Author_Settings.objects(author_id=userid_to)
    print "len(author_settings_array_me): " + str(len(author_settings_array_me))
    if len(author_settings_array_me) == 0 or author_settings_array_me[0].privacy_hide_own_articles is False:
        article_me_array = Article.objects(id=id)
    
        if len(article_me_array) > 0 and article_me_array[0].status=="published":
            article_me = article_me_array[0]
            activity_article_pm = {}        
            activity_article_pm["title"] = article_me.title
            activity_article_pm["published_date"] = article_me.published_date
            activity_article_pm["excerpt"] = article_me.excerpt
            activity_article_pm["slug"] = article_me.slug

            print db.author__activity.update({"_id": str(userid_to)}, 
                                       {"$push": 
                                        {"latest_articles": 
                                         { "$each" : [activity_article_pm],
                                           "$slice" : -5
                                         }
                                        }
                                       }, 
                                       upsert=True)
    
@receiver(roles_updated, dispatch_uid="111")
def update_article_creation_log(roles, **kwargs):
    for role in roles:
        print "role_name: " + role.role_name
        authors = Author.objects(user_role=role.role_name)
        for author in authors:
            print "author_name: " + author.author_name
            author.user_permissions = role.permissions
            author.save()

#    activity_records = Author_Activity.objects(author_id=id)
#    activity_record = None
#    if len(activity_records) > 0:
#        activity_record = activity_records[0]
#    else:
#        activity_record = Author_Activity()
    #activity_record = 

def get_bad_article(error_type):
    article = Article()
    article.id = "-1"
    article.author = Author()
    article.author.id = "-1"
    article.author.image = ""
    article.author.first_name = ""
    article.author.last_name = ""
    article.author.user_bio = ""
    
    if error_type == "incorrect_articleid":
        article.excerpt = "Article id is incorrect"
        article.title = "Incorrect article id"
    elif error_type == "no_article_found":
        article.excerpt = "No article found!"
        article.title = "No article found for this id"

    return article

def return_list_stripped_members(list_object,add_blank=False):
    stripped_list = []
    for member in list_object:
        if add_blank == False:
            if not member:
                continue
            member = member.strip()
            if not member:
                continue
            stripped_list.append(member)
        else:
            if not member:
                stripped_list.append(member)
                continue
            member = member.strip()
            stripped_list.append(member)

    
    return stripped_list

def get_author_activity(authorid):
    author_activity_array = Author_Activity.objects(author_id=authorid)
    if len(author_activity_array) > 0:
        return author_activity_array[0]
    return None


def get_or_initialise_author_activity(authorid):
    author_activity = get_author_activity(authorid)
    
    if author_activity is None:
        authors_array = Author.objects(id=authorid)
        if len(authors_array) > 0:
            return initialise_author_activity(authorid, author=authors_array[0])
        else:
            return None

    return author_activity


def update_aboutus_authors(user, **kwargs):
#    for member in kwargs:
#        print "update_aboutus request.DATA parameter: " + str(member)
    authors = Author.objects(id=str(user.id))
    
    author = None
    if len(authors) > 0:
        author = authors[0]
    else:
        raise PermissionDenied()

    user_permissions = author.user_permissions


    if "set_aboutus" not in user_permissions:
        raise PermissionDenied()

    if 'removed_authors' in kwargs and kwargs['removed_authors'] is not None:
        authors_to_remove = kwargs['removed_authors']
        for author in authors_to_remove:
            team_author = Team_Author.objects(author_id=author)
            team_author.delete()

    if 'added_authors' in kwargs:
        authors_to_add = kwargs['added_authors']
        print "type of authors_to_add: " + str(type(authors_to_add))
        print "number of authors_add: "+ str(len(authors_to_add))
        for author in authors_to_add:
            team_author = Team_Author()
            team_author.author_id = author['id']
            team_author.author_name = author['author_name']
            team_author.first_name = author['first_name']
            team_author.last_name = author['last_name'] 
            team_author.image = author['image']
            team_author.role = author['role']
            team_author.save()

    if 'changed_authors' in kwargs:
        authors_to_change = kwargs['changed_authors']
        for author in authors_to_change:
            team_authors = Team_Author.objects(author_id=author['id'])
            if len(team_authors) > 0:
                team_author = team_authors[0]
                team_author.author_id = author['id']
                team_author.author_name = author['author_name']
                team_author.first_name = author['first_name']
                team_author.last_name = author['last_name'] 
                team_author.image = author['image']
                team_author.role = author['role']
                team_author.save()
            else:
                print 'team author not found: ' + author['id']


def update_aboutus_metadata(user, **kwargs):
    authors = Author.objects(id=str(user.id))
    
    author = None
    if len(authors) > 0:
        author = authors[0]
    else:
        raise PermissionDenied()

    user_permissions = author.user_permissions


    if "set_aboutus" not in user_permissions:
        raise PermissionDenied()

    team_metadata = None

    team_metadata_array = Team_Metadata.objects()
    if len(team_metadata_array) > 0:
        team_metadata = team_metadata_array[0]
    else:
        team_metadata = Team_Metadata()

    for key in kwargs:
        print "key: " + str(key)

    if "aboutus_message" in kwargs:
        team_metadata.aboutus_message = kwargs["aboutus_message"]

    team_metadata.save()

def update_aboutus_contactus(user, **kwargs):
    authors = Author.objects(id=str(user.id))
    
    author = None
    if len(authors) > 0:
        author = authors[0]
    else:
        raise PermissionDenied()

    user_permissions = author.user_permissions


    if "set_aboutus" not in user_permissions:
        raise PermissionDenied()
    if 'removed_contactus' in kwargs and kwargs['removed_contactus'] is not None:
        contactus_to_remove = kwargs['removed_contactus']
        for contactus in contactus_to_remove:
            team_contactUs = Team_ContactUs.objects(id=ObjectId(contactus))
            team_contactUs.delete()

    if 'added_contactus' in kwargs:
        contactus_to_add = kwargs['added_contactus']
        for contactus in contactus_to_add:
            team_contactUs = Team_ContactUs()
            team_contactUs.contactus_description = contactus['contactus_description']
            team_contactUs.contactus_details = contactus['contactus_details']
            team_contactUs.contactus_type = contactus['contactus_type']
            team_contactUs.save()

    if 'changed_contactus' in kwargs:
        contactus_to_change = kwargs['changed_contactus']
        for contactus in contactus_to_change:
            team_contactUs_array = Team_ContactUs.objects(id=ObjectId(contactus['id']))
            if len(team_contactUs_array) > 0:
                team_contactUs = team_contactUs_array[0]
                team_contactUs.contactus_description = contactus['contactus_description']
                team_contactUs.contactus_details = contactus['contactus_details']
                team_contactUs.contactus_type = contactus['contactus_type']

                team_contactUs.save()
            else:
                print 'team contactus not found: ' + contactus['id']


def set_article_metadata(article, **kwargs):
    if "article_metadata" in kwargs:
        article.article_metadata = Article_Metadata() 
        metadata_in_request = kwargs["article_metadata"]
        if metadata_in_request  is not None:
            if "robots_tag" in metadata_in_request:
                article.article_metadata.robots_tag = metadata_in_request["robots_tag"]
                

#http://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

class Extensible_class(object):
    pass

def get_about_us(**kwargs):
    team_object = Extensible_class()
    team_object.team_authors = []
    team_object.team_metadata = None
    team_object.team_contactus = []
    if "get_all_information" in kwargs and kwargs["get_all_information"] == "true":
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
        return team_object
    if "get_author_information" in kwargs and kwargs["get_author_information"] == "true":
        team_authors = Team_Author.objects.all()
        print team_authors
        if len(team_authors) > 0:
            #team_authorserialisers = []
            #team_object.team_authors = team_authorserialisers
            team_object.team_authors = list(team_authors)

    if "get_metadata_information" in kwargs  and kwargs["get_metadata_information"] == "true":
        team_metadata_array = Team_Metadata.objects()
        if len(team_metadata_array) > 0:
            team_metadata = team_metadata_array[0]
            #print "team_metadata: " + team_metadata
            team_object.team_metadata = team_metadata
        else:
            team_metadata = util.Extensible_class()
            team_metadata.aboutus_message = ""
            team_object.team_metadata =  team_metadata

    if "get_contactus_information" in kwargs  and kwargs["get_contactus_information"] == "true":
        team_contactus = Team_ContactUs.objects()
        if len(team_contactus) > 0:
            team_object.team_contactus = list(team_contactus)

    return team_object

def article_search(**kwargs):
    if "searchString" in kwargs and kwargs["searchString"]:
        searchString = kwargs["searchString"]
        if isinstance(searchString, list):
            if len(searchString) > 0:
                searchString = searchString[0]
        articles = Article.objects.filter(Q(storytext__icontains = searchString) & Q(status="published"))
        return list(articles)
    return []

def get_user_permissions(**kwargs):
    authors = Author.objects(id=str(user.id))
    
    author = None
    if len(authors) > 0:
        author = authors[0]
    else:
        raise PermissionDenied()

    user_permissions = author.user_permissions


    if "assign_permissions" not in user_permissions and "create_roles" not in user_permissions:
        raise PermissionDenied()

    return Roles_And_Permissions.objects.all()



def compare_object_and_dict(mongoengine_object, rest_dict, ignore_missing_fields):
    object_dict = mongoengine_object._data
    for key in object_dict:
        if key not in rest_dict:
            if ignore_missing_fields:
                continue
            else:
                return False
        if object_dict[key] != rest_dict[key]:
            return False

    return True

def get_required_permissions_for_author_update(changed_authors):
    required_permissions = set()
    for changed_author in changed_authors:
        authors = Author.objects(id=changed_author["id"])
        author = None
        if len(authors) == 1:
            author = authors[1]

        
        #compatibility break-prone check
        if compare_object_and_dict(author,changed_author, True):
            continue

        print "str(changed_author): " + str(changed_author)

        print "str(author._data): " + str(author._data)
 


        if author.user_role != changed_author['user_role']:
            required_permissions.add("assign_permissions")


        author.user_role = changed_author["user_role"]

        print "str(author._data): " + str(author._data)
        
        if not compare_object_and_dict(author,changed_author, True):
            raise PermissionDenied("You need 'assign_permissions' permission to changed author roles, no other changes to authors are permitted")
            
    return required_permissions

def check_user_permissions(user, permissions_to_compare):
    
    if not user.is_authenticated():
        raise PermissionDenied("You are not authenticated.")

    authors = Author.objects(id=str(user.id))
    
    author = None
    if len(authors) > 0:
        author = authors[0]
    else:
        raise PermissionDenied("You are not authenticated.")

    user_permissions = author.user_permissions

    for permission_to_compare in permissions_to_compare:
        if permission_to_compare not in user_permissions:
            raise PermissionDenied("You don't have the permissions to perform this operation.")
    

def set_if_missing_failed_updates_authors(returned_dict, **kwargs):
    if "failed_updates" not in returned_dict:
        failed_updates = {}
        failed_updates["missing_author_role_names"] = {}
        returned_dict["failed_updates"] = failed_updates


def update_authors(user, changed_author_details, return_changes, **kwargs):
    roles_map = {}
    return_dict = {"ok" : "true"}
    changed_authors_return = None
    missing_roles = set()
    print "str(return_changes): " + str(return_changes)
    if return_changes:
        changed_authors_return = []
        return_dict["changed_authors"] = changed_authors_return
    for changed_author in changed_author_details:
        authors = Author.objects(id=changed_author["id"])
        
        if len(authors) == 1:
            author = authors[0]
            new_role = changed_author["user_role"]

            
            if new_role not in roles_map:
                if new_role not in missing_roles:
                    try:
                        role = Role_And_Permissions.objects.get(role_name = new_role)
                        roles_map[role.role_name] = role
                    except DoesNotExist as e:
                        missing_roles.add(new_role)
                        set_if_missing_failed_updates_authors(return_dict)
                        returned_dict["failed_updates"]["missing_author_role_names"][author.author_name] = new_role
                        continue
                else:
                    set_if_missing_failed_updates_authors(return_dict)
                    returned_dict["failed_updates"]["missing_author_role_names"][author.author_name] = new_role
                    continue
                    

            role = roles_map[new_role]
            author.user_role = new_role
            author.user_permissions = role.permissions

            author.save()
            if return_changes:
                changed_authors_return.append(author)
    return return_dict

def update_authors_all_modes(user, **kwargs):
    if "all_information" not in kwargs or kwargs["all_information"] is not True:
        raise PermissionDenied("This operation only supports 'all_information' as of now")
    return_dict = {}
    return_changes = False
    required_permissions = None
    changed_authors = None
    if "changed_authors" in kwargs:
        changed_authors = kwargs["changed_authors"]
    
    if changed_authors is not None and len(changed_authors) > 0:
        required_permissions = get_required_permissions_for_author_update(changed_authors)
    

        
        check_user_permissions(user, required_permissions)
        
        print "str(kwargs): " + str(kwargs)
        if "return_changes" in kwargs and (kwargs["return_changes"] == "true" or kwargs["return_changes"] is True):
            return_changes = True    
    
            print "str(return_changes): " + str(return_changes)
            
        return_dict.update(update_authors(user, changed_authors, return_changes))

    return return_dict
    
    pass

def validate_role_dicts (**kwargs):
    new_role_details = kwargs['new_roles']
    for role_detail in new_role_details:
        validate_role_dict(role_detail)

def validate_role_dict(role):
    if "\\" in role["role_name"]:
        raise ValueError("Role name cannot contain letter '\\'")
        

def validate_role(role):
    if "\\" in role.role_name:
        raise ValueError("Role name cannot contain letter '\\'")

def get_all_roles_permissions(**kwargs):
    if "fields" in kwargs:
        fields = kwargs["fields"]
        if isinstance(fields, basestring):
            fields = fields.split(",")
        
        return Role_And_Permissions.objects.all().only(*fields)
        
    return Role_And_Permissions.objects.all()
    


def create_author_roles_all_modes(user, **kwargs):
    #validate_role_dicts(**kwargs)

    check_user_permissions(user, ["create_roles"])

    returned_dict = {}
    print "str(kwargs): " + str(kwargs) 
    return_changes = False
    if 'return_changes' in kwargs and ((kwargs['return_changes'] == "true") or (kwargs['return_changes'] is True)):
        print "str(type(kwargs['return_changes'])): " + str(type(kwargs['return_changes']))
        print "str(kwargs['return_changes']): " + str(kwargs['return_changes'])
        return_changes = True
    if 'all_information' in kwargs and (kwargs['all_information'] == 'true' or kwargs['all_information'] is True):
        if 'new_roles' in kwargs:
            returned_dict_create = create_author_roles(user, kwargs['new_roles'], return_changes)
            returned_dict.update(returned_dict_create)
        if 'modified_roles' in kwargs:
            returned_dict_update = update_author_roles(user, kwargs['modified_roles'], return_changes)
            returned_dict.update(returned_dict_update)
        return returned_dict

    else:
        return create_author_roles(kwargs['new_roles'])
        


def set_if_missing_failed_updates(returned_dict, **kwargs):
    if "failed_updates" not in returned_dict:
        failed_updates = {}
        failed_updates["duplicate_role_names"] = {}
        failed_updates["missing_role_names"] = {}
        failed_updates["new_blank_role_names"] = False
        returned_dict["failed_updates"] = failed_updates
        

def create_author_roles(user, new_role_details, return_changes, **kwargs):
    returned_dict = {"ok" : "true"}
    check_user_permissions(user, ["create_roles"])
    created_roles = []
    for role_detail in new_role_details:
        role_name_from_detail  = role_detail["role_name"]
        roles = Role_And_Permissions.objects(role_name=role_name_from_detail)
        if len(roles) > 0:
            set_if_missing_failed_updates(returned_dict)
            returned_dict["failed_updates"]["new_blank_role_names"] = True

        role = Role_And_Permissions()
        role.role_name = role_name_from_detail
        print 'role_detail["permissions"]: ' + str(role_detail["permissions"])
        permissions = role_detail["permissions"]
        if isinstance(permissions, basestring):
            role.permissions = role_detail["permissions"].split(",")
        else:
            role.permissions = role_detail["permissions"]
        role.save()
        created_roles.append(role)

    #print "created_roles: " + str(created_roles)
    
    print "str(return_changes): " + str(return_changes)
    if return_changes is True:
        returned_dict["created_roles"] = created_roles
        return returned_dict
    else:
        return returned_dict



def get_articles_all(request, **kwargs):
    kwargs = delistify_all_parameters(kwargs)
    try:
        serialisedList = None
        articleslist = None
        if "fromId" in kwargs and kwargs["fromId"]:
            articlesList =  Article.objects(id__gt=ObjectId(kwargs["fromId"]))
        else:
            articlesList = Article.objects()


        articlesList = articlesList.order_by("published_date")
            
        authorId = -1
        if "authorId" in kwargs and kwargs["authorId"]:
            articlesList = articlesList.filter(author=kwargs["authorId"])
            authorId = int(kwargs["authorId"])
        
        #need to look into the following logic (currently 6 lines), so as to make this API the one to use for main page
        if "status" not in kwargs or not kwargs["status"] or kwargs["status"] != "published":
            if not request.user.is_authenticated() or (not check_permissions(str(request.user.id), ["publish_others_articles", "edit_others_articles"]) and request.user.id != authorId):
                return {"ok" : "false",  "message" : "You do not have required permissions, either set status=published or authorId=your-author-id", "code" : "permission_denied", "status": status.HTTP_403_FORBIDDEN  }
        else:
            articlesList = articlesList.filter(status=kwargs["status"])

#            if not util.check_permissions(request.user, ["publish_others_articles", "edit_others_articles"]):
#                articlesList = articlesList.exclude("storytext","storyplaintext","excerpt","tags")
#                articlesList.filter(status="published")


            #return Response({"ok" : "False", "Message" : "Get is not supported for this API" })
        if "no_content" in kwargs and kwargs["no_content"] == "true":
            articlesList = articlesList.exclude("storytext","storyplaintext","excerpt","tags")
            
        if "limit" in kwargs and is_number(kwargs["limit"]):
            print 'kwargs["limit"]: '
            print kwargs["limit"]
            articlesList = articlesList.limit(int(kwargs["limit"]))
                
    
        return articlesList.select_related()

    except Exception as e:
        print "Exception in ArticlesPost: " + str(e)
        print " exception stacktrace: " + str(traceback.extract_tb(sys.exc_info()[2]))
        return {"ok":"false", "message": str(e), "status": status.HTTP_500_INTERNAL_SERVER_ERROR }

def delistify_all_parameters(parameters, **kwargs):
    returned_parameters = {}
    
    dont_delistify = None

    if "dont_delistify" in kwargs and kwargs["dont_delistify"] is not None:
        dont_delistify = kwargs["dont_delistify"]
    else:
        dont_delistify = []

    for parameter in parameters:
        if parameter in dont_delistify or not hasattr(parameters[parameter], '__iter__'):
            returned_parameters[parameter] = parameters[parameter]
        else:
            values = parameters[parameter]
            if values is not None and len(values) > 0:
                returned_parameters[parameter] = values[0]
            else:
                returned_parameters[parameter] = None

    return returned_parameters
                    
def update_author_roles(user, changed_role_details, return_changes, **kwargs):
    check_user_permissions(user, ["create_roles"])
    changed_roles = []
    returned_dict = {"ok" : "true"}
    for role_detail in changed_role_details:
        role_name_from_detail = None
        try:
            role_name_from_detail = role_detail["role_name"]
            role = Role_And_Permissions.objects.get(role_name=role_name_from_detail)
            permissions = role_detail["permissions"]
            if isinstance(permissions, basestring):
                role.permissions = role_detail["permissions"].split(",")
            else:
                role.permissions = role_detail["permissions"]
            role.save()
            changed_roles.append(role)
        except DoesNotExist as e:
            set_if_missing_failed_updates(returned_dict)
            missing_role_names = returned_dict["failed_updates"]["missing_role_names"]
            missing_role_names.append(role_name_from_detail)

    roles_updated.send_robust(sender=update_author_roles, roles=changed_roles)


    if return_changes is True:
        returned_dict["updated_roles"] = changed_roles
        return returned_dict
    else:
        return returned_dict
        



#http://stackoverflow.com/questions/38987/how-can-i-merge-two-python-dictionaries-in-a-single-expression
def merge_two_dicts(x, y, **kwargs):
    '''Given two dicts, merge them into a new dict as a shallow copy.'''
    z = x
    if "shallow_copy" in kwargs and kwargs["shallow_copy"] == True:
        z = x.copy()
    z.update(y)
    return z

def serialised_list_for_roles(roles_dict, **kwargs):
    returned_serialised_list = {}
    returned_object = Extensible_class()
    if "created_roles" in roles_dict:
        returned_object.created_roles = roles_dict["created_roles"]
        #print 'roles_dict["created_roles"]: ' + str(roles_dict["created_roles"])
    else:
        returned_object.created_roles = []
    if "updated_roles" in roles_dict:
        returned_object.updated_roles = roles_dict["updated_roles"]
    else:
        returned_object.updated_roles = []
    if "deleted_roles" in roles_dict:
        returned_object.deleted_roles = roles_dict["deleted_roles"]
    else:
        returned_object.deleted_roles = []

    returned_object.ok = roles_dict["ok"]
    return returned_object


import sys
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
from .models import STATUS_VALUE_DICT
from .models import Metadata
from .models import Author_Activity
from .models import Author_Settings
from .models import Category
from .models import Tag
from .models import ArticleForTagCategory
from .db import db
from rest_framework import status
from allauth.account.signals import user_logged_in, user_signed_up
from django.dispatch import receiver
from django.contrib.auth.models import User
import django.dispatch
from lxml import etree, html
from PIL import Image, ImageOps, ImageChops

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

crop_image_dimensions_dict = {"header_image" : (0,0,1280, 400), "thumbnail_image" : (0,0,180, 180)}
fit_image_dimensions_dict = {"header_image" : (1280, 400), "thumbnail_image" : (180, 180)}

image_format_dict = {"JPEG" : "jpg", "PNG" : "png", "GIF" : "gif"}
category_delimiter_for_deser = "%,#@$"
category_name_friendly_name_seperator = "%.#@$"

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

        profile_updated.send(sender=change_profile, id=author.id, fields=updated_fields, author=author)
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
    published_article_finalised.send(sender=finalise_published_article, article=article)


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
        article_published.send(sender=create_article,article=article)

    log_user_activity.send(sender=create_article, id=articleid, userid_to=user.id, userid_from=None)

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
                article_unpublished.send(sender=update_article,article=article)
            elif article.status == "published" and article_state["original_article"].status != "published":
                article_published.send(sender=update_article,article=article)
        
    
    log_user_activity.send(sender=update_article, id=articleid, userid_to=user.id, userid_from=None)


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

@receiver(article_published, dispatch_uid="106")
def handle_article_published(article, **kwargs):
    update_category_num_users_for_article(article, 1)
    update_tag_num_users_for_article(article, 1)

@receiver(article_unpublished, dispatch_uid="107")
def handle_article_unpublished(article, **kwargs):
    update_category_num_users_for_article(article, -1)
    update_tag_num_users_for_article(article, -1)

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

#http://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


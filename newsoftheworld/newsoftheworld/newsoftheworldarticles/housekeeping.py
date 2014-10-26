import os
from PIL import Image, ImageOps
from newsoftheworldarticles.models import Article, Tag, Category
from newsoftheworldarticles.util import get_articleForTagCategory_from_article

FRONT_PAGE_IMAGE_LOCATION = '/newsoftheworld/newsoftheworldmedia/ojfrontpageimages'

def update_header_image_size():
    for i in os.listdir(FRONT_PAGE_IMAGE_LOCATION):
        if i.startswith('header_'):
            print i
            image = Image.open(os.path.join(FRONT_PAGE_IMAGE_LOCATION,i))
            image = ImageOps.fit(image, (1280,400))
            image.save(os.path.join(FRONT_PAGE_IMAGE_LOCATION,i))

def update_tag_articles(**kwargs):
    articles = Article.objects(status="published")
    for article in articles:
        tags = article.tags
        if tags is not None:
            for tag in tags:
                tag_documents = Tag.objects(name=tag)
                if len(tag_documents) > 0:
                    tag_document = tag_documents[0]
                    if "update_userids" in kwargs and kwargs["update_userids"] == True:
                        tag_document.update(add_to_set__user_ids = article.id)
                    if "update_users" in kwargs and kwargs["update_users"] == True:
                        tag_document.update(add_to_set__users = get_articleForTagCategory_from_article(article))

def update_tag_articles_num_users():
    tags = Tag.objects.all()
    for tag in tags:
        if tag.user_ids is not None:
            tag.update(set__num_users=len(tag.user_ids))

def update_category_articles(**kwargs):
    articles = Article.objects(status="published")
    for article in articles:
        categories = article.categories
        if categories is not None:
            for category in categories:
                category_documents = Category.objects(name=category)
                if len(category_documents) > 0:
                    category_document = category_documents[0]
                    if "update_userids" in kwargs and kwargs["update_userids"] == True:
                        category_document.update(add_to_set__user_ids = article.id)
                    if "update_users" in kwargs and kwargs["update_users"] == True:
                        category_document.update(add_to_set__users = get_articleForTagCategory_from_article(article))

import os
import datetime
from PIL import Image, ImageOps
from lxml import html, etree
from newsoftheworldarticles.models import Article, Tag, Category
from newsoftheworldarticles.util import get_articleForTagCategory_from_article, populate_or_create_sitemap_url_element

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

def update_story_displayed_text_for_article(article):
    root = html.fromstring(article.storytext)
    img_elements = root.findall('.//img')
    for img_element in img_elements:
        img_element.attrib.pop("primaryimage", None)
        if img_element.attrib.get("alt") is None:
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


def update_story_displayed_text():
    articles = Article.objects(status="published")
    for article in articles:
        if not article.storydisplayedtext:
            update_story_displayed_text_for_article(article)
            article.save()

#def populate_or_create_sitemap_url_element(url_element, loc,lastmod,changefreq,priority,**kwargs):
#    if url_element is None:
#        url_element = etree.Element('url')
#
#    url_element = etree.Element('url')
#    loc_element = etree.SubElement(url_element, 'loc')
#    loc_element.text = loc
#    lastmod_element = etree.SubElement(url_element, 'lastmod')
#    lastmod_element.text = lastmod
#    if changefreq is not None:
#        change_freq_element = etree.SubElement(url_element, 'changefreq')
#        change_freq_element.text = changefreq
#    if priority is not None:
#        priority_element = etree.SubElement(url_element, 'priority')
#        priority_element.text = priority
#
#    return url_element


def create_new_sitemap():
    NSMAP = {"image" : "http://www.google.com/schemas/sitemap-image/1.1",
             "news" : "http://www.google.com/schemas/sitemap-news/0.9"}


    IMAGENS = "http://www.google.com/schemas/sitemap-image/1.1"
    NEWSNS = "http://www.google.com/schemas/sitemap-news/0.9"

    datetimenow = datetime.datetime.now()
    if os.path.exists("/newsoftheworld/newsoftheworldusr/sitemap.xml"):
        os.rename("/newsoftheworld//newsoftheworldusr/sitemap.xml", "/newsoftheworld/newsoftheworldusr/sitemap.xml.bak." + str(datetimenow.year) + "." + str(datetimenow.month) + "." + str(datetimenow.day)  + "." + str(datetimenow.hour) + "." + str(datetimenow.minute) + "." + str(datetimenow.second))

    urlset_element = etree.Element('urlset', nsmap = NSMAP, xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    #urlset_element.attrib["xmlns:image"] = "http://www.google.com/schemas/sitemap-image/1.1"

    #urlset_element.attrib["xmlns:news"] = "http://www.google.com/schemas/sitemap-news/0.9"

    url_main_page_element = etree.Element('url')

    url_main_page_element = populate_or_create_sitemap_url_element(None, 'https://www.opinionjunction.com/', datetimenow.isoformat(), "daily", "1.0")

    urlset_element.insert(0, url_main_page_element)

    doc = etree.ElementTree(urlset_element)


    categories = Category.objects()

    for category in categories:
        category_element = populate_or_create_sitemap_url_element(None, 'https://www.opinionjunction.com/'+ category.name, datetimenow.isoformat(), "daily", "0.9")
        urlset_element.append(category_element)

    articles = Article.objects(status="published")

    for article in articles:
        article_element = populate_or_create_sitemap_url_element(None, 'https://www.opinionjunction.com/' + 'article/' + str(article.id) + "/" + article.slug, article.published_date.isoformat(), None, None)
        article_image_element = etree.SubElement(article_element, '{%s}image' % IMAGENS)
        article_image_loc_element = etree.SubElement(article_image_element, '{%s}loc' % IMAGENS)
        if article.primary_image and article.primary_image[0] == '/':
            article_image_loc_element.text = 'https://www.opinionjunction.com' + article.primary_image
        else:
            article_image_loc_element.text = article.primary_image
        article_news_element = etree.SubElement(article_element, '{%s}news' % NEWSNS)
        article_news_publication_element = etree.SubElement(article_news_element, '{%s}publication' % NEWSNS)
        article_news_publication_name_element = etree.SubElement(article_news_publication_element, '{%s}name' % NEWSNS)
        article_news_publication_name_element.text = "Opinion Junction"
        article_news_publication_language_element = etree.SubElement(article_news_publication_element, '{%s}language' % NEWSNS)
        article_news_publication_language_element.text = 'en'
        article_news_title_element = etree.SubElement(article_news_element, '{%s}title' % NEWSNS)
        article_news_title_element.text = article.title
        article_news_keywords_element = etree.SubElement(article_news_element, '{%s}keywords' % NEWSNS)
        article_news_publication_date_element = etree.SubElement(article_news_element, '{%s}publication_date' % NEWSNS)
        article_news_publication_date_element.text = article.published_date.isoformat()
        #article_image_element.append(article_image_loc_element)
        #article_element.append(article_image_element)
        urlset_element.append(article_element)

    doc.write("/newsoftheworld/newsoftheworldusr/sitemap.xml", xml_declaration=True, encoding="utf-8", pretty_print=True)

def set_category_friendly_name_string_for_article_for_tag_category(context,article):
    if hasattr(article, "friendly_categories"):
        return 
    
    categories = context['categories']

    article_categories = article.categories

    if not article_categories:
        article.friendly_Categories = ""
        return 

    article_categories_array = article_categories.split("%,#@$")

    categories_return = ""

    use_comma = False

    if 'categoriesMap' not in context:
        setCategoriesMap(categories, context)

    categoriesMap = context['categoriesMap']

    if len(article_categories_array) > 0:
        category = article_categories_array[0]
        if category and category in categoriesMap:
            use_comma = True
            categories_return = categoriesMap[category].friendly_name
            article_categories_array = article_categories_array[1:]

    for category in article_categories_array:
        if category and (category in categoriesMap):
            if use_comma is True:
                categories_return = categories_return + ", " + categoriesMap[category].friendly_name
            else:
                categories_return = categoriesMap[category].friendly_name
                use_comma = True

    article.friendly_categories = categories_return

def setCategoriesMap(categories, context):
    categoriesMap = {}
    for category in categories:
        categoriesMap[category.name] = category
    context['categoriesMap'] = categoriesMap

def set_category_friendly_name_string(context,article):
    if hasattr(article, "category_friendly_name"):
        return article.category_friendly_names
    
    categories = context['categories']

    if categories is None:
        article.category_friendly_names = article.categories
        return

    if 'categoriesMap' not in context:
        setCategoriesMap(categories, context)

    categoriesMap = context['categoriesMap']

    
    

    articleCategories = article.categories
    numArticleCategories = len(articleCategories)

    category_friendly_names = ""

    if numArticleCategories > 0:
        category_friendly_names = categoriesMap[articleCategories[0]].friendly_name

    articleCategoriesIndex1 = articleCategories[1:]

    for articleCategory in articleCategoriesIndex1:
        category_friendly_names = category_friendly_names + "," + categoriesMap[articleCategory].friendly_name

    article.category_friendly_names = category_friendly_names

def setFriendlyAuthorName(author):
    if hasattr(author, "friendly_name"):
        return author.friendly_name

    authorName = "";
    if author.first_name:
        authorName = author.first_name + " "
        
    if author.last_name:
        authorName = authorName + " " + author.last_name
                
    if authorName.strip():
        author.friendly_name = authorName
    else:
        author.friendly_name = author.author_name




def isUploadedImage(image):
    return image.startswith(":@#") is not True

def getProviderData(image):
    providerData = {};
    if image.startswith(":@#"):
        image = image[len(":@#"): len(image)]
        imageDataArray = image.split(":")
        providerData["providerName"] = imageDataArray[0]
        providerData["userIdHash"] = imageDataArray[1]
        if len(imageDataArray) >= 3:
            providerData["userId"] = imageDataArray[2]
            
    return providerData

def getImageForProvider(provider_name, image, size=200):

    if provider_name == "gravatar":
        return "http://www.gravatar.com/avatar/" + image + "?s=" + size


def setAuthorImage(author):
    if not author.image:
        author.friendly_image =  "https://upload.wikimedia.org/wikipedia/commons/a/aa/Blank_user.svg"
    else:
        if isUploadedImage(author.image):
            author.friendly_image = author.image
            return 
            
    
        imageData = getProviderData(image)
    
        author.friendly_image = getImageForProvider(imageData["providerName"], imageData["userIdHash"])

        
def setFriendlyThumbnailImage(article):
    if article.thumbnail_image:
        article.friendly_thumbnail_image = article.thumbnail_image
    else:
        article.friendly_thumbnail_image = "/static/no_preview.png"
    

def articleInList(article, articleList):
    for memberArticle in articleList:
        if article.id == memberArticle.id:
            return True

    return False

        
def addHeaderArticle(headerArticles, articleInfos):
    for articleInfo in articleInfos:
        if articleInfo.primary_image:
            if not articleInList(articleInfo, headerArticles):
                if not articleInfo.header_image:
                    articleInfo.header_image = articleInfo.primary_image
                headerArticles.append(articleInfo)
                return


    
#def set_about_us(team_object):
#    team_authors = Team_Author.objects()
#    if len(team_authors) > 0:
#        team_object.team_authors = list(team_authors)
#
#    team_metadata_array = Team_Metadata.objects()
#
#    if len(team_metadata_array) > 0:
#        team_metadata = team_metadata_array[0]
#        #print "team_metadata: " + team_metadata
#        team_object.team_metadata = team_metadata
#    else:
#        team_metadata = util.Extensible_class()
#        team_metadata.aboutus_message = ""
#        team_object.team_metadata =  team_metadata
#    
#    team_contactus = Team_ContactUs.objects()
#    if len(team_contactus) > 0:
#        team_object.team_contactus = list(team_contactus)


template_http_parameters_dict = {"protocol" : "https", "domain_name" : "opinionjunction.com", "twitter_handle" : "ojunction_com"}

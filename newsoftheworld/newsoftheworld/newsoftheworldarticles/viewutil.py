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
        category_friendly_names = category_friendly_names + "," + categoriesMap[articleCategory.friendly_name]

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
                    articleInfo.header_image = article.primary_image
                headerArticles.append(articleInfo)
                return


    

from django import template

register = template.Library()

@register.simple_tag(takes_context=True)
def get_category_friendly_name_string(context, article):
    if hasattr(article, "category_friendly_name"):
        return article.category_friendly_names
    
    categories = context['categories']

    if categories is None:
        return article.category

    categoriesMap = None
    if 'categoriesMap' not in context:
        categoriesMap = {}
        for category in categories:
            categoriesMap[category.name] = category
        context['categoriesMap'] = categoriesMap
    else:
        categoriesMap = context['categoriesMap']

    
    

    articleCategories = article.categories
    numArticleCategories = articleCategories.length

    category_friendly_names = ""

    if numArticleCategories > 0:
        category_friendly_names = categoriesMap[articleCategories[0]].friendly_name

    articleCategoriesIndex1 = articleCategories[1:]

    for articleCategory in articleCategoriesIndex1:
        category_friendly_names = category_friendly_names + "," + categoriesMap[articleCategory.friendly_name]

    article.category_friendly_names = category_friendly_names

    return category_friendly_names
        
@register.simple_tag
def getAuthorName(author):
    authorName = "";
    if author.first_name:
        authorName = author.first_name + " "
        
    if author.last_name:
        authorName = authorName + " " + author.last_name
                
    if authorName.strip():
        return authorName
        
    return author.author_name

def isUploadImage(image):
    return image.index(":@#") != 0

def getProviderData(image):
    providerData = {};
    if image.index(":@#") ==0:
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

@register.simple_tag
def getAuthorImage(author):
    if not author.image:
        return "/static/Blank_user.svg"

    if isUploadedImage(author.image):
        return author.image
        

    imageData = getProviderData(image)

    return getImageForProvider(imageData["providerName"], imageData["userIdHash"])

        

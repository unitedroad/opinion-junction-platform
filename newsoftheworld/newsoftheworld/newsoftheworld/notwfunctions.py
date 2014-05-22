import tweepy

import pickle

import re

from django.core.cache import cache
import hashlib

from collections import OrderedDict

import sys
#import cv
from optparse import OptionParser

import urllib

import urllib2

import lxml.etree

import settings

import cgi

MEM_TIMEOUT = 900

NUM_FEEDS_TO_GET_FOR_COUNTRY = 5

twitterApi = None

ATTRIBUTE_TYPE_TAGIMAGEURL = 'TAGIMAGEURL'

ATTRIBUTE_TYPE_TAGTHUMBNAILURL = 'TAGTHUMBNAILURL'

ATTRIBUTE_TYPE_BOTTOMARTICLELINK = 'BOTTOMARTICLELINK'

ATTRIBUTE_TYPE_SITEATTRIBUTE = 'SITEATTRIBUTE'

DEFAULT_DESKTOP_WIKI_THUMBNAIL_WIDTH = 200

DEFAULT_DESKTOP_WIKI_THUMBNAIL_WIDTH_HOMEPAGE = 128

WIKIMEDIA_IMAGE_URL_PREFIX = 'https://upload.wikimedia.org/wikipedia/commons/'

WIKIMEDIA_IMAGE_URL_PREFIX_LENGTH = 47

WIKIMEDIA_THUMBNAIL_URL_FRAGMENT = 'thumb/'

def twitterTest(**kwargs):
    global twitterApi
    if twitterApi is None:
        initTwitterAPI()
    if 'region' in kwargs:
        twitterApi.update_status('Hello World to ' + kwargs['region'] + ' from New Of The World')
    else:
        twitterApi.update_status('Hello World from New Of The World')

def getTweetsForRegion(region_name):
    global twitterApi
    if twitterApi is None:
        initTwitterAPI()
    tweets_for_region = twitterApi.list_timeline(owner_screen_name='newsoftheworldt',slug='trends-' + region_name.lower().replace('/','-').replace(' ', '-'))
    #print tweets_for_region
    #for tweet_row in tweets_for_region:
    #    print tweet_row.author.screen_name + ' : ' + tweet_row.text
    return tweets_for_region

def initTwitterAPI():
    global twitterApi
    auth1 = tweepy.auth.OAuthHandler('RQkLjKGtMBMmda5zpmiVw','vgjSefsz3jBEM8cbb1phsFSSvta8qZyGvSpIhBX08k')
    auth1.set_access_token('1077694608-rJxL6QnKgP5py1dVYRN5hcWgNqenmvJZsBhWvex', 'AqFxr9qdH5nwp7bwQAua9fMpD8nBFbVpB8prtclTSMU')
    twitterApi = tweepy.API(auth1)
        
def updateIpAddressCountryMappingFromCSV(**kwargs):
   csvFile = open("GeoIPCountryWhois.csv", "rb") 
   csvReader = csvFile.reader(csvFile)
   for row in csvReader:
      print 'hello'
   csvFile.close()

def countryDatabaseFromCSV(**kwargs):
   csvFile = open("iso3166.csv", "rb")
   csvReader = csvFile.read(csvFile)
   for row in csvReader:
      print 'hello'
   csvFile.close()

def get_cache_result(key):

   if key:
      hash = hashlib.md5(key.encode('utf-8')).hexdigest()

      return cache.get(hash)

def set_cache_result(key, value,*args):

   if key:
      hash = hashlib.md5(key.encode('utf-8')).hexdigest()

      if len(args) > 0:
          timeout = args[0]
      else:
          timeout = MEM_TIMEOUT

      cache.set(hash, value, timeout)
   
def parseTweetText(tweet):
    reForScreenNames = re.compile('@\S*',re.UNICODE)
    reobjectunicode = re.compile('#\S*',re.UNICODE)
    print "In parseTweetText"
    tweetText = tweet.text
    tweetTextByteArray = bytearray(tweetText,encoding='utf-8')
    hashTagMatchIter = reobjectunicode.finditer(tweetText)
    for hashTagMatch in reversed(list(hashTagMatchIter)):
        insertStringIntoByteArray(tweetTextByteArray,"</a>",hashTagMatch.end())
        insertStringIntoByteArray(tweetTextByteArray,"<a href=''>",hashTagMatch.start())

    screenNameMatchIter = reForScreenNames.finditer(tweetText)
    for screenNameMatch in reversed(list(screenNameMatchIter)):
        matchEnd = screenNameMatch.end()
        screenNameText = screenNameMatch.group()
        if screenNameText[-1] == u":":
            matchEnd = matchEnd - 1 #hack
            screenNameText = screenNameText[:-1]
        insertStringIntoByteArray(tweetTextByteArray,"</a>",matchEnd)
        insertStringIntoByteArray(tweetTextByteArray,"<a href='http://twitter.com/" + screenNameText + "'>",screenNameMatch.start())
    #print "tweetText is : " + tweetText 
    #tweetHashTags = tweet.entities['hashtags']
   # if len(tweetHashTags) > 0:
    #    print "tweetHashTags members are : " + ",".join(dir(tweetHashTags[0]))
    #    print "tweetHashTags members are : "
    #    for tweetHashTagIndex in tweetHashTags[0]['indices']:print str(tweetHashTagIndex) + ", "
    #tweetHashTagsRev = reversed(sorted(tweetHashTags, key=lambda a: a.start))
    #hashTagStartList = []
    #hashTagEndList = []

    #hashTagSplitTextList = []
    #for hashTagIndex, tweetHashTag in enumerate(tweetHashTags):
        #if hashTagIndex == len(tweetHashTags)
             
#        hashTagStart = tweetHashTag.start
#        hashTagEnd = tweetHashTagEnd
#        tweetTextByteArray.insert(hashTagStart,"<a href=''>")
#        tweetTextByteArray.insert(hashTagEnd,"</a>")
        #hashTagStartList.append(hashTagStart)
        #hashTagsEndList.append(hashTagEnd)
    
    formattedTweetText = tweetTextByteArray.decode('utf-8')   
    if formattedTweetText != tweetText:
        print formattedTweetText
    return formattedTweetText

def insertStringIntoByteArray(textByteArray, textString, index=0,encoding="utf-8"):
    textStringByteArray = bytearray(textString, encoding)
    for character in textStringByteArray:
        textByteArray.insert(index,character)
        index = index + 1

def parseTweetTextFromFile():
    tweetsFile = open("tweetsFile","r")
    try:
        while True:
            tweet = pickle.load(tweetsFile)
            parseTweetText(tweet)
    except:
        "Probably came to the end of the file"
        raise

"""
This program is demonstration for face and object detection using haar-like features.
The program finds faces in a camera image or video stream and displays a red box around them.

Original C implementation by:  ?
Python implementation by: Roman Stanchak, James Bowman
"""

min_size = (20, 20)
image_scale = 2
haar_scale = 1.2
min_neighbors = 2
haar_flags = 0

def detect_and_draw(img, cascade):
    # allocate temporary images
    gray = cv.CreateImage((img.width,img.height), 8, 1)
    small_img = cv.CreateImage((cv.Round(img.width / image_scale),
             cv.Round (img.height / image_scale)), 8, 1)

    # convert color input image to grayscale
    cv.CvtColor(img, gray, cv.CV_BGR2GRAY)

    # scale input image for faster processing
    cv.Resize(gray, small_img, cv.CV_INTER_LINEAR)

    cv.EqualizeHist(small_img, small_img)

    if(cascade):
        t = cv.GetTickCount()
        faces = cv.HaarDetectObjects(small_img, cascade, cv.CreateMemStorage(0),
                                     haar_scale, min_neighbors, haar_flags, min_size)
        t = cv.GetTickCount() - t
        print "detection time = %gms" % (t/(cv.GetTickFrequency()*1000.))
        if faces:
            for ((x, y, w, h), n) in faces:
                # the input to cv.HaarDetectObjects was resized, so scale the
                # bounding box of each face and convert it to two CvPoints
                pt1 = (int(x * image_scale), int(y * image_scale))
                pt2 = (int((x + w) * image_scale), int((y + h) * image_scale))
                cv.Rectangle(img, pt1, pt2, cv.RGB(255, 0, 0), 3, 8, 0)

    cv.ShowImage("result", img)

def getImageUrlFromWikiCommons(tag_name):
    headers = {'user-agent':'FreeYourSourceAgent/1.1 (http://www.freeyoursource.org;unitedronaldo@freeyoursource.org BasedOnurllib/2.7'}
    
    wikimedia_url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=20&gsroffset=20&prop=imageinfo&iiprop=url&format=xml&' + urllib.urlencode({'gsrsearch':"'" + tag_name.replace(' ', '+') + "'"}) 
    print wikimedia_url
    req = urllib2.Request(wikimedia_url, None, headers)
    
    html_string = urllib2.urlopen(req).read()

    html = lxml.etree.fromstring(html_string)

    image_anchors = html.findall('.//imageinfo')

    #print html_string

    print len(image_anchors)

    if len(image_anchors) > 0:
        for image_anchor in image_anchors:
            image_li_array = image_anchor.findall('.//ii')
            print len(image_li_array)
            if len(image_li_array) > 0:
                image_li = image_li_array[0]
                image_url = image_li.attrib['url']
                print image_url
                if re.search('jpg$|png$|jpeg$',image_url,flags=re.IGNORECASE) is not None:
                    print 'image url ' + image_url + ' matched criteria'
                    return image_url
        
    return None

def getImageFromWikimedia(image_url,**kwargs):
    get_thumbnail = False
    get_full_image = True
    thumbnail_width = DEFAULT_DESKTOP_WIKI_THUMBNAIL_WIDTH
    thumbnail_url = None
    wikimedia_image_dict = dict()
    isOriginalImage = False
    if 'get_thumbnail' in kwargs:
        get_thumbnail = kwargs['get_thumbnail']
    if 'get_full_image' in kwargs:
        get_full_image = kwargs['get_full_image']

    if 'thumbnail_size' in kwargs:
        thumbnail_size = kwargs['thumbnail_size']

    print 'getImageFromWikimedia: kwargs: ' + str(kwargs)

    if get_thumbnail is True:
        if image_url.startswith(WIKIMEDIA_IMAGE_URL_PREFIX):
            thumbnail_filename_in_url  = str(thumbnail_width) + 'px-' + image_url.split('/')[-1] 
            thumbnail_url = image_url[0:WIKIMEDIA_IMAGE_URL_PREFIX_LENGTH] + WIKIMEDIA_THUMBNAIL_URL_FRAGMENT + image_url[WIKIMEDIA_IMAGE_URL_PREFIX_LENGTH:] + '/' + thumbnail_filename_in_url
            kwargs['file_name'] = thumbnail_filename_in_url
            kwargs['original_image_url'] = image_url
            print 'thumbnail_url: ' + thumbnail_url
            try:
                thumbnail_file_name = actuallyDownloadImageFromWikimedia(thumbnail_url, **kwargs)
            except:
                isOriginalImage = True #file maybe too small to create thumbnails
                thumbnail_file_name = actuallyDownloadImageFromWikimedia(image_url, **kwargs)

            wikimedia_image_dict['thumbnail_file_name'] = thumbnail_file_name
    if get_full_image is True:
        #get_full_image = get_full_image
        image_file_name = actuallyDownloadImageFromWikimedia(image_url, **kwargs)
        wikimedia_image_dict['image_file_name'] = image_file_name

    wikimedia_image_dict['is_original_image'] = isOriginalImage
        
    return wikimedia_image_dict

    
def actuallyDownloadImageFromWikimedia(image_url,**kwargs):

    print 'actuallyDownloadImageFromWikimedia: kwargs: ' + str(kwargs)



    #print 'getImageFromWikimedia: image_url is: ' + image_url
    headers = {'user-agent':'FreeYourSourceAgent/1.1 (http://www.freeyoursource.org;unitedronaldo@freeyoursource.org BasedOnurllib/2.7'}

    req = urllib2.Request(image_url, None, headers)

    filename = None 
    if 'file_name' in kwargs:
        file_name = kwargs['file_name']
        print file_name

    #urllib.urlretrieve(image_url, settings.MEDIA_ROOT)


    response = urllib2.urlopen(req)
   
    _, params = cgi.parse_header(response.headers.get('Content-Disposition',''))

    print "params are: " + str(params)

    if filename is None:
        if len(params) > 0:
            try:
                filename = params['filename']
            except:
                filename = image_url.split('/')[-1]
        else:
            filename = image_url.split('/')[-1]
    
    filename = cleanFileName(filename)
    image_data = response.read()

    file_location = settings.MEDIA_ROOT + '/' + filename
    filestream = open(file_location, "wb")

    filestream.write(image_data)

    filestream.close()

    print file_location

    return filename

def cleanFileName(filename):
    #try:
    #    filename = unicode(filename, "utf-8")
    #except:
    #    pass
    #filename = urllib.unquote(filename).decode('utf-8')
    filename = urllib.unquote(filename) #urldecode
    return re.sub('[<>:"/\\\\|?*]','+',filename) #remove filesystem-illegal characters

class State_object_for_template:
    #current_state
    pass

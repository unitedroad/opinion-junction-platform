

import sys
import csv 

#sys.path.append("/home/ranubhai/newsoftheworld")

#from newsoftheworld import newsoftheworldgeneral

import tweepy

import json

import time

import traceback

from sets import Set

from django.db.models import Q

from newsoftheworldgeneral.models import country_codes
from newsoftheworldgeneral.models import ip_country
from newsoftheworldgeneral.models import region_codes
from newsoftheworldgeneral.models import country_region
from newsoftheworldgeneral.models import Tweet_region
from newsoftheworldgeneral.models import Newsfeed_country
from newsoftheworldgeneral.models import Common_attributes

twitterApi = None
twitterJsonData = None
ATTRIBUTE_TYPE_BOTTOMARTICLELINK = 'BOTTOMARTICLELINK'

def updateIpAddressCountryMappingFromCSV(**kwargs):
   csvFile = open("GeoIPCountryWhois.csv", "rb")
   csvReader = csv.reader(csvFile)
   for row in csvReader:
      ip_start = row[0]
      ip_end = row[1]
      country_id = row[4]
      ip_row = ip_country(ip_start=ip_start,ip_end=ip_end,country_id=country_codes.objects.get(country_id=country_id))
      ip_row.save()
   csvFile.close()

def updateCountryDatabaseFromCSV(**kwargs):
   csvFile = open("iso3166.csv", "rb")
   csvReader = csv.reader(csvFile)
   for row in csvReader:
      #country_id=row[0].replace("'","")
      country_id=row[0]
      country_name=row[1]
      country_friendly_name = ''
      if len(row) >= 3:
          country_friendly_name = row[2]
      country_row = country_codes(country_id=country_id,country_name=country_name,country_friendly_name=country_friendly_name)
      country_row.save()
   csvFile.close()

def updateExistingCountryDatabaseFromCSV(**kwargs):
   csvFile = open("iso3166.csv", "rb")
   csvReader = csv.reader(csvFile)
   for row in csvReader:
      country_id=row[0]
      try:
          country_row = country_codes.objects.get(country_id=country_id)
          country_row.country_name = row[1]
          if len(row) >= 3:
              country_row.country_friendly_name = row[2]
          country_row.save()
      except:
          print "Exception"  
          traceback.print_exc()
   csvFile.close()

def updateContinentDatabaseFromCSV(**kwargs):
    csvFile = open("ContinentsById.csv","rb")
    csvReader = csv.reader(csvFile)
    for row in csvReader:
       region_row = region_codes(region_id=row[0],region_name=row[1])
       region_row.save()
    csvFile.close()

def updateCountryToContinentMapping():
    csvFile = open("countriesbyregions.csv","rb")
    csvReader = csv.reader(csvFile)
    for row in csvReader:
       print "country_name: {0} region_name: {1}" . format(row[0] ,row[1])
       country_region_row = country_region(country_id=country_codes.objects.get(country_name=row[0]),region_id=region_codes.objects.get(region_name=row[1]))
       country_region_row.save()
    csvFile.close()

def populateTweetRegionTable():
    csvFile = open("tweethandles.csv","rb")
    csvReader = csv.reader(csvFile)
    global twitterApi
    i = 0
    for row in csvReader:
       if i == 0:
          i = i + 1
          continue
       if len(row) >= 4:
          screen_name = row[0]
          friendly_name = row[1]
          region_id = row[3]
          country_id = row[2]
          #print region_id
          #print region_codes.objects.get(region_id=region_id).region_name
          #region_name = region_codes.objects.get(region_id=region_id).region_name
          Tweet_region(tweet_handle=screen_name,region_id=region_id,country_id=country_id,tweet_friendly_name=friendly_name).save()
          #tweet_region_row = Tweet_region(tweet_handle=screen_name,region_name='',tweet_friendly_name=friendly_name)    

def createTwitterListForRegions():
    csvFile = open("tweethandles.csv","rb")
    csvReader = csv.reader(csvFile)
    region_set = Set([])
    global twitterApi
    for row in csvReader:
       if len(row) >= 4:
          region_id = row[3]
          region_set.add(region_id)
    
    if twitterApi is None:
       initTwitterAPI()       

    for region in region_set:
       try:
          twitterApi.create_list('trends/' + region_codes.objects.get(region_id=region).region_name)
       except:
          print 'Exception while creating list for region: %s'% region
          #raise

def populateTwitterlistRegions():
    csvFile = open("tweethandles.csv","rb")
    csvReader = csv.reader(csvFile)
    region_codes_qs = region_codes.objects.all()
    global twitterApi
    if twitterApi is None:
          initTwitterAPI()       
    i = 0
    for row in csvReader:
       print i
       
       if i == 0:
          i = i + 1
          continue
       if len(row) >= 4:
          region_id = row[3]
          user_id = row[0]
          region_name = region_codes_qs.get(region_id=region_id).region_name
          try:
             #user_id_numeric = str(getTwitterIdForName(user_id))
             #print 'Adding user id {1} name {0} to list {2}'. format(user_id, user_id_numeric, region_name)
             print 'Adding name {0} to list {1}'. format(user_id, region_name)
             twitterApi.add_list_member(slug='trends-' + region_name.lower().replace('/','-').replace(' ', '-'), screen_name=user_id,owner_screen_name='newsoftheworldt')
             time.sleep(0.5)
          except:
             print 'Exception while adding user {0} to list {1}'.format(user_id, region_name) 
             raise

def initTwitterAPI():
    global twitterApi
    auth1 = tweepy.auth.OAuthHandler('RQkLjKGtMBMmda5zpmiVw','vgjSefsz3jBEM8cbb1phsFSSvta8qZyGvSpIhBX08k')
    auth1.set_access_token('1077694608-rJxL6QnKgP5py1dVYRN5hcWgNqenmvJZsBhWvex', 'AqFxr9qdH5nwp7bwQAua9fMpD8nBFbVpB8prtclTSMU')
    twitterApi = tweepy.API(auth1)

def getTwitterAccountsMap():
    global twitterJsonData
    twitterFile = open("headsofstates.txt","rb")
    jsonString = twitterFile.read()
    twitterFile.close()
    twitterJsonData = json.loads(jsonString)
    for x in range(2, 5):
       twitterFile = open("headsofstates" + str(x) + ".txt","rb")
       jsonString = twitterFile.read()
       twitterJsonDataX = json.loads(jsonString)
       twitterJsonData.extend(twitterJsonDataX)
       twitterFile.close()
    return twitterJsonData

def getTwitterIdForName(accountName):
    global twitterJsonData
    if twitterJsonData is None:
       getTwitterAccountsMap()
    #print jsonData
    for accountDetailsJO in twitterJsonData:
       if accountName == accountDetailsJO[u'screen_name']:
          return accountDetailsJO[u'id']

def insertFeedRowToTable(**kwargs):

    feedEntriesFileName = 'feedentries-final.txt'
    if 'feedfilename' in kwargs:
       feedEntriesFileName = kwargs['feedfilename']

    feedEntriesFile = open(feedEntriesFileName,'r')
    oldCountryName = ''
    currentCountryName = ''

    country_codes_qs = country_codes.objects.all()
    Newsfeed_country_qs = Newsfeed_country.objects.all()

    invalidCountry = True

    for feedEntryLine in feedEntriesFile:
        isFeedIgnoreable = False
        isCommentsFeed = False
        if len(feedEntryLine) == 0:
            continue
        feedEntryLineLower = feedEntryLine.lower()
        if feedEntryLine.startswith('######'):
            oldCountryName = currentCountryName
            currentCountryName = feedEntryLine.strip().strip('#').strip(u'#')
            print currentCountryName
            country_codes_array = country_codes_qs.filter(Q(country_name__iexact=currentCountryName.replace(u'-',u' '))|Q(country_friendly_name__iexact=currentCountryName.replace(u'-',u' ')))
#            country_codes_array = country_codes_qs.filter(Q(country_name__iequals=currentCountryName))
#            continue
            if len(country_codes_array) < 1:
                invalidCountry = True
                print 'Invalid Country'
                continue
            else:
                invalidCountry = False
            country_codes_row = country_codes_array[0]
            continue
        if invalidCountry is True:
            continue
        currentCountryId = country_codes_row.country_id
        if 'feed ignoreable' in feedEntryLineLower:
            isFeedIgnoreable = True
        if 'comments feed' in feedEntryLineLower:
            isCommentsFeed = True
        feedEntryLineArray = feedEntryLine.split('#')
        feedUrlEntry = feedEntryLineArray[0].strip()
        if isFeedIgnoreable is False and isCommentsFeed is False:
            if invalidCountry is False:
                Newsfeed_country_row = Newsfeed_country(country_id=country_codes_row.country_id,feed_url=feedUrlEntry,feed_comments=' # '.join(feedEntryLineArray[1:]))
                Newsfeed_country_row.save()


def insertFeedRowToTableForWorld():
    feedEntriesFile = open('feedentries-world-final.txt','r')
    for feedEntryLine in feedEntriesFile:
        if feedEntryLine.startswith('######'):
            pass
        feedEntryLineArray = feedEntryLine.split('#')
        feedUrlEntry = feedEntryLineArray[0].strip()
        Newsfeed_country_row = Newsfeed_country(country_id='WO',feed_url=feedUrlEntry,feed_comments=' # '.join(feedEntryLineArray[1:]))
        Newsfeed_country_row.save()

def insertFeedTopicRowsForWorld():
    feedEntriesFile = open('feedentries-world-topics-final.txt', 'r')
    topic = ''
    for feedEntryLine in feedEntriesFile:
       if feedEntryLine.startswith('##########'):
          topic = feedEntryLine.strip().strip(u'#').strip('#')
          continue
       elif feedEntryLine.startswith('######'):
          pass
       feedEntryLineArray = feedEntryLine.split('#')
       feedUrlEntry = feedEntryLineArray[0].strip()
       feed_comments = ''
       if topic == 'science':
          feed_comments = '#technology'
       elif topic == 'technology':
          feed_comments = '#science'

       Newsfeed_country_row = Newsfeed_country(country_id='WO',feed_url=feedUrlEntry,feed_comments=feed_comments,feed_topic=topic)
       Newsfeed_country_row.save()


def insertBottonArticleLinksAndMarkCurrentOld(article_link,article_summary):
   common_attributes_bottomarticlelinks_qs = Common_attributes.objects.filter(attribute_type=ATTRIBUTE_TYPE_BOTTOMARTICLELINK)
   common_attributes_bottomarticlelinks_qs.update(attribute_comments='#previous')
   common_attributes_bottomarticlelinks_row = Common_attributes(attribute_author='Default',attribute_name=article_link,attribute_content=article_summary,attribute_type=ATTRIBUTE_TYPE_BOTTOMARTICLELINK,attribute_comments="#current")
   common_attributes_bottomarticlelinks_row.save()

import hashlib

from django.core.cache import cache

def get_cache_result(key):

   if key:
      hash = hashlib.md5(key).hexdigest()

      return cache.get(hash)

def set_cache_result(key, value,*args):

   if key:
      hash = hashlib.md5(key).hexdigest()

      if len(args) > 0:
          timeout = args[0]
      else:
          timeout = MEM_TIMEOUT

      cache.set(hash, value, timeout)

def getTweetsForWorld():
    tweets_for_world = get_cache_result('tweets_world')
    if tweets_for_world is None:
        return []
#        tweets_for_world = notwfunctions.getTweetsForRegion('world')
#        notwfunctions.set_cache_result('tweets_world',tweets_for_world)
    all_tweets_for_today = []
    all_tweets_for_today = tweets_for_world[0:4]
    shuffle(all_tweets_for_today)
    return all_tweets_for_today

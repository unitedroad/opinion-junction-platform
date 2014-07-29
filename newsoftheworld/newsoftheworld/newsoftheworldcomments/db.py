import pymongo
from newsoftheworldarticles.util import profile_updated

from pymongo import MongoClient

from django.dispatch import receiver

client = MongoClient()

client = MongoClient('mongodb://localhost:27017/')


db = client.notwcomments

@receiver(profile_updated, dispatch_uid="104")
def mark_author_change(id, fields, **kwargs):
    print "hello profile_updated"
    changed_profile = db.changed_profiles.find_and_modify(query={"id":id,"status":None},update={"$addToSet": {"fields" : fields}}, upsert=True)
#    if len(changed_profile_entries) > 0:
#        changed_profile = changed_profile_entries
#    changed_profile.id = id
#    changed_profile.fields = fields
    #db.changed_profiles.

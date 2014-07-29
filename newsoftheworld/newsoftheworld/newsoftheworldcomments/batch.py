from db import db

#from .models import Author
from newsoftheworldarticles.models import Author
from .models import Comment
from . import util

def update_comments_authors():
    changed_profiles = db.changed_profiles.find(query={"status":None})
    for changed_profile in changed_profiles:
        changed_profile = db.changed_profiles.find_and_modify(query={"id":changed_profile["id"],"status":None},update={"status":"processing"})
        if changed_profile is None:
            break #Seems someone else is already working on these profiles in parallel
        update_changed_profile(changed_profile)
        changed_profile = db.changed_profiles.find_and_modify(query={"id":changed_profile["id"],"status":"processing"},update={"status":"done"})
        if changed_profile is None:
            print "something is not right in update comments autnor db tracking logic"

#    while (len(changed_profiles) > 0):
#        num_changed_profiles_remaining = len(changed_profiles)
#        changed_profile_50 = None
#        changed_profiles_to_process = None
#        if num_changed_profiles_remaining == 0:
#            changed_profile_50 = changed_profiles[-1]
#            changed_profiles_to_process = changed_profiles
#            changed_profiles = []
#        else:
#            changed_profile_50 = changed_profiles[49]
#            changed_profiles_to_process = changed_profiles[0:50]
#            changed_profiles = [50:]
#        changed_profile_50 = db.changed_profiles.find_and_modify(query={"id":changed_profile_50["id"],"status":None},update={"status":"marked"}})
#        if changed_profile_50 is None:
#            break #Seems someone else is already working on these profiles in parallel
#        for changed_profile in changed_profiles_to_process:
#            changed_profile = db.changed_profiles.find_and_modify(query={"id":changed_profile["id"],"status":None},update={"status":"processing"}})
#            if changed_profile is None:
#                break #Seems someone else is already working on these profiles in parallel
#
            

def update_changed_profile(changed_profile): #mixing pymongo and MongoEngine not good
    authors = Author.objects(id=changed_profile["id"])
    if len(authors) <=0:
        print "profile " : + str(changed_profile["id"]) + " not found"
        return

    author = authors[0]
    
    comments = Comment.objects(author__id=changed_profile["id"])

    author_name = util.get_friendly_name(author)
#    if "first_name" in changed_profile.fields or "last_name" in changed_profile.fields:
#        author_name = util.get_friendly_name
        
    comments.update(set__author__author_name = author_name,set__author__image=author.image)
    

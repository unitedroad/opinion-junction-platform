from django.core.management.base import BaseCommand, CommandError
from newsoftheworldcomments.db import db

#from .models import Author
from newsoftheworldarticles.models import Author
from newsoftheworldcomments.models import Comment
from newsoftheworldcomments import util

class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        changed_profiles = db.changed_profiles.find(query={"status":None})
        for changed_profile in changed_profiles:
            if changed_profile["status"] is not None:
                continue 
            print changed_profile
            changed_profile = db.changed_profiles.find_and_modify(query={"id":changed_profile["id"],"status":None},update={"$set" : {"status":"processing"}})
            if changed_profile is None:
                break #Seems someone else is already working on these profiles in parallel
            self.update_changed_profile(changed_profile)
            changed_profile = db.changed_profiles.find_and_modify(query={"id":changed_profile["id"],"status":"processing"},update={"$set" : {"status":"done"}})
            if changed_profile is None:
                print "something is not right in update comments autnor db tracking logic"

                
    def update_changed_profile(self, changed_profile): #mixing pymongo and MongoEngine not good
        authors = Author.objects(id=changed_profile["id"])
        if len(authors) <=0:
            print "profile: "  + str(changed_profile["id"]) + " not found"
            return

        author = authors[0]
    
        comments = Comment.objects(author__id=changed_profile["id"])

        author_name = util.get_friendly_name(author)
#       if "first_name" in changed_profile.fields or "last_name" in changed_profile.fields:
#           author_name = util.get_friendly_name
        
        comments.update(set__author__author_name = author_name,set__author__image=author.image) #best thing is to change only those fields that have changed in the article author
    

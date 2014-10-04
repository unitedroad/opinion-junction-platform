import pymongo
from newsoftheworldarticles.util import profile_updated
from newsoftheworldarticles.models import Author_Settings, Author_Activity
from .models import Comment
from .util import log_user_activity_comment, log_user_activity_vote

from pymongo import MongoClient

from django.dispatch import receiver

client = MongoClient()

client = MongoClient('mongodb://localhost:27017/')


db = client.notwcomments

@receiver(profile_updated, dispatch_uid="102")
def mark_author_change(id, fields, author, **kwargs):
    print "hello profile_updated"
    changed_profile = db.changed_profiles.find_and_modify(query={"id":id,"status":None},update={"$addToSet": {"fields" : fields}}, upsert=True)
#    if len(changed_profile_entries) > 0:
#        changed_profile = changed_profile_entries
#    changed_profile.id = id
#    changed_profile.fields = fields
    #db.changed_profiles.


@receiver(log_user_activity_comment, dispatch_uid="104")
def update_comment_creation_log(comment, **kwargs):
    author_id = comment.author.id
    author_settings_array_me = Author_Settings.objects(author_id=author_id)
    if len(author_settings_array_me) == 0 or author_settings_array_me[0].privacy_hide_own_comments is False:
        activity_comment_pm = {}
        activity_comment_pm["text_excerpt"] = comment.text
        activity_comment_pm["comment_slug"] = comment.slug
        activity_comment_pm["article_id"] = comment.discussion_id
        activity_comment_pm["comment_slug"] = comment.slug


        print db.author__activity.update({"_id": author_id}, 
                                         {"$push": 
                                          {"latest_comments": 
                                           { "$each" : [activity_comment_pm],
                                             "$slice" : -5
                                           }
                                         }
                                        }, 
                                         upsert=True)

@receiver(log_user_activity_vote, dispatch_uid="105")
def update_comment_vote_log(comment, vote, userid_from, **kwargs):
    userid_from = str(userid_from)
    userid_to = comment.author.id
    user_to_settings_array_me = Author_Settings.objects(author_id=userid_to)
    if len(user_to_settings_array_me) == 0 or user_to_settings_array_me[0].privacy_hide_others_votes is False:
        user_from_settings_array_me = Author_Settings.objects(author_id=userid_from)
        if len(user_from_settings_array_me) == 0 or user_from_settings_array_me[0].privacy_hide_own_votes is False:
            if vote == "unvote":
                Author_Activity.objects(author_id=userid_from).update_one(pull__latest_votes__slug=comment.slug)
                Author_Activity.objects(author_id=userid_to).update_one(pull__latest_votes_from__slug=comment.slug)
#                print db.author__activity.update({"author_id": userid_from}, 
#                                                 {"$pull": 
#                                                  {"latest_votes": 
#                                                   { "$each" : [activity_own_vote_pm],
#                                                     "$slice" : -5
#                                                   }
#                                                  }
#                                                 }, 
#                                                 upsert=True)
#
#                print db.author__activity.update({"author_id": userid_to}, 
#                                                 {"$push": 
#                                                  {"latest_votes_from": 
#                                                   { "$each" : [activity_own_vote_pm],
#                                                     "$slice" : -5
#                                                   }
#                                                  }
#                                                 }, 
#                                                 upsert=True)
            else:
                activity_own_vote_pm = {}
                activity_own_vote_pm["author_name"] = comment.author.author_name
                activity_own_vote_pm["author_id_to"] = comment.author.id
                
                activity_own_vote_pm["post_type"] = "comment"
                activity_own_vote_pm["text_excerpt"] = comment.text
                activity_own_vote_pm["slug"] = comment.slug
                activity_own_vote_pm["vote"] = vote
                activity_own_vote_pm["article_id"] = comment.discussion_id
            
                print db.author__activity.update({"_id": userid_from}, 
                                                 {"$push": 
                                                  {"latest_votes": 
                                                   { "$each" : [activity_own_vote_pm],
                                                     "$slice" : -5
                                                  }
                                                }
                                               }, 
                                                 upsert=True)

                print db.author__activity.update({"_id": userid_to}, 
                                                 {"$push": 
                                                  {"latest_votes_from": 
                                                   { "$each" : [activity_own_vote_pm],
                                                     "$slice" : -5
                                                   }
                                                  }
                                                 }, 
                                                 upsert=True)

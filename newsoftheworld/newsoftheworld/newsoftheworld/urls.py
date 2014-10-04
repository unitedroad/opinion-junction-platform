from django.conf.urls import patterns, include, url

from rest_framework.urlpatterns import format_suffix_patterns
from newsoftheworld import settings
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from newsoftheworldcomments.api import PostList
from newsoftheworldcomments.api import CommentsAll
from newsoftheworldcomments.api import CommentsList
from newsoftheworldcomments.api import PostCommentsList
from newsoftheworldcomments.api import CommentsUpVote
from newsoftheworldcomments.api import CommentsDownVote
from newsoftheworldcomments.api import CommentsUnVote

from newsoftheworldarticles.api import ArticlesList
from newsoftheworldarticles.api import ArticlesPost
from newsoftheworldarticles.api import ArticlesByCategory
from newsoftheworldarticles.api import ArticlesByEachCategory
from newsoftheworldarticles.api import AuthorsList
from newsoftheworldarticles.api import AuthorsListAll
from newsoftheworldarticles.api import AuthorsSettings
from newsoftheworldarticles.api import LoggedInUserDetails
from newsoftheworldarticles.api import UpdateProfileSelf
from newsoftheworldarticles.api import TagsList
from newsoftheworldarticles.api import CategoriesList

from newsoftheworldarticles.views import Article_Traditional_View
from newsoftheworldarticles.views import Category_Traditional_View
from newsoftheworldarticles.views import Home_Traditional_View

urlpatterns = patterns('',

    url(r'^/?$', 
        Home_Traditional_View.as_view()),
    url(r'^article/(?P<articleid>.+)/(?P<articletext>.+)/?$', Article_Traditional_View.as_view()),
    url(r'^(?P<category_name>politics|technology|identities|hoist|art)/?$', 
        Category_Traditional_View.as_view()),


    url(r'^(?P<server_deliver_root>ojserverdeliver)/?$', 
        Home_Traditional_View.as_view()),
    url(r'^(?P<server_deliver_root>ojserverdeliver)/article/(?P<articleid>.+)/(?P<articletext>.+)/?$', Article_Traditional_View.as_view()),
    url(r'^(?P<server_deliver_root>ojserverdeliver)/(?P<category_name>politics|technology|identities|hoist|art)/?$', 
        Category_Traditional_View.as_view()),

    # Examples:
    # url(r'^$', 'newsoftheworldhomeapp.views.home', name='home'),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.MEDIA_ROOT}),
    url(r'^$', 'newsoftheworldhomeapp.views.home', name='home'),
    url(r'^support/contactus$', 'newsoftheworldgeneral.views.contactus', name="contactusnobackslash"),
    url(r'^support/contactus/$', 'newsoftheworldgeneral.views.contactus', name="contactusbackslash"),
    url(r'^featured/(?P<storyname>.+)$', 'newsoftheworldgeneral.views.featuredstoryname', name="featuredstorynamenobackslash"),
    url(r'^featured/(?P<storyname>.+)/$', 'newsoftheworldgeneral.views.featuredstoryname', name="featuredstorynamebackslash"),
    url(r'^featured$', 'newsoftheworldgeneral.views.featured', name="featurednobackslash"),
    url(r'^featured/$', 'newsoftheworldgeneral.views.featured', name="featuredbackslash"),
    url(r'^support/feedback/$', 'newsoftheworldgeneral.views.feedback', name="feedbackbackslash"),
    url(r'^support/feedback$', 'newsoftheworldgeneral.views.feedback', name="feedbacknobackslash"),
    url(r'^region/(?P<region>[a-z]+)$', 'newsoftheworldgeneral.views.region', name="regionnobackslash"),
    url(r'^region/(?P<region>[a-z]+)/$', 'newsoftheworldgeneral.views.region', name="regionbackslash"),
    url(r'^region$', 'newsoftheworldgeneral.views.regioncurrent', name="regioncurrentnobackslash"),
    url(r'^region/$', 'newsoftheworldgeneral.views.regioncurrent', name="regioncurrentbackslash"),
    url(r'^world$', 'newsoftheworldgeneral.views.world', name="worldnobackslash"),
    url(r'^world/$', 'newsoftheworldgeneral.views.world', name="worldbackslash"),
    url(r'^topic/(?P<topic>[a-z]+)$', 'newsoftheworldgeneral.views.topic', name="topicnobackslash"),
    url(r'^topic/(?P<topic>[a-z]+)/$', 'newsoftheworldgeneral.views.topic', name="topicbackslash"),
    url(r'^aboutus/$', 'newsoftheworldgeneral.views.aboutus', name="aboutusbackslash"),
    url(r'^aboutus$', 'newsoftheworldgeneral.views.aboutus', name="aboutusnobackslash"),
    url(r'^chronology/(?P<year>\d{4})/$', 'newsoftheworldchronology.views.archivebyperiod', {'month':-1}),
    url(r'^chronology/(?P<year>\d{4})$', 'newsoftheworldchronology.views.archivebyperiod', {'month':-1}),
    url(r'^chronology/(?P<year>\d{4})/(?P<month>\d{2})/$', 'newsoftheworldchronology.views.archivebyperiod', name="archivesummaryfordaybackslash"),
    url(r'^chronology/(?P<year>\d{4})/(?P<month>\d{2})$', 'newsoftheworldchronology.views.archivebyperiod', name="archivesummaryfordaynobackslash"),
    url(r'^chronology/$', 'newsoftheworldchronology.views.archivebyperiod', {'month':-1,'year':-1}, name="archivesummaryallbackslash"),
    url(r'^chronology$', 'newsoftheworldchronology.views.archivebyperiod', {'month':-1, 'year':-1}, name="archivesummaryallnobackslash"),

    # test urls for comments
    
    #disqus
    url('^disqus$', 'newsoftheworldexperiments.views.disqus' ),
    url('^disqus/$', 'newsoftheworldexperiments.views.disqus' ),
    url('^disqus/.+$', 'newsoftheworldexperiments.views.disqus' ),
    url('^disqus/.+/$', 'newsoftheworldexperiments.views.disqus' ),

    #livefyre
    url('^livefyre$', 'newsoftheworldexperiments.views.livefyre' ),
    url('^livefyre/$', 'newsoftheworldexperiments.views.livefyre' ),
    url('^livefyre/.+$', 'newsoftheworldexperiments.views.livefyre' ),
    url('^livefyre/.+/$', 'newsoftheworldexperiments.views.livefyre' ),

    url('^commentstest', 'newsoftheworldcomments.views.commentstest' ),
    url('^comments', 'newsoftheworldcomments.views.comments' ),
    # url(r'^newsoftheworld/', include('newsoftheworld.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin$', include(admin.site.urls)),
    url(r'^tinymce/', include('tinymce.urls')),

    #url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),

    #url(r'^accounts/login/$', 'django.contrib.auth.views.login', name="django.contrib.auth.views.login" ),
    url(r'^accounts/facebook_social_callback$', 'newsoftheworldcomments.views.facebook_social_callback'),
    url(r'^accounts/login_successful_mw$', 'newsoftheworldcomments.views.login_successful_mw', name='login_successful_mw'),
    url(r'^accounts/login$', 'newsoftheworldarticles.views.login', name='login_article'),
    url(r'^accounts/login/$', 'newsoftheworldarticles.views.login', name='login_article'),
    url(r'^accounts/facebook/login/token/?$', 'newsoftheworldarticles.socialaccount.providers.facebook.views.login_by_token', 
        name='facebook_login_by_token'),
    url(r'^accounts/signup/?$', 'newsoftheworldarticles.views.signup', name='account_signup_rest'),
    url(r'^accounts/login_callback$', 'newsoftheworldcomments.views.login_callback', name='login_callback'),
    url(r'^accounts/', include('allauth.urls')),

    url('^test$', 'newsoftheworldexperiments.views.test'),
    url('^test/$', 'newsoftheworldexperiments.views.test'),
)


rest_patterns=patterns('', url(r'^api/1.0/posts/(?P<postid>[0-9a-f]+)/comments/?$', PostCommentsList.as_view(), name='post-comment-list'),     
    url(r'^api/1.0/posts/comments/?$', CommentsList.as_view(), name='post-comment-test-list'),     
    url(r'^api/1.0/comments/?$', CommentsAll.as_view(), name='comment-all'),     
    url(r'^api/1.0/comments/(?P<commentid>.+)/upvote/?$', CommentsUpVote.as_view(), name='comments-upvote'),     
    url(r'^api/1.0/comments/(?P<commentid>.+)/downvote/?$', CommentsDownVote.as_view(), name='comments-downvote'),     
    url(r'^api/1.0/comments/(?P<commentid>.+)/unvote/?$', CommentsUnVote.as_view(), name='comments-unvote'),     
    url(r'^api/1.0/comments/(?P<commentid>.+)/?$', CommentsList.as_view(), name='comments-list'),     

    url(r'^api/1.0/articles/by-category/?$', ArticlesByCategory.as_view(), name='articles-by-category'),     
    url(r'^api/1.0/categories/(?P<category>.+)/articles/?$', ArticlesByEachCategory.as_view(), name='articles-by-each-category'),     
    url(r'^api/1.0/articles/(?P<articleid>.+)$', ArticlesList.as_view(), name='articles-list'),     
    url(r'^api/1.0/articles/?$', ArticlesPost.as_view(), name='articles-post'),     

    url(r'^api/1.0/authors/loggedin/self/profile?$', UpdateProfileSelf.as_view(), name='logged-in-user-profile'),
    url(r'^api/1.0/authors/loggedin/self/?$', LoggedInUserDetails.as_view(), name='logged-in-user-details'),
    url(r'^api/1.0/authors/(?P<authorid>.+)/settings/?$', AuthorsSettings.as_view(), name='authors-settings'),     
    url(r'^api/1.0/authors/(?P<authorid>.+)/activity/?$', AuthorsActivity.as_view(), name='authors-activity'),     
    url(r'^api/1.0/authors/(?P<authorid>.+)/?$', AuthorsList.as_view(), name='authors-list'),     
    url(r'^api/1.0/authors/?$', AuthorsListAll.as_view(), name='authors-list-all'),     
    url(r'^api/1.0/tags/?$', TagsList.as_view(), name='tags-list'),     
    url(r'^api/1.0/categories/?$', CategoriesList.as_view(), name='categories-list'),

    url(r'comments/login/?$', 'newsoftheworldcomments.views.commentslogin' ),
)

rest_patterns=format_suffix_patterns(rest_patterns, allowed=['json','html'])

urlpatterns += rest_patterns

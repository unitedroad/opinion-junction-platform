from django.conf.urls import patterns, include, url

from rest_framework.urlpatterns import format_suffix_patterns
from newsoftheworld import settings
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from newsoftheworldcomments.api import PostList
from newsoftheworldcomments.api import CommentsList
from newsoftheworldcomments.api import PostCommentsList

from newsoftheworldarticles.api import ArticlesList
from newsoftheworldarticles.api import ArticlesPost
from newsoftheworldarticles.api import AuthorsList
from newsoftheworldarticles.api import AuthorsListAll
from newsoftheworldarticles.api import LoggedInUserDetails
from newsoftheworldarticles.api import TagsList
from newsoftheworldarticles.api import CategoriesList

urlpatterns = patterns('',
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
    url(r'^accounts/login_callback$', 'newsoftheworldcomments.views.login_callback', name='login_callback'),
    url(r'^accounts/', include('allauth.urls')),

    url('^test$', 'newsoftheworldexperiments.views.test'),
    url('^test/$', 'newsoftheworldexperiments.views.test'),
)


rest_patterns=patterns('', url(r'^api/1.0/posts/(?P<postid>[0-9]+)/comments/?$', PostCommentsList.as_view(), name='post-comment-list'),     
    url(r'^api/1.0/posts/comments/?$', CommentsList.as_view(), name='post-comment-test-list'),     
    url(r'^api/1.0/comments/(?P<commentid>.+)/?$', CommentsList.as_view(), name='comments-list'),     

    url(r'^api/1.0/articles/(?P<articleid>.+)$', ArticlesList.as_view(), name='articles-list'),     
    url(r'^api/1.0/articles/?$', ArticlesPost.as_view(), name='articles-post'),     

    url(r'^api/1.0/authors/loggedin/self/?$', LoggedInUserDetails.as_view(), name='logged-in-user-details'),
    url(r'^api/1.0/authors/(?P<authorid>.+)/?$', AuthorsList.as_view(), name='authors-list'),     
    url(r'^api/1.0/authors/?$', AuthorsListAll.as_view(), name='authors-list-all'),     
    url(r'^api/1.0/tags/?$', TagsList.as_view(), name='tags-list'),     
    url(r'^api/1.0/categories/?$', CategoriesList.as_view(), name='categories-list'),

    url(r'comments/login/?$', 'newsoftheworldcomments.views.commentslogin' ),
)

rest_patterns=format_suffix_patterns(rest_patterns, allowed=['json','html'])

urlpatterns += rest_patterns

from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns

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
from newsoftheworldarticles.api import AuthorsActivity
from newsoftheworldarticles.api import LoggedInUserDetails
from newsoftheworldarticles.api import UpdateProfileSelf
from newsoftheworldarticles.api import ArticlesByTag
from newsoftheworldarticles.api import TagsList
from newsoftheworldarticles.api import CategoriesList
from newsoftheworldarticles.api import AboutUs

from newsoftheworldarticles.views import Article_Traditional_View
from newsoftheworldarticles.views import Category_Traditional_View
from newsoftheworldarticles.views import Home_Traditional_View
from newsoftheworldarticles.views import ArticlesByTag_Traditional_View
from newsoftheworldarticles.views import AuthorsActivity_Traditional_View
from newsoftheworldarticles.views import Aboutus_Traditional_View
from newsoftheworldarticles.views import Error_400_Traditional_View
from newsoftheworldarticles.views import Error_403_Traditional_View
from newsoftheworldarticles.views import Error_404_Traditional_View
from newsoftheworldarticles.views import Error_500_Traditional_View

from newsoftheworldarticles.views import view_for_404

from django.http import HttpResponse

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'newsoftheworld.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    (r'^robots\.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: /", mimetype="text/plain")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/facebook_social_callback$', 'newsoftheworldcomments.views.facebook_social_callback'),
    url(r'^accounts/login_successful_mw$', 'newsoftheworldcomments.views.login_successful_mw', name='login_successful_mw'),
    url(r'^accounts/login$', 'newsoftheworldarticles.views.login', name='login_article'),
    url(r'^accounts/login/$', 'newsoftheworldarticles.views.login', name='login_article'),
    url(r'^accounts/facebook/login/token/?$', 'newsoftheworldarticles.socialaccount.providers.facebook.views.login_by_token', 
        name='facebook_login_by_token'),
    url(r'^accounts/signup/?$', 'newsoftheworldarticles.views.signup', name='account_signup_rest'),
    url(r'^accounts/login_callback$', 'newsoftheworldcomments.views.login_callback', name='login_callback'),
    url(r'^accounts/', include('allauth.urls')),

    url(r'^/?$', 
        Home_Traditional_View.as_view()),
    url(r'^article/(?P<articleid>.+)/(?P<articletext>.+)/?$', Article_Traditional_View.as_view()),
    url(r'^(?P<category_name>politics|technology|identities|hoist|art)/?$', 
        Category_Traditional_View.as_view()),

    url(r'^tag/(?P<tag_name>.+)/?$', ArticlesByTag_Traditional_View.as_view()),     

    url(r'^profile/(?P<authorid>.+)/?$', AuthorsActivity_Traditional_View.as_view()),     


    url(r'^(?P<server_deliver_root>ojserverdeliver)/?$', 
        Home_Traditional_View.as_view()),
    url(r'^(?P<server_deliver_root>ojserverdeliver)/article/(?P<articleid>.+)/(?P<articletext>.+)/?$', Article_Traditional_View.as_view()),
    url(r'^(?P<server_deliver_root>ojserverdeliver)/(?P<category_name>politics|technology|identities|hoist|art)/?$', 
        Category_Traditional_View.as_view()),

    url(r'^(?P<server_deliver_root>ojserverdeliver)/tag/(?P<tag_name>.+)/?$', ArticlesByTag_Traditional_View.as_view()),     

    url(r'^(?P<server_deliver_root>ojserverdeliver)/profile/(?P<authorid>.+)/?$', AuthorsActivity_Traditional_View.as_view()),     

    url(r'^accounts/test$', 'newsoftheworldarticles.views.test', name='account_test'),

    url(r'^(?P<server_deliver_root>ojserverdeliver)/aboutus?$', Aboutus_Traditional_View.as_view()),     
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
    url(r'^api/1.0/tags/(?P<tag_name>.+)/?$', ArticlesByTag.as_view(), name='articles-by-tag'),     
    url(r'^api/1.0/tags/?$', TagsList.as_view(), name='tags-list'),     
    url(r'^api/1.0/categories/?$', CategoriesList.as_view(), name='categories-list'),
    url(r'^api/1.0/aboutus/?$', AboutUs.as_view(), name='about-us'),

    url(r'comments/login/?$', 'newsoftheworldcomments.views.commentslogin' ),
)

rest_patterns=format_suffix_patterns(rest_patterns, allowed=['json','html'])

urlpatterns += rest_patterns

handler400 = Error_400_Traditional_View.as_view()

handler403 = Error_403_Traditional_View.as_view()


handler404 = Error_404_Traditional_View.as_view()

handler500 = Error_500_Traditional_View.as_view()

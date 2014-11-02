import json

import traceback
import sys

from django.shortcuts import render

from django.core.urlresolvers import reverse

from django.http import HttpResponse

from django.views.generic import TemplateView

from django.template import RequestContext, Template

from django.utils.cache import patch_response_headers 

from allauth.account import app_settings

from allauth.account.views import RedirectAuthenticatedUserMixin, AjaxCapableProcessFormViewMixin, FormView, SignupView

from allauth.account.forms import SignupForm

from allauth.socialaccount import providers

from .forms import RestLoginForm

from .utils import complete_signup

from allauth.account.utils import (get_next_redirect_url, get_login_redirect_url,                               
                                   passthrough_next_redirect_url)

from django.contrib.sites.models import Site

from . import util

from . import viewutil

from newsoftheworldcomments import util as commentsutil

from .models import Article

from .models import Metadata

from .models import Tag

class RedirectAuthenticatedUserAjaxCompatibleMixin(RedirectAuthenticatedUserMixin):
    def dispatch(self, request, *args, **kwargs):
        self.request = request
        if request.is_ajax() and request.user.is_authenticated():
            response = {}
            response['ok'] = 'true'
            response['code'] = 'already_logged_in'
            response['message'] = 'Already Logged In'
            c = RequestContext(request,{'response':json.dumps(response)})
            t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
            return HttpResponse(t.render(c), content_type="application/json")
            #return HttpResponse(json.dumps(response), content_type="application/json")
        else:
            return super(RedirectAuthenticatedUserMixin, self).dispatch(request, *args, **kwargs)


    

# Create your views here.
class LoginView(RedirectAuthenticatedUserAjaxCompatibleMixin,
                AjaxCapableProcessFormViewMixin,
                FormView):
    form_class = RestLoginForm
    template_name = "account/login.html"
    success_url = None
    redirect_field_name = "next"
    def form_valid(self, form):
        success_url = self.get_success_url()
        return form.login(self.request, redirect_url=success_url)

    def get_success_url(self):
        # Explicitly passed ?next= URL takes precedence
        ret = (get_next_redirect_url(self.request,
                                     self.redirect_field_name)
               or self.success_url)
        return ret

    def get_context_data(self, **kwargs):
        ret = super(LoginView, self).get_context_data(**kwargs)
        signup_url = passthrough_next_redirect_url(self.request,
                                                   reverse("account_signup"),
                                                   self.redirect_field_name)
        redirect_field_value = self.request.REQUEST \
            .get(self.redirect_field_name)
        ret.update({"signup_url": signup_url,
                    "site": Site.objects.get_current(),
                    "redirect_field_name": self.redirect_field_name,
                    "redirect_field_value": redirect_field_value})
        return ret

login = LoginView.as_view()


class RestSignupView(SignupView):
    template_name = "account/signup.html"
    form_class = SignupForm
    redirect_field_name = "next"
    success_url = None
    def form_valid(self, form):
        user = form.save(self.request)
        #print str(complete_signup)
        try:
            return complete_signup(self.request, user,
                                   app_settings.EMAIL_VERIFICATION,
                                   self.get_success_url())
        except Exception as e:
            print "Exception in RestSignupView: " + str(traceback.extract_tb(sys.exc_info()[2]))
            raise
    
signup = RestSignupView.as_view()

class Main_Traditional_View(TemplateView):
    
    template_name = "index.html"


    def get_context_data(self, **kwargs):
        
        tag_list = Metadata.objects.filter(entry_type="category")

        context = super(Main_Traditional_View, self).get_context_data(**kwargs)
        context['categories'] = tag_list

        viewutil.setCategoriesMap(tag_list, context)

        if 'server_deliver_root' in kwargs:
            context['server_deliver_root'] = "/" + kwargs["server_deliver_root"]
        else:
            context['server_deliver_root'] = ''
        return context



class Article_Traditional_View(Main_Traditional_View):
    
    template_name = "article/article.html"


    def get_context_data(self, **kwargs):
        article = None
        articleid = kwargs["articleid"]
        if util.check_valid_object_id(id=articleid) is not True:
            article = util.get_bad_article("incorrect_articleid")
        else:
            articles = Article.objects(id=articleid)
            if len(articles) > 0:
                articles.select_related()
                article = articles[0]
            else:
                article = util.get_bad_article("no_article_found")

        if len(article.tags) > 0:
            article.firstTag = article.tags[0]
        else:
            article.firstTag = None
        
        article.tagsAfterFirst = article.tags[1:]

        context = super(Article_Traditional_View, self).get_context_data(**kwargs)
        context['article'] = article
        return context


class Home_Traditional_View(Main_Traditional_View):

    template_name = "home/index.html"


    def get_context_data(self, **kwargs):

        context = super(Home_Traditional_View, self).get_context_data(**kwargs)
        categories = context['categories']
        articleInfos = []
        util_kwargs = {}
        util_kwargs["limit"] = 5
        
        articles = []

        for category in categories:
            articlesByCategory = util.get_articles_by_category(category.name, util_kwargs)
            viewutil.addHeaderArticle(articles, articlesByCategory)            
            articleInfos.extend(articlesByCategory)

        for article in articleInfos:
            viewutil.set_category_friendly_name_string(context, article)
            viewutil.setFriendlyAuthorName(article.author)
            viewutil.setAuthorImage(article.author)
            viewutil.setFriendlyThumbnailImage(article)


        latest_comments_qs = commentsutil.get_comments_all(util_kwargs)
        latest_comments = []
        latest_comments.extend(latest_comments_qs)

        for comment in latest_comments:
            viewutil.setAuthorImage(comment.author)
            #print comment.author.name
            #viewutil.setFriendlyAuthorName(comment.author)

        #if len(articleInfos) > 0:
        #    print articleInfos[0].author.friendly_name

        context['homepage'] = True
        context['articleInfos'] = articleInfos
        context['articles'] = articles
        context['latest_comments'] = latest_comments
#        context['article'] = article

        return context
    

class AuthorsActivity_Traditional_View(Main_Traditional_View):

    template_name = "publicprofile/index.html"

    def get_context_data(self, **kwargs):
        context = super(AuthorsActivity_Traditional_View, self).get_context_data(**kwargs)
        authorid = kwargs["authorid"]
        author_activity = util.get_or_initialise_author_activity(authorid)
        context["show_activity"] = True
        context["show_error"] = False
        context["message"] = ""
        if author_activity is not None:
            context["authorActivity"] = author_activity
        else:
            context["authorActivity"] = None
            context["show_activity"] = False
            context["show_error"] = True
            context["message"] = "Author does not exist"

        return context

class ArticlesByTag_Traditional_View(Main_Traditional_View):

    template_name = "articlesbytag/index.html"


    def get_context_data(self, **kwargs):
        tag_name = kwargs["tag_name"]

        tags = Tag.objects(name=tag_name)

        context = super(ArticlesByTag_Traditional_View, self).get_context_data(**kwargs)

        if tags is not None and len(tags) > 0:
            tag = tags[0]
            users = tag.users
            if users is not None and len(users) > 0:
                for user in users:
                    viewutil.set_category_friendly_name_string_for_article_for_tag_category(context,user)

        context['tagName'] = tag_name

        context['articleInfos'] = users

        return context

class Category_Traditional_View(Main_Traditional_View):

    template_name = "home/index.html"


    def get_context_data(self, **kwargs):

        category_name = kwargs["category_name"]
        util_kwargs = {}
        util_kwargs["limit"] = 30

        articleInfosQs = util.get_articles_by_category(category_name, util_kwargs)
        articleInfos = [] # We need to do this otherwise the updated article objects are not in the list
        context = super(Category_Traditional_View, self).get_context_data(**kwargs)

        for article in articleInfosQs:
            viewutil.set_category_friendly_name_string(context, article)
            viewutil.setFriendlyAuthorName(article.author)
            #print article.author.friendly_name
            #print article.author.id
            viewutil.setAuthorImage(article.author)
            viewutil.setFriendlyThumbnailImage(article)
            articleInfos.append(article)

        articles = []
        viewutil.addHeaderArticle(articles, articleInfos)
#        if len(articleInfos) > 0:
#            article = articleInfos[0]
#            if not article.header_image:
#                article.header_image = article.primary_image
#            articles.append(articleInfos[0])

        commentsutil_kwargs = {}
        commentsutil_kwargs["limit"] = 5
        commentsutil_kwargs["metadata_string"] = "category='" + category_name + "'"
        latest_comments_qs = commentsutil.get_comments_all(commentsutil_kwargs)
        latest_comments = []
        latest_comments.extend(latest_comments_qs)

        for comment in latest_comments:
            viewutil.setAuthorImage(comment.author)


        #if len(articleInfos) > 0:
        #    print dir(articleInfos[0].author)
        #    print articleInfos[0].author.friendly_name

        context['homepage'] = False
        if category_name in context['categoriesMap']:
            context['category'] = context['categoriesMap'][category_name]
        else:
            category_none = Metadata()
            Metadata.entry_type = "category"
            context['category'] = category_none
        context['articleInfos'] = articleInfos
        context['articles'] = articles
        context['latest_comments'] = latest_comments
#        context['article'] = article
        return context

class Test_View(Main_Traditional_View):

    template_name = "account/email/password_reset_key_message.html"

test = Test_View.as_view()

import json

from django.shortcuts import render

from django.core.urlresolvers import reverse

from django.http import HttpResponse

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
        return complete_signup(self.request, user,
                               app_settings.EMAIL_VERIFICATION,
                               self.get_success_url())
    
signup = RestSignupView.as_view()


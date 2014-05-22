from django.shortcuts import render

from django.core.urlresolvers import reverse

from allauth.account.views import RedirectAuthenticatedUserMixin, AjaxCapableProcessFormViewMixin ,FormView

from .forms import ArticlesLoginForm

from allauth.account.utils import (get_next_redirect_url, complete_signup,
                    get_login_redirect_url, perform_login,
                    passthrough_next_redirect_url)

from django.contrib.sites.models import Site

# Create your views here.
class LoginView(RedirectAuthenticatedUserMixin,
                AjaxCapableProcessFormViewMixin,
                FormView):
    form_class = ArticlesLoginForm
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

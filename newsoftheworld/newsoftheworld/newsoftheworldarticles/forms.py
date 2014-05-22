import json
from django import forms
from django.contrib import messages
from allauth.account.forms import LoginForm, PasswordField
from allauth.account.adapter import get_adapter
from allauth.account import signals
from allauth.account.app_settings import AuthenticationMethod, EmailVerificationMethod
from allauth.account import app_settings
from allauth.account.utils import get_login_redirect_url
from allauth.utils import set_form_field_order
from django.http import HttpResponse, HttpResponseRedirect
#from django.utils.translation import pgettext, ugettext_lazy as _, ugettext
from django.utils.translation import ugettext_lazy as _
class ArticlesLoginForm(LoginForm):

    password = PasswordField(label=_("Password"))
    remember = forms.BooleanField(label=_("Remember Me"),
                                  required=False)

    user = None

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        if app_settings.AUTHENTICATION_METHOD == AuthenticationMethod.EMAIL:
            login_widget = forms.TextInput(attrs={'placeholder':
                                                  _('E-mail address'),
                                                  'autofocus': 'autofocus'})
            login_field = forms.EmailField(label=_("E-mail"),
                                           widget=login_widget)
        elif app_settings.AUTHENTICATION_METHOD \
                == AuthenticationMethod.USERNAME:
            login_widget = forms.TextInput(attrs={'placeholder':
                                                  _('Username'),
                                                  'autofocus': 'autofocus'})
            login_field = forms.CharField(label=_("Username"),
                                          widget=login_widget,
                                          max_length=30)
        else:
            assert app_settings.AUTHENTICATION_METHOD \
                == AuthenticationMethod.USERNAME_EMAIL
            login_widget = forms.TextInput(attrs={'placeholder':
                                                  _('Username or e-mail'),
                                                  'autofocus': 'autofocus'})
            login_field = forms.CharField(label=pgettext("field label",
                                                         "Login"),
                                          widget=login_widget)
        self.fields["login"] = login_field
        set_form_field_order(self,  ["login", "password", "remember"])


    def login(self, request, redirect_url=None):
        ret = perform_login(request, self.user,
                            email_verification=app_settings.EMAIL_VERIFICATION,
                            redirect_url=redirect_url)
        if self.cleaned_data["remember"]:
            request.session.set_expiry(60 * 60 * 24 * 7 * 3)
        else:
            request.session.set_expiry(0)
        return ret


def perform_login(request, user, email_verification,
                  redirect_url=None, signal_kwargs={},
                  signup=False):
    """
    Keyword arguments:

    signup -- Indicates whether or not sending the
    email is essential (during signup), or if it can be skipped (e.g. in
    case email verification is optional and we are only logging in).
    """
    from allauth.account.models import EmailAddress
    
    response = {}

    has_verified_email = EmailAddress.objects.filter(user=user,
                                                     verified=True).exists()
    if email_verification == EmailVerificationMethod.NONE:
        pass
    elif email_verification == EmailVerificationMethod.OPTIONAL:
        # In case of OPTIONAL verification: send on signup.
        if not has_verified_email and signup:
            send_email_confirmation(request, user, signup=signup)
    elif email_verification == EmailVerificationMethod.MANDATORY:
        if not has_verified_email:
            send_email_confirmation(request, user, signup=signup)
            if request.is_ajax():
                response['code'] = 'email_confirmation_sent'
                response['message'] = 'Email Confirmation Sent'
                return HttpResponse(json.dumps(response), content_type="application/json")
            else:
                return HttpResponseRedirect(
                reverse('account_email_verification_sent'))
    # Local users are stopped due to form validation checking
    # is_active, yet, adapter methods could toy with is_active in a
    # `user_signed_up` signal. Furthermore, social users should be
    # stopped anyway.
    if not user.is_active:
        if request.is_ajax():
            response['code'] = 'account_inactive'
            response['message'] = 'Account Inactive'
            return HttpResponse(json.dumps(response), content_type="application/json")
        else:
            return HttpResponseRedirect(reverse('account_inactive'))
    get_adapter().login(request, user)
    signals.user_logged_in.send(sender=user.__class__,
                                request=request,
                                user=user,
                                **signal_kwargs)
    get_adapter().add_message(request,
                              messages.SUCCESS,
                              'account/messages/logged_in.txt',
                              {'user': user})

    if request.is_ajax():
        
        response['code'] = 'login_successful'
        response['message'] = 'Logged in Successfully'

        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponseRedirect(get_login_redirect_url(request, redirect_url))


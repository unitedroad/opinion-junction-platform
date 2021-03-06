from django.contrib import messages
from django.shortcuts import render_to_response, render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, Template
from django.core.urlresolvers import reverse
from allauth.socialaccount.adapter import get_adapter
from allauth.socialaccount import signals
from allauth.socialaccount.models import SocialLogin
from newsoftheworldarticles.utils import perform_login, complete_signup
from allauth.account.utils import user_username
from django.shortcuts import render_to_response, render
from allauth.account.adapter import get_adapter as get_account_adapter
from django.forms import ValidationError
from allauth.account import app_settings as account_settings
from allauth.socialaccount import app_settings
from allauth.exceptions import ImmediateHttpResponse

def complete_social_signup(request, sociallogin):
    return complete_signup(request,
                           sociallogin.account.user,
                           app_settings.EMAIL_VERIFICATION,
                           sociallogin.get_redirect_url(request),
                           signal_kwargs={'sociallogin': sociallogin})

def _process_signup(request, sociallogin):
    auto_signup = get_adapter().is_auto_signup_allowed(request,
                                                       sociallogin)
    if not auto_signup:
        if request.is_ajax():
            response = {}
            response['ok'] = 'false'
            response['code'] = 'auto_signup_not_possible'
            response['message'] = 'Auto Signup not possible with this account. Try signing up with another social account or contact Admin.'
            c = RequestContext(request,{'response':json.dumps(response)})
            t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
            return HttpResponse(t.render(c), content_type="application/json")

        request.session['socialaccount_sociallogin'] = sociallogin.serialize()
        url = reverse('socialaccount_signup')
        ret = HttpResponseRedirect(url) #we need to make this view support ajax if we don't have auto signup enabled
    else:
        # Ok, auto signup it is, at least the e-mail address is ok.                                                                                                                                                       
        # We still need to check the username though...                                                                                                                                                                   
        if account_settings.USER_MODEL_USERNAME_FIELD:
            username = user_username(sociallogin.account.user)
            try:
                get_account_adapter().clean_username(username)
            except ValidationError:
                # This username is no good ...                                                                                                                                                                            
                user_username(sociallogin.account.user, '')
        # FIXME: This part contains a lot of duplication of logic                                                                                                                                                         
        # ("closed" rendering, create user, send email, in active                                                                                                                                                         
        # etc..)                                                                                                                                                                                                          
        try:
            if not get_adapter().is_open_for_signup(request,
                                                    sociallogin):
                if request.is_ajax():
                    reponse = {}
                    response['ok'] = 'false'
                    response['code'] = 'signup_closed'
                    response['message'] = 'Closed for signup'
                    c = RequestContext(request,{'response':json.dumps(response)})
                    t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
                    return HttpResponse(t.render(c), content_type="application/json")

                return render(request,
                              "account/signup_closed.html") #support if request.is_ajax()
        except ImmediateHttpResponse as e:
            if request.is_ajax():
                reponse = {}
                response['html'] = e.response.content.decode('utf8')
                c = RequestContext(request,{'response':json.dumps(response)})
                t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
                return HttpResponse(t.render(c),
                                    status=e.response.status_code,
                                    content_type='application/json')
            return e.response #support if request.is_ajax()
        get_adapter().save_user(request, sociallogin, form=None)
        ret = complete_social_signup(request, sociallogin)
    return ret

def _login_social_account(request, sociallogin):
    return perform_login(request, sociallogin.account.user,
                         email_verification=app_settings.EMAIL_VERIFICATION,
                         redirect_url=sociallogin.get_redirect_url(request),
                         signal_kwargs={"sociallogin": sociallogin})

def _complete_social_login(request, sociallogin):
    if request.user.is_authenticated():
        logout(request)
    if sociallogin.is_existing:
        # Login existing user                                                                                                                                                                                             
        ret = _login_social_account(request, sociallogin)
    else:
        # New social user                                                                                                                                                                                                 
        ret = _process_signup(request, sociallogin)
    return ret


def _add_social_account(request, sociallogin):
    reponse = None
    t = None
    if request.is_ajax():
        response = {}
        t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
    if request.user.is_anonymous():
        if request.is_ajax():
            response['ok'] = 'false'
            response['code'] = 'unknown_error'
            response['message'] = 'Unknown Error'
            c = RequestContext(request,{'response':json.dumps(response)})
            return HttpResponse(t.render(c), content_type="application/json", status=400)

        # This should not happen. Simply redirect to the connections                                                                                                                                                      
        # view (which has a login required)                                                                                                                                                                               
        return HttpResponseRedirect(reverse('socialaccount_connections'))
    level = messages.INFO
    message = 'socialaccount/messages/account_connected.txt'
    if sociallogin.is_existing:
        if sociallogin.account.user != request.user:
            # Social account of other user. For now, this scenario                                                                                                                                                        
            # is not supported. Issue is that one cannot simply                                                                                                                                                           
            # remove the social account from the other user, as                                                                                                                                                           
            # that may render the account unusable.                                                                                                                                                                       
            level = messages.ERROR
            message = 'socialaccount/messages/account_connected_other.txt'
        else:
            # This account is already connected -- let's play along                                                                                                                                                       
            # and render the standard "account connected" message                                                                                                                                                         
            # without actually doing anything.                                                                                                                                                                            
            pass
    else:
        # New account, let's connect                                                                                                                                                                                      
        sociallogin.connect(request, request.user)
        try:
            signals.social_account_added.send(sender=SocialLogin,
                                              request=request,
                                              sociallogin=sociallogin)
        except ImmediateHttpResponse as e:
            if request.is_ajax():
                response['ok'] = 'false'
                response['html'] = e.response.content.decode('utf8')
                response['code'] = 'unknown_error'
                response['message'] = 'Unknown Error'
                c = RequestContext(request,{'response':json.dumps(response)})
                return HttpResponse(t.render(c), content_type="application/json", status = e.response.status_code)

            return e.response
    default_next = get_adapter() \
        .get_connect_redirect_url(request,
                                  sociallogin.account)
    next_url = sociallogin.get_redirect_url(request) or default_next
    get_account_adapter().add_message(request, level, message)
    if request.is_ajax():
        response['ok'] = 'true'
        response['code'] = 'logged_in_successfully'
        response['message'] = 'Logged in successfully'
        c = RequestContext(request,{'response':json.dumps(response)})
        return HttpResponse(t.render(c), content_type="application/json")
        
    return HttpResponseRedirect(next_url)


def complete_social_login(request, sociallogin):
    assert not sociallogin.is_existing
    sociallogin.lookup()
    try:
        get_adapter().pre_social_login(request, sociallogin)
        signals.pre_social_login.send(sender=SocialLogin,
                                      request=request,
                                      sociallogin=sociallogin)
    except ImmediateHttpResponse as e:
        return e.response
    if sociallogin.state.get('process') == 'connect':
        return _add_social_account(request, sociallogin)
    else:
        return _complete_social_login(request, sociallogin)

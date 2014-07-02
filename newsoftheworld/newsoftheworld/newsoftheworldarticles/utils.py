import json
from django.contrib import messages
from allauth.account.adapter import get_adapter
from allauth.account import signals
from allauth.account.app_settings import AuthenticationMethod, EmailVerificationMethod
from allauth.account.utils import get_login_redirect_url, send_email_confirmation
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, Template
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, Template

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
                c = RequestContext(request,{'response':json.dumps(response)})
                t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
                return HttpResponse(t.render(c), mimetype="application/json")
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
            c = RequestContext(request,{'response':json.dumps(response)})
            t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
            return HttpResponse(t.render(c), mimetype="application/json")
            #return HttpResponse(json.dumps(response), content_type="application/json")
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
        c = RequestContext(request,{'response':json.dumps(response)})
        t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
        return HttpResponse(t.render(c), mimetype="application/json")
        #return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponseRedirect(get_login_redirect_url(request, redirect_url))


def complete_signup(request, user, email_verification, success_url, 
                    signal_kwargs={}):
    #print "request.is_ajax: " + str(request.is_ajax)
    signals.user_signed_up.send(sender=user.__class__,
                                request=request,  
                                user=user,
                                 **signal_kwargs) 
    
    return perform_login(request, user, 
                         email_verification=email_verification,
                         signup=True,    
                         redirect_url=success_url,  
                         signal_kwargs=signal_kwargs)

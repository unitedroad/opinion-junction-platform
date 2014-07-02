import logging
import requests

from django.utils.cache import patch_response_headers
from django.shortcuts import render

from allauth.socialaccount.models import (SocialLogin, 
                                          SocialToken)


from allauth.socialaccount.providers.facebook.forms import FacebookConnectForm
from allauth.socialaccount.providers.facebook.provider import FacebookProvider
from allauth.socialaccount.providers.facebook.views import fb_complete_login
from allauth.socialaccount import providers 

from newsoftheworldarticles.socialaccount.helpers import complete_social_login

def channel(request):
    provider = providers.registry.by_id(FacebookProvider.id)
    locale = provider.get_locale_for_request(request)
    response = render(request, 'facebook/channel.html',
                      {'facebook_jssdk_locale': locale}) 
    cache_expire = 60 * 60 * 24 * 365
    patch_response_headers(response, cache_expire)
    response['Pragma'] = 'Public'
    return response 

def login_by_token(request):
        ret = None 
        if request.method == 'POST': 
            form = FacebookConnectForm(request.POST)
            if form.is_valid():
                try:
                    provider = providers.registry.by_id(FacebookProvider.id)
                    login_options = provider.get_fb_login_options(request)
                    app = providers.registry.by_id(FacebookProvider.id) \
                        .get_app(request)
                    access_token = form.cleaned_data['access_token']
                    if login_options.get('auth_type') == 'reauthenticate':
                        info = requests.get(
                            'https://graph.facebook.com/oauth/access_token_info',
                            params={'client_id': app.client_id,
                                    'access_token': access_token}).json()
                        nonce = provider.get_nonce(request, pop=True)
                        ok = nonce and nonce == info.get('auth_nonce')
                    else:
                        ok = True
                    if ok:
                        token = SocialToken(app=app,
                                            token=access_token)
                        login = fb_complete_login(request, app, token)
                        login.token = token
                        login.state = SocialLogin.state_from_request(request)
                        ret = complete_social_login(request, login)
                        #ret['ok'] = ['true']
                        #ret['code'] = ['login_successful']
                        #ret['message'] = ['Logged in Successfully']
                except requests.RequestException:
                    logger.exception('Error accessing FB user profile')
        if not ret:
            if request.is_ajax():
                response = {}
                response['ok'] = 'false'
                response['code'] = 'social_login_failure'
                response['message'] = 'Social Network Login Failure'
                c = RequestContext(request,{'response':json.dumps(response)})
                t = Template("{% autoescape off %}{{response}}{% endautoescape %}") # A dummy template
                ret = HttpResponse(t.render(c), mimetype="application/json")
            else:
                ret = render_authentication_error(request)
        return ret

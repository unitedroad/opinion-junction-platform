# Create your views here.
from django.http import HttpResponse
from django.template import Context, loader
from django.template import RequestContext

def commentstest(request):
    template = loader.get_template('commentstest.html')
    context = RequestContext(request, {
        'foo':'bar',
    })
    return HttpResponse(template.render(context))

def comments(request):
    template = loader.get_template('comments/index.html')
    context = RequestContext(request, {
        'foo':'bar',
    })
    return HttpResponse(template.render(context))

def commentslogin(request):
    template = loader.get_template('comments/login.html')
    context = RequestContext(request, {
        'foo':'bar',
    })
    return HttpResponse(template.render(context))

def facebook_social_callback(request):
    template = loader.get_template('account/social_callback_popup.html')
    context = RequestContext(request, {
        'foo':'bar',
    })
    return HttpResponse(template.render(context))

def login_callback(request):
    template = loader.get_template('account/social_callback_popup.html')
    context = RequestContext(request, {
        'foo':'bar',
    })
    return HttpResponse(template.render(context))

def login_successful_mw(request):
    template = loader.get_template('account/login_successful_mw.html')
    context = RequestContext(request, {
        'foo':'bar',
    })
    return HttpResponse(template.render(context))

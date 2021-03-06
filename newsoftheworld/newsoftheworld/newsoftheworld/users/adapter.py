from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter

class NotwAccountAdapter(DefaultAccountAdapter):

    def get_login_redirect_url(self, request):
        print "is_ajax: " + str(request.is_ajax())
        if request.method == "POST" and hasattr(request, "POST") and "login_redirect_url" in request.POST:
            return request.POST["login_redirect_url"]
        elif request.method == "GET" and hasattr(request, "GET") and "login_redirect_url" in request.GET:
            return request.GET["login_redirect_url"]
        else:
            #return super(DefaultAccountAdapter, self).get_login_redirect_url(request)
            return DefaultAccountAdapter.get_login_redirect_url(self, request)

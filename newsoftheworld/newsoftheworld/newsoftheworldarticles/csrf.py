import json
from django.http import HttpResponseForbidden
from django.template import Context, Template
from django.conf import settings
from django.views.csrf import CSRF_FAILURE_TEMPLATE

def csrf_failure(request, reason=""):
    """
    view used when request fails CSRF protection 
    """
    from django.middleware.csrf import REASON_NO_REFERER
    t = Template(CSRF_FAILURE_TEMPLATE)
    if request.is_ajax():    
        response = {'reason': reason,
                    'no_referer': reason == REASON_NO_REFERER,
                    'code': "csrf_failure",
                    'message': reason,
                    };
        return HttpResponseForbidden(json.dumps(response), content_type="application/json")
    c = Context({'DEBUG': settings.DEBUG,
                 'reason': reason,
                 'no_referer': reason == REASON_NO_REFERER
                 })
    return HttpResponseForbidden(t.render(c), content_type='text/html')

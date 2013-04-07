from django.views.generic.base import TemplateView
from django.http import HttpResponse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout

from django.conf import settings

class HomePageView(TemplateView):

    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        context['apps'] = settings.HAF_APPS
        return context

def login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            auth_login(request, user)
            return HttpResponse("success")
            # Redirect to a success page.
        else:
            return HttpResponse("");
    else:
        return HttpResponse("");

def logout(request):
    auth_logout(request)
    return HttpResponse("success");

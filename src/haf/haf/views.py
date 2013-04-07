from django.views.generic.base import TemplateView

from django.conf import settings

class HomePageView(TemplateView):

    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        context['apps'] = settings.HAF_APPS
        return context

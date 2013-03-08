from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.conf import settings

from rest_api.apis import raw

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', login_required(TemplateView.as_view(template_name="home.html")), {}, 'home'),

    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}, 'login'),
    #url(r'^accounts/', include('registration.backends.simple.urls')),
    #url(r'^powr/', include('powr.urls', namespace='powr')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^api/', include(raw.api.urls)),
)

# Include the urls for each HAF app
for app in settings.HAF_APPS:
    urlpatterns += patterns('',
        url('^'+app+'/', include(app + '.urls', namespace=app)),
    )

print urlpatterns
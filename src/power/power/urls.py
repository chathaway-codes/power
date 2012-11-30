from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from rest_api.apis import raw
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'power.views.home', name='home'),
    # url(r'^power/', include('power.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^sample/rest_charts/$', TemplateView.as_view(template_name="charts.html")),

    url(r'^api/', include(raw.api.urls)),
)

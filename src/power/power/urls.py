from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from rest_api.apis import raw
import satellite.urls
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', TemplateView.as_view(template_name="home.html"), {}, 'home'),
    # url(r'^power/', include('power.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^satellite/', include(satellite.urls, 'satellite')),
    url(r'^sample/rest_charts/$', TemplateView.as_view(template_name="charts.html")),
    url(r'^view_data/$', TemplateView.as_view(template_name="view_data.html"), {}, 'view_data'),
	url(r'^view_data/view_data2$', TemplateView.as_view(template_name="view_data2.html"), {}, 'view_data2'),
	
    url(r'^api/', include(raw.api.urls)),
)

from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^add/', 'satellite.views.add', {}, 'add'),
)

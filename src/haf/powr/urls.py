from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

urlpatterns = patterns('',
    url(r'^satellite/add/', login_required(TemplateView.as_view(template_name='powr/satellite_add.html')), name='satellite_add'),
    url(r'^device/add/', login_required(TemplateView.as_view(template_name='powr/device_add.html')), name='device_add'),
)


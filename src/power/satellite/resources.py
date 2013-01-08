from tastypie.resources import ModelResource
from rest_api.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from satellite.models import Satellite

class SatelliteResource(ModelResource):
    class Meta:
        queryset = Satellite.objects.all()
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()


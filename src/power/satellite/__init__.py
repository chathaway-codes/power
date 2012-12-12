from tastypie.resources import ModelResource
from rest_api.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from rest_api.apis import raw
from satellite.models import Satellite

print "Initing the Satellite module..."

class SatelliteResource(ModelResource):
    class Meta:
        queryset = Satellite.objects.all()
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()

raw.api.register(SatelliteResource())


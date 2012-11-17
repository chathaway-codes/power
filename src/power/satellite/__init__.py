from tastypie.resources import ModelResource

from rest_api.apis import raw
from satellite.models import Satellite

print "Initing the Satellite module..."

class SatelliteResource(ModelResource):
    class Meta:
        queryset = Satellite.objects.all()

raw.api.register(SatelliteResource())


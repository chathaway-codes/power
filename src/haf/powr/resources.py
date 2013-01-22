from rest_api.resources import ModelResource
from tastypie.constants import ALL

from powr.models import Satellite, Device

class SatelliteResource(ModelResource):
    class Meta:
        queryset = Satellite.objects.all()

class DeviceResource(ModelResource):
    class Meta:
        queryset = Device.objects.all()
        filtering = {
            'id': ALL,
        }


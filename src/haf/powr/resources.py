from tastypie import fields
from rest_api.resources import ModelResource, ModelMeta
from tastypie.constants import ALL

from powr.models import Satellite, Device, Graph

class SatelliteResource(ModelResource):
    class Meta(ModelMeta):
        queryset = Satellite.objects.all()

class DeviceResource(ModelResource):
    satellite = fields.ToOneField(SatelliteResource, 'satellite', full=True, null=True)
    class Meta(ModelMeta):
        queryset = Device.objects.all()
        filtering = {
            'id': ALL,
            "enabled": ALL,
        }

class GraphResource(ModelResource):
    devices = fields.ManyToManyField(DeviceResource, 'devices', full=True)
    class Meta(ModelMeta):
        queryset = Graph.objects.all()
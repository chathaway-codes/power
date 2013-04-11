from tastypie import fields
from rest_api.resources import ModelResource, ModelMeta
from tastypie.constants import ALL

from powr.models import Satellite, Device, Graph, Data

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

class DataResource(ModelResource):
    device_id = fields.ToOneField(DeviceResource, 'device_id')
    class Meta(ModelMeta):
        queryset = Data.objects.all()
        filtering = {
            'device_id': ALL,
            'timestamp': ALL,
        }
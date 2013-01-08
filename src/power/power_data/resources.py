from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization

from power_data.models import Data

from device.resources import DeviceResource

class DataResource(ModelResource):
    device_id = fields.ForeignKey(DeviceResource, 'device_id')
    class Meta:
        queryset = Data.objects.all()
        authentication = Authentication()
        authorization = Authorization()
        filtering = {
            'timestamp': ALL,
            'id': ALL,
            'device_id': ALL_WITH_RELATIONS,
        }


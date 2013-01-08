from tastypie.resources import ModelResource
from tastypie.constants import ALL
from rest_api.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from device.models import Device

class DeviceResource(ModelResource):
    class Meta:
        queryset = Device.objects.all()
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()
        filtering = {
            'id': ALL,
        }


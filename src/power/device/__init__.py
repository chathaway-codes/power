from tastypie.resources import ModelResource
from rest_api.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from rest_api.apis import raw
from device.models import Device

print "Initing the Device module..."

class DeviceResource(ModelResource):
    class Meta:
        queryset = Device.objects.all()
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()

raw.api.register(DeviceResource())

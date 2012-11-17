from tastypie.resources import ModelResource

from rest_api.apis import raw
from device.models import Device

print "Initing the Device module..."

class DeviceResource(ModelResource):
    class Meta:
        queryset = Device.objects.all()

raw.api.register(DeviceResource())

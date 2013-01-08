from device.resources import DeviceResource
from rest_api.apis import raw

raw.api.register(DeviceResource())

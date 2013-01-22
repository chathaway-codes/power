from powr.resources import DeviceResource, SatelliteResource
from rest_api.apis import raw

raw.api.register(DeviceResource())
raw.api.register(SatelliteResource())

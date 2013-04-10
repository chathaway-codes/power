from powr.resources import DeviceResource, SatelliteResource, GraphResource
from rest_api.apis import raw

raw.api.register(DeviceResource())
raw.api.register(SatelliteResource())
raw.api.register(GraphResource())

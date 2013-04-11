from powr.resources import DeviceResource, SatelliteResource, GraphResource, DataResource
from rest_api.apis import raw

raw.api.register(DeviceResource())
raw.api.register(SatelliteResource())
raw.api.register(GraphResource())
raw.api.register(DataResource())

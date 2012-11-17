from tastypie.resources import ModelResource

from rest_api.apis import raw
from power_data.models import Data

print "Initing the Data module..."

class DataResource(ModelResource):
    class Meta:
        queryset = Data.objects.all()

raw.api.register(DataResource())


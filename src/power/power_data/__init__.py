from tastypie.resources import ModelResource
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization

from rest_api.apis import raw
from power_data.models import Data

print "Initing the Data module..."

class DataResource(ModelResource):
    class Meta:
        queryset = Data.objects.all()
        authentication = Authentication()
        authorization = Authorization()

raw.api.register(DataResource())


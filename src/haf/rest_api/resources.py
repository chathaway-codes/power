from tastypie.resources import ModelResource as def_ModelResource
from rest_api.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

class ModelMeta:
    always_return_data = True
    authentication = SessionAuthentication()
    authorization = DjangoAuthorization()

class ModelResource(def_ModelResource):
    class Meta(ModelMeta):
        pass

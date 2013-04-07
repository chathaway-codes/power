from tastypie import fields
from rest_api.resources import ModelResource, ModelMeta
from tastypie.constants import ALL
from django.contrib.auth.hashers import make_password, is_password_usable

from django.conf import settings

class UserResource(ModelResource):
    def hydrate(self, bundle):
        if not is_password_usable(bundle.obj.password):
            bundle.obj.password = make_password(bundle.obj.password)
        return bundle
            
    class Meta(ModelMeta):
        queryset = settings.AUTH_USER_MODEL.objects.all()
        excludes = ['email', 'password', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']

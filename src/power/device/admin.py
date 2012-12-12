from django.contrib import admin
from device.models import Device, DeviceGroup

class DeviceAdmin(admin.ModelAdmin):
    add_form_template = 'device/add.html'

    list_display = ('name', 'satellite', 'enabled',)
    list_filter = ('enabled',)

    def changelist_view(self, request, extra_context=None):
        if not request.GET.has_key('enabled__exact'):
            q = request.GET.copy()
            q['enabled__exact'] = '1'
            request.GET = q
            request.META['QUERY_STRING'] = request.GET.urlencode()
        return super(DeviceAdmin,self).changelist_view(request, extra_context=extra_context)

class DeviceGroupAdmin(admin.ModelAdmin):
    filter_horizontal = ('devices', )

admin.site.register(Device, DeviceAdmin)
admin.site.register(DeviceGroup, DeviceGroupAdmin)

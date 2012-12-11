from django.contrib import admin
from device.models import Device

class DeviceAdmin(admin.ModelAdmin):
    add_form_template = 'device/add.html'

admin.site.register(Device, DeviceAdmin)

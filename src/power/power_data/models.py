from django.db import models

from device.models import Device

class Data(models.Model):
	device_id = models.ForeignKey(Device, null=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	watt = models.DecimalField(max_digits=10, decimal_places=4)
	avg_volt = models.DecimalField(max_digits=8, decimal_places=4)
	interval = models.IntegerField()

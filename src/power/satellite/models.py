from django.db import models

from device.models import Device

class Satellite(models.Model):
	serial_number = models.CharField(max_length=9)
	device_id = models.ForeignKey(Device)

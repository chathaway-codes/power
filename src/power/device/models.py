from django.db import models

from satellite.models import Satellite

class Device(models.Model):
    name = models.CharField(max_length=500)
    enabled = models.BooleanField(default=True)
    satellite = models.ForeignKey(Satellite, null=True)
	
    def __unicode__(self):
        return self.name

class DeviceGroup(models.Model):
    name = models.CharField(max_length=500)
    devices = models.ManyToManyField(Device)

    def __unicode__(self):
        return self.name

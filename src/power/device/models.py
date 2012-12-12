from django.db import models

class Device(models.Model):
    name = models.CharField(max_length=500)
    enabled = models.BooleanField(default=True)
	
    def __unicode__(self):
        return self.name

class DeviceGroup(models.Model):
    name = models.CharField(max_length=500)
    devices = models.ManyToManyField(Device)

    def __unicode__(self):
        return self.name

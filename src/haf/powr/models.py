import re
from django.db import models

class Device(models.Model):
    name = models.CharField(max_length=500)
    enabled = models.BooleanField(default=True)
    satellite = models.ForeignKey('Satellite', null=True, blank=True)

    def __unicode__(self):
        return self.name

class DeviceGroup(models.Model):
    name = models.CharField(max_length=500)
    devices = models.ManyToManyField('Device')

    def __unicode__(self):
        return self.name

class Satellite(models.Model):
    serial_number = models.CharField(max_length=9)
    outlet = models.CharField(max_length=9)
    unique_together = ("serial_number", "outlet")

    def __unicode__(self):
        return re.sub("(.{3})", "\\1-", self.serial_number, re.DOTALL)[:-1] + ":" + self.outlet


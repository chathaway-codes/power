import re
from django.db import models

from device.models import Device

class Satellite(models.Model):
    serial_number = models.CharField(max_length=9)
    outlet = models.CharField(max_length=9)
    unique_together = ("serial_number", "outlet")
    device_id = models.ForeignKey(Device, null=True)

    def __unicode__(self):
        return re.sub("(.{3})", "\\1-", self.serial_number, re.DOTALL)[:-1] + ":" + self.outlet

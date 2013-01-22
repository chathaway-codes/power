import re
from django.db import models

class Device(models.Model):
    """
    Stores a device entry. A device is a user-friendly object representing a real-world gadget. Data is associated with the device, and only gathered through the satellite
    """
    name = models.CharField(max_length=500, help_text="The name of the device. This should be verbose, and very descriptive")
    enabled = models.BooleanField(default=True, help_text="This value indicates whether this device is enabled or not. It should be set to false if a device is \"delete\"")
    satellite = models.ForeignKey('Satellite', null=True, blank=True)

    def __unicode__(self):
        return self.name

class DeviceGroup(models.Model):
    """
    This represents a logical grouping of device. There is at least one of these for each device, and possibly more. When constructing graphs, the user will select device groups instead of just devices.
    """
    name = models.CharField(max_length=500)
    devices = models.ManyToManyField('Device')

    def __unicode__(self):
        return self.name

class Satellite(models.Model):
    """
    The satellite is the gadget that reports data back to this server. It simply sends data, which gets stored by using an associated device.
    """
    serial_number = models.CharField(max_length=9)
    outlet = models.CharField(max_length=9)
    unique_together = ("serial_number", "outlet")

    def __unicode__(self):
        """
        A satellite should be represented by:
        >>> s = Satellite(serial_number="aaabbbccc", outlet="a")
        >>> print s
        aaa-bbb-ccc:a
        """
        return re.sub("(.{3})", "\\1-", self.serial_number, re.DOTALL)[:-1] + ":" + self.outlet


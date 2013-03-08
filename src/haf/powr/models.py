import re
from django.db import models
from datetime import datetime

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
    
    @staticmethod
    def get_satellite_by_id(id):
        """
        Returns the satellite represented by id
        >>> s = Satellite(serial_number="aaabbbccc", outlet="a")
        >>> s.save()
        >>> p = Satellite.get_satellite_by_id(s.__unicode__())
        >>> p == s
        True
        """
        # First, get the outlet
        serial, outlet = id.split(":")
        # Next, prepare the serial number
        serial = serial.replace("-", '')
        
        s = Satellite.objects.filter(serial_number=serial, outlet=outlet)
        
        if len(s) == 0:
            raise Exception("Couldn't find outlet: %s" % id)
        return s[0]

    def __unicode__(self):
        """
        A satellite should be represented by:
        >>> s = Satellite(serial_number="aaabbbccc", outlet="a")
        >>> print s
        aaa-bbb-ccc:a
        """
        return re.sub("(.{3})", "\\1-", self.serial_number, re.DOTALL)[:-1] + ":" + self.outlet

class PowerCost(models.Model):
    """
    This represents a unit of "cost" for the specified duration
    """
    cost = models.DecimalField(max_digits=4, decimal_places=2)
    
    effective_start = models.DateTimeField()
    effective_end = models.DateTimeField(null=True, blank=True)
    
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    range_bottom = models.IntegerField()
    range_top = models.IntegerField()
    
    @staticmethod
    def find_power_cost():
        """
        Finds the PowerCost applicable at the moment
        >>> now = datetime.now()
        >>> p = PowerCost(cost=0.05, effective_start=now, start_time="00:00:00", end_time="23:59:59",
        ...           range_bottom="0", range_top="1000")
        >>> p.save()
        >>> PowerCost.find_power_cost() == p
        True
        """
        now = datetime.now()
        
        # First check to make sure the last update so long ago its not applicable
        ### Not implemented!
        PowerCost.consumed_power = 0
        
        objects = PowerCost.objects.filter(start_time__lte=now, end_time__gt=now, 
                                 range_bottom__lte=PowerCost.consumed_power, range_top__gt=PowerCost.consumed_power)
        if len(objects) == 0:
            raise Exception("No PowerCost objects applicable!")
        
        return objects[0]
        

class Data(models.Model):
    """
    This represents one piece of "data" gathered from the satellites
    """
    device_id = models.ForeignKey(Device, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    watt = models.DecimalField(max_digits=10, decimal_places=4)
    avg_volt = models.DecimalField(max_digits=8, decimal_places=4)
    interval = models.IntegerField()
    
    cost = models.ForeignKey(PowerCost)

    def __unicode__(self):
        return self.device_id.__unicode__() + " consumed " + repr(self.watt) + " watts over " + repr(self.interval) + " seconds"

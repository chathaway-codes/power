from django.db import models

class Data(models.Model):
	device_id = models.ForeignKey(Device)
	timestamp = models.DateField(auto_now_add=True)
	watt = models.DecimalField(max_digits=6, decimal_places=2)
	avg_volt = models.DecimalField(max_digits=4, decimal_places=1)
	interval = models.IntegerField()

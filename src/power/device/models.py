from django.db import models

class Device(models.Model):
	name = models.Charfield(max_length=500)
	

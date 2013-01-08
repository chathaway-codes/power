from django.core.management.base import BaseCommand, CommandError
from time import sleep

from power_data.models import Data
from satellite.models import Satellite
from device import Device

class Command(BaseCommand):
    args = "<satellite_serial>:<outlet> <wattage> <avg_volt> <interval>"
    help = "Pretends to be a Satellite, faking reports."

    def handle(self, *args, **options):
        satellite_serial, outlet, wattage, avg_volt, interval = 0, 0, 0, 0, 0
        try:
            satellite_serial, wattage, avg_volt, interval = args
            # Split up the serial
            satellite_serial, outlet = satellite_serial.split(":")
            # And remove dashes from the serial
            satellite_serial = satellite_serial.replace("-", "")

            # Make sure interval is an int
            interval = int(interval)
        except ValueError:
            raise CommandError("Invalid values provided")
        satellite = Satellite.objects.filter(serial_number=satellite_serial, outlet=outlet)[0]
        device = Device.objects.filter(satellite=satellite)[0]

        while True:
            d = Data(device_id=device, watt=wattage, avg_volt=avg_volt, interval=interval)
            d.save()
            print "Added log: " + d.__unicode__()
            sleep(interval)

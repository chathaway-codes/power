from powr.models import Data, PowerCost, Device

def process(satellite, rest):
    print "process(%s, %s)" % (satellite, rest)
    
    # Get all the data we need
    voltage, current = rest.split(':')
    voltage = int(voltage, 10)
    current = int(current, 10) / 1000.0
    
    # Find the correct PowerCost for now
    power_cost = PowerCost.find_power_cost()
    
    # Get the device
    satellites = satellite.device_set.all()
    device = Device.objects.all()[0]
    if len(satellites) > 0:
        device = satellite.device_set.all()[0]
    
    # Create and save the power data
    Data(device_id=device, watt=voltage*current, avg_volt=voltage, interval=5, cost=power_cost).save()
    

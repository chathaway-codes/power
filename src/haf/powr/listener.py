from powr.models import Data, PowerCost

def process(satellite, rest):
    print "process(%s, %s)" % (satellite, rest)
    
    # Get all the data we need
    voltage, current = rest.split(':')
    voltage = int(voltage, 16)
    current = int(current, 16)
    
    # Find the correct PowerCost for now
    power_cost = PowerCost.find_power_cost()
    
    # Get the device
    print("Here2")
    device = satellite.device_set.all()[0]
    print("Here2.2")
    
    # Create and save the power data
    Data(device_id=device, watt=voltage*current, avg_volt=voltage, interval=5, cost=power_cost).save()
    

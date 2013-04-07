from django.core.management.base import BaseCommand, CommandError
from optparse import make_option
import sys
import signal
import select
import time
import serial

from powr.models import Satellite

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--infile-type',
            dest='--infile-type',
            default='stdin',
            help='Input source. Choices are stdin or file'),
        )
    infile_variable = '--infile-type'
    args = "[%s=<stdin,serial>] <Input file if --infile-type=serial>" % infile_variable
    help = "Starts a thread that reads from the infile and calls the appropiate listeners"
    
    def handle(self, *args, **options):
        # First, figure out what type of file to use
        if "--infile-type" in options:
            if options[self.infile_variable] == 'stdin':
                self.infile = sys.stdin
            elif options[self.infile_variable] == 'serial':
                self.infile = serial.Serial(args[0], 9600)
        else:
            self.infile = sys.stdin
        
        # And run
        signal.signal(signal.SIGINT, self.signal_handler)
        self.running = True
        self.run()
        
    def run(self):
        modules = {}
        self.infile.flush()
        while self.running:
            # Brandon Arnold was standing over my shoulder when I changed the timeout to 1 second
            if not select.select([self.infile,],[],[],1.0)[0]:
                continue
            s = self.infile.readline().replace('\r', '').strip()
            try:
                module, satellite, outlet, rest = s.split(':', 3)
                print("%s" % (satellite + ":" + outlet))
                satellite = Satellite.get_satellite_by_id(satellite + ":" + outlet)
                if module not in modules:
                    modules[module] = __import__(module + '.listener')
                print("Here")
                modules[module].listener.process(satellite, rest)
                print("Here3")
            except ValueError as detail:
                sys.stderr.write("Failed to parse line: %s\n" % s)
                sys.stderr.write("Error: %s\n" % detail)
            
    def signal_handler(self, signal, frame):
        self.running = False

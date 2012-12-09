from django.contrib import admin

from satellite.models import Satellite

class SatelliteAdmin(admin.ModelAdmin):
    # This can't be found using reverse url because
    #  the urls haven't been populated when this
    #  is called
    add_form_template = 'satellite/add.html'

admin.site.register(Satellite, SatelliteAdmin)


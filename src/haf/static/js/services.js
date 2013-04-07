angular.module('powrDeviceServices', ['ngResource']).
    factory('Device', function($resource) {
        return $resource(window.API_RAW+'/device/:id', {}, {
        });
});

angular.module('powrSatelliteServices', ['ngResource']).
    factory('Satellite', function($resource) {
        return $resource(window.API_RAW+'/satellite/:id', {}, {
        });
});


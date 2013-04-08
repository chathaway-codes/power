angular.module('powrDeviceServices', ['ngResource']).
    factory('Device', function($resource) {
        return $resource(window.API_RAW+'/device/:id', {}, {
            save: {method: "PUT"}
        });
});

angular.module('powrSatelliteServices', ['ngResource']).
    factory('Satellite', function($resource) {
        return $resource(window.API_RAW+'/satellite/:id', {}, {
            save: {method: "PUT"}
        });
});

angular.module('systemUserServices', ['ngResource']).
    factory('User', function($resource) {
        return $resource(window.API_RAW+'/user/:id', {}, {
            save: {method: "PUT"},
            create: {method: "POST"}
        });
});
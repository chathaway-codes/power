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

// Create services for all resources in the REST API
angular.module('rest', ['$http']).
    config(function($http) {
      console.log("Here!");
      $http({method: "GET", url: window.API_RAW}).
          success(function(data) {
              console.log(data);
      });
});

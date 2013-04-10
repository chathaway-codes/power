'use strict';

var navList = angular.module('navList', []);

var haf = angular.module('haf', ['powrDeviceServices', 'powrSatelliteServices', 'systemUserServices']);

haf.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.
        when('/dashboard', {templateUrl: window.STATIC_URL+'partials/dashboard.html', controller: DashboardCtrl}).

        when('/graphs', {templateUrl: window.STATIC_URL+'powr/partials/graphs.html', controller: GraphsCtrl}).
        when('/graphs/new', {templateUrl: window.STATIC_URL+'powr/partials/graphs/new.html', controller: GraphsNewCtrl}).

        when('/devices', {templateUrl: window.STATIC_URL+'powr/partials/devices.html', controller: DevicesListCtrl}).
        when('/devices/new', {templateUrl: window.STATIC_URL+'powr/partials/devices/new.html', controller: DevicesNewCtrl}).
        when('/devices/update', {templateUrl: window.STATIC_URL+'powr/partials/devices/update.html', controller: DevicesUpdateCtrl}).
        // Delete is ommitted as per requirement FD_101
        when('/devices/:id', {templateUrl: window.STATIC_URL+'powr/partials/devices/detail.html', controller: DevicesDetailCtrl}).
        
        when('/system/users', {templateUrl: window.STATIC_URL+'system/partials/users.html', controller: UsersListCtrl}).
        when('/system/users/new', {templateUrl: window.STATIC_URL+'system/partials/users/new.html', controller: UsersNewCtrl}).
        when('/system/users/:id', {templateUrl: window.STATIC_URL+'system/partials/users/detail.html', controller: UsersDetailCtrl}).

        otherwise({redirectTo: '/dashboard'});
    // Build something to deal with authorization
    function http401Interceptor(scope, $q) {
        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            if(status == 401) {
                var deferred = $q.defer();
                var req = {
                    config: response.config,
                    deferred: deferred
                };
                scope.requests401.push(req);
                scope.$broadcast('event:loginRequired');
                return deferred.promise;
            }

            return $q.reject(response);
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }

    $httpProvider.responseInterceptors.push(['$rootScope', '$q', http401Interceptor]);
}]);

haf.run(['$rootScope', '$http', '$location', function(scope, $http, $location) {
    scope.requests401 = [];

    scope.$on('event:loginConfirmed', function() {
        console.log("Logged in");
        $('#loginModal').modal('hide');
        var i, requests = scope.requests401;
        for(i=0; i < requests.length; i++) {
            retry(requests[i]);
        }
        scope.requests401 = [];

        function retry(req) {
            $http(req.config).then(function(response) {
                req.deferred.resolve(response);
            });
        }
    });


    scope.$on('event:loginRequired', showLogin);

    scope.$on('event:logoutRequest', function() {
        $http.get(window.LOGOUT_URL);
    });

    // If the user isn't logged in, prompt them
    if(!window.LOGGED_IN)
        showLogin();
}]);


function showLogin() {
    $('#loginModal').modal('show');
    $("#login-username").focus();
}

function alert(message) {
    var alert = '<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>'
        + message +'</div>';
    $('#alerts').append(message);
}

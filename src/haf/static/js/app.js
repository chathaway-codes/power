'use strict';

var navList = angular.module('navList', []);

var haf = angular.module('haf', ['powrDeviceServices', 'powrSatelliteServices']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/dashboard', {templateUrl: window.STATIC_URL+'partials/dashboard.html', controller: DashboardCtrl}).

            when('/graphs', {templateUrl: window.STATIC_URL+'powr/partials/graphs.html', controller: GraphsCtrl}).
            when('/graphs/new', {templateUrl: window.STATIC_URL+'powr/partials/graphs/new.html', controller: GraphsNewCtrl}).

            when('/devices', {templateUrl: window.STATIC_URL+'powr/partials/devices.html', controller: DevicesListCtrl}).
            when('/devices/new', {templateUrl: window.STATIC_URL+'powr/partials/devices/new.html', controller: DevicesNewCtrl}).
            when('/devices/update', {templateUrl: window.STATIC_URL+'powr/partials/devices/update.html', controller: DevicesUpdateCtrl}).
            // Delete is ommitted as per requirement FD_101
            when('/devices/:id', {templateUrl: window.STATIC_URL+'powr/partials/devices/detail.html', controller: DevicesDetailCtrl}).

            otherwise({redirectTo: '/dashboard'});
    }]);

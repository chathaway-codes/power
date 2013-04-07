'use strict';

var navList = angular.module('navList', []);

var haf = angular.module('haf', []).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/dashboard', {templateUrl: window.STATIC_URL+'partials/dashboard.html', controller: DashboardCtrl}).
            when('/graphs', {templateUrl: window.STATIC_URL+'powr/partials/graphs.html', controller: GraphsCtrl}).
            when('/graphs/new', {templateUrl: window.STATIC_URL+'powr/partials/graphs/new.html', controller: GraphsNewCtrl}).
            otherwise({redirectTo: '/dashboard'});
    }]);

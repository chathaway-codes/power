'use strict';

function NavCtrl($scope, $location) {
    $scope.navClass = function(page) {
        var currentRoute = $location.path().substring(1).split("/")[0] || 'dashboard';
        return page === currentRoute ? 'active' : '';
    }
}


function DashboardCtrl($scope) {
}

function GraphsCtrl($scope) {
}

function GraphsNewCtrl($scope) {
    $scope.STATIC_URL = window.STATIC_URL;

    $('#startabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });


    $('#endabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });
}

function DevicesListCtrl($scope, $location, Device) {
    $scope.page_title = "Devices";

    $scope.objects = Device.query();

    $scope.go = function(object) {
        $location.path("/devices/" + object.id);
    }

    $scope.goNewDevice = function() {
        $location.path("/devices/new");
    }
}
DevicesListCtrl.$inject = ['$scope', '$location', 'Device'];

function DevicesNewCtrl($scope, $location, Satellite, Device) {
    $scope.device = {"enabled": true};

    $scope.save = function(device) {
        Device.save($scope.device);
        $location.path('/devices');
    };

    $scope.reset = function() {
        $scope.device = {};
    };

    $scope.satellites = Satellite.query();
}
DevicesNewCtrl.$inject = ['$scope', '$location', 'Satellite', 'Device'];

function DevicesUpdateCtrl($scope) {
}
DevicesUpdateCtrl.$inject = ['$scope'];

function DevicesDetailCtrl($scope, $routeParams, Device, Satellite) {
    $scope.device = Device.get({id: $routeParams.id});
    $scope.satellites = Satellite.query();
    var original = $scope.device;

    $scope.editName = false;
    $scope.editEnabled = false;
    $scope.save = function() {
        $scope.device.$save();
        original = $scope.device;
    }
    $scope.cancel = function() {
        $scope.device = original;
    }
}
DevicesDetailCtrl.$inject = ['$scope', '$routeParams', 'Device', 'Satellite'];


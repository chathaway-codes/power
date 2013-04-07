'use strict';

function NavCtrl($scope, $location) {
    $scope.navClass = function(page) {
        var currentRoute = $location.path().substring(1).split("/")[0] || 'dashboard';
        return page === currentRoute ? 'active' : '';
    }
}

function LoginCtrl($rootScope, $scope, $http) {
    $scope.form = {username: '', password: ''};

    $scope.login = function() {
        var payload = $.param($scope.form);
        var config = {
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8', 'X-CSRFToken': $.cookie('csrftoken')}
        };

        var failure = function(data) {
            $scope.error = "Incorrect username or password.";
            $scope.form = {username: '', password: ''};
            console.log($scope);
        }

        $http.post(window.LOGIN_URL, payload, config).then(function(data) {
            console.log(data);
            if(data.data == "success") {
                $rootScope.$broadcast('event:loginConfirmed');
                window.LOGGED_IN = true;
            }
            else
                failure(data);
        }, failure);
    }
}
LoginCtrl.$inject = ['$rootScope', '$scope', '$http'];

function LogoutCtrl($rootScope, $scope, $http) {
    $scope.logout = function() {
        $http.get(window.LOGOUT_URL).then(function(data) {
            $scope.loggedIn = false;
            $rootScope.$broadcast('event:logoutConfirmed');
        }, function(data) {
        });
    }

    $rootScope.$on("event:loginConfirmed", function() {
        $scope.loggedIn = true;
    });

    $scope.loggedIn = window.LOGGED_IN;
}
LogoutCtrl.$inject = ['$rootScope', '$scope', '$http'];


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
    $scope.objects = Device.query();
    $scope.filter = {enabled: true};

    $scope.go = function(object) {
        $location.path("/devices/" + object.id);
    }

    $scope.goNewDevice = function() {
        $location.path("/devices/new");
    }

    $scope.disable = function(object) {
        object.enabled = !object.enabled;
        Device.save(object);
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


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
    introJs().start();
}

function GraphsCtrl($scope, Graph) {
    $scope.objects = Graph.query();
    
    $scope.delete = function(object) {
        $scope.objects.splice(object, 1);
        object.$delete({id: object.id})
    }
    
    $scope.sort = {
        column: 'name',
        descending: false
    };
    
    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if($scope.sort.column == column) {
            $scope.sort.descending = !sort.descending;
        } else {
            $scope.sort.column = column;
            $scope.sort.descending = false;
        }
    };
}
GraphsCtrl.$inject = ['$scope', 'Graph'];

function GraphsNewCtrl($scope, $location, Device, Graph) {
    $scope.STATIC_URL = window.STATIC_URL;
    $scope.device_list = Device.query({"enabled": "true"});
    $scope.chart = {'devices': [], 'starting_unit': 'Y', 'timespan_unit': 'Y'};
    $scope.selected_devices = [];
    $scope.selected_devices_rm = [];
    
    $scope.addDevice = function() {
        var items = $scope.selected_devices;
        
        // Remove the item from the devices_available box
        // And append them to the devices_selected box
        for(var i=0; i < items.length; i++) {
            $scope.chart.devices.push(items[i]);
            $scope.device_list.splice($scope.device_list.indexOf(items[i]), 1);
        }
        $scope.selected_devices = [];
    }
    $scope.remDevice = function() {
        var items = $scope.selected_devices_rm;
        
        // Remove the item from the devices_available box
        // And append them to the devices_selected box
        for(var i=0; i < items.length; i++) {
            $scope.device_list.push(items[i]);
            $scope.chart.devices.splice($scope.chart.devices.indexOf(items[i]), 1);
        }
        $scope.selected_devices = [];
    }
    
    $scope.save = function() {
        // Add in the 
        console.log($scope.chart);
        Graph.create($scope.chart, function() {
            $location.path('/graphs');
            alert('Graph created');
        });
        $scope.chart = {'devices': [], 'starting_unit': 'Y', 'timespan_unit': 'Y'};
    }

    /*$('#startabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });


    $('#endabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });*/
}
GraphsNewCtrl.$inject = ['$scope', '$location', 'Device', 'Graph'];

function GraphsUpdateCtrl($scope, $location, $routeParams, Device, Graph) {
    $scope.STATIC_URL = window.STATIC_URL;
    $scope.device_list = Device.query({"enabled": "true"});
    $scope.chart = Graph.get({id: $routeParams.id}, function() {
        // Remove all registered devices from this list
        for(var i=0; i < $scope.chart.devices.length; i++) {
            var dev = $scope.chart.devices[i];
            $scope.device_list.splice($scope.device_list.indexOf(dev), 1);
        }
    });
    $scope.selected_devices = [];
    $scope.selected_devices_rm = [];
    
    $scope.addDevice = function() {
        var items = $scope.selected_devices;
        
        // Remove the item from the devices_available box
        // And append them to the devices_selected box
        for(var i=0; i < items.length; i++) {
            $scope.chart.devices.push(items[i]);
            $scope.device_list.splice($scope.device_list.indexOf(items[i]), 1);
        }
        $scope.selected_devices = [];
    }
    $scope.remDevice = function() {
        var items = $scope.selected_devices_rm;
        
        // Remove the item from the devices_available box
        // And append them to the devices_selected box
        for(var i=0; i < items.length; i++) {
            $scope.device_list.push(items[i]);
            $scope.chart.devices.splice($scope.chart.devices.indexOf(items[i]), 1);
        }
        $scope.selected_devices = [];
    }
    
    $scope.save = function() {
        // Add in the 
        console.log($scope.chart);
        Graph.create($scope.chart, function() {
            $location.path('/graphs');
            alert('Graph updated');
        });
    }
    
    /*$('#startabsolutetime').datetimepicker({
        t *imeFormat: "hh:mm tt"
    });


    $('#endabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });*/
}
GraphsUpdateCtrl.$inject = ['$scope', '$location', '$routeParams', 'Device', 'Graph'];

/*
 * Device Controllers
 */

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
        object.$save({id: object['id']});
    }
}
DevicesListCtrl.$inject = ['$scope', '$location', 'Device'];

function DevicesNewCtrl($scope, $location, Satellite, Device) {
    $scope.device = {"enabled": true};

    $scope.save = function(device) {
        Device.create($scope.device);
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
        $scope.device.$save({id: $scope.device.id});
        original = $scope.device;
    }
    $scope.cancel = function() {
        $scope.device = original;
    }
}
DevicesDetailCtrl.$inject = ['$scope', '$routeParams', 'Device', 'Satellite'];

/*
 * User controllers
 */
function UsersListCtrl($scope, User) {
    $scope.objects = User.query();
    
    $scope.delete = function(object) {
        $scope.objects.splice(object, 1);
        object.$delete({id: object.id})
    }
    
    $scope.sort = {
        column: 'username',
        descending: false
    };
    
    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if($scope.sort.column == column) {
            $scope.sort.descending = !sort.descending;
        } else {
            $scope.sort.column = column;
            $scope.sort.descending = false;
        }
    };
}
UsersListCtrl.$inject = ['$scope', 'User'];

function UsersNewCtrl($scope, $location, User) {
    $scope.save = function() {
        if($scope.object.password == $scope.confirm_password) {
            User.create($scope.object);
            $location.path('/system/users');
        } else {
            $scope.message = "Password's don't match!";
        }
    }
}
UsersNewCtrl.$inject = ['$scope', '$location', 'User'];

function UsersDetailCtrl($scope, $routeParams, User) {
    $scope.object = User.get({id: $routeParams.id});
    var original = $scope.object;
    
    $scope.editUserName = false;
    $scope.editFirstName = false;
    $scope.editLastName = false;
    $scope.save = function() {
        $scope.object.$save({id: $scope.object.id});
        original = $scope.object;
    }
    $scope.cancel = function() {
        $scope.object = original;
    }
    
    $scope.savePassword = function() {
        if($scope.password == $scope.confirm_password) {
            $scope.object.password = $scope.password;
            $scope.save();
            $('#passwordModal').modal('hide');
            $scope.message = "Password updated!";
        } else {
            $scope.password_error = "Password's don't match!";
        }
    }
}
UsersDetailCtrl.$inject = ['$scope', '$routeParams', 'User'];

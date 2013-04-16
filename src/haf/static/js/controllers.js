'use strict';

function NavCtrl($scope, $location) {
    $scope.navClass = function(page) {
        var currentRoute = $location.path().substring(1).split("/")[0] || 'dashboard';
        return page === currentRoute ? 'active' : '';
    }

    $scope.help = function() {
        introJs().start();
    }
}

function LoginCtrl($rootScope, $scope, $http) {
    $scope.form = {username: '', password: ''};

    $scope.login = function() {
        $("#login-spinner").css('display', 'inline-block');
        var payload = $.param($scope.form);
        var config = {
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8', 'X-CSRFToken': $.cookie('csrftoken')}
        };

        var failure = function(data) {
            $scope.error = "Incorrect username or password.";
            $scope.form = {username: '', password: ''};
            $("#login-spinner").css('display', 'none');
        }

        $http.post(window.LOGIN_URL, payload, config).then(function(data) {
            if(data.data == "success") {
                $rootScope.$broadcast('event:loginConfirmed');
                window.LOGGED_IN = true;
                $("#login-spinner").css('display', 'none');
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
            showLogin();
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

/*
 * Graphing controllers
 */

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
    
    $scope.selectedCls = function(column) {
        return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
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

function GraphsNewCtrl($scope, $location, $routeParams, Device, Graph, Data) {
    
    GraphsEditBase($scope, $location, $routeParams, Device, Graph, Data);
    
    $scope.chart = {'devices': [], 'starting_unit': 'Y', 'timespan_unit': 'Y'};
    $scope.selected_devices = [];
    $scope.selected_devices_rm = [];

    /*$('#startabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });


    $('#endabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });*/
}
GraphsNewCtrl.$inject = ['$scope', '$location', '$routeParams', 'Device', 'Graph', 'Data'];

function GraphsUpdateCtrl($scope, $location, $routeParams, Device, Graph, Data) {
    GraphsEditBase($scope, $location, $routeParams, Device, Graph, Data);
    $scope.chart = Graph.get({id: $routeParams.id}, function() {
        // Remove all registered devices from this list
        for(var i=0; i < $scope.chart.devices.length; i++) {
            var dev = $scope.chart.devices[i];
            $scope.device_list.splice($scope.device_list.indexOf(dev), 1);
        }
    });
    $scope.selected_devices = [];
    $scope.selected_devices_rm = [];
}
GraphsUpdateCtrl.$inject = ['$scope', '$location', '$routeParams', 'Device', 'Graph', 'Data'];

function GraphsEditBase($scope, $location, $routeParams, Device, Graph, Data) {
    $scope.STATIC_URL = window.STATIC_URL;
    $scope.device_list = Device.query({"enabled": "true"});
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
    
    $scope.showGraph = function() {
        if($scope.chart.graph_type != 'STAC') {
            //$scope.chart.start_date = $("#startabsolutetime").datepicker('getDate').toString('yyyy-MM-dd hh:mm:ss');
            //$scope.chart.end_date = $("#endabsolutetime").datepicker('getDate').toString('yyyy-MM-dd hh:mm:ss');
            renderGraph($scope.chart, $('#graph'));
        } else {
            $scope.datas = [];
            
            for(var i=0; i < $scope.chart.devices.length; i++) {
                var device = $scope.chart.devices[i];
                var datas = Data.query({device_id: device.id}, function(datas) {
                    datas.forEach(function(d) {
                        d.timestamp = (new Date(d.timestamp)).toLocaleString();
                        d.device = device.name;
                    });
                    $scope.datas = $scope.datas.concat(datas);
                });
            }
        }
    }
    
    $scope.save = function() {
        // Add in the 
        Graph.create($scope.chart, function() {
            $location.path('/graphs');
            alert('Graph updated');
        });
    }
    
    $scope.create = function() {
        // Add in the 
        Graph.create($scope.chart, function() {
            $location.path('/graphs');
            alert('Graph created');
        });
        $scope.chart = {'devices': [], 'starting_unit': 'Y', 'timespan_unit': 'Y'};
    }
    
    /*
     * These are for sorting the data table
     */
    $scope.sort = {
        column: 'date',
        descending: false
    };
    
    $scope.selectedCls = function(column) {
        return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
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
    
    /*$('#startabsolutetime').datetimepicker({
        t *imeFormat: "hh:mm tt"
    });


    $('#endabsolutetime').datetimepicker({
        timeFormat: "hh:mm tt"
    });*/
}

//GraphsEditBase.$inject = ['$scope', '$location', '$routeParams', 'Device', 'Graph', 'Data'];

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
        if(object.enabled)
            alert('Device enabled: ' + object['name']);
        else
            alert('Device disabled: ' + object['name']);
    }
}
DevicesListCtrl.$inject = ['$scope', '$location', 'Device'];

function DevicesNewCtrl($scope, $location, Satellite, Device) {
    $scope.device = {"enabled": true};

    $scope.save = function(device) {
        Device.create($scope.device);
        $location.path('/devices');
        alert('Device created: ' + $scope.device.name);
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
        alert('Device updated: ' + $scope.device.name);
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
        alert('User deleted: ' + object.username);
    }
    $scope.selectedCls = function(column) {
        return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
    };
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
            alert('User created: ' + $scope.object.username);
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
        alert('User updated: ' + $scope.object.username);
    }
    $scope.cancel = function() {
        $scope.object = original;
    }
    
    $scope.savePassword = function() {
        if($scope.password == $scope.confirm_password) {
            $scope.object.password = $scope.password;
            $scope.save();
            $('#passwordModal').modal('hide');
            alert('Password for ' + $scope.object.username + ' updated!');
        } else {
            $scope.password_error = "Password's don't match!";
        }
    }
}
UsersDetailCtrl.$inject = ['$scope', '$routeParams', 'User'];

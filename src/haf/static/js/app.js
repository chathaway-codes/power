'use strict';

var navList = angular.module('navList', []);

var haf = angular.module('haf', ['powrDeviceServices', 'powrSatelliteServices', 'powrGraphFilters',
                                 'systemUserServices']);

haf.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.
        when('/dashboard', {templateUrl: window.STATIC_URL+'partials/dashboard.html', controller: DashboardCtrl}).

        when('/graphs', {templateUrl: window.STATIC_URL+'powr/partials/graphs.html', controller: GraphsCtrl}).
        when('/graphs/new', {templateUrl: window.STATIC_URL+'powr/partials/graphs/new.html', controller: GraphsNewCtrl}).
        when('/graphs/:id', {templateUrl: window.STATIC_URL+'powr/partials/graphs/detail.html', controller: GraphsUpdateCtrl}).

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
    $('#alerts').append(alert);
}

function renderGraph(model, el) {
    /**
     * Function prototypes
     */
    // Function to sum everything up for pie chart...
    function sumAllPie(collection) {
        var pieData = [];
        for(var i=0; i < collection.length; i++) {
            var c = collection[i];
            var total = 0;
            c.forEach(function(d) {
                total += d.get('watt');
                console.log(d.get('watt'));
            });
            pieData.push([labels[i], total]);
        }
        console.log(pieData);
        return [pieData];
    }
    
    // Delete the old chart, if present
    el.empty();
    
    // Start assembling the query parameter for the data
    var query = "";
    console.log(model);
    if(model.timeframe_method == 'ABS') {
        var start_date = new Date(model.start_date);
        var stop_date = new Date(model.stop_date);
        query += "timestamp__gte=" + start_date.toString("yyyy-MM-dd");
        query += "&timestamp__lte=" + stop_date.toString("yyyy-MM-dd");
    }
    
    // Get collections for each device in the model
    var collections = [];
    var variables = [];
    var labels = [];
    
    for(var i=0; i < model.devices.length; i++) {
        var device = model.devices[i];
        query += "&device_id=" + device.id;
        
        var Datas = Backbone.Collection.extend({
            url: window.API_RAW + "/data?" + query,
            
            parse: function(datas) {
                for(var i=0; i < datas.length; i++) {
                    datas[i].timestamp = (new Date(datas[i].timestamp)).toString("yyyy-MM-dd hh:mm:ss");
                    datas[i].watt = parseInt(datas[i].watt, 10);
                }
                return datas;
            }
        });
        collections.push(new Datas());
        variables.push(
            [
            'timestamp',
            'watt'
        ]);
        
        labels.push(device.name);
    }
    
    var chart;
    
    // Call the correct graphing wizard
    if(model.graph_type == 'LINE') {
        chart = new jqLineChart({
            el: el,
            collection: collections,
            jqplotOptions: {
                title: model.name,
                axes: {
                    xaxis: {
                        renderer: $.jqplot.DateAxisRenderer,
                        tickOptions: {
                            formatString: "%b, %#d, %Y",
                            angle: -30
                        }
                    }
                },
                legend: {
                    labels: labels
                }
            }, 
            variables: variables
        });
    } else if(model.graph_type == 'BAR') {
        var series = [];
        for(var i=0; i < labels.length; i++) {
            series.push({label: labels[i]});
        }
        
        chart = new jqBarChart({
            el: el,
            collection: collections,
            jqplotOptions: {
                title: model.name,
                series: series,
            },
            variables: variables
        });
    } else if(model.graph_type == 'PIE') {
        
        var series = [];
        for(var i=0; i < labels.length; i++) {
            series.push({label: labels[i]});
        }
        
        chart = new jqPieChart({
            el: el,
            collection: collections,
            jqplotOptions: {
                title: model.name,
                series: series
            },
            variables: ['Test'],
            process_data: sumAllPie
            //variableType: "groups"
        });
        console.log(variables);
    } else if(model.graph_type == 'STAC') {
        var div = "";
    };
    
    // Then fetch the data and make the chart
    for(var i=0; i < collections.length; i++) {
        collections[i].fetch({error: function() {
            alert(arguments);
        }, reset: true});
    }
}

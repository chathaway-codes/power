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

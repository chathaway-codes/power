define(["jquery", "backbone", "v/add_satellite", "backbone-tastypie"], function($, Backbone, add_satellite) {
    "use strict";

    var App;

    // The function for searching
    var searching = function() {
        console.log("Searching done now");
        setTimeout(function() {
            // Generate a random serial
            var possible = "ABCDEF0123456789";
            var sn = "";
            for( var i=0; i < 9; i++ ) {
                if(i % 3 == 0 && i != 0)
                    sn += "-";
                sn += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            App.model.set('serial_number', sn);
            App.nextState();
            clearTimeout(this);
        }, 4000);
    }

    // Load the first view
    App = new add_satellite({searching: searching});
});


define(["jquery", "backbone", "v/add_satellite", "backbone-tastypie"], function($, Backbone, add_satellite) {
    "use strict";

    var App;

    // The function for searching
    var searching = function() {
        console.log("Searching done now");
        App.nextState();
    }

    // Load the first view
    App = new add_satellite({searching: searching});
});


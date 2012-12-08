define(["jquery", "backbone", "backbone-tastypie"], function($, Backbone) {
    "use strict";

    var data = Backbone.Model.extend({
        url: function() {
            return this.get("resource_uri") || this.collection.url;
        }
    });

    return data;
});

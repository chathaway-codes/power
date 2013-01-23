define(["jquery", "backbone", "backbone-tastypie"], function($, Backbone) {
    "use strict";

    var data = Backbone.Model.extend({
        url: function() {
            if(this.get("resource_uri"))
                return this.get("resource_uri");

            if(this.collection && this.collection.url)
                return this.collection.url;

            return "/api/raw/device/";
        }
    });

    return data;
});

define(["jquery", "m/model"], function($, Model) {
    "use strict";

    var data = Model.extend({
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

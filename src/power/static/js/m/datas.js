define(["m/data", "jquery", "backbone", "backbone-tastypie"], function(data, $, Backbone) {
    "use strict";

    var datas = Backbone.Collection.extend({
        url: "/api/raw/data/",
        model: data,
        parse: function(data) {
            return data.objects;
        }
    });

    return datas;
});

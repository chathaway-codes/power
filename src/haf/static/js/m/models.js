define(["backbone"], function(Backbone) {
    "use strict";

    var TastypieCollection = Backbone.Collection.extend({
        parse: function(response) {
            this.recent_meta = response.meta || {};
            return response.objects || response;
        }
    });

    return TastypieCollection;
});

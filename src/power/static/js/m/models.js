define(['backbone', 'underscore'], function(Backbone, _) {
    "use strict";
    var collection = Backbone.Collection.extend({
        initialize: function(models, options) {
            // Check for the query string
            if(options != null && options.queryString != null)
                this.queryString = options.queryString;

            if(this.baseUrl == null && options.baseUrl == null)
                throw "A url option is required!";
            else if(this.baseUrl == null)
                this.baseUrl = options.baseUrl;
        },
        url: function() {
            var url = this.baseUrl;

            if(_.isFunction(url))
                url = url();
            
            if(this.queryString != null)
                url += "?" + this.queryString + "&format=json";
            return url;
        },
        parse: function(data) {
            return data.objects;
        },
    });
    
    return collection;
});

require(['backbone'], function(Backbone) {
    "use strict";
    var TastypieModel = Backbone.Model.extend({
        base_url: function() {
          var temp_url = Backbone.Model.prototype.url.call(this);
          return (temp_url.charAt(temp_url.length - 1) == '/' ? temp_url : temp_url+'/');
        },
    
        url: function() {
          return this.base_url();
        }
    });
    
    return TastypieModel;
});

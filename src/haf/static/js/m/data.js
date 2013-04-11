var DataModel = Backbone.Collection.extend({
    url: window.API_RAW + '/data/',
    parse: function(datas) {
        for(var i=0; i < datas.length; i++) {
            datas[i].timestamp = (new Date(datas[i].timestamp)).toString("yyyy-MM-dd hh:mm:ss");
        }
        return datas;
    }
});
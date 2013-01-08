define(["m/data", "jquery", "m/models", "backbone-tastypie"], function(data, $, models) {
    "use strict";

    var datas = models.extend({
        baseUrl: window.API_RAW + "data/",
        model: data,
        parse: function(data) {
            data = data['objects']
            for(var i=0; i < data.length; i++) {
                data[i]['timestamp'] = data[i]['timestamp'].replace('T', ' ');
                data[i]['timestamp'] = data[i]['timestamp'].split('+')[0]
            }
            return data;
        }
    });

    return datas;
});

require.config({
    baseUrl: "/static/js/",
});

require(["jquery", "backbone", "icanhaz", "v/jqplot.linechart", "m/datas",
    "jquery.jqplot", "plugins/jqplot.dateAxisRenderer.min", "plugins/jqplot.canvasAxisTickRenderer.min"],
    function($, Backbone, ich, jqLineChart, datas) {
    var d = new datas([], {queryString: "limit=1000&device_id__id=10"});

    new jqLineChart({
        el: $("#main"),
        collection: d,
        jqplotOptions: {
            title: "Wattage v Time",
            series: [
                {label: "The Gadget"},
            ],
            axes: {
                yaxis: {
                    min: 0,
                    max: 3000,
                    numberTicks: 15,
                },
                /*xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    tickOptions: {
                        formatString: "%Y-%m-%d %H:%M:%S",
                    },
                }*/
            },
        },
        variables: [
            "timestamp",
            "watt",
                
        ],
    });

    d.fetch();
});

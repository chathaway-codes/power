//require(["jquery", "v/jqplot", "v/jqplot.piechart", "v/jqplot.barchart", "v/jqplot.linechart", "m/coconuts", "m/actual_coconuts", "jquery.jqplot",
//    "plugins/jqplot.dateAxisRenderer.min", "plugins/jqplot.canvasAxisTickRenderer.min"], 
//    function($, jqChart, jqPieChart, jqBarChart, jqLineChart, coconuts, actual_coconuts) {
    "use strict";
function makeLineChart(el, collection, jqplotOptions, variables) {
        var chart =  new jqLineChart({
            el: el,
            collection: collection,
            jqplotOptions: jqplotOptions,
            variables: variables
        });
        
        return chart;
    }
    
    window.makeLineChart = makeLineChart;
//});

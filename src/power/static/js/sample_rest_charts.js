require(["jquery", "m/datas", "jquery.jqplot"], function($, datas) {
    "use strict";
/*    var my_datas = new datas;
    my_datas.fetch({async: false});*/

    // Our ajax data renderer which here retrieves a text file.
    // it could contact any source and pull data, however.
    // The options argument isn't used in this renderer.
    var ajaxDataRenderer = function(url, plot, options) {
      var ret = null;
      $.ajax({
	// have to use synchronous here, else the function
	// will return before the data is fetched
	async: false,
	url: url,
	dataType:"json",
	success: function(data) {
	  ret = data;
	}                                                                                                                                                                             
      });                                                                                                                                                                             
      // The returned data will need to be formatted to look like:                                                                                                                    
      //  [[x, xx, xxx, xxxx]]                                                                                                                                                        
      //  [[y, yy, yyy, yyyy]]                                                                                                                                                        
      var power = [];                                                                                                                                                                 
      var dates = [];                                                                                                                                                                 
      var data = [];                                                                                                                                                                  
      for(var o in ret['objects']) {
	  o = ret['objects'][o];
	  data.push([o['timestamp'], parseFloat(o['watt'])]);
	  power.push(parseFloat(o['watt']));
	  dates.push(o['timestamp']);
      }
      return [power];
    };
   
    // The url for our json data
    var jsonurl = "/api/raw/data/?format=json";
   
    // passing in the url string as the jqPlot data argument is a handy
    // shortcut for our renderer.  You could also have used the
    // "dataRendererOptions" option to pass in the url.
    var plot2 = $.jqplot('chart2', jsonurl,{
      title: "AJAX JSON Data Renderer",
      dataRenderer: ajaxDataRenderer,
      dataRendererOptions: {
	unusedOptionalUrl: jsonurl
      },
      axesDefaults: {
	  ticks: [],
      }
    });
})

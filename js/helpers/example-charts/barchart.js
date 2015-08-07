/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */





/*                        _                _        _
 *  _                    _                _        _
 * | |__  __ _  _ _  __ | |_   __ _  _ _ | |_     (_) ___
 * | '_ \/ _` || '_|/ _|| ' \ / _` || '_||  _| _  | |(_-<
 * |_.__/\__,_||_|  \__||_||_|\__,_||_|   \__|(_)_/ |/__/
 *                                              |__/
 *
 * This provides a simple bar-chart graph.
 *
 * Example usage:
 *   var chart1 = Barchart()
 *     .title('An example chart')
 *     .downloadCsv(true)
 *     .downloadSvg(true)
 *     .yAccessor(function (d) { return d.A1 });
 * */

define([], function() {
  'use strict';

  // This is the function that is called when you do something like:
  //   var chart1 = Barchart()
  return function module () {
    // Various internal, private variables of the module. These are within the function 'Closure'
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        // Defaults
        width = 500,
        height = 500,
        gap = 0,
        ease = 'linear', // Options: https://devdocs.io/d3/transitions#d3_ease
        svg, title, downloadCsv, downloadSvg,
        yAccessor = function (d) { return d },
        // Configuration
        cssPath = 'css/charts/barchart.css',
        namespace = 'barchart-'+(Math.random() * (9999 - 0) + 0),
        // Dispatcher for the 'customHover' event
        dispatch = d3.dispatch('customHover');

    // The exportable function
    var exports = function (_selection) {
      _selection.each(function(_data) {
        console.log(_data);
        _data = _data.map(yAccessor);
        console.log(_data);
        // If this is the first time that the function is called and no svg element exists, then
        // create it along with the main 'g' elements.
        if (!svg) {
          svg = d3.select(this)
            .append("svg")
            .classed("chart", true);
          var container = svg.append("g").classed("container-group", true);
          container.append("g").classed("chart-group", true);
          container.append("g").classed("x-axis-group axis", true);
          container.append("g").classed("y-axis-group axis", true);

          // Get CSS via AJAX and inject it inline so that it can be exported
          d3.text(cssPath+'?t=' + (new Date()).getTime(), function (err, text) {
            svg.append('style')
              .attr({type: 'text/css', media: 'screen'})
              .text(text);
          });

          // Add a listener to the window resize event and call itself
          d3.select(window).on('resize.'+namespace, function () {
            exports(_selection);
          });

          // Add title
          if (title) {
            $(this).prepend('<h2 class="chart-title">'+title+'</h2>');
          }
          // Add dropdown menu
          if ((downloadCsv || downloadSvg) && Modernizr.blobconstructor) {
            var $dropdown = $(this)
              .prepend('<div class="dropdown chart-options">'+
                '<button class="btn btn-default dropdown-toggle btn-xs" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
                  '<span class="caret"></span>'+
                '</button>'+
                '<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1"></ul>'+
              '</div>').children('.chart-options');
            if (downloadSvg) { $dropdown.children('.dropdown-menu').append('<li><a href="#" class="download">Download chart as SVG</a></li>') };
            if (downloadCsv) {
              $dropdown.children('.dropdown-menu')
                .append('<li><a href="#" class="downloadCsv">Download data in CSV</a></li>')
                .find('a.downloadCsv')
                .click(function (e) {
                  e.preventDefault();
                  var csvData = "";
                console.log(_data);
                // TODO make data into CSV
                _data.forEach(function (v) {
                  if (typeof v === 'object') {

                  } else {
                    return v;
                  }
                });
              })
            };
            $dropdown.children('.dropdown-toggle').dropdown();
          }
        }

        /*
         *  ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗    ██╗      ██████╗  ██████╗ ██╗ ██████╗
         * ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝    ██║     ██╔═══██╗██╔════╝ ██║██╔════╝
         * ██║     ███████║███████║██████╔╝   ██║       ██║     ██║   ██║██║  ███╗██║██║
         * ██║     ██╔══██║██╔══██║██╔══██╗   ██║       ██║     ██║   ██║██║   ██║██║██║
         * ╚██████╗██║  ██║██║  ██║██║  ██║   ██║       ███████╗╚██████╔╝╚██████╔╝██║╚██████╗
         *  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝ ╚═════╝
         */

        // Update width and height to match parent (this together with the chart redrawing on window resize makes it responsive)
        var _parentElement = d3.select(this).node();
        width = _parentElement.getBoundingClientRect().width;
        height = d3.max([height, _parentElement.getBoundingClientRect().height]);

        // Internal sizing of the chart and bars
        var chartW = width - margin.left - margin.right,
            chartH = height - margin.top - margin.bottom,
            barW = chartW / _data.length;

        // x and y scales and axis
        var x1 = d3.scale.ordinal()
          .domain(_data.map(function(d, i) { return i; }))
          .rangeRoundBands([0, chartW], 0.1);
        var y1 = d3.scale.linear()
          .domain([0, d3.max(_data, function(d, i) { return d; })])
          .range([chartH, 0]);
        var xAxis = d3.svg.axis()
          .scale(x1)
          .orient("bottom");
        var yAxis = d3.svg.axis()
          .scale(y1)
          .orient("left");

        // Transform the main 'svg' and axes into place.
        svg.transition().attr({width: width, height: height});
        svg.select(".container-group")
          .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

        svg.select(".x-axis-group.axis")
          .transition()
          .ease(ease)
          .attr({transform: "translate(0," + (chartH) + ")"})
          .call(xAxis);

        svg.select(".y-axis-group.axis")
          .transition()
          .ease(ease)
          .call(yAxis);

        // Couple of variables used to layout the individual bars.
        var gapSize = x1.rangeBand() / 100 * gap;
        var barW = x1.rangeBand() - gapSize;

        // Setup the enter, exit and update of the actual bars in the chart.
        // Select the bars, and bind the data to the .bar elements.
        var bars = svg.select(".chart-group")
        .selectAll(".bar")
        .data(_data);
        // If there aren't any bars create them
        bars.enter().append("rect")
          .classed("bar", true)
          .attr({x: chartW,
                 width: barW,
                 y: function(d, i) { return y1(d); },
                 height: function(d, i) { return chartH - y1(d); }
                })
          .on("mouseover", dispatch.customHover);
        // If updates required, update using a transition.
        bars.transition()
          .ease(ease)
          .attr({
          width: barW,
          x: function(d, i) { return x1(i) + gapSize / 2; },
          y: function(d, i) { return y1(d); },
          height: function(d, i) { return chartH - y1(d); }
        });
        // If exiting, i.e. deleting, fade using a transition and remove.
        bars.exit().transition().style({opacity: 0}).remove();
      });
    }




    // Getters and setters
    exports.title = function(_x) {
      if (!arguments.length) return title;
      title = _x;
      return this;
    };
    exports.downloadCsv = function(_x) {
      if (!arguments.length) return downloadCsv;
      downloadCsv = _x;
      return this;
    };
    exports.downloadSvg = function(_x) {
      if (!arguments.length) return downloadSvg;
      downloadSvg = _x;
      return this;
    };
    exports.yAccessor = function(func) {
      if (!arguments.length) return yAccessor;
      yAccessor = func;
      return this;
    };

    // Rebind 'customHover' event to the "exports" function, so it's available "externally" under the typical "on" method:
    d3.rebind(exports, dispatch, "on");

    // Return object
    return exports;
  };

});

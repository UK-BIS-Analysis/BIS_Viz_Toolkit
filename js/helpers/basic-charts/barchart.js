/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa, screen */





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
 *     .yAccessor(function (d) { return d.A1 });
 */

define(['helpers/basic-charts/_base'], function(Base) {
  'use strict';

  // This is the function that is called when you do something like: var chart1 = Barchart()
  return function module () {

    // Configuration variables
    var svg,
        dispatch = d3.dispatch('customHover'); // Dispatcher for the custom events

    // Variables that can be set with getters/setters below
    var yAccessor = function (d) { return d; };

    // The exportable function
    var exports = function (_selection) {
      _selection.each(function(_data) {

        // Instantiate base chart
        var _base = Base(this)
          .addResizeListener(exports, _selection)
          .addCSS('css/charts/barchart.css')
          .addDownloadSVGBahaviour('#chart1-downloadSvg', this)
          .addDownloadPNGBahaviour('#chart1-downloadPng', this)
          .addDownloadCSVBahaviour('#chart1-downloadCsv', _data);

        /*
         *  ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗    ██╗      ██████╗  ██████╗ ██╗ ██████╗
         * ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝    ██║     ██╔═══██╗██╔════╝ ██║██╔════╝
         * ██║     ███████║███████║██████╔╝   ██║       ██║     ██║   ██║██║  ███╗██║██║
         * ██║     ██╔══██║██╔══██║██╔══██╗   ██║       ██║     ██║   ██║██║   ██║██║██║
         * ╚██████╗██║  ██║██║  ██║██║  ██║   ██║       ███████╗╚██████╔╝╚██████╔╝██║╚██████╗
         *  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝ ╚═════╝
         */

        // If this is the first run and we don't have the reference to the SVG
        // node saved then get it. Note that the svg element is actually created
        // by the Base class and here we are only saving a D3 object with it.
        if (!svg) {
          svg = d3.select(this).select('svg');
          var container = svg.append("g").classed("container-group", true).classed("barchart", true);
          container.append("g").classed("chart-group", true);
          container.append("g").classed("x-axis-group axis", true);
          container.append("g").classed("y-axis-group axis", true);
        }

        // Main visualization variables
        var margin = { top: 20, right: 20, bottom: 40, left: 40 },
            width = 400,      // Width and height determine the chart aspect ratio
            height = 300,
            ratio = height/width,
            gap = 0,
            ease = 'linear';  // Options: https://devdocs.io/d3/transitions#d3_ease

        // Update width and height to match parent (this together with the chart redrawing on window resize makes it responsive)
        var _parentElement = d3.select(this).node();
        height = d3.min([$(window).height() - $('#navbar').height()*1.7, _parentElement.getBoundingClientRect().width * ratio]);
        width = _parentElement.getBoundingClientRect().width;

        // Internal sizing of the chart and bars
        var chartW = width - margin.left - margin.right,
            chartH = height - margin.top - margin.bottom,
            barW = chartW / _data.map(yAccessor).length;

        // x and y scales and axis
        var x1 = d3.scale.ordinal()
          .domain(_data.map(function(d, i) { return i; }))
          .rangeRoundBands([0, chartW], 0.1);
        var y1 = d3.scale.linear()
          .domain([0, d3.max(_data, function(d, i) { return yAccessor(d); })])
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
        barW = x1.rangeBand() - gapSize;

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
                 y: function(d, i) { return y1(yAccessor(d)); },
                 height: function(d, i) { return chartH - y1(yAccessor(d)); }
                })
          .on("mouseover", dispatch.customHover);
        // If updates required, update using a transition.
        bars.transition()
          .ease(ease)
          .attr({
          width: barW,
          x: function(d, i) { return x1(i) + gapSize / 2; },
          y: function(d, i) { return y1(yAccessor(d)); },
          height: function(d, i) { return chartH - y1(yAccessor(d)); }
        });
        // If exiting, i.e. deleting, fade using a transition and remove.
        bars.exit().transition().style({opacity: 0}).remove();
      });
    };




    // Custom getters and setters
    exports.yAccessor = function(func) {
      if (!arguments.length) { return yAccessor; }
      yAccessor = func;
      return this;
    };

    // Rebind 'customHover' event to the "exports" function, so it's available "externally" under the typical "on" method:
    d3.rebind(exports, dispatch, "on");

    // Return exports function
    return exports;
  };

});

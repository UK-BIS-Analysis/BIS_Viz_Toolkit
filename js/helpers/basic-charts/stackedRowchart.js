/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa, screen */





/*
 *       _              _            _                             _                _        _
 *   ___| |_  __ _  __ | |__ ___  __| | ___  _ _  ___ __ __ __ __ | |_   __ _  _ _ | |_     (_) ___
 *  (_-<|  _|/ _` |/ _|| / // -_)/ _` ||___|| '_|/ _ \\ V  V // _|| ' \ / _` || '_||  _| _  | |(_-<
 *  /__/ \__|\__,_|\__||_\_\\___|\__,_|     |_|  \___/ \_/\_/ \__||_||_|\__,_||_|   \__|(_)_/ |/__/
 *                                                                                        |__/
 * This provides a simple stacked-rowchart
 *
 * Example usage:
 *   var chart1 = Barchart()
 *     .accessor(function (d) { return { Answer1: d.A1} });
 *
 * The accessor is supposed to return an array of numbers which will be used to draw the stacked segments.
 */

define(['helpers/basic-charts/_baseChart'], function(BaseChart) {
  'use strict';

  // This is the function that is called when you do something like: var chart1 = Barchart()
  return function module () {

    // Internal variables
    var dispatch = d3.dispatch('select'); // Dispatcher for the custom events

    // The chart function is exported and configured in viz.js.
    // The draw method is called in a D3 chain such as d3.select('#chart').datum(records).call(stackedRowchart);
    var chart = new BaseChart();

    chart.draw = function (_selection) {

      _selection.each(function(_data) {

        chart.data = _data;

        // If this is the first run and we don't have the reference to the SVG
        // node saved then we create it along with a few other setup routines
        if (!chart.svg) {
          // Create the SVG
          chart.svg = chart.addSvg(this);
          // Add some behaviours
          chart.addResizeListener(chart.draw, _selection)
               .addCSS('css/charts/stackedRowchart.css')
               .setup(this);

          // Create containers for chart and axises
          var container = chart.svg.append('g').classed('container-group', true).classed('barchart', true);
          container.append('g').classed('chart-group', true);
          container.append('g').classed('x-axis-group axis', true);
          container.append('g').classed('y-axis-group axis', true);
        }

        /*
         *  ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗    ██╗      ██████╗  ██████╗ ██╗ ██████╗
         * ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝    ██║     ██╔═══██╗██╔════╝ ██║██╔════╝
         * ██║     ███████║███████║██████╔╝   ██║       ██║     ██║   ██║██║  ███╗██║██║
         * ██║     ██╔══██║██╔══██║██╔══██╗   ██║       ██║     ██║   ██║██║   ██║██║██║
         * ╚██████╗██║  ██║██║  ██║██║  ██║   ██║       ███████╗╚██████╔╝╚██████╔╝██║╚██████╗
         *  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝ ╚═════╝
         */

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
            barH = chartH / _data.length;

        // X and Y scales and axis
        var xScale = d3.scale.linear()
          .domain([0, d3.max(_data, function(d, i) {
            // Returns the sum of all elements in the array
            return chart.accessor(d).reduce(function (prev, curr) { return prev + curr.value; }, 0);
          })])
          .range([0, chartW]);
        var yScale = d3.scale.ordinal()
          .domain(_data.map(function(d, i) { return i; }))
          .rangeRoundBands([chartH, 0], 0.1);
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient('bottom');
        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient('left');

        // Color scale
        var color = d3.scale.category10();

        // Transform the main 'svg' and axes into place.
        chart.svg.transition().attr({width: width, height: height});
        chart.svg.select('.container-group')
          .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});
        chart.svg.select('.x-axis-group.axis')
          .transition()
          .ease(ease)
          .attr({transform: 'translate(0,' + (chartH) + ')'})
          .call(xAxis);
        chart.svg.select('.y-axis-group.axis')
          .transition()
          .ease(ease)
          .call(yAxis);


        // Determine bar and gap size.
        var gapSize = yScale.rangeBand() / 100 * gap;
        barH = yScale.rangeBand() - gapSize;

        // Setup the enter, exit and update of the actual bars and segments in the chart.
        // BIND: Select the bars, and bind the data to the .bar elements.
        var bars = chart.svg.select('.chart-group')
          .selectAll('.bar')
          .data(_data);
        // ENTER: Create elements that are not already in the DOM
        // Groups: g.bar
        bars.enter().append('g')
          .classed('bar', true)
          .attr('transform', function (d,i) {
            return 'translate(0,'+yScale(i)+')';
          });
        // Segments: rect.segment
        var segments = bars.selectAll('rect')
            .data(function(d) {
              return chart.accessor(d).map(function (curr, i, arr) {
                curr.base = arr.reduce(function (prev, curr, j, arr) {
                  return j < i ? prev + curr.value : prev;
                }, 0);
                return curr;
              });
            });
        segments.enter().append('rect')
          .classed('segment', true)
          .attr({
            x: function(d, i) { return xScale(d.base); },
            height: barH,
            fill: function(d, i) { return color(i); },
            width: function(d, i) { return xScale(d.value); }
          });

        // UPDATE: Update any elements that are in the DOM but have new data binded to them
        bars.transition()
          .ease(ease)
          .attr('transform', function (d,i) {
            return 'translate(0,'+yScale(i)+')';
          });
        segments.transition()
          .ease(ease)
          .attr({
            x: function(d, i) { return xScale(d.base); },
            height: barH,
            fill: function(d, i) { return color(i); },
            width: function(d, i) { return xScale(d.value); }
          });

        // EXIT: Remove any elements that no longer match data
        bars.exit().transition().style({opacity: 0}).remove();
        segments.exit().transition().style({opacity: 0}).remove();

        // Add tooltip
        chart.svg.call(chart.toolTip);
        segments
          .on('mouseover', chart.toolTip.show)
          .on('mouseout', chart.toolTip.hide);
      });

      // End of CHART LOGIC (normally no need to edit below here)

    };



    // Rebind custom dispatch events to the 'chart' function, so it's available 'externally' under the typical 'on' method:
    d3.rebind(chart, dispatch, 'on');

    // Return chart function
    return chart;
  };

});

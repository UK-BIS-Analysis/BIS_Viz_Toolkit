/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */

/*
 *                           __              __        _

 * This provides a bar-chart graph.
 * */

define([], function() {
  'use strict';

  return function (selector, chartgroup) {
    return dc.rowChart(selector, chartgroup)
      .width(180)
      .height(180)
      .margins({top: 20, left: 10, right: 10, bottom: 20})
      //.ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
      .label(function (d) {
          return d.key.split('.')[1];
      })
      .title(function (d) {
          return d.value;
      })
      .elasticX(true)
      //.xAxis().ticks(4);
  }

});

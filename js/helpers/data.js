/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */





/*
 *
 *
 *      _        _              _
 *   __| | __ _ | |_  __ _     (_) ___
 *  / _` |/ _` ||  _|/ _` | _  | |(_-<
 *  \__,_|\__,_| \__|\__,_|(_)_/ |/__/
 *                           |__/
 *
 * This is a requirejs module and therefore the file is wrapped in a define() function.
 * The module returns a function with chainable methods which act as getters and setters.
 *
 * This can be used for example like this in viz.js:
 * var vizData = data()
 *    .url('data/samples/questions.csv')
 *    .type('csv')
 *    .dimensions(['Q', 'Period', 'Question']);
 *
 * */

define([], function() {
  'use strict';

  return function () {

    // Internal variables
    var url, type, dimensions,
        // The crossfilter object, in some tutorials it's called ndx
        xf = {},
        // An object in which we will store all the dimensions we will create
        xfDims = {},
        // TODO: An object in which we will store all the groups we will create
        xfGroups = {},
        // The data object is the object we will return for consmption. It has all the
        // public methods and properties, including, getters and setters to access the
        // above properties which are in the closure.
        data = {};

    // The load function takes a config object with url, type and dimensions,
    // loads the data and then calls the callback function passing a new
    // crossfilter object as a parameter.
    data.load = function (callback) {
      // Return an error if not enough parameters are given.
      if (!url || !type) {
        callback('Insufficient data passed in data config object.');
        return;
      }
      // Load the data using the d3 fuction for the chosen data type.
      d3[type](url, function (err, rows) {
        // Place the resulting data into crossfilter
        xf = crossfilter(rows);
        // Add dimensions to crossfilter
        dimensions.forEach(function (dim) {
          xfDims[dim] = xf.dimension(function(d) { return d[dim]; });
        });
        // Callback
        callback(null, data);
      });
    };

    // Getters and setters
    data.url = function(value) {
      if (!arguments.length) { return url; }
      url = value;
      return data;
    };
    data.type = function(value) {
      if (!arguments.length) { return type; }
      type = value;
      return data;
    };
    data.dimensions = function(value) {
      if (!arguments.length) { return dimensions; }
      dimensions = value;
      return data;
    };
    // Getters only
    data.exposedFilters = function() {
      return exposedFilters;
    };
    data.xf = function() {
      return xf;
    };
    data.xfDims = function() {
      return xfDims;
    };

    return data;

  };
});

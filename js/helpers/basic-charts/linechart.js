/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */

/*
 *    __ _                 __              __        _
 *   / /(_)___  ___  ____ / /  ___ _ ____ / /_      (_)___
 *  / // // _ \/ -_)/ __// _ \/ _ `// __// __/_    / /(_-<
 * /_//_//_//_/\__/ \__//_//_/\_,_//_/   \__/(_)__/ //___/
 *                                             |___/
 * This provides a bar-chart graph.
 * */

define([], function() {
  'use strict';

  return function chart() {

    var width = 720, // default width
        height = 80; // default height

    function my(selection) {
      selection.each(function(d, i) {
        // generate chart here; `d` is the data and `this` is the element
      });
    }

    my.width = function(value) {
      if (!arguments.length) { return width; }
      width = value;
      return my;
    };

    my.height = function(value) {
      if (!arguments.length) { return height; }
      height = value;
      return my;
    };

    return my;
  };

});

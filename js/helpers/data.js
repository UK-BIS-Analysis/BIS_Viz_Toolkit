/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
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
 * This is inspired by the dataManager module from the book "Developing a D3.js Edge" by Roland Dunn & Ger Hobbelt & Andrew Thornton & Chris Viau & Troy Mott, 2015 Bleeding Edge Press
 *
 * Example usage:
 *   var data = dataManager()
 *     .load('data/samples/questions.csv', 'csv')
 *     .on('dataUpdate', function (records) {
 *       console.log(records);
 *     });
 *
 * */

define([], function() {
  'use strict';

  return function module () {

    // Chainable exportable function
    var exports = function () { return this; },
        // Internal variables
        dispatch = d3.dispatch('dataUpdate', 'dataLoading'),
        data,
        // Crossfilter & dimensions
        xf = crossfilter(),
        dims = {};




    /*
     * data.load
     * A method that loads a data file, applies a cleaning function asynchronously.
     */
    exports.load = function(_file, _type, _cleaningFunc) {

      // If _type is not csv, tsv or json then return an error
      if (['csv', 'tsv', 'json'].indexOf(_type) === -1) { throw 'Unrecognized or unspecified data type.'; }

      // Create the request using d3.
      var loadCsv = d3[_type](_file);

      // On the progress event, dispatch the custom dataLoading event.
      loadCsv.on('progress', function() { dispatch.dataLoading(d3.event.loaded);});

      // Launch a get request for the data file
      loadCsv.get(function (_err, _response) {
        if (_err) { throw _err; };

        // If a a cleaning function is supplied then apply it.
        if (typeof _cleaningFunc === 'function') {
          _response.forEach(function (d) { _cleaningFunc(d); });
        }

        //Assign the cleaned response to our data variable.
        data = _response;

        //Add data to our Crossfilter.
        xf.add(_response);

        //Dispatch our custom dataUpdate event passing in the cleaned data.
        dispatch.dataUpdate(_response);
      });

      // Return self so that the function is chainable
      return this;
    };




    /*
     * data.addDim
     * A method that creates a new dimension on the crossfilter.
     */
    exports.setDim = function (_dim) {

      // Create the dimension if it does not exist yet
      if (!dims[_dim]) {
        dims[_dim] = xf.dimension(function (d) {
          return d[_dim];
        });
      }

      // Return self so that the function is chainable
      return this;
    };




    /*
     * data.getDim
     * Create a method to get a crossfilter dimension
     */
    exports.getDim = function (_dim) {
      return dims[_dim];
    }




    /*
     * data.filter
     * Create a method to apply a filter all crossfilter values are supported:
     *  data.filter([100, 200]); // selects values between 100 and 200
     *  data.filter(120); // selects values equal to 120
     *  data.filter(function(d) { return d % 2; }); // selects values which are odd
     *  data.filter(null); // selects all values
     */
    exports.filter = function (_dim, filter) {
      dims[_dim].filter(filter);
      console.log('New filtered data: %o', dims[_dim].top(Infinity));
      dispatch.dataUpdate(dims[_dim].top(Infinity));
    }




    /*
     * data.getData
     * Create a method to access the cleaned data.
     */
    exports.getData = function () {
      return data;
    };




    /*
     * data.getCrossfilterSize
     * Create a method to get the size of our crossfilter
     */
    exports.getCrossfilterSize = function () {
      return xf.size();
    };




    // Bind the 'on' event of the dispatch object to the exportable data module itself.
    d3.rebind(exports, dispatch, 'on');

    // Return object
    return exports;

  };
});

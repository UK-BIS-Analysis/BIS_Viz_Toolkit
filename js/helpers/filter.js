/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */





/*                 _              _          _
 *   __  ___  _ _ | |_  _ _  ___ | | ___    (_) ___
 *  / _|/ _ \| ' \|  _|| '_|/ _ \| |(_-< _  | |(_-<
 *  \__|\___/|_||_|\__||_|  \___/|_|/__/(_)_/ |/__/
 *                                        |__/
 *
 * This is a requirejs module and therefore the file is wrapped in a define() function.
 *
 * Example usage:
 *   var controls = Controls()
 *     .attach(data)
 *     .draw('Q', 'Question', '#qFilter');
 *
 * */

define([], function() {
  'use strict';

  return function module () {
    // Chainable exportable function
    var exports = {},
        // Internal variables and functions
        internal = {},
        dispatch = d3.dispatch('filtered'),
        options = [],
        data;

    /*
     * controls.attach
     * A method that attaches the data object
     */
    exports.attach = function (_data) {
      data = _data;
      return this;
    };

    /*
     * controls.add
     * A method that adds
     */
    exports.add = function (_dim, _label, _selector) {
      internal.draw(_dim, _selector);
      data.on('dataUpdate.filter'+_dim, function (records) {
        // Update options array
        options = internal.getOptions(_dim);
        // If a filter is set on _dim then update the dropdown and trigger an internal change
        if (data.filter(_dim)) {
          $(_selector).val(data.filter(_dim)).trigger('change', [true]);
        }
      });
      return this;
    };

    /*
     * internal.draw
     * A method that draws the select2 widget on screen
     */
    internal.draw = function (_dim, _selector) {
      // Create a select control in the specified selector
      var $select = $(_selector)
        .select2({
          minimumResultsForSearch: 20,
          data: function () { return options; },
          dropdownAutoWidth : true
          // placeholder: _label,
          // theme: 'classic',
        });

      // When value is changed update data object with filter
      $select.on('change', function (evt, internal) {
        if (!internal) {
          var newValue = ($select[0].value !== '') ? $select[0].value : null;
          data.filter(_dim, newValue);
        }
      });
    };

    internal.getOptions = function (_dim) {
      // The data function is run each time the dropdown is opened
      var options = data
        .getDim(_dim)
        .group()
        .top(Infinity)
        .map(function(v) {
          return {
            id: v.key,
            text: v.key + ' ('+v.value+')',
            disabled: v.value === 0
          };
        })
        .sort(function (a,b) {
          if(a.id < b.id) { return -1; }
          if(a.id > b.id) { return 1; }
          return 0;
        });
      return { results: options };
    };

    // Bind the 'on' event of the dispatch object to the exportable data module itself.
    d3.rebind(exports, dispatch, 'on');

    // Return object
    return exports;
  };
});

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
    var exports = function () { return this; },
        // Internal variables
        dispatch = d3.dispatch('filtered'),
        data;

    /*
     * controls.attach
     * A method that attaches the data object
     */
    exports.attach = function (_data) {
      data = _data;
      return this;
    }


    /*
     * controls.draw
     * A method that draws the select2 widget on screen
     */
    exports.draw = function (_dim, _label, _selector) {
      // Create a select control in the specified selector
      var $select = $(_selector)
        .select2({
            allowClear: true,
            placeholder: _label,
            minimumResultsForSearch: 20,
            theme: 'classic',
            data: function () {
              var options = data.getDim(_dim).group().top(Infinity).map(function(v) {
                return {
                  id: v.key,
                  text: v.key + ' ('+v.value+')',
                  disabled: v.value === 0
                }
              }).sort(function (a,b) {
                return a.id > b.id;
              });
              return { results: options }
            }
          });

      // In order to add multiple event listeners we namespace them with the name of the dimension
      //data.on('dataUpdate.'+_dim, function () {$select.select2("updateResults")});

      // When value is changed
      $select.on('change', function (evt) {
        var newValue = ($select[0].value != '') ? $select[0].value : null;
        console.log('Filter set from dropdown: '+_dim+' = '+newValue);
        data.filter(_dim, newValue);
      });

      return this;
    }


    // Bind the 'on' event of the dispatch object to the exportable data module itself.
    d3.rebind(exports, dispatch, 'on');

    // Return object
    return exports;
  }
});

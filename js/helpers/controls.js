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
     * controls.add
     * A method that adds
     */
    exports.add = function (_dim, _label, _selector) {
      exports.draw(_dim, _label, _selector);
      data.on('dataUpdate.filter'+_dim, function (records) {
        if (data.filter(_dim)) {
          $(_selector).val(data.filter(_dim)).trigger('change', [true]);
        }
        // TODO make sure size of widget is suitable
        //
      });
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
          // placeholder: _label,
          minimumResultsForSearch: 20,
          //theme: 'classic',
          data: function () {
            // The data function is run each time the dropdown is opened
            var options = data.getDim(_dim).group().top(Infinity)
              .map(function(v) {
                return {
                  id: v.key,
                  text: v.key + ' ('+v.value+')',
                  disabled: v.value === 0
                }
              })
              .sort(function (a,b) {
                if(a.id < b.id) return -1;
                if(a.id > b.id) return 1;
                return 0;
              });
            return { results: options }
          },
//          initSelection: function(element, callback) {
//            if (data.filter(_dim)) {
//              // TODO set it according to filter
//              return;
//            }
//
//            //callback({id: options[0].id, text: options[0].text});
//          },
        });

      // In order to add multiple event listeners we namespace them with the name of the dimension
      //data.on('dataUpdate.'+_dim, function () {$select.select2("updateResults")});

      // When value is changed
      $select.on('change', function (evt, internal) {
        if (!internal) {
           var newValue = ($select[0].value != '') ? $select[0].value : null;
          //console.log('Filter set from dropdown: '+_dim+' = '+newValue);
           data.filter(_dim, newValue);
        }
      });

      return this;
    }


    // Bind the 'on' event of the dispatch object to the exportable data module itself.
    d3.rebind(exports, dispatch, 'on');

    // Return object
    return exports;
  }
});

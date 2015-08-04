/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */

define([], function() {
  'use strict';

  var $controls = [];

  var controls = {

    draw2: function (selector, xfDim, type) {

    },

    // Creates the controls with all values available.
    draw: function (selector, data) {

      var exposedFilters = data.exposedFilters();

      exposedFilters.forEach(function (dim) {
        // Get values of the dimension
        var values = data.xfDims()[dim].top(Infinity),
            uniques = [];
        // Get unique values for dimension (AKA remove duplicates) and sort
        $.each(values, function(i, d){
          if($.inArray(d[dim], uniques) === -1) { uniques.push(d[dim]); }
        });
        uniques.sort();
        // Check if a control already exists

        // Create a select control
        var $select = $(selector).append($('<select><option></option></select>').attr('id', 'dimFilter-'+dim)).children('#dimFilter-'+dim).select2({
          allowClear: true,
          placeholder: dim,
          data: uniques
        });
        // Add label
        $select.before('<label for="'+'dimFilter-'+dim+'">'+dim+':</label>');
        // Trigger a 'change' event on the data object when the control is changed
        $select.on('change', function (evt) {
          data.xfDims()[dim].filter($select[0].value);
          $(data).trigger('change');
        });



//        var $select = $(selector).append($('<select class="form-control"></select>').attr('id', 'dimFilter-'+dim)).children('#dimFilter-'+dim);
//        $.each(uniques, function(k, v) {
//          $select.append($("<option></option>")
//            .attr("value",v)
//            .text(v));
//        });
//        // Add label
//        $select.before('<label for="'+'dimFilter-'+dim+'">'+dim+':</label>');
//        // Trigger a 'change' event on the data object when the control is changed
//        $select.on('change', function (evt) {
//          data.xfDims()[dim].filter($select[0].value);
//          $(data).trigger('change');
//        });
//        // React on change event
//        $(data).on('change', function () {
//          controls.draw(selector, data);
//        });
      });
    }



  };

  return controls;
});

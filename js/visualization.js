/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, require, window, DEBUG */

/*
 *         _                     _  _             _    _                    _
 * __   __(_) ___  _   _   __ _ | |(_) ____ __ _ | |_ (_)  ___   _ __      (_) ___
 * \ \ / /| |/ __|| | | | / _` || || ||_  // _` || __|| | / _ \ | '_ \     | |/ __|
 *  \ V / | |\__ \| |_| || (_| || || | / /| (_| || |_ | || (_) || | | | _  | |\__ \
 *   \_/  |_||___/ \__,_| \__,_||_||_|/___|\__,_| \__||_| \___/ |_| |_|(_)_/ ||___/
 *                                                                       |__/
 * THIS RUNS THE MAIN LOGIC OF THE Visualization
 * It wraps everything in the requirejs callback function and calls the necessary helpers as dependencies.
 * For most visualizations this is the only js file you would need to edit.
 * */

// Add a timestamp to the query to avoid browser caching
require.config({
    urlArgs: "build=" + (new Date()).getTime()
});

// Require dependencies
require(['helpers/gui', 'helpers/data', 'helpers/filters'], function(gui, data, filters) {
  'use strict';

  // This jQuery callback makes sure that all code is run after the document and scripts have all loaded properly
  $(document).ready(function () {

    // Use Modernizr to check for broweser requirements and if they are not met display an error in a modal and don't load anything else.
    if (Modernizr.svg) {
      $('#modal').modal({ remote: 'pages/error.html'});
      return;
    }

    // Setup GUI behaviours
    gui.setup();




  });     // Close $(document).ready
});       // Close require

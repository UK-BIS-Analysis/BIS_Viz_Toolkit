/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nonew: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, require, window, DEBUG */

// Add a timestamp to the query to avoid browser caching
require.config({ urlArgs: "build=" + (new Date()).getTime() });



/*
 *
 *       _          _
 * __ __(_) ___    (_) ___
 * \ V /| ||_ / _  | |(_-<
 *  \_/ |_|/__|(_)_/ |/__/
 *               |__/
 *
 * This file runs the main logic of the visualization.
 * It wraps everything in the requirejs callback function and calls the necessary modules as dependencies.
 *
 * The file is split into three main steps:
 *   (1) Define the data source(s)
 *   (2) Define any data filters
 *   (3) Define charts. You may need or want to edit the modules.
 *   (4) Run the actual data loading and rendering of charts
 *
 * The entire file is wrapped in the require function (see http://requirejs.org/) which takes two arguments:
 *    - An array of paths to module files (without ".js" at the end)
 *    - A callback function which gets passed the objects returned by each of the modules, in the order they were specified.
 *      Please note that modules have capitalized names. Instances below will have lower cases names.
 * Then it is wrapped in the jQuery $(document).ready callback to make sure the DOM has completed loading.
 * */
require(['helpers/gui', 'helpers/data', 'helpers/controls', 'helpers/basic-charts/barchart', 'helpers/basic-charts/stackedRowchart'], function(gui, Data, Filter, Barchart, StackedRowchart) {
  'use strict';
  $(document).ready(function () {

    // Setup GUI behaviours
    gui.setup();

    // Use Modernizr to check for browser requirements and if they are not met display an error in a modal and don't load anything else.
    if (!Modernizr.svg) {
      $('#modal').modal({ remote: 'pages/error.html'});
      return;
    }

    /*
     * ███████╗████████╗███████╗██████╗      ██╗
     * ██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ███║
     * ███████╗   ██║   █████╗  ██████╔╝    ╚██║
     * ╚════██║   ██║   ██╔══╝  ██╔═══╝      ██║
     * ███████║   ██║   ███████╗██║          ██║
     * ╚══════╝   ╚═╝   ╚══════╝╚═╝          ╚═╝ : Define data and dimensions
     *
     * Start here. Set the URL and dimensions of your data.
     * - Url can be relative to index.html (e.g. 'data/samples/questions.csv') or absolute (e.g. 'http://www.example.com/data.json')
     * - Type can be csv, tsv or json
     * - Dimensions are the columns in your data that you want to be able to filter by (more than 8 dimensions are not recommended)
     * You can load multiple data sources by creating different variables (e.g. data1, data2...)
     *
     * Example:
     *  var data = Data()
     *    .load('data/samples/questions.csv', 'csv')
     *    .setDim('Question');
     *
     */
    var data = Data()
      .load('data/samples/questions.csv', 'csv')
      .setDim('Question')
      .filter('Question', 'Q01 Question one?');




    /*
     * ███████╗████████╗███████╗██████╗     ██████╗
     * ██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ╚════██╗
     * ███████╗   ██║   █████╗  ██████╔╝     █████╔╝
     * ╚════██║   ██║   ██╔══╝  ██╔═══╝     ██╔═══╝
     * ███████║   ██║   ███████╗██║         ███████╗
     * ╚══════╝   ╚═╝   ╚══════╝╚═╝         ╚══════╝ : Define and draw any filters
     *
     * Filters are drop down menus that expose the dimensions to the user similarly to the auto-filters in Excel.
     *
     * Example:
     * var controls = Controls()
     *   .attach(data)
     *   .draw('Question', 'Question', '#qFilter')
     *
     */
    var questionControl = Filter()
      .attach(data)
      .add('Question', 'Question', '#qFilter');




    /*
     * ███████╗████████╗███████╗██████╗     ██████╗
     * ██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ╚════██╗
     * ███████╗   ██║   █████╗  ██████╔╝     █████╔╝
     * ╚════██║   ██║   ██╔══╝  ██╔═══╝      ╚═══██╗
     * ███████║   ██║   ███████╗██║         ██████╔╝
     * ╚══════╝   ╚═╝   ╚══════╝╚═╝         ╚═════╝  : Define charts
     *
     * Setup any charts.
     *
     */

    // Initialize and configure the charts
    var barchart = Barchart()
      .accessor(function (d) { return d.A1; });

    var stackedRowchart = StackedRowchart()
      .accessor(function (d) { return [parseFloat(d.A1), parseFloat(d.A2), parseFloat(d.A3), parseFloat(d.A4), parseFloat(d.A5)]; });

    // Bind the drawing of the functions to any update in the data
    data.on('dataUpdate', function (records) {
      console.log('data update called');
      d3.select('#chart1-barchart')
        .datum(records).call(barchart);

      d3.select('#chart2-stackedRowchart')
        .datum(records).call(stackedRowchart);

    });

  });   // Close $(document).ready
});     // Close require

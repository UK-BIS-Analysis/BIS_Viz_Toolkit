/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
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
require(['helpers/gui', 'helpers/data', 'helpers/filter', 'helpers/basic-charts/barchart', 'helpers/basic-charts/rowchart', 'helpers/basic-charts/linechart'], function(gui, Data, Filter, Barchart, Rowchart, Linechart) {
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
     * - Url can be relative to index.html (e.g. 'data/samples/questions.csv')
     *   or absolute (e.g. 'http://www.example.com/data.json')
     * - Type can be csv, tsv or json
     * - Dimensions are the columns in your data that you want to be able to filter by.
     *   More than 8 dimensions are not recommended.
     *   Ensure that dimension names are unique even if you use different data sources.
     *   It's best to use column names that do not use spaces or special charachters.
     * You can load multiple data sources by creating different variables (e.g. data1, data2...)
     *
     * Example:
     *  var data = Data()
     *    // Usage: .load(filepath, filetype, dataCleaningFunc)
     *    .load('data/samples/questions.csv', 'csv')
     *    // Usage .setDim(dimensionName)
     *    .setDim('Question');
     *
     */
    var data = new Data()
      .load('data/samples/questions.csv', 'csv')
      .setDim('Question')
      .filter('Question', 'Q01 Question one?', true);

    var secondaryData = new Data()
      .load('data/samples/gdp.csv', 'csv')
      .setDim('quarterName')
      .filter('quarterName', '1997 Q2', true);



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
    var questionControl = new Filter()
      .attach(data)
      .add('Question', 'Question', '#qFilter');

    var gdpControl = new Filter()
      .attach(secondaryData)
      .add('quarterName', 'Quarter', '#gdpFilter');



    /*
     * ███████╗████████╗███████╗██████╗     ██████╗
     * ██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ╚════██╗
     * ███████╗   ██║   █████╗  ██████╔╝     █████╔╝
     * ╚════██║   ██║   ██╔══╝  ██╔═══╝      ╚═══██╗
     * ███████║   ██║   ███████╗██║         ██████╔╝
     * ╚══════╝   ╚═╝   ╚══════╝╚═╝         ╚═════╝  : Define charts
     *
     * Setup the charts.
     * The accessor function should return an array of objects.
     * Each object should have a label and a value property.
     * Values should be numerical (integer or float)
     *
     */

    // Initialize and configure the chart drawing functions
    var chart1 = new Rowchart()
      .addDownloadSVGBehaviour('#chart2-downloadSvg')
      .addDownloadPNGBehaviour('#chart2-downloadPng')
      .addDownloadCSVBehaviour('#chart2-downloadCsv')
      .addXaxisTitle('Percent (%)')
      .addYaxisTitle('Period')
      .xAxisTickFormat(d3.format('%'))
      .yAccessor(function (d, i) {
        return d.Period;
      })
      .xAccessor(function (d, i) {
        return [
          { label: 'Strongly disagree', value: parseFloat(d.A5), displayValue: d3.format('%')(d.A5) },
          { label: 'Disagree', value: parseFloat(d.A4), displayValue: d3.format('%')(d.A4) },
          { label: 'Neither agree nor disagree', value: parseFloat(d.A3), displayValue: d3.format('%')(d.A3) },
          { label: 'Agree', value: parseFloat(d.A2), displayValue: d3.format('%')(d.A2) },
          { label: 'Strongly agree', value: parseFloat(d.A1), displayValue: d3.format('%')(d.A1) }
        ];
      });

    var chart2 = new Barchart()
      .addDownloadSVGBehaviour('#chart1-downloadSvg')
      .addDownloadPNGBehaviour('#chart1-downloadPng')
      .addDownloadCSVBehaviour('#chart1-downloadCsv')
      .addXaxisTitle('Period')
      .addYaxisTitle('Percent (%)')
      .yAxisTickFormat(d3.format('%'))
      .xAccessor(function (d, i) { return d.Period; })
      .yAccessor(function (d, i) {
        return [
          { label: 'Strongly agree', value: parseFloat(d.A1), displayValue: d3.format('%')(d.A1) },
          { label: 'Agree', value: parseFloat(d.A2), displayValue: d3.format('%')(d.A2) },
          { label: 'Neither agree nor disagree', value: parseFloat(d.A3), displayValue: d3.format('%')(d.A3) },
          { label: 'Disagree', value: parseFloat(d.A4), displayValue: d3.format('%')(d.A4) },
          { label: 'Strongly disagree', value: parseFloat(d.A5), displayValue: d3.format('%')(d.A5) }
        ];
      });

    var chart3 = new Linechart()
      .addDownloadSVGBehaviour('#chart3-downloadSvg')
      .addDownloadPNGBehaviour('#chart3-downloadPng')
      .addDownloadCSVBehaviour('#chart3-downloadCsv')
      .addXaxisTitle('Period')
      .addYaxisTitle('Percent (%)')
      .yAxisTickFormat(d3.format('%'))
      .xAccessor(function (d, i) { return d.Period; })
      .yAccessor(function (d, i) {
        return [
          { label: 'Strongly agree', value: parseFloat(d.A1), displayValue: d3.format('%')(d.A1) },
          { label: 'Agree', value: parseFloat(d.A2), displayValue: d3.format('%')(d.A2) }
        ];
      });


    /*
     * ███████╗████████╗███████╗██████╗     ██╗  ██╗
     * ██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ██║  ██║
     * ███████╗   ██║   █████╗  ██████╔╝    ███████║
     * ╚════██║   ██║   ██╔══╝  ██╔═══╝     ╚════██║
     * ███████║   ██║   ███████╗██║              ██║
     * ╚══════╝   ╚═╝   ╚══════╝╚═╝              ╚═╝ : Bind drawing functions to updates in the data
     *
     */
    data.on('dataUpdate', function (records) {
      d3.select('#chart1')
        .datum(records).call(chart1.draw);
      d3.select('#chart2')
        .datum(records).call(chart2.draw);
      d3.select('#chart3')
        .datum(records).call(chart3.draw);
    });

    secondaryData.on('dataUpdate', function (records) {
      // Update charts that depend on the secondary data
    });


  });   // Close $(document).ready
});     // Close require

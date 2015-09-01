/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa, saveAs, Blob, unescape */





/*      _                        _
 *     | |__  __ _  ___ ___     (_) ___
 *     | '_ \/ _` |(_-</ -_) _  | |(_-<
 *  ___|_.__/\__,_|/__/\___|(_)_/ |/__/
 * |___|                      |__/
 * This module provides some basic functionality across charts
 *
 */

define([], function() {
  'use strict';

  // This is the function that is called when you do something like: var chart = new BaseChart()
  return function module () {

    // Internal closure vars
    var svg,
        xAccessor = function (d) { return d; },
        yAccessor = function (d) { return d; },
        setupTasks = [];

    // The exportable function, this is the object returned and that has all the methods to work as a base for other charts.
    var baseChart = function () { return this; };

    baseChart.addSvg = function (selector) {
      if (!svg || svg.size() === 0) {
        svg = d3.select(selector)
                .append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('version', '1.1');
      }
      return svg;
    };

    baseChart.setup = function (selection) {
      setupTasks.forEach(function(task) {
        task(selection);
      });
    };

    baseChart.xAccessor = function(f) {
      // If passed a function as argument then set accessor
      if (arguments.length === 1 && typeof f === 'function') {
        xAccessor = f;
        return this;
      }
      // Otherwise run the current accessor and return results
      return xAccessor.apply(this, arguments);
    };

    baseChart.yAccessor = function(f) {
      // If passed a function as argument then set accessor
      if (arguments.length === 1 && typeof f === 'function') {
        yAccessor = f;
        return this;
      }
      // Otherwise run the current accessor and return results
      return yAccessor.apply(this, arguments);
    };

    baseChart.addResizeListener = function (func, sel) {
      $(window).on('resize', function () {
        func(sel);
      });
      return this;
    };

    baseChart.addCSS = function (_url) {
      if (svg.select('defs').size() > 0) { return this; }
      var defs = svg.append('defs');
      d3.text(_url, function (err, text) {
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.innerHTML = '/* <![CDATA[ */' + text + '/* ]]> */';
        defs.node().appendChild(s);
      });
      return this;
    };

    baseChart.addDownloadCSVBehaviour = function (_link) {
      setupTasks.push(function (selection) {
        d3.select(_link).on('click', function (evt) {
          var arr = baseChart.data,
              csvStr = '';

          arr.forEach(function (currLine) {
            var line = '',
                currCol;
            for (currCol in currLine) {
              if (currLine.hasOwnProperty(currCol)) {
                if (line !== '') { line += ','; }
                line += currLine[currCol];
              }
            }
            csvStr += line + '\r\n';
          });

          var blob = new Blob([csvStr], {type: 'text/plain;charset=utf-8'});
          saveAs(blob, 'data.csv');
        });
      });
      return this;
    };

    baseChart.addDownloadSVGBehaviour = function (_link) {
      setupTasks.push(function (selection) {
        d3.select(_link).on('click', function (evt) {
          var outer = document.createElement('div');
          outer.appendChild(d3.select(selection).select('svg').node().cloneNode(true));
          var blob = new Blob([outer.innerHTML], {type: 'text/plain;charset=utf-8'});
          saveAs(blob, 'chart.svg');
        });
      });
      return this;
    };

    baseChart.addDownloadPNGBehaviour = function (_link) {
      setupTasks.push(function (selection) {
        d3.select(_link).on('click', function (evt) {
          var outer = document.createElement('div');
          outer.appendChild(d3.select(selection).select('svg').node().cloneNode(true));
          var xml = '<?xml version="1.0" standalone="no"?>\n'+
                        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+
                        outer.innerHTML;
          var image = new Image();
          image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(xml)));
          image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            var a = document.createElement('a');
            a.download = 'image.png';
            a.href = canvas.toDataURL('image/png');
            document.body.appendChild(a);
            a.click();
          };
        });
      });
      return this;
    };

    baseChart.toolTip = d3.tip()
      .attr('class', 'd3-tip d3-tip-stackedRowchart')
      .html(function(d) { return d.label + ': ' + d.displayValue; });

    baseChart.addXaxisTitle = function (title) {
      this.xAxisTitle = title;
      return this;
    };

    baseChart.addYaxisTitle = function (title) {
      this.yAxisTitle = title;
      return this;
    };

    // TickFormat getter/setter
    var _xAxisTickFormat = null;
    baseChart.xAxisTickFormat = function (format) {
      if (arguments.length === 1) {
        _xAxisTickFormat = format;
        return this;
      }
      return _xAxisTickFormat;
    };
    var _yAxisTickFormat = null;
    baseChart.yAxisTickFormat = function (format) {
      if (arguments.length === 1) {
        _yAxisTickFormat = format;
        return this;
      }
      return _yAxisTickFormat;
    };

    // TODO:
    // legends?


    return baseChart;
  };

});

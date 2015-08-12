/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa, saveAs */





/*      _                        _
 *     | |__  __ _  ___ ___     (_) ___
 *     | '_ \/ _` |(_-</ -_) _  | |(_-<
 *  ___|_.__/\__,_|/__/\___|(_)_/ |/__/
 * |___|                      |__/
 * This module provides some basic functionality across charts
 *
 * check http://stackoverflow.com/a/25751945/3702554
 */

define([], function() {
  'use strict';

  return function module (_selector) {
    // Internal vars
    var svg = d3.select(_selector).select('svg');
    if (svg.size() === 0) {
      svg = d3.select(_selector)
              .append('svg')
              .attr('xmlns', 'http://www.w3.org/2000/svg')
              .attr('version', '1.1');
    }

    // Exportable function
    var exports = function () { return this };

    exports.addResizeListener = function (func, sel) {
      $(window).on('resize', function () {
        func(sel);
      });
      return this;
    };

    exports.addCSS = function (_url) {
      if (svg.select('defs').size() > 0) { return this; }
      var defs = svg.append('defs');
      d3.text(_url, function (err, text) {
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.innerHTML = '/* <![CDATA[ */' + text + '/* ]]> */';
        defs.node().appendChild(s);
      });
      return this;
    }

    exports.addDownloadCSVBahaviour = function (_link, _data) {
      d3.select(_link).on('click', function (evt) {
        var array = typeof _data != 'object' ? JSON.parse(_data) : _data,
            csvStr = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += array[i][index];
            }
            csvStr += line + '\r\n';
        }
        var blob = new Blob([csvStr], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'data.csv');
      })
      return this;
    };

    exports.addDownloadSVGBahaviour = function (_link) {
      d3.select(_link).on('click', function (evt) {
        var outer = document.createElement('div');
        outer.appendChild(d3.select(_selector).select('svg').node().cloneNode(true));
        var blob = new Blob([outer.innerHTML], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'chart.svg');
      });
      return this;
    };

    exports.addDownloadPNGBahaviour = function (_link) {
      d3.select(_link).on('click', function (evt) {
        var outer = document.createElement('div');
        outer.appendChild(d3.select(_selector).select('svg').node().cloneNode(true));
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
        }
      });
      return this;
    };

    // TODO:
    // exports.addXaxisTitle
    // exports.addYaxisTitle
    // exports.xTickFormat
    // exports.yTickFormat
    // legends?


    return exports;
  };

});

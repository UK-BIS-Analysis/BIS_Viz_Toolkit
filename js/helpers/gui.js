/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, queryObject, btoa */

/*
 *               _      _
 *  __ _  _   _ (_)    (_) ___
 * / _` || | | || |    | |/ __|
 *  (_| || |_| || | _  | |\__ \
 * \__, | \__,_||_|(_)_/ ||___/
 * |___/             |__/
 * THIS RUNS THE MAIN LOGIC OF THE Visualization
 * It wraps everything in the requirejs callback function and calls the necessary helpers as dependencies.
 * */

define([], function() {
  'use strict';

  var gui = {

    setup: function () {

      // Declare a global boolean DEBUG variable which we'll use to switch on or off console.log messages
      if (typeof DEBUG === 'undefined') {
        window.DEBUG = true;
      }

      // ADD SPECIFIC MENU BEHAVIOURS
      // Calls to modals: this tweak empties modals after every display making the modal code re-usable
      // (see http://stackoverflow.com/a/18134067)
      $('body').on('hidden.bs.modal', '#modal', function () {
        $(this).removeData('bs.modal');
      });
      // Share links: build links with http://www.sharelinkgenerator.com if needed
      var winTop = (screen.height / 2) - (520 / 2),
          winLeft = (screen.width / 2) - (350 / 2);
      $('#facebookShareLink').on('click', function (e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u='+window.location.href, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + 520 + ',height=' + 350);
      });
      $('#tweetLink').on('click', function (e) {
        e.preventDefault();
        window.open('https://twitter.com/share?url='+window.location.href, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + 520 + ',height=' + 350);
      });

    } // close setup()

  }; // close gui
  return gui;
});

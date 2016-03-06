(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradityFilters', []).
  filter('foldDeletedComments', function() {
    return function(input) {
      if (!input || !input.length)
        return input;
      
      var currentHead = null;
      for (var i = 0; i < input.length; ++i) {
        if (input[i].isDeleted) {
          if (currentHead === null) {
              currentHead = input[i];
              currentHead.trailingCount = 1;
              currentHead.isHead = true;
          } else {
            currentHead.trailingCount++;
            input[i].isHead = false;
            input[i].head = currentHead;
          }
        } else {
          currentHead = null;
        }
      }
      
      return input;
    };
  });

})();

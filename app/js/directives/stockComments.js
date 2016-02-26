/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() { 'use strict';

angular.module('tradity').
  directive('stockComments', function($compile,stock) {
    function link(scope, element, attrs) {
      scope.fetchComments = function() {
        if (!scope.stockinfo || !scope.stockinfo.stocktextid) {
          return;
        }
        
        var isin = scope.stockinfo.stocktextid;
      
        if (scope.fetchingComments !== isin) {
          scope.fetchingComments = isin;
          
          stock.getComments(isin).then(function(comments) {
            if (comments === null) {
              comments = [];
            }
            
            scope.comments = comments;
          });
        }
      };
      
      scope.$on('visible-popover', scope.fetchComments);
      
      if (attrs.autoload !== 'false') {
        scope.$watch('stockinfo.stocktextid', scope.fetchComments);
      }
    }
    
    return {
      link: link,
      templateUrl: 'app/templates/stock.comments.html',
      scope:{
        stockinfo: '=',
        autoload: '@',
        embedder: '@'
      }
    };
  });

})();

(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('FeedblogsCtrl', function($scope, socket, gettextCatalog) {
    $scope.newblog = {
      bloguser: null,
      endpoint: null,
      category: null
    };
    
    $scope.addFeedblog = function() {
      if (!$scope.newblog.bloguser)
        $scope.newblog.bloguser = null;
      else
        $scope.newblog.bloguser = parseInt($scope.newblog.bloguser);
      
      var curScope = $scope;
      $scope.newblog.schoolid = null;
      
      while ($scope.newblog.schoolid == null && curScope) {
        if (curScope.schoolid)
          $scope.newblog.schoolid = curScope.schoolid;
        
        curScope = curScope.$parent;
      }
      
      return socket.post('/wordpress/addFeed', {
        data: $scope.newblog
      }).then(function(result) {
        if (result._success) {
          notification(gettextCatalog.getString('Ok!'), true);
          $scope.listWordpressFeeds();
        } else {
          notification(gettextCatalog.getString('Error: ') + JSON.stringify(data));
        }
      });
    };
    
    $scope.removeFeedblog = function(id) {
      return socket.delete('/wordpress/feeds/' + blogid).then(function(data) {
        if (data._success) {
          notification(gettextCatalog.getString('Ok!'), true);
          $scope.listWordpressFeeds();
        } else {
          notification(gettextCatalog.getString('Error: ') + JSON.stringify(data));
        }
      });
    };
    
    $scope.processBlogs = function() {
      socket.post('/wordpress/processFeed').then(function(data) {
        if (data._success)
          notification(gettextCatalog.getString('Ok!'), true);
        else
          notification(gettextCatalog.getString('Error: ') + JSON.stringify(data));
      });
    };
  });

})();

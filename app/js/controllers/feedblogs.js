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
      
      return socket.emit('add-wordpress-feed', $scope.newblog).then(function(data) {
        if (data.code == 'add-wordpress-feed-success') {
          notification(gettextCatalog.getString('Ok!'), true);
          socket.emit('list-wordpress-feeds');
        } else {
          notification(gettextCatalog.getString('Error: {{code}}', data));
        }
      });
    };
    
    $scope.removeFeedblog = function(id) {
      return socket.emit('remove-wordpress-feed', { blogid: id }).then(function(data) {
        if (data.code == 'remove-wordpress-feed-success') {
          notification(gettextCatalog.getString('Ok!'), true);
          socket.emit('list-wordpress-feeds');
        } else {
          notification(gettextCatalog.getString('Error: {{code}}', data));
        }
      });
    };
    
    $scope.processBlogs = function() {
      socket.emit('process-wordpress-feed').then(function(data) {
        if (data.code == 'process-wordpress-feed-success')
          notification(gettextCatalog.getString('Ok!'), true);
        else
          notification(gettextCatalog.getString('Error: {{code}}', data));
      });
    };
  });

})();

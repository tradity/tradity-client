(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('CommentCtrl', function($scope, socket, gettextCatalog) {
    $scope.editComment = function(comment) {
      return socket.put('/events/comments/' + comment.commentid, {
        data: {
          comment: prompt('Neuer Kommentartext: (Leerlassen zum Beibehalten)') || comment.comment,
          trustedhtml: false
        }
      }).then(function() { notification(gettextCatalog.getString('Ok!'), true); });
    };

    $scope.deleteComment = function(comment) {
      return socket.put('/events/comments/' + comment.commentid, {
        data: {
          comment: comment.comment,
          trustedhtml: comment.trustedhtml,
          cstate: 'mdeleted'
        }
      }).then(function() { notification(gettextCatalog.getString('Ok!'), true); });
    };
    
    $scope.sendComment = function() {
      var eventid = false;
      
      var curScope = $scope;
      
      while (!eventid && curScope) {
        if      (curScope.trade)  eventid = curScope.trade.eventid;
        else if (curScope.user)   eventid = curScope.user.registerevent;
        else if (curScope.school) eventid = curScope.school.eventid;
        
        curScope = curScope.$parent;
      }
      
      if (!eventid)
        return notification(gettextCatalog.getString('Comment event was not found!'));

      return socket.post('/events/' + eventid + '/comments', {
        data: {
          comment: $scope.comment,
          ishtml: $scope.ishtml
        }
      }).then(function(data) {
        if (data.code == 404) {
          notification(gettextCatalog.getString('Comment event was not found – something is wrong here!'));
        } else if (data._success) {
          var time = new Date();
          $scope.comments.unshift({
            comment: $scope.comment,
            trustedhtml: $scope.ishtml,
            username: $scope.ownUser.name,
            profilepic: $scope.ownUser.profilepic,
            time: time.getTime() / 1000 - 1
          });
          $scope.comment = '';
        } else {
          console.log($scope, data);
          notification(gettextCatalog.getString('Sorry, something went wrong.'));
        }
      });
    };
  });

})();

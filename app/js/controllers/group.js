(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('GroupCtrl', function($scope, $sce, $state, $stateParams, gettext, gettextCatalog, DEFAULT_GROUP_BANNER, socket) {
    $scope.school = { pendingMembers: [] };
    $scope.selfIsSchoolAdmin = false;
    $scope.selfIsSchoolMember = false;
    $scope.comments = [];
    $scope.schoolid = null;
    $scope.descpage = '';
    $scope.editingDescpage = false;
    $scope.uploadField = false;
    $scope.feedblogs = [];

    // in case a group gets called without /pinboard
    if ($state.includes('*.group'))
      $state.go('.pinboard');

    $scope.schoolid = $stateParams.schoolid;

    socket.emit('get-school-info', {
      lookfor: $scope.schoolid,
      _cache: 30
    }).then(function(data) {
      if (data.code == 'not-logged-in') {
        return socket.emit('school-exists', {
          lookfor: $scope.schoolid,
          _cache: 30
        }).then(function(data) {
          if (data.code == 'school-exists-success' && data.exists) {
            $state.go('schoolregister', {schoolid: data.path});
          }
        });
      }
      
      if (data.code == 'get-school-info-success') {
        $.extend(true, $scope.school, data.result);
        $scope.comments = $.extend(true, [], $scope.school.comments); // deep copy
        $scope.descpage = $scope.school.descpage;
        $scope.schoolid = $scope.school.id;
        $scope.feedblogs = $scope.school.feedblogs;
        if (!$scope.school.banner)
          $scope.school.banner = DEFAULT_GROUP_BANNER;
        
        if ($scope.ownUser && $scope.ownUser.schools) {
          $.each($scope.ownUser.schools, function(i, e) {
            if (e.path == $scope.school.path) 
              $scope.selfIsSchoolMember = true;
          });
        }

        var checkAdmin = function() {
          $.each($scope.school.admins, function(i, e) {
            if ($scope.ownUser && e.adminid == $scope.ownUser.uid && e.status == 'admin') 
              $scope.selfIsSchoolAdmin = true;
          });
        };
        
        checkAdmin();
        $scope.$on('user-update', checkAdmin);

        $.each($scope.comments, function(i, e) {
          e.comment = $sce.trustAsHtml(e.trustedhtml ? e.comment : escapeHTML(e.comment));
        });
        
        $scope.$broadcast('school-info-update', $scope.school);
      }
    });

    $scope.enterTeam = function () {
      socket.emit('get-own-options', function(data) {
        data.result.school = $scope.schoolid;
        socket.emit('change-options', data.result);
        $scope.selfIsSchoolMember = true;
      });
    };

    $scope.leaveTeam = function () {
      if (confirm("Willst du wirklich die Gruppe verlassen ?")) {
        socket.emit('get-own-options', function(data) {
          data.result.school = null;
          socket.emit('change-options', data.result, function(data) {
            if (/success$/.test(data.code)) 
              $state.go('game.groupOverview');
          });
          notification(gettext('Left group'), true);
          $scope.selfIsSchoolMember = false;
          $scope.selfIsSchoolAdmin = false;
        });
      }
    };

    $scope.deleteCommentSA = function(comment) {
      socket.emit('school-delete-comment', {
        schoolid: $scope.schoolid,
        commentid: comment.commentid
      }, function() { notification(gettext('Ok!'), true); });
    };

    $scope.kickUser = function(user) {
      if (!confirm('Wirklich User „' + user.name + '“ aus der Gruppe „' + user.schoolname + '“ löschen?'))
        return;

      socket.emit('school-kick-user', {
        schoolid: user.school,
        uid: user.uid
      }, function() {
        notification(gettext('Ok!'), true);
      });
    };

    $scope.promoteUserToAdmin = function(user) {
      if (!confirm('Wirklich User „' + user.name + '“ zum Admin der Gruppe „' + $scope.school.name + '“ machen?'))
        return;

      socket.emit('school-change-member-status', {
        schoolid: $scope.schoolid,
        uid: user.uid,
        status: 'admin'
      }, function() {
        notification(gettext('Ok!'), true);
      });
    };

    $scope.enterDescpageEdit = function() {
      $scope.editingDescpage = true;
    };

    $scope.enterPictureUpload = function() {
      $scope.uploadField = true;
    };

    $scope.changeDescription = function() {
      var bannerFile = document.getElementById('bannerupload').files[0];
      if (bannerFile) {
        fileemit(socket, gettext, bannerFile, 'school-publish-banner', {
          schoolid: $scope.schoolid
        }, $scope.serverConfig, function(code) {
          switch (code) {
            case 'publish-success':
              notification(gettext('Sucessfully uploaded profile picture!'), true);
              break;
            case 'publish-quota-exceed':
              notification(gettext('Your profile picture file is too large (maximum 3\u00a0MB)'));
              break;
            case 'publish-inacceptable-role':
            case 'publish-inacceptable-mime':
              notification(gettext('There was a technical problem uploading your profile picture.\nPlease turn to tech@tradity.de'));
              break;
          }
        });
      }

      socket.emit('school-change-description', {
        schoolid: $scope.schoolid,
        descpage: $scope.descpage
      }, function() {
        notification(gettext('Ok!'), true);
      });
    };

    $scope.verifyMember = function(user) {
      socket.emit('school-change-member-status', {
        schoolid: $scope.schoolid,
        uid: user.uid,
        status: 'member'
      }, function() {
        notification(gettext('Ok!'), true);
      });
    };

    $scope.createSchool = function() {
      var n = prompt('Gruppenname:');
      if (!n)
        return;
      n = n.trim();
      if (!n.length)
        return;

      socket.emit('create-school', {
        schoolname: n,
        schoolpath: $scope.school.path + '/' + n.replace(/[^\w_-]/g, '-').replace(/-+/g, '-'),
      }).then(function(data) {
        if (data.code == 'create-school-success')
          notification(gettext('Ok!'), true);
        else
          notification(gettextCatalog.getString('Error: {{code}}', data));
      });
    };
  });

})();

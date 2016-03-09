(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('GroupCtrl', function($scope, $sce, $state, $stateParams, gettextCatalog, DEFAULT_GROUP_BANNER, socket, $q) {
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

    socket.get('/school', {
      params: { lookfor: $scope.schoolid }
    }).then(function(result) {
      if (result.identifier == 'login-required') {
        return socket.get('/school-exists', {
          params: { lookfor: $scope.schoolid }
        }).then(function(result) {
          if (result._success && result.data.exists) {
            $state.go('schoolregister', {schoolid: result.data.path});
          }
        });
      }
      
      if (result._success) {
        $.extend(true, $scope.school, result.data);
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
      socket.get('/options').then(function(result) {
        result.data.school = $scope.schoolid;
        $scope.selfIsSchoolMember = true;
        return socket.put('/options', { data: result.data });
      });
    };

    $scope.leaveTeam = function () {
      if (!confirm("Willst du wirklich die Gruppe verlassen?"))
        return;
      
      socket.get('/options').then(function(result) {
        result.data.school = null;
        socket.put('/options', { data: result.data }).then(function(data) {
          if (data._success) 
            $state.go('game.groupOverview');
        });
        notification(gettextCatalog.getString('Left group'), true);
        $scope.selfIsSchoolMember = false;
        $scope.selfIsSchoolAdmin = false;
      });
    };

    $scope.deleteCommentSA = function(comment) {
      socket.delete('/school/' + $scope.schoolid + '/comments/' + comment.commentid)
        .then(function() { notification(gettextCatalog.getString('Ok!'), true); });
    };

    $scope.kickUser = function(user) {
      if (!confirm('Wirklich User „' + user.name + '“ aus der Gruppe „' + user.schoolname + '“ löschen?'))
        return;

      socket.delete('/school/' + user.school + '/members/' + user.uid).then(function() {
        notification(gettextCatalog.getString('Ok!'), true);
      });
    };

    $scope.promoteUserToAdmin = function(user) {
      if (!confirm('Wirklich User „' + user.name + '“ zum Admin der Gruppe „' + $scope.school.name + '“ machen?'))
        return;

      socket.put('/school/' + $scope.schoolid + '/members/' + user.uid, {
        data: { status: 'admin' }
      }).then(function() {
        notification(gettextCatalog.getString('Ok!'), true);
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
        fileemit(socket, gettextCatalog, bannerFile, '/school/' + $scope.schoolid + '/banner',
          { method: 'PUT' }, $scope.serverConfig, $q).then(function(result) {
          if (result._success) {
            notification(gettextCatalog.getString('Sucessfully uploaded profile picture!'), true);
            return;
          }
          
          switch(result.identifier) {
            case 'quota-exceeded':
              notification(gettextCatalog.getString('Your profile picture file is too large (maximum 3\u00a0MB)'));
              break;
            case 'inacceptable-role':
            case 'inacceptable-mime':
              notification(gettextCatalog.getString('There was a technical problem uploading your profile picture.\nPlease turn to tech@tradity.de'));
              break;
          }
        });
      }

      socket.put('/school/' + $scope.schoolid + '/description', {
        data: {
          descpage: $scope.descpage
        }
      }).then(function() {
        notification(gettextCatalog.getString('Ok!'), true);
      });
    };

    $scope.verifyMember = function(user) {
      socket.put('/school/' + $schope.schoolid + '/members/' + user.uid, {
        data: {
          status: 'member'
        }
      }).then(function() {
        notification(gettextCatalog.getString('Ok!'), true);
      });
    };

    $scope.createSchool = function() {
      var n = prompt('Gruppenname:');
      if (!n)
        return;
      n = n.trim();
      if (!n.length)
        return;

      socket.post('/school', {
        data: {
          schoolname: n,
          schoolpath: $scope.school.path + '/' + n.replace(/[^\w_-]/g, '-').replace(/-+/g, '-'),
        }
      }).then(function(result) {
        if (result._success)
          notification(gettextCatalog.getString('Ok!'), true);
        else
          notification(gettextCatalog.getString('Error: ') + JSON.stringify(data));
      });
    };
  });

})();

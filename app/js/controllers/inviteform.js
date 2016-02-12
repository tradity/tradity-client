(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('InviteFormCtrl', function($scope, socket, gettextCatalog) {
    socket.emit('create-invite-link', {
      schoolid: $scope.schoolid ? $scope.schoolid : null
    }, function(data) {
      $scope.invitelink = data.url;
    });
    
    $scope.createInviteLink = function() {
      var emails = $scope.inviteemails.split(/[\s,;]+/g);
      for (var i = 0; i < emails.length; ++i) {
        socket.emit('create-invite-link', {
          email: emails[i],
          schoolid: $scope.schoolid ? $scope.schoolid : null
        }).then(function(data) { // jshint ignore:line
          switch (data.code) {
            case 'create-invite-link-invalid-email':
              notification(gettextCatalog.getString('Invalid e-mail address'));
              break;
            case 'create-invite-link-not-verif':
              notification(gettextCatalog.getString('You have not verified your e-mail address'));
              break;
            case 'create-invite-link-failed':
              notification(gettextCatalog.getString('Could not send invitation link'));
              break;
            case 'create-invite-link-success':
              notification(gettextCatalog.getString('Invitation link was sent successfully'), true);
              break;
          }
        }); // jshint ignore:line
      }
    };
    
      $scope.copyTooltip = {isOpen: false, msg: ''};
    
    var clipboard = new Clipboard('.btn-copy');
    
    clipboard.on('success', function() {
      $scope.copyTooltip.isOpen = true;
      $scope.copyTooltip.msg = gettextCatalog.getString('Copied!');
    }).on('error', function() {
      $scope.copyTooltip.isOpen = true;
      $scope.copyTooltip.msg = gettextCatalog.getString('Press Ctrl-C/⌘-C to copy');
    });
    
    $scope.closeCopyTooltip = function() {
      $scope.copyTooltip = {isOpen: false, msg: ''};
    };
  });

})();

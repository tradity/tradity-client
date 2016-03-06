(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('InviteFormCtrl', function($scope, socket, gettextCatalog) {
    var createInviteLinkURL = $scope.schoolid ?
      '/school/' + $scope.schoolid + '/create-invitelink' :
      '/create-invitelink';
    
    socket.post(createInviteLinkURL).then(function(result) {
      $scope.invitelink = result.url;
    });
    
    $scope.createInviteLink = function() {
      var emails = $scope.inviteemails.split(/[\s,;]+/g);
      for (var i = 0; i < emails.length; ++i) {
        socket.post(createInviteLinkURL, {
          data: { email: emails[i] }
        }).then(function(result) { // jshint ignore:line
          if (result._success) {
            notification(gettextCatalog.getString('Invitation link was sent successfully'), true);
            return;
          }
          
          switch (result.identifier) {
            case 'invalid-email':
              notification(gettextCatalog.getString('Invalid e-mail address'));
              break;
            case 'email-not-verified':
              notification(gettextCatalog.getString('You have not verified your e-mail address'));
              break;
            default:
              notification(gettextCatalog.getString('Could not send invitation link'));
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

angular.module('tradity').
  controller('InviteFormCtrl', function($scope, socket) {
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
        }, function(data) {
          switch (data.code) {
            case 'create-invite-link-invalid-email':
              notification('E-Mail-Adresse ungültig');
              break;
            case 'create-invite-link-not-verif':
              notification('Eigene E-Mail-Adresse nicht bestätigt');
              break;
            case 'create-invite-link-failed':
              notification('Einladungslink konnte nicht verschickt werden');
              break;
            case 'create-invite-link-success':
              notification('Einladungslink wurde verschickt');
              break;
          }
        });
      }
    };
  });

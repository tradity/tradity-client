'use strict';

angular.module('tradity.controllers', []).
  controller('LoginCtrl', function($scope, $location, socket) {
    $scope.register = function() {
      socket.emit('login', {
        name: $scope.username,
        pw: $scope.password,
        stayloggedin: false
      },
      function(data) {
        switch (data.code) {
          case 'login-success':
            $location.path('/')
            break;
          case 'login-badname':
            alert('Benutzer existiert nicht');
            break;
          case 'login-wrongpw':
            alert('Falsches Passwort');
            break;
          case 'login-email-not-verified':
            alert('Emailadresse noch nicht bestätigt');
        }
      });
    };
  }).
  controller('MainCtrl', function($scope, $location, socket) {
    socket.on('response', function(data) {
      if (data.code == 'not-logged-in') {
        alert('Nicht eingeloggt');
        $location.path('/login');
      }
    });
  });

'use strict';

angular.module('tradity.controllers', []).
  controller('LoginCtrl', function($scope, socket) {
    socket.on('login', function(data) {
      console.log('Möglichkeit 2', data);
    });
    $scope.register = function() {
      socket.emit('login', {
        name: $scope.username,
        pw: $scope.password,
        stayloggedin: false
      }, function(data) { console.log('Möglichkeit 1', data); });
    };
  });

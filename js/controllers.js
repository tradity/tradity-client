'use strict';

angular.module('tradity.controllers', []).
  controller('LoginCtrl', function($scope, socket) {
    socket.on('response', function(data) {
      console.log(data);
    });
    $scope.register = function() {
      socket.emit('query', {
        type: 'login',
        name: $scope.username,
        pw: $scope.password,
        stayloggedin: false
      });
    };
  });
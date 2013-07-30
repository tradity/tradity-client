'use strict';

angular.module('tradity.controllers', []).
  controller('LoginCtrl', function($scope, $location, socket) {
    $scope.login = function() {
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
  }).
  controller('RegistrationCtrl', function($scope, socket) {
    socket.on('register', function(data) {
      if (data.code == 'reg-success') {
        alert('Registrierung erfolgreich');
      } else if (data.code == 'reg-email-failed') {
        alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      }
    });
    $scope.school = null;
    $scope.register = function() {
      socket.emit('register', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.school
      },
      function(data) {
        switch (data.code) {
          case 'reg-email-sending':
            alert('Aktivierungsmail wird versandt');
            break;
          case 'reg-email-already-present':
            alert('Email bereits vorhanden');
            break;
          case 'reg-name-already-present':
            alert('Benutzername bereits vergeben');
            break;
          case 'reg-unknown-school':
            alert('Unbekannte Schule');
            break;
          case 'reg-too-short-pw':
            alert('Das Passwort ist zu kurz');
            break;
          case 'reg-name-invalid-char':
            alert('Der Benutzername enthält unerlaubte Zeichen');
        }
      });
    };
  }).
  controller('OptionsCtrl', function($scope, socket) {
    socket.emit('get-own-options', {}, function(data) {
      $scope.name = data.result.name;
      $scope.giv_name = data.result.giv_name;
      $scope.fam_name = data.result.fam_name;
      $scope.realnamepublish = data.result.realnamepublish;
      $scope.password = null;
      $scope.password_check = null;
      $scope.email = data.result.email;
      $scope.gender = data.result.gender;
      $scope.school = data.result.school;
      $scope.birthday = data.result.birthday;
      $scope.desc = data.result.desc;
      $scope.provision = data.result.provision;
      $scope.address = data.result.address;
    });
    $scope.changeOptions = function() {
      socket.emit('change-options', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.school,
        birthday: $scope.birthday,
        desc: $scope.desc,
        provision: $scope.provision,
        address: $scope.address
      },
      function(data) {
        switch (data.code) {
          case 'reg-email-sending':
            alert('Aktivierungsmail wird versandt');
            break;
          case 'reg-email-already-present':
            alert('Email bereits vorhanden');
            break;
          case 'reg-name-already-present':
            alert('Benutzername bereits vergeben');
            break;
          case 'reg-unknown-school':
            alert('Unbekannte Schule');
            break;
          case 'reg-too-short-pw':
            alert('Das Passwort ist zu kurz');
            break;
          case 'reg-name-invalid-char':
            alert('Der Benutzername enthält unerlaubte Zeichen');
            break;
          case 'invalid-provision':
            alert('Ungültige Provision');
        }
      }
    )};
    socket.on('change-options', function(data) {
      if (data.code == 'reg-success') {
        alert('Aktivierungsmail erfolgreich versandt');
      } else if (data.code == 'reg-email-failed') {
        alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      }
    });
  });

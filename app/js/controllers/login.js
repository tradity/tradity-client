angular.module('tradity').
  controller('LoginCtrl', function($scope, $routeParams, $location, socket) {
    $scope.username = '';
    $scope.password = '';
    $scope.stayloggedin = false;

    if ($routeParams.emailVerifCode && $routeParams.uid) {
      socket.emit('emailverif', {
        key: $routeParams.emailVerifCode,
        uid: $routeParams.uid
      },
      function(data) {
        switch (data.code) {
          case 'email-verify-success':
            notification('Emailadresse erfolgreich bestätigt',true);
            break;
          case 'email-verify-already-verified':
            notification('Emailadresse bereits bestätigt');
            break;
          case 'email-verify-other-already-verified':
            notification('Jemand anderes hat diese Emailadresse bereits bestätigt');
            break;
          case 'email-verify-failure':
            notification('Fehler beim Bestätigen der Emailadresse');
        }
      });
    }
    $scope.login = function() {
      socket.emit('login', {
        name: $scope.username,
        pw: $scope.password,
        stayloggedin: $scope.stayloggedin
      },
      function(data) {        
        switch (data.code) {
          case 'login-success':
            $scope.fetchSelf(function() {
              $scope.pokeEvents();
            });
            $location.path('/');
            break;
          case 'login-badname':
            notification('Benutzer existiert nicht');
            break;
          case 'login-wrongpw':
            notification('Falsches Passwort');
            break;
          case 'login-email-not-verified':
            notification('Emailadresse noch nicht bestätigt');
        }
      });
    };

    socket.on('password-reset', function(data) {
      if (data.code == 'password-reset-success') {
        notification('Neues Passwort erfolgreich versandt',true);
      } else if (data.code == 'password-reset-failed') {
        notification('Das neue Passwort konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      } else if (data.code == 'password-reset-notfound') {
        notification('Benutzer existiert nicht');
      } else if (data.code == 'password-reset-sending') {
        notification('Neues Passwort wird versandt');
      }
    });
    $scope.passwordReset = function() {
      socket.emit('password-reset', {
        name: $scope.username
      });
    };
    socket.emit('ping', function(data) {
      
    });
  });

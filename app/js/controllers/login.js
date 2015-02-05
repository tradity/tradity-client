angular.module('tradity').
	controller('LoginCtrl', function($scope, user, $stateParams, $state, safestorage, socket) {
		$scope.username = '';
		$scope.password = '';
		$scope.stayloggedin = false;
		$scope.alerts = [];
		$scope.logging_in = false;
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		user.me().then(function(){
			$state.go('game.feed');
		})

		if ($stateParams.emailVerifCode && $stateParams.uid) {
			socket.emit('emailverif', {
				key: $stateParams.emailVerifCode,
				uid: $stateParams.uid
			}, function(data) {
				switch (data.code) {
					case 'login-success':
						$scope.alerts.push({ type: 'success', msg:'Emailadresse erfolgreich bestätigt'});
						$scope.fetchSelf();
						$state.go('game.feed');
						break;
					case 'email-verify-already-verified':
						$scope.alerts.push({ type: 'danger', msg:'Emailadresse bereits bestätigt'});
						break;
					case 'email-verify-other-already-verified':
						$scope.alerts.push({ type: 'danger', msg:'Jemand anderes hat diese Emailadresse bereits bestätigt'});
						break;
					case 'email-verify-failure':
						$scope.alerts.push({ type: 'danger', msg:'Fehler beim Bestätigen der Emailadresse'});
						break;
				}
			});
		}
		
		$scope.login = function() {		
			$scope.logging_in = true;
			safestorage.setPassword($scope.password);
			socket.emit('login', {
				name: $scope.username,
				pw: $scope.password,
				stayloggedin: $scope.stayloggedin
			}, function(data) {
				$scope.logging_in = false;
				switch (data.code) {
					case 'login-success':
						user.fetch();
						$state.go('game.feed');
						break;
					case 'login-badname':
						$scope.alerts.push({ type: 'danger', msg:'Benutzer „' + $scope.username + '“ existiert nicht'});
						break;
					case 'login-wrongpw':
						$scope.alerts.push({ type: 'danger', msg:'Falsches Passwort'});
						break;
					case 'login-email-not-verified':
						$scope.alerts.push({ type: 'danger', msg:'Emailadresse noch nicht bestätigt'});
						break;
				}
			});
		};

		socket.on('password-reset', function(data) {
			if (data.code == 'password-reset-success') {
				$scope.alerts.push({ type: 'success', msg:'Neues Passwort erfolgreich versandt'});
			} else if (data.code == 'password-reset-failed') {
				$scope.alerts.push({ type: 'danger', msg:'Das neue Passwort konnte nicht versandt werden. Bitte an tech@tradity.de wenden'});
			} else if (data.code == 'password-reset-notfound') {
				$scope.alerts.push({ type: 'danger', msg:'Benutzer „' + $scope.username + '“ existiert nicht'});
			}
		});

		$scope.passwordReset = function() {
			socket.emit('password-reset', {
				name: $scope.username
			});
		};
	});

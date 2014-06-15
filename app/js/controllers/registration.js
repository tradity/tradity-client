angular.module('tradity').
	controller('RegistrationCtrl', function($scope, $stateParams, $state, $dialogs, socket) {
		$scope.school = $stateParams.schoolid;
		$scope.traditye = 0;
		$scope.zipcode = '';
		$scope.town = '';
		$scope.street = '';
		$scope.invitekey = $stateParams.inviteCode;
		$scope.betakey = '';
		$scope.onLSResult = [
			function() {
				for (var i = 0; i < $scope.schoolList.length; ++i) {
					var s = $scope.schoolList[i];
					if (s.path == $scope.school || s.id == $scope.school || s.name == $scope.school) {
						$scope.schoolname = document.getElementById('schoolname').value = s.name;
						$scope.school = s.id;
						break;
					}
				}
			}
		];
		
		if ($scope.invitekey) {
			socket.emit('get-invitekey-info', {
				invitekey: $scope.invitekey
			}, function(data) {
				if (data.code == 'get-invitekey-info-success') {
					$scope.email = data.result.email;
					$scope.school = data.result.schoolid;
				}
			});
		}
		
		socket.on('register', function(data) {
			switch (data.code) {
				case 'reg-success':
					var modal = $dialogs.notify('Willkommen bei Tradity!', 'Bitte bestätige die „Bestätigungsmail“, um alle Funktionen freizuschalten und für die Preise gewinnberechtigt zu sein.');
					
					modal.result.then(function(btn) {
						notification('Registrierung erfolgreich', true);
						$scope.fetchSelf();
						$state.go('game.feed');
					});
					break;
				case 'reg-email-failed':
					notification('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
					break;
				case 'reg-email-already-present':
					notification('Email bereits vorhanden');
					break;
				case 'reg-name-already-present':
					notification('Benutzername bereits vergeben');
					break;
				case 'reg-unknown-school':
					notification('Unbekannte Schule');
					break;
				case 'reg-too-short-pw':
					notification('Das Passwort ist zu kurz');
					break;
				case 'reg-beta-necessary':
					notification('Beta-Schlüssel ungültig oder nicht angegeben');
					break;
				case 'reg-name-invalid-char':
					notification('Der Benutzername enthält unerlaubte Zeichen');
					break;
			}
		});
		
		$scope.register = function() {
			if (!$scope.agbread)
				return notification('Bitte bestätige, dass du die AGB gelesen hast.');
			if ($scope.password_check != $scope.password)
				return notification('Die Passwörter stimmen nicht überein!');
			if (!$scope.giv_name || !$scope.fam_name)
				return notification('Bitte gib deinen Namen an, damit du Gewinne erhalten kannst.');
			
			socket.emit('register', {
				name: $scope.name,
				giv_name: $scope.giv_name,
				fam_name: $scope.fam_name,
				realnamepublish: $scope.realnamepublish,
				password: $scope.password,
				email: $scope.email,
				school: $scope.schoolname ? ($scope.school ? $scope.school : $scope.schoolname) : null,
				betakey: $scope.betakey,
				street: $scope.street,
				zipcode: $scope.zipcode,
				town: $scope.town,
				traditye: $scope.traditye,
				invitekey: $scope.invitekey
			});
		};
		
		useSchoolAC($scope, socket);
	});

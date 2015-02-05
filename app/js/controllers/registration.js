angular.module('tradity').
	controller('RegistrationCtrl', function($scope, $stateParams, $state, dialogs, safestorage, socket) {
		$scope.school = $stateParams.schoolid;
		$scope.schoolname_none = false;
		$scope.traditye = 0;
		$scope.dla_optin = 0;
		$scope.zipcode = '';
		$scope.town = '';
		$scope.street = '';
		$scope.schoolclass = '';
		$scope.invitekey = $stateParams.inviteCode;
		$scope.betakey = '';
		$scope.lang = 'de';
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
		$scope.alerts = [];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		
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
					var modal = dialogs.notify('Willkommen bei Tradity!', 'Bitte bestätige die „Bestätigungsmail“, um alle Funktionen freizuschalten und für die Preise gewinnberechtigt zu sein.');
					
					modal.result.then(function(btn) {
						$scope.alerts.push({ type: 'danger', msg:'Registrierung erfolgreich'});
						$scope.fetchSelf();
						$state.go('game.feed');
					});
					break;
				case 'reg-email-failed':
					$scope.alerts.push({ type: 'danger', msg:'Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden'});
					break;
				case 'reg-email-already-present':
					$scope.alerts.push({ type: 'danger', msg:'Email bereits vorhanden'});
					break;
				case 'reg-name-already-present':
					$scope.alerts.push({ type: 'danger', msg:'Benutzername bereits vergeben'});
					break;
				case 'reg-unknown-school':
					$scope.alerts.push({ type: 'danger', msg:'Unbekannte Schule'});
					break;
				case 'reg-too-short-pw':
					$scope.alerts.push({ type: 'danger', msg:'Das Passwort ist zu kurz'});
					break;
				case 'reg-beta-necessary':
					$scope.alerts.push({ type: 'danger', msg:'Beta-Schlüssel ungültig oder nicht angegeben'});
					break;
				case 'reg-name-invalid-char':
					$scope.alerts.push({ type: 'danger', msg:'Der Benutzername enthält unerlaubte Zeichen'});
					break;
			}
		});
		
		$scope.register = function() {
			if (!$scope.email)
				return $scope.alerts.push({ type: 'danger', msg:'Bitte gib deine E-Mail-Adresse an.'});
			if (!$scope.agbread)
				return $scope.alerts.push({ type: 'danger', msg:'Bitte bestätige, dass du die AGB gelesen hast.'});
			if ($scope.password_check != $scope.password)
				return $scope.alerts.push({ type: 'danger', msg:'Die Passwörter stimmen nicht überein!'});
			if (!$scope.giv_name || !$scope.fam_name)
				return $scope.alerts.push({ type: 'danger', msg:'Bitte gib deinen Namen an, damit du Gewinne erhalten kannst.'});
			if (!$scope.schoolname_none && !$scope.schoolname)
				return $scope.alerts.push({ type: 'danger', msg:'Bitte gib an, ob und welcher Gruppe du angehörst.'});
			
			safestorage.setPassword($scope.password);
			socket.emit('register', {
				name: $scope.name,
				giv_name: $scope.giv_name,
				fam_name: $scope.fam_name,
				realnamepublish: $scope.realnamepublish,
				password: $scope.password,
				email: $scope.email,
				school: $scope.schoolname ? ($scope.school ? $scope.school : $scope.schoolname) : null,
				schoolclass: $scope.schoolclass,
				betakey: $scope.betakey,
				street: $scope.street,
				zipcode: $scope.zipcode,
				town: $scope.town,
				traditye: $scope.traditye,
				dla_optin: $scope.dla_optin,
				invitekey: $scope.invitekey
			});
		};
		
		useSchoolAC($scope, socket);
	});

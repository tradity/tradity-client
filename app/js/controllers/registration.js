'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('RegistrationCtrl', function($scope, $stateParams, $state, user, dialogs, safestorage, gettext, languageManager, socket) {
		$scope.school = $stateParams.schoolid; // XXX
		$scope.traditye = 0;
		$scope.dla_optin = 0;
		$scope.zipcode = '';
		$scope.town = '';
		$scope.street = '';
		$scope.schoolclass = '';
		$scope.invitekey = $stateParams.inviteCode;
		$scope.betakey = '';
		$scope.lang = languageManager.getCurrentLanguage();
		
		$scope.alerts = [];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		$scope.$watch('lang', function() {
			languageManager.setCurrentLanguage($scope.lang);
		});
		
		if ($scope.invitekey) {
			// XXX
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
					var modal = dialogs.notify(
						gettext('Welcome to Tradity!'),
						gettext('Please click on the link in the verification e-mail we just sent you in order to be able to use the full functionality of Tradity and be eligible for winning the available prizes.'));
					
					modal.result.then(function(btn) {
						$scope.alerts.push({ type: 'danger', msg: gettext('Successful registration') });
						user.fetch();
						$state.go('game.feed');
					});
					break;
				case 'reg-email-failed':
					$scope.alerts.push({ type: 'danger', msg: gettext('Could not send verification e-mail. Please turn to tech@tradity.de.') });
					break;
				case 'reg-email-already-present':
					$scope.alerts.push({ type: 'danger', msg: gettext('This e-mail address has already been taken') });
					break;
				case 'reg-name-already-present':
					$scope.alerts.push({ type: 'danger', msg: gettext('This user name has already been taken') });
					break;
				case 'reg-unknown-school':
					$scope.alerts.push({ type: 'danger', msg: gettext('The entered school has not been found') });
					break;
				case 'reg-too-short-pw':
					$scope.alerts.push({ type: 'danger', msg: gettext('Your password is too short!') });
					break;
				case 'reg-beta-necessary':
					$scope.alerts.push({ type: 'danger', msg: gettext('No valid beta key was entered') });
					break;
				case 'reg-name-invalid-char':
					$scope.alerts.push({ type: 'danger', msg: gettext('Your user name contains invalid characters!')});
					break;
			}
		});
		
		$scope.register = function() {
			if (!$scope.email)
				return $scope.alerts.push({ type: 'danger', msg: gettext('Please provide an e-mail address') });
			if (!$scope.agbread)
				return $scope.alerts.push({ type: 'danger', msg: gettext('Please confirm that you have read the TOS') });
			if ($scope.password_check != $scope.password)
				return $scope.alerts.push({ type: 'danger', msg: gettext('The entered passwords do not match') });
			if (!$scope.giv_name || !$scope.fam_name)
				return $scope.alerts.push({ type: 'danger', msg: gettext('Please enter your name in order to be eligible for winning prizes') });
			/*if (!$scope.schoolname_none && !$scope.schoolname) // XXX
				return $scope.alerts.push({ type: 'danger', msg: gettext('Please indicate which organization or school you belong to') });*/
			
			safestorage.setPassword($scope.password);
			socket.emit('register', {
				name: $scope.name,
				giv_name: $scope.giv_name,
				fam_name: $scope.fam_name,
				realnamepublish: $scope.realnamepublish,
				password: $scope.password,
				email: $scope.email,
				school: $scope.school,
				schoolclass: $scope.schoolclass,
				betakey: $scope.betakey,
				street: $scope.street,
				zipcode: $scope.zipcode,
				town: $scope.town,
				lang: languageManager.setCurrentLanguage($scope.lang),
				traditye: $scope.traditye,
				dla_optin: $scope.dla_optin,
				invitekey: $scope.invitekey
			});
		};
	});

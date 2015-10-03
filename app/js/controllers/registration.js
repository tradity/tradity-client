'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('RegistrationCtrl', function($scope, $stateParams, $state, user, dialogs, safestorage, gettext, languageManager, socket) {
		var vm = this;
		vm.school = $stateParams.schoolid; // XXX
		vm.traditye = 0;
		vm.dla_optin = 0;
		vm.zipcode = '';
		vm.town = '';
		vm.street = '';
		vm.schoolclass = '';
		vm.invitekey = $stateParams.inviteCode;
		vm.betakey = '';
		vm.lang = languageManager.getCurrentLanguage();
		
		vm.alerts = [];
		vm.closeAlert = function(index) {
			vm.alerts.splice(index, 1);
		};

		$scope.$watch('lang', function() {
			languageManager.setCurrentLanguage(vm.lang);
		});
		
		if (vm.invitekey) {
			// XXX
			socket.emit('get-invitekey-info', {
				invitekey: vm.invitekey
			}, function(data) {
				if (data.code == 'get-invitekey-info-success') {
					vm.email = data.result.email;
					vm.school = data.result.schoolid;
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
						vm.alerts.push({ type: 'danger', msg: gettext('Successful registration') });
						user.fetch();
						$state.go('game.feed');
					});
					break;
				case 'reg-email-failed':
					vm.alerts.push({ type: 'danger', msg: gettext('Could not send verification e-mail. Please turn to tech@tradity.de.') });
					break;
				case 'reg-email-already-present':
					vm.alerts.push({ type: 'danger', msg: gettext('This e-mail address has already been taken') });
					break;
				case 'reg-name-already-present':
					vm.alerts.push({ type: 'danger', msg: gettext('This user name has already been taken') });
					break;
				case 'reg-unknown-school':
					vm.alerts.push({ type: 'danger', msg: gettext('The entered school has not been found') });
					break;
				case 'reg-too-short-pw':
					vm.alerts.push({ type: 'danger', msg: gettext('Your password is too short!') });
					break;
				case 'reg-beta-necessary':
					vm.alerts.push({ type: 'danger', msg: gettext('No valid beta key was entered') });
					break;
				case 'reg-name-invalid-char':
					vm.alerts.push({ type: 'danger', msg: gettext('Your user name contains invalid characters!')});
					break;
			}
		});
		
		vm.register = function() {
			if (!vm.email)
				return vm.alerts.push({ type: 'danger', msg: gettext('Please provide an e-mail address') });
			if (!vm.agbread)
				return vm.alerts.push({ type: 'danger', msg: gettext('Please confirm that you have read the TOS') });
			if (vm.password_check != vm.password)
				return vm.alerts.push({ type: 'danger', msg: gettext('The entered passwords do not match') });
			if (!vm.giv_name || !vm.fam_name)
				return vm.alerts.push({ type: 'danger', msg: gettext('Please enter your name in order to be eligible for winning prizes') });
			/*if (!vm.schoolname_none && !vm.schoolname) // XXX
				return vm.alerts.push({ type: 'danger', msg: gettext('Please indicate which organization or school you belong to') });*/
			
			safestorage.setPassword(vm.password);
			socket.emit('register', {
				name: vm.name,
				giv_name: vm.giv_name,
				fam_name: vm.fam_name,
				realnamepublish: vm.realnamepublish,
				password: vm.password,
				email: vm.email,
				school: vm.school,
				schoolclass: vm.schoolclass,
				betakey: vm.betakey,
				street: vm.street,
				zipcode: vm.zipcode,
				town: vm.town,
				lang: languageManager.setCurrentLanguage(vm.lang),
				traditye: vm.traditye,
				dla_optin: vm.dla_optin,
				invitekey: vm.invitekey
			});
		};
	});

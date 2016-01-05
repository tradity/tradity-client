(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('LoginCtrl', function(user, $stateParams, $state, safestorage, socket) {
		var vm = this;
		vm.username = '';
		vm.password = '';
		vm.stayloggedin = false;
		vm.alerts = [];
		vm.logging_in = false;
		vm.closeAlert = function(index) {
			vm.alerts.splice(index, 1);
		};

		user.me().then(function(){
			$state.go('game.feed');
		});

		if ($stateParams.emailVerifCode && $stateParams.uid) {
			socket.emit('emailverif', {
				key: $stateParams.emailVerifCode,
				uid: $stateParams.uid
			}, function(data) {
				switch (data.code) {
					case 'login-success':
						vm.alerts.push({ type: 'success', msg:'Emailadresse erfolgreich bestätigt'});
						user.fetch();
						$state.go('game.feed');
						break;
					case 'email-verify-already-verified':
						vm.alerts.push({ type: 'danger', msg:'Emailadresse bereits bestätigt'});
						break;
					case 'email-verify-other-already-verified':
						vm.alerts.push({ type: 'danger', msg:'Jemand anderes hat diese Emailadresse bereits bestätigt'});
						break;
					case 'email-verify-failure':
						vm.alerts.push({ type: 'danger', msg:'Fehler beim Bestätigen der Emailadresse'});
						break;
				}
			});
		}
		
		vm.login = function() {
			vm.logging_in = true;
			safestorage.setPassword(vm.password);
			socket.emit('login', {
				name: vm.username,
				pw: vm.password,
				stayloggedin: vm.stayloggedin
			}, function(data) {
				vm.logging_in = false;
				switch (data.code) {
					case 'login-success':
						user.fetch();
						location.href = '/feed';
						break;
					case 'login-badname':
						vm.alerts.push({ type: 'danger', msg:'Benutzer „' + vm.username + '“ existiert nicht'});
						break;
					case 'login-wrongpw':
						vm.alerts.push({ type: 'danger', msg:'Falsches Passwort'});
						break;
					case 'login-email-not-verified':
						vm.alerts.push({ type: 'danger', msg:'Emailadresse noch nicht bestätigt'});
						break;
				}
			});
		};

		socket.on('password-reset', function(data) {
			if (data.code == 'password-reset-success') {
				vm.alerts.push({ type: 'success', msg:'Neues Passwort erfolgreich versandt'});
			} else if (data.code == 'password-reset-failed') {
				vm.alerts.push({ type: 'danger', msg:'Das neue Passwort konnte nicht versandt werden. Bitte an tech@tradity.de wenden'});
			} else if (data.code == 'password-reset-notfound') {
				vm.alerts.push({ type: 'danger', msg:'Benutzer „' + vm.username + '“ existiert nicht'});
			}
		});

		vm.passwordReset = function() {
			socket.emit('password-reset', {
				name: vm.username
			});
		};
	});

})();

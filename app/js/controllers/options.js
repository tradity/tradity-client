angular.module('tradity').
	controller('OptionsCtrl', function($scope, md5, socket, safestorage, dailyLoginAchievements, config, dialogs) {
		$scope.lang = 'de'; // dummy

		socket.on('get-own-options', function(data) {
			if (!data.result)
				return;
			
			$scope.DLAValidityDays = config.server().DLAValidityDays;
			$scope.show_dlainfo = false;
			$scope.dla_cert_days = dailyLoginAchievements.getCertificates().map(function(cert) {
				return new Date(cert.date)
			});
			$scope.name = data.result.name;
			$scope.giv_name = data.result.giv_name;
			$scope.fam_name = data.result.fam_name;
			$scope.realnamepublish = data.result.realnamepublish;
			$scope.password = null;
			$scope.password_check = null;
			$scope.email = data.result.email;
			$scope.prevschool = data.result.school;
			$scope.school = data.result.school;
			$scope.schoolname = document.getElementById('schoolname').value = data.result.schoolname;
			$scope.schoolname_none = (data.result.school == null);
			$scope.schoolclass = data.result.schoolclass;
			$scope.desc = data.result.desc;
			$scope.lprovision = data.result.lprovision;
			$scope.wprovision = data.result.wprovision;
			$scope.street = data.result.street;
			$scope.zipcode = data.result.zipcode;
			$scope.town = data.result.town;
			$scope.traditye = data.result.traditye&&true;
			$scope.dla_optin = data.result.dla_optin&&true;
			$scope.delayorderhist = data.result.delayorderhist;
			
			if (data.result.birthday !== null) {
				var d = new Date(data.result.birthday);
				$scope.birthdayd = d.getUTCDate();
				$scope.birthdaym = d.getUTCMonth()+1;
				$scope.birthdayy = d.getUTCFullYear();
			}
		});
		
		socket.emit('get-own-options');
		
		$scope.handlePublishCode = function(code) {
			switch (code) {
				case 'publish-success':
					alert('Profilbild erfolgreich hochgeladen!');
					break;
				case 'publish-quota-exceed':
					alert('Die Profilbilddatei ist leider zu groß (höchstens 3 MB)');
					break;
				case 'publish-proxy-not-allowed':
				case 'publish-inacceptable-role':
				case 'publish-inacceptable-mime':
					alert('Es gab beim Hochladen Deines Profilbilds leider technische Schwierigkeiten.\nWende dich bitte an tech@tradity.de');
					break;
			}
		};
		
		$scope.useGravatar = function() {
			fileemit(socket, 'https://secure.gravatar.com/avatar/' + md5.createHash($scope.ownUser.email) + '?s=384', 'publish', {
				role: 'profile.image',
				proxy: true
			}, $scope.serverConfig, $scope.handlePublishCode);
		};
		
		$scope.changeOptions = function() {
			if (!$scope.password_check) $scope.password_check = null;
			if (!$scope.password)       $scope.password = null;
			
			if ($scope.password_check != $scope.password)
				return notification('Die Passwörter stimmen nicht überein');
			
			$scope.schoolname = $scope.schoolname_none ? '' : document.getElementById('schoolname').value;
			var d = Date.UTC($scope.birthdayy, $scope.birthdaym-1, $scope.birthdayd);
			if (!$scope.birthdayy)
				d = null;
			
			var piFile = document.getElementById('profileimage').files[0];
			if (piFile) {
				fileemit(socket, piFile, 'publish', {
					role: 'profile.image',
				}, $scope.serverConfig, $scope.handlePublishCode);
			}
			
			var school;
			if ((!$scope.schoolname && $scope.school) || $scope.schoolname_none) {
				school = null;
			} else {
				var foundSNameInList = null;
				for (var i = 0; i < $scope.schoolList.length; ++i) {
					if ($scope.schoolList[i].name == $scope.schoolname) {
						foundSNameInList = $scope.schoolList[i].id;
						break;
					}
				}
				
				if (foundSNameInList)
					school = foundSNameInList;
				else
					school = $scope.schoolname;
			}
			
			if ($scope.password)
				safestorage.setPassword($scope.password);
			
			if ($scope.dla_optin)
				dailyLoginAchievements.submitToServer(true);
			
			socket.emit('change-options', {
				name: $scope.name,
				giv_name: $scope.giv_name,
				fam_name: $scope.fam_name,
				realnamepublish: $scope.realnamepublish,
				password: $scope.password,
				email: $scope.email,
				school: school,
				birthday: d,
				desc: $scope.desc,
				lprovision: $scope.lprovision,
				wprovision: $scope.wprovision,
				street: $scope.street,
				zipcode: $scope.zipcode,
				town: $scope.town,
				schoolclass: $scope.schoolclass,
				traditye: $scope.traditye,
				dla_optin: $scope.dla_optin,
				delayorderhist: $scope.delayorderhist
			}, function(data) {
				switch (data.code) {
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
			});
		};
		
		$scope.resetUser = function() {
			var dlg = dialogs.confirm('Options', 'Willst du dich wirklich resetten?');
			dlg.result.then(function(btn) {
				socket.emit('reset-user', null, function(data) {
					if (data.code == 'reset-user-success')
						alert('Reset erfolgreich!');
				});
			})
		};
		
		socket.on('change-options', function(data) {
			if (data.code == 'reg-success') {
				alert('Optionen erfolgreich gespeichert');
			} else if (data.code == 'reg-email-failed') {
				alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
			}
		});
		
		$scope.loadSearch = function() {
			useSchoolAC($scope, socket);
		}
		
	});

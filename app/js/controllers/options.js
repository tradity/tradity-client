(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
controller('OptionsCtrl', function($scope, md5, socket, safestorage, dailyLoginAchievements, config, dialogs, gettext, languageManager, $q) {
  $scope.genders = socket.emit('list-genders', { _cache: 500 }).then(function(data) {
    if (data.code != 'list-genders-success')
      return;

    return $scope.genders = data.genders;
  });

  socket.on('get-own-options', function(data) {
    if (!data.result)
      return;

    $scope.DLAValidityDays = config.server().DLAValidityDays;
    $scope.show_dlainfo = false;
    $scope.dla_cert_days = dailyLoginAchievements.getCertificates().map(function(cert) {
      return new Date(cert.date);
    });
    $scope.name = data.result.name;
    $scope.giv_name = data.result.giv_name;
    $scope.fam_name = data.result.fam_name;
    $scope.realnamepublish = data.result.realnamepublish;
    $scope.password = null;
    $scope.password_check = null;
    $scope.email = data.result.email;
    $scope.school = data.result.school;
    $scope.schoolclass = data.result.schoolclass;
    $scope.desc = data.result.desc;
    $scope.lprovision = data.result.lprovision;
    $scope.wprovision = data.result.wprovision;
    $scope.street = data.result.street === 'null' ? '' : data.result.street;
    $scope.zipcode = data.result.zipcode === 'null' ? '' : data.result.zipcode;
    $scope.town = data.result.town === 'null' ? '' : data.result.town;

    $scope.lang = languageManager.setCurrentLanguage(data.result.lang);
    $scope.traditye = data.result.traditye && true;
    $scope.dla_optin = data.result.dla_optin && true;
    $scope.delayorderhist = data.result.delayorderhist;
    
    $scope.birthday = new Date(data.result.birthday);
    
    $scope.genderIndex = null;
    $q.when($scope.genders).then(function(genders) {
      $scope.genderIndex = genders.genders.indexOf(data.result.gender);
    });

    // if (data.result.birthday !== null) {
    //   var d = new Date(data.result.birthday);
    //   $scope.birthdayd = d.getUTCDate();
    //   $scope.birthdaym = d.getUTCMonth() + 1;
    //   $scope.birthdayy = d.getUTCFullYear();
    // }
  });

  socket.emit('get-own-options');

  $scope.handlePublishCode = function(code) {
    switch (code) {
      case 'publish-success':
        notification(gettext('Profile picture was uploaded successfully!'), true);
        break;
      case 'publish-quota-exceed':
        notification(gettext('Your profile picture file is too large (maximum 3 MB)'));
        break;
      case 'publish-proxy-not-allowed':
      case 'publish-inacceptable-role':
      case 'publish-inacceptable-mime':
        notification(gettext('There was a technical problem uploading your profile picture.\nPlease turn to tech@tradity.de'));
        break;
    }
  };

  $scope.useGravatar = function() {
    fileemit(socket, gettext, 'https://secure.gravatar.com/avatar/' + md5.createHash($scope.ownUser.email) + '?s=384', 'publish', {
      role: 'profile.image',
      proxy: true
    }, $scope.serverConfig, $scope.handlePublishCode);
  };

  $scope.$watch('lang', function() {
    languageManager.setCurrentLanguage($scope.lang);
  });

  $scope.changeOptions = function() {
    if (!$scope.password_check) $scope.password_check = null;
    if (!$scope.password) $scope.password = null;

    if ($scope.password_check != $scope.password)
      return notification(gettext('The entered passwords do not match'));

    // var d = Date.UTC($scope.birthdayy, $scope.birthdaym - 1, $scope.birthdayd);
    // if (!$scope.birthdayy)
    //   d = null;

    var piFile = document.getElementById('profileimage').files[0];
    if (piFile) {
      fileemit(socket, gettext, piFile, 'publish', {
        role: 'profile.image',
      }, $scope.serverConfig, $scope.handlePublishCode);
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
      school: $scope.school,
      schoolclass: $scope.schoolclass,
      birthday: $scope.birthday.getTime(),
      gender: vm.genderIndex === null ? null : $scope.genders.genders[vm.genderIndex],
      desc: $scope.desc,
      lprovision: $scope.lprovision,
      wprovision: $scope.wprovision,
      street: $scope.street,
      zipcode: $scope.zipcode,
      town: $scope.town,
      lang: languageManager.setCurrentLanguage($scope.lang),
      traditye: $scope.traditye,
      dla_optin: $scope.dla_optin,
      delayorderhist: $scope.delayorderhist
    }, function(data) {
      switch (data.code) {
        case 'reg-email-already-present':
          notification(gettext('This e-mail address has already been taken'));
          break;
        case 'reg-name-already-present':
          notification(gettext('This user name has already been taken'));
          break;
        case 'reg-unknown-school':
          notification(gettext('The entered school has not been found'));
          break;
        case 'reg-too-short-pw':
          notification(gettext('Your password is too short!'));
          break;
        case 'reg-name-invalid-char':
          notification(gettext('Your user name contains invalid characters!'));
          break;
        case 'invalid-provision':
          notification(gettext('The entered provision value is invalid'));
          break;
      }
    });
  };

  $scope.resetUser = function() {
    var dlg = dialogs.confirm(gettext('Options'), gettext('Are you sure you want to reset?'));
    dlg.result.then(function(btn) {
      socket.emit('reset-user', null, function(data) {
        if (data.code == 'reset-user-success')
          notification(gettext('Sucessfully reset user!'), true);
      });
    });
  };

  socket.on('change-options', function(data) {
    if (data.code == 'reg-success') {
      notification(gettext('Sucessfully saved options'), true);

      socket.emit('get-own-options');
    }
    else if (data.code == 'reg-email-failed') {
      notification(gettext('Could not send verification e-mail. Please turn to tech@tradity.de.'));
    }
  });
  
  $scope.openDatepicker = function(event) {
    $scope.datepickerOpened = true;
  };


});

})();

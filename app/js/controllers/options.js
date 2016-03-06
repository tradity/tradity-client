(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
controller('OptionsCtrl', function($scope, md5, socket, safestorage, dailyLoginAchievements, config, dialogs, gettextCatalog, languageManager, $q, $rootScope) {
  $scope.genders = socket.get('/genders', { cache: true }).then(function(result) {
    if (!result._success) {
      return;
    }

    return $scope.genders = result.data;
  });

  $scope.getOptions = function() {
    socket.get('/options').then(function(result) {
      if (!result._success)
        return;

      $scope.DLAValidityDays = config.server().DLAValidityDays;
      $scope.show_dlainfo = false;
      $scope.dla_cert_days = dailyLoginAchievements.getCertificates().map(function(cert) {
        return new Date(cert.date);
      });
      $scope.name = result.data.name;
      $scope.giv_name = result.data.giv_name;
      $scope.fam_name = result.data.fam_name;
      $scope.realnamepublish = result.data.realnamepublish;
      $scope.password = null;
      $scope.password_check = null;
      $scope.email = result.data.email;
      $scope.school = result.data.school;
      $scope.schoolclass = result.data.schoolclass;
      $scope.desc = result.data.desc;
      $scope.lprovision = result.data.lprovision;
      $scope.wprovision = result.data.wprovision;
      $scope.street = result.data.street === 'null' ? '' : result.data.street;
      $scope.zipcode = result.data.zipcode === 'null' ? '' : result.data.zipcode;
      $scope.town = result.data.town === 'null' ? '' : result.data.town;

      $scope.lang = languageManager.setCurrentLanguage(result.data.lang);
      $scope.traditye = result.data.traditye && true;
      $scope.dla_optin = result.data.dla_optin && true;
      $scope.delayorderhist = result.data.delayorderhist;
      
      $scope.birthday = new Date(result.data.birthday);
      
      $scope.genderIndex = null;
      $q.when($scope.genders).then(function(genders) {
        $scope.genderIndex = genders.genders.indexOf(result.data.gender);
      });

      // if (data.result.birthday !== null) {
      //   var d = new Date(result.data.birthday);
      //   $scope.birthdayd = d.getUTCDate();
      //   $scope.birthdaym = d.getUTCMonth() + 1;
      //   $scope.birthdayy = d.getUTCFullYear();
      // }
    });
  };
  
  $scope.getOptions();

  $scope.handlePublishCode = function(result) {
    if (result._success) {
      notification(gettextCatalog.getString('Sucessfully uploaded profile picture!'), true);
      return;
    }
    
    switch(result.identifier) {
      case 'quota-exceeded':
        notification(gettextCatalog.getString('Your profile picture file is too large (maximum 3\u00a0MB)'));
        break;
      case 'inacceptable-role':
      case 'inacceptable-mime':
        notification(gettextCatalog.getString('There was a technical problem uploading your profile picture.\nPlease turn to tech@tradity.de'));
        break;
    }
  };

  $scope.useGravatar = function() {
    fileemit(socket, gettextCatalog, 'https://secure.gravatar.com/avatar/' + md5.createHash($scope.ownUser.email) + '?s=384', 
    '/dynamic/files', {
      method: 'POST',
      params: {
        role: 'profile.image',
        proxy: true
      }
    }, $scope.serverConfig, $q).then($scope.handlePublishCode);
  };

  $scope.$watch('lang', function() {
    languageManager.setCurrentLanguage($scope.lang);
  });

  $scope.changeOptions = function() {
    if (!$scope.password_check) $scope.password_check = null;
    if (!$scope.password) $scope.password = null;

    if ($scope.password_check != $scope.password)
      return notification(gettextCatalog.getString('The entered passwords do not match'));

    // var d = Date.UTC($scope.birthdayy, $scope.birthdaym - 1, $scope.birthdayd);
    // if (!$scope.birthdayy)
    //   d = null;

    var piFile = document.getElementById('profileimage').files[0];
    if (piFile) {
      fileemit(socket, gettextCatalog, piFile, '/dynamic/files', {
        method: 'POST',
        params: { role: 'profile.image' },
      }, $scope.serverConfig, $q).then($scope.handlePublishCode);
    }

    if ($scope.password)
      safestorage.setPassword($scope.password);

    if ($scope.dla_optin)
      dailyLoginAchievements.submitToServer(true);

    socket.put('/options', {
      data: {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        school: $scope.school,
        schoolclass: $scope.schoolclass,
        birthday: $scope.birthday.getTime(),
        gender: $scope.genderIndex === null ? null : $scope.genders.genders[$scope.genderIndex],
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
      }
    }).then(function(result) {
      $scope.getOptions();
      
      if (result._success)
        return;
      
      switch (data.identifier) {
        case 'email-already-present':
          notification(gettextCatalog.getString('This e-mail address has already been taken'));
          break;
        case 'name-already-present':
          notification(gettextCatalog.getString('This user name has already been taken'));
          break;
        case 'unknown-school':
          notification(gettextCatalog.getString('The entered school has not been found'));
          break;
        case 'too-short-pw':
          notification(gettextCatalog.getString('Your password is too short!'));
          break;
        case 'name-invalid-char':
          notification(gettextCatalog.getString('Your user name contains invalid characters!'));
          break;
        case 'invalid-provision':
          notification(gettextCatalog.getString('The entered provision value is invalid'));
          break;
      }
    });
  };

  $scope.resetUser = function() {
    var dlg = dialogs.confirm(gettextCatalog.getString('Options'), gettextCatalog.getString('Are you sure you want to reset?'));
    dlg.result.then(function(btn) {
      socket.post('/reset-user').then(function(result) {
        if (result._success)
          notification(gettextCatalog.getString('Sucessfully reset user!'), true);
      });
    });
  };

  $rootScope.$on('/options', function(result) {
    if (result.data) {
      return; // was GET request
    }
    
    if (result._success) {
      notification(gettextCatalog.getString('Successfully saved options'), true);

      return socket.get('/options');
    } /*else if (data.code == 'reg-email-failed') {
      notification(gettextCatalog.getString('Could not send verification e-mail. Please turn to tech@tradity.de.'));
    }*/
  });
  
  $scope.openDatepicker = function(event) {
    $scope.datepickerOpened = true;
  };


});

})();

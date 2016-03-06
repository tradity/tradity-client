(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
controller('RegistrationCtrl', function($scope, $stateParams, $state, user, dialogs, safestorage, gettextCatalog, languageManager, asyncLoadJS, socket) {
  var vm = this;
  vm.validateStatus = {
    name: '',
    email: ''
  };
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
  vm.password = '';
  vm.genderIndex = null;
  vm.datepickerOpened = false;
  var strengths = [
    {
      style: 'danger',
      text: gettextCatalog.getString('Too Weak')
    },
    {
      style: 'danger',
      text: gettextCatalog.getString('Too Weak')
    }, {
      style: 'warning',
      text: gettextCatalog.getString('Weak')
    },
    {
      style: 'info',
      text: gettextCatalog.getString('Good')
    },
    {
      style: 'success',
      text: gettextCatalog.getString('Excellent')
    },
  ];

  var validationMsg = { // [code: msg]
    'email-invalid-email': gettextCatalog.getString('Please enter your valid email'),
    'email-already-present': gettextCatalog.getString('Email has been used to register with us'),
    'name-invalid-char': gettextCatalog.getString('Username contains invalid characters!'),
    'name-already-present': gettextCatalog.getString('Username has been taken'),
  };

  // possibly redirect to game feed when already logged in
  user.me().then(function() {
    $state.go('game.feed');
  });


  vm.questionnaire = socket.get('/questionnaires').then(function(result) {
    if (!result._success)
      return;
    
    // ugly, works for now
    return vm.questionnaire = result.data.questionnaires[1];
  });

  // we work with the indexes in the gender array,
  // since angular cannot handle stuff like “Third Gender”
  vm.genders = socket.get('/genders', { cache: true }).then(function(result) {
    if (!result._success)
      return;

    return vm.genders = result.data;
  });

  vm.alerts = [];
  vm.closeAlert = function(index) {
    vm.alerts.splice(index, 1);
  };

  $scope.$watch(function() {
    return vm.lang;
  }, function() {
    languageManager.setCurrentLanguage(vm.lang);
  });

  if (vm.invitekey) {
    // XXX
    socket.get('/invitekey' + vm.invitekey).then(function(result) {
      if (result._success) {
        vm.email = result.data.email;
        vm.school = result.data.schoolid;
      }
    });
  }

  $scope.registerResultHandler = function(result) {
    if (result._success) {
      var modal = dialogs.notify(
        gettextCatalog.getString('Welcome to Tradity!'),
        // gettextCatalog.getString('Please click on the link in the verification e-mail we just sent you in order to be able to use the full functionality of Tradity and be eligible for winning the available prizes.'));
        gettextCatalog.getString('Please remember to choose your school or uni as a group to be eligible for the prizes.'));
      
      return modal.result.then(function(btn) {
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('Successful registration')
        });
        user.fetch();
        if (vm.questionnaire)
          $state.go('survey', {questionnaire: vm.questionnaire.questionnaire_id});
        else
          $state.go('game.feed');
      });
    }
    
    switch (result.identifier) {
      case 'email-already-present':
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('This e-mail address has already been taken')
        });
        break;
      case 'name-already-present':
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('This user name has already been taken')
        });
        break;
      case 'unknown-school':
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('The entered school has not been found')
        });
        break;
      case 'too-short-pw':
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('Your password is too short!')
        });
        break;
      case 'beta-necessary':
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('No valid beta key was entered')
        });
        break;
      case 'name-invalid-char':
        vm.alerts.push({
          type: 'danger',
          msg: gettextCatalog.getString('Your user name contains invalid characters!')
        });
        break;
    }
  };

  vm.register = function() {
    if (!vm.email)
      return vm.alerts.push({
        type: 'danger',
        msg: gettextCatalog.getString('Please provide an e-mail address')
      });
    /*if (!vm.agbread)
      return vm.alerts.push({
        type: 'danger',
        msg: gettextCatalog.getString('Please confirm that you have read the TOS')
      });*/
    if (vm.password_check != vm.password)
      return vm.alerts.push({
        type: 'danger',
        msg: gettextCatalog.getString('The entered passwords do not match')
      });
    if (!vm.giv_name || !vm.fam_name)
      return vm.alerts.push({
        type: 'danger',
        msg: gettextCatalog.getString('Please enter your name in order to be eligible for winning prizes')
      });
    if (!vm.school && vm.school !== null)
      return vm.alerts.push({
        type: 'danger',
        msg: gettextCatalog.getString('Please indicate which organization or school you belong to!')
      });
    /*if (isNaN(parseInt(vm.genderIndex)) && vm.genderIndex !== null)
      return vm.alerts.push({
        type: 'danger',
        msg: gettextCatalog.getString('Please indicate your gender or choose “Prefer not to say”.')
      });*/

    // var d = Date.UTC($scope.birthdayy, $scope.birthdaym - 1, $scope.birthdayd);
    // if (!$scope.birthdayy) d = null;

    safestorage.setPassword(vm.password);
    socket.post('/register', {
      data: {
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
        invitekey: vm.invitekey,
        gender: vm.genderIndex === null ? null : vm.genders.genders[vm.genderIndex],
        // birthday: d
        birthday: vm.birthday
      }
    }).then($scope.registerResultHandler);
  };

  vm.validateEmail = function() {
    socket.get('/validate-email/' + vm.email).then(function(result) {
      vm.validateStatus.email = !result._success;
      if (vm.validateStatus.email)
        vm.alerts.push({
          type: 'danger',
          msg: validationMsg['email-' + result.identifier]
        });
    });
  };

  vm.validateName = function() {
    socket.get('/validate-username/' + vm.name).then(function(result) {
      vm.validateStatus.name = !result._success;
      if (vm.validateStatus.name)
        vm.alerts.push({
          type: 'danger',
          msg: validationMsg['name-' + result.identifier]
        });
    });
  };

  var zxcvbnLoaded = asyncLoadJS(['/node_modules/zxcvbn/dist/zxcvbn.js']);

  $scope.$watch(function() {
    return vm.password;
  }, function(value) {
    return zxcvbnLoaded.then(function() {
      var result = zxcvbn(value || '');
      vm.password_score = result.score || 1;
      vm.password_style = strengths[result.score].style;
      vm.password_text = strengths[result.score].text;
    });
  });

  vm.openDatepicker = function(event) {
    vm.datepickerOpened = true;
  };
});

})();

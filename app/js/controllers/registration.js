(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
controller('RegistrationCtrl', function($scope, $stateParams, $state, user, dialogs, safestorage, gettext, languageManager, asyncLoadJS, socket) {
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
      text: gettext('Too Weak')
    },
    {
      style: 'danger',
      text: gettext('Too Weak')
    }, {
      style: 'warning',
      text: gettext('Weak')
    },
    {
      style: 'info',
      text: gettext('Good')
    },
    {
      style: 'success',
      text: gettext('Excellent')
    },
  ];

  var validationMsg = { // [code: msg]
    'reg-invalid-email': gettext('Please enter your valid email'),
    'reg-email-already-present': gettext('Email has been used to register with us'),
    'reg-name-invalid-char': gettext('Username contains not-allowed characters'),
    'reg-name-already-present': gettext('Username has been taken'),
  };

  // possibly redirect to game feed when already logged in
  user.me().then(function() {
    $state.go('game.feed');
  });


  vm.questionnaire = socket.emit('list-questionnaires').then(function(data) {
    if (data.code != 'list-questionnaires-success')
      return;
    
    // ugly, works for now
    return vm.questionnaire = data.questionnaires[1];
  });

  // we work with the indexes in the gender array,
  // since angular cannot handle stuff like “Third Gender”
  vm.genders = socket.emit('list-genders', { _cache: 500 }).then(function(data) {
    if (data.code != 'list-genders-success')
      return;

    return vm.genders = data.genders;
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
          // gettext('Please click on the link in the verification e-mail we just sent you in order to be able to use the full functionality of Tradity and be eligible for winning the available prizes.'));
          gettext('Please remember to choose your school or uni as a group to be eligible for the prizes.'));
        modal.result.then(function(btn) {
          vm.alerts.push({
            type: 'danger',
            msg: gettext('Successful registration')
          });
          user.fetch();
          if (vm.questionnaire)
            $state.go('survey', {questionnaire: vm.questionnaire.questionnaire_id});
          else
            $state.go('game.feed');
        });
        break;
      case 'reg-email-failed':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('Could not send verification e-mail. Please turn to tech@tradity.de.')
        });
        break;
      case 'reg-email-already-present':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('This e-mail address has already been taken')
        });
        break;
      case 'reg-name-already-present':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('This user name has already been taken')
        });
        break;
      case 'reg-unknown-school':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('The entered school has not been found')
        });
        break;
      case 'reg-too-short-pw':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('Your password is too short!')
        });
        break;
      case 'reg-beta-necessary':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('No valid beta key was entered')
        });
        break;
      case 'reg-name-invalid-char':
        vm.alerts.push({
          type: 'danger',
          msg: gettext('Your user name contains invalid characters!')
        });
        break;
    }
  });

  vm.register = function() {
    if (!vm.email)
      return vm.alerts.push({
        type: 'danger',
        msg: gettext('Please provide an e-mail address')
      });
    /*if (!vm.agbread)
      return vm.alerts.push({
        type: 'danger',
        msg: gettext('Please confirm that you have read the TOS')
      });*/
    if (vm.password_check != vm.password)
      return vm.alerts.push({
        type: 'danger',
        msg: gettext('The entered passwords do not match')
      });
    if (!vm.giv_name || !vm.fam_name)
      return vm.alerts.push({
        type: 'danger',
        msg: gettext('Please enter your name in order to be eligible for winning prizes')
      });
    /*if (!vm.schoolname_none && !vm.schoolname) // XXX
      return vm.alerts.push({ type: 'danger', msg: gettext('Please indicate which organization or school you belong to') });*/

    // var d = Date.UTC($scope.birthdayy, $scope.birthdaym - 1, $scope.birthdayd);
    // if (!$scope.birthdayy) d = null;

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
      invitekey: vm.invitekey,
      gender: vm.genders.genders[vm.genderIndex],
      // birthday: d
      birthday: vm.birthday
    });
  };

  vm.validateEmail = function() {
    socket.emit('validate-email', {
      email: vm.email
    }, function(data) {
      vm.validateStatus.email = data.code != 'validate-email-valid';
      if (vm.validateStatus.email)
        vm.alerts.push({
          type: 'danger',
          msg: validationMsg[data.code]
        });
    });
  };

  vm.validateName = function() {
    socket.emit('validate-username', {
      name: vm.name
    }, function(data) {
      vm.validateStatus.name = data.code != 'validate-username-valid';
      if (vm.validateStatus.name)
        vm.alerts.push({
          type: 'danger',
          msg: validationMsg[data.code]
        });
    });
  };

  var zxcvbnLoaded = asyncLoadJS(['js/jit/zxcvbn.js']);

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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Component, OnInit } from '@angular/core';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdButton } from '@angular2-material/button';

@Component({
  selector: 'tradity-login',
  templateUrl: 'app/login/login.component.html',
  styleUrls: ['app/login/login.component.css'],
  directives: [MD_INPUT_DIRECTIVES, MdButton]
})
export class LoginComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('initiate LoginComponent');
  }

}

/*
export default class LoginComponent {
  templateUrl = 'app/login/login.component.html';
}

function LoginController(user, $stateParams, $state, safestorage, socket, gettextCatalog) {
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
    socket.post('verify-email', {
      data: {
        key: $stateParams.emailVerifCode,
        uid: $stateParams.uid
      }
    }).then(function(result) {
      if (result._success) {
        vm.alerts.push({ type: 'success', msg:'Emailadresse erfolgreich bestätigt'});
        user.fetch();
        $state.go('game.feed');
        return;
      }
      
      switch (data.identifier) {
        case 'already-verified':
          vm.alerts.push({ type: 'danger', msg:'Emailadresse bereits bestätigt'});
          break;
        case 'other-already-verified':
          vm.alerts.push({ type: 'danger', msg:'Jemand anderes hat diese Emailadresse bereits bestätigt'});
          break;
        default:
          vm.alerts.push({ type: 'danger', msg:'Fehler beim Bestätigen der Emailadresse'});
          break;
      }
    });
  }
  
  vm.login = function() {
    vm.logging_in = true;
    safestorage.setPassword(vm.password);
    socket.post('/login', {
      data: {
        name: vm.username,
        pw: vm.password,
        stayloggedin: vm.stayloggedin
      }
    }).then(function(result) {
      vm.logging_in = false;
      if (result._success) {
        user.fetch();
        location.href = '/feed';
        return;
      }
      
      vm.alerts.push({ type: 'danger', msg:gettextCatalog.getString('Wrong username or password')});
    });
  };

  vm.passwordReset = function() {
    return socket.post('/reset-password', {
      data: {
        name: vm.username
      }
    }).then(function(result) {
      if (result._success) {
        vm.alerts.push({ type: 'success', msg:'Neues Passwort erfolgreich versandt'});
      } else if (result.identifier == 'user-not-found') {
        vm.alerts.push({ type: 'danger', msg:'Benutzer „' + vm.username + '“ existiert nicht'});
      } else {
        vm.alerts.push({ type: 'danger', msg:'Das neue Passwort konnte nicht versandt werden. Bitte an tech@tradity.de wenden'});
      }
    });
  };
}
*/
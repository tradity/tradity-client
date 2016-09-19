/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Component } from '@angular/core';
import 'rxjs/Rx'; // load the full rxjs

import { ApiService } from './api.service';
import { UserService } from './user.service';

@Component({
  selector: 'tradity',
  template: '<router-outlet></router-outlet>',
  providers: [
    ApiService,
    UserService
  ]
})
export class AppComponent {
  
  constructor(private userService: UserService) { }
  
}

/*
export default class TradityComponent {
    template = '<ng-outlet></ng-outlet>';
    $routeConfig = [
      {path: '/login/...', name: 'Login', component: 'login', useAsDefault: true}
    ];
}

function TradityController($sce, ranking, $feed, $user, $rootScope, $scope, $location,
    $state, $stateParams, socket, safestorage, dailyLoginAchievements, $http, $interval, $timeout,
    gettextCatalog, languageManager, API_HOST, API_CONNECT_TEST_PATH, DEFAULT_PROFILE_IMG)
  {
    $scope.Math = Math;
    $scope.vtime = function(t) {
      return vagueTime.get({
        to: t,
        units: 's',
        lang: languageManager.getCurrentLanguage()
      });
    };

    $scope.isAdmin = false;
    $rootScope.ownUser = $scope.ownUser = $user;
    $scope.loading = false;
    $scope.serverConfig = {};
    $scope.hasOpenQueries = socket.hasOpenQueries;

    $scope.toggleM = function() {
      console.log('sdfs');
      $('#pagenav').toggleClass('hidden-xs');
    };
    
    $scope.connectionLastRx = 0;
    $scope.connectionCheck = function() {
      var alive = function() {
        if ($state.includes('error.connection')) {
          $state.go('game.feed');
        }
      };
      var dead = function() {
        $state.go('error.connection');
      };
      
      var curRx = socket.received;
      if (curRx > $scope.connectionLastRx) {
        $scope.connectionLastRx = curRx;
        return alive(); // everything okay
      }
      
      $scope.connectionLastRx = curRx;
      socket.get('/ping').then(function(result) {
        if (result._success) {
          alive();
        }
      });
      
      $timeout(function() {
        if (socket.received > $scope.connectionLastRx)
          return;
        
        $http.get(API_HOST + API_CONNECT_TEST_PATH).then(alive, dead);
      }, 3000);
    };
    
    $timeout($scope.connectionCheck, 3141);
    var connectionCheck = $interval($scope.connectionCheck, 20000);
    
    $scope.$on('destroy', function() {
      $interval.cancel(connectionCheck);
    });

    $scope.showSearch = function() {
      $scope.search = true;
    };

    $scope.openSearch = function(query) {
      $state.go('game.search', {
        query: query
      });
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) { 
      if (toParams.query) {
        $scope.searchBarText = toParams.query;
        $scope.search = true;
      }
      else {
        $scope.search = false;
        $scope.searchBarText = '';
      }
    });

    $scope.$on('makeadmin', function() {
      $scope.isAdmin = true;
    });

    $scope.$on('user-update', function() {
      if (!$scope.ownUser || !$scope.ownUser.uid) {
        $scope.isAdmin = false;
        return;
      }
      
      safestorage.check().then(function() {
        dailyLoginAchievements.check();
      });

      if ($scope.isAdmin)
        return;

      if ($scope.ownUser.access && $scope.ownUser.access.indexOf('*') != -1)
        $scope.$emit('makeadmin');

      if (!$scope.ownUser.profilepic)
        $scope.ownUser.profilepic = DEFAULT_PROFILE_IMG;
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.logout = function() {
      $scope.eventIDs = {};
      $scope.messages = [];
      
      socket.post('/logout').then(function(data) {
        safestorage.clear();
        
        $scope.ownUser = null;
        $scope.isAdmin = false;
        $scope.$broadcast('user-update', null);
        $state.go('index.login');
      });
    };
    
    $rootScope.$on('socket:answer', function(ev, answer) {
      // console.log('socket:answer -> ', answer);
      if (answer.result.identifier === 'login-required') {
        $user = $rootScope.$new(true);
        
        $rootScope.$broadcast('user-update', null);
        if ($state.includes('game'))
          $state.go('index.login');
      }
    });

    socket.get('/config').then(function(result) {
      var cfg = result.data;
      for (var k in cfg)
        $scope.serverConfig[k] = cfg[k];
      
      $scope.ownUserRanking = ranking.getRanking(null, $scope.serverConfig.ranking || {}, null, null, true);
      $scope.ownUserRanking.onRankingUpdated(function() {
        if ($scope.ownUser && $scope.ownUser.uid)
          $scope.ownUser.rank = $scope.ownUserRanking.get('all').rankForUser($scope.ownUser.uid);
      });
      
      $scope.$on('user-update', function() {
        if ($scope.ownUser && $scope.ownUser.uid)
          $scope.ownUserRanking.fetch();
      });
    });
    
    $rootScope.$on('socket:answer', function(ev, answer) {
      if (answer.response.status >= 500) {
        notification(gettextCatalog.getString('There was a technical problem – the tech team of Tradity has been informed.'));
      }
    });
  }
*/
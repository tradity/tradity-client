(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('AdminUserlistCtrl', function($scope, $stateParams, $state, socket) {
    $scope.userlist = [];
    $scope.totalDisplayed = 20;
    
    $scope.reverse = true;
    $scope.showImpersonate = true;
    $scope.showID = true;
    $scope.showName = true;
    $scope.showFullName = true;
    $scope.showEMail = true;
    $scope.showLastLogin = false;
    $scope.showRegisterTime = true;
    $scope.showTrades = false;
    $scope.showComments = false;
    $scope.showLastComment = false;
    $scope.showBirthday = false;
    $scope.showSchool = true;
    $scope.showAddress = false;
    $scope.showProvision = false;
    $scope.showDeletion = false;
    $scope.showFreemoney = false;
    $scope.showTotalvalue = false;
    $scope.showRecvProvision = false;
    $scope.showDeleteUser = true;

    $scope.loadMore = function() {
      $scope.totalDisplayed += 10;
    };
    
    var gini = function(data) {
      // https://en.wikipedia.org/wiki/Gini_coefficient#Calculation
      
      var weightedSum = 0;
      var sum = 0;
      
      for (var i = 0; i < data.length; ++i) {
        weightedSum += (i+1) * data[i];
        sum += data[i];
      }
      
      return (2 * weightedSum) / (data.length * sum) - 1.0 - (1 / data.length);
    };
    
    $scope.listAllUsers = function() {
      socket.get('/users').then(function(data) {
        if (data.code != 'list-all-users-success')
          return;
      
        $scope.userlist = data.results;
        
        $scope.usercount = 0;
        $scope.tradeusers = 0;
        $scope.tickusers = 0;
        $scope.verifusers = 0;
        
        var tradedistr = [];
        
        for (var i = 0; i < $scope.userlist.length; ++i) {
          var u = $scope.userlist[i];
          ++$scope.usercount;
          if (u.emailverif) ++$scope.verifusers;
          if (u.tradecount >= 1) ++$scope.tradeusers;
          
          tradedistr.push(u.tradecount);
        }
        
        tradedistr.sort();
        $scope.tradeGini = gini(tradedistr);
      });
    };
    
    $scope.exportEmailCSV = function() {
      var quote = function(s) {
        if (s == null)
          return 'NULL';
        return JSON.stringify(String(s));
      };
      
      var csv = '"giv_name";"fam_name";"name";"registertime";"email";"name"\n' +
      $scope.userlist.map(function(u) {
        return [
          quote(u.giv_name), quote(u.fam_name), quote(u.name),
          parseInt(u.registertime) || 0, quote(u.email), quote(u.schoolpath)
        ].join(';');
      }).join('\n') + '\n';
      
      var blob = new Blob([new TextEncoder().encode(csv)], {type: 'text/csv;charset=utf-8'});
      var url = URL.createObjectURL(blob);
      window.open(url, 'export_email_csv');
    };
    
    $scope.listAllUsers();
    
    $scope.changeUserEMail = function(user) {
      var email = prompt('Geänderte E-Mail-Adresse: (leer lassen, um es bei „' + user.email + '“ zu belassen)') || user.email;
      var emailverif = confirm('E-Mail-Adresse bestätigt?');
      socket.put('/user/' + user.uid + '/email', {
        data: {
          email: email,
          emailverif: emailverif
        }
      }).then(function(data) {
        $scope.listAllUsers();
      });
    };
    
    $scope.deleteUser = function(user) {
      if (!confirm('Wirklich User ' + user.uid + ' („' + user.name + '“) löschen?'))
        return;
      
      socket.delete('/user/' + user.uid).then(function(data) {
        alert('Ein User weniger… *schnief*');
        $scope.listAllUsers();
      });
    };
  });

})();

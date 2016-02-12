(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('ProfileCtrl', function($scope, user, $sce, $state, $stateParams, DEFAULT_PROFILE_IMG, socket, gettextCatalog) {
    $scope.values = [];
    $scope.userAchievements = [];
    $scope.user = null;
    $scope.orders = [];

    user.get($stateParams.userId).then(function(user){
      if (!user) {
        // ?!
        alert('Ups');
        return;
      }
      $scope.user = user;
      $scope.values = user.values;
      $scope.userAchievements = user.achievements;
      var orders = user.orders;
      orders.sort(function(a,b) { return b.buytime - a.buytime; });
      for (var i in orders) {
        if (orders[i].money > 0) {
          orders[i].ordertype = 'depot-buy';
        } else if (orders[i].money < 0) {
          orders[i].ordertype = 'depot-sell';
        } else {
          orders[i].ordertype = '';
        }
        orders[i].price = Math.abs(orders[i].money / orders[i].amount);
      }
      $scope.orders = orders;
      user.pinboard.sort(function(a,b) { return b.time - a.time; });
      $scope.comments = user.pinboard;
      $.each($scope.comments, function(i, e) {
        e.comment = $sce.trustAsHtml(e.trustedhtml ? e.comment : escapeHTML(e.comment));
      });
    });
    
    $scope.addToWatchlist = function() {
      socket.emit('watchlist-add', {
        stockid: $scope.user.lstockid
      },
      function(data) {
        if (data.code == 'watchlist-add-success') {
          notification(gettextCatalog.getString('Added user {{name}} to your watch list', {
            name: $scope.user.name
          }), true);
        } else if (data.code == 'watchlist-add-notfound') {
          notification(gettextCatalog.getString('User not found – something went wrong here'));
        }
      });
    };
    
    // in case a profile gets called without /overview
    if ($state.includes('*.profile'))
      $state.go('.overview');
  });

})();

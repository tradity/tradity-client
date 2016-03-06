(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('DepotCtrl', function($scope, $rootScope, socket, gettextCatalog) {
    var ownDepotOrUser = function() {
      if (!$scope.ownUser || !$scope.ownUser.uid)
        return;
      
      $scope.ownUser.depotvalue = 0;
      for (var i in $scope.results) {
        $scope.ownUser.depotvalue += parseInt($scope.results[i].total);
      }
    };

    socket.get('/depot').then(function(data) {
      if (data._success) {
        $scope.results = data.results;
        ownDepotOrUser();
      }
    });

    socket.get('/user/$self').then(function(result) {
      var orders = result.orders;
      if (!orders)
        return;

      orders.sort(function(a,b) { return b.buytime - a.buytime; });
      for (var i in orders) {
        if (orders[i].money > 0) {
          orders[i].ordertype = 'depot-buy';
        } else if (orders[i].money < 0) {
          orders[i].ordertype = 'depot-sell';
        } else {
          orders[i].ordertype = '';
        }
        orders[i].price = (orders[i].money / orders[i].amount);
      }
      $scope.orders = orders;
    });

    $scope.listDQueries = function() {
      socket.get('/dqueries').then(function(result) {
        $scope.delayedOrders = [];
        for (var i = 0; i < result.data.length; ++i) {
          var q = result.data[i];
          if (q.query.type == 'stock-buy') {
            q.buysell = q.query.amount < 0 ? 'sell' : 'buy';
            q.amount = Math.abs(q.query.amount);
            $scope.delayedOrders.push(q);
          }
        }
      });
    };
    
    $scope.listDQueries();

    $scope.removeDelayedOrder = function(id) {
      socket.delete('/dqueries/' + id).then(function(result) {
        if (result._success) {
          $scope.listDQueries();
        } else if (data.code == 404) {
          notification(gettextCatalog.getString('Order not found. Possibly it has already been executed?'));
        }
      });
    };

    $scope.showWatchlist = function() {
      socket.get('/watchlist').then(function(result) {
        if (result._success) {
          $scope.watchlist = result.data;
        }
      });
    };
    
    $scope.removeFromWatchlist = function(entry) {
      socket.delete('/watchlist' + entry.id).then(function(result) {
        if (result._success) {
          notification(gettextCatalog.getString('{{stockname}} removed from the watchlist', {
            stockname: entry.stockname
          }), true);
          
          $scope.showWatchlist();
        }
      });
    };
    
    $scope.showWatchlist();
  });

})();

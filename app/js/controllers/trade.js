(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('TradeCtrl', function($stateParams, $state, $location, socket, gettext, gettextCatalog,
    dialogs, orderByFilter, searchStringSimilarity, config) {
        var vm = this;
    vm.amount = null;
    vm.value = null;
    vm.stockid = null;
    vm.stockname = null;
    vm.leader = null;
    vm.cur = null;
    vm.xtype = 'market';
    vm.xvalue = '';
    vm.sellbuy = 1;
    vm.fee = 0;
    vm.forceNow = false;
    vm.isMarketOrder = true;
    vm.results = [];
    vm.popularStocks = [];
    vm.showPopularStocks = false;
    vm.showTradeThrobber = false;

    vm.togglePopularStocks = function() {
      vm.showPopularStocks = !vm.showPopularStocks;
    };

    vm.buy = function() {
      if (!vm.amount)
        return;
      if (!vm.leader && !vm.stockid)
        return dialogs.error('tradity', gettext('You need to choose a stock!'));
        
      var dlg = dialogs.confirm(gettext('Trade'),
        gettextCatalog.getString('Do you want to trade {{amount}} {{shares}} of {{stockname}}?', {
          stockname: vm.stockname,
          amount: vm.amount,
          shares: gettextCatalog.getPlural(vm.amount, 'share', 'shares')
        }));

      dlg.result.then(function(btn) {
        /*if (vm.stockid == 'US38259P5089')  {
          $state.go('game.depot.listing');
          return;
        } else if (vm.stockid = 'walkthrough') {
          $state.go('game.ranking.all');
          return;
        }*/

        var query = {
          amount: vm.amount * vm.sellbuy,
          stockid: vm.stockid,
          leader: vm.leader,
          forceNow: vm.forceNow,
          retainUntilCode: 'stock-buy-success',
          dquerydata: { /* will be returned in the dquery-exec event */
            xtype: vm.xtype,
            xvalue: parseFloat(vm.xvalue.replace(',', '.')),
            name: vm.stockname,
            amount: vm.amount * vm.sellbuy,
            delayedquery: true,
            ordertime: new Date().getTime()
          }
        };
        var qtype = 'stock-buy';
        if (vm.xtype != 'market') {
          if (vm.xvalue == null)
            return dialogs.error('tradity', gettext('Please enter a numerical stop/limit value'));
          var fieldname = (vm.amount >= 0) ^ (vm.sellbuy < 0) ? 'ask' : 'bid';
          var compar = !((vm.xtype == 'limit') ^ (vm.amount >= 0) ^ (vm.sellbuy < 0)) ? '<' : '>';
          
          var condition = '';
          var stockid = vm.stockid;
          if (!vm.leader)
            condition = 'stock::' + vm.stockid + '::exchange-open > 0 ∧ ';
          else
            stockid = '__LEADER_' + vm.leader + '__';
          condition += 'stock::' + stockid + '::' + fieldname + ' ' + compar + ' ' + (parseFloat(vm.xvalue.replace(',', '.')) * 10000);
          query.type = qtype;
          query = {
            condition: condition,
            query: query
          };
          qtype = 'dquery';
        }
        
        socket.emit(qtype, query, function(data) {
          var modal;
          
          switch (data.code) {
            case 'dquery-success':
              modal = dialogs.notify('tradity', gettext('The trade will be executed as soon as the given conditions are fulfilled.'));
              modal.result.then(function(btn) {
                $state.go('game.depot.transactions');
              });
              break;
            case 'stock-buy-success':
              modal = dialogs.notify('tradity', gettext('Successfully traded!'));
              modal.result.then(function(btn) {
                $state.go('game.depot.listing');
              });
              break;
            case 'stock-buy-email-not-verif':
              dialogs.error('tradity', gettext('You need to provide a verified e-mail address in order to be eligible for follower trades!'));
              break;
            case 'stock-buy-out-of-money':
              dialogs.error('tradity', gettext('You do not have enough leftover money for this trade!'));
              break;
            case 'stock-buy-single-paper-share-exceed':
              dialogs.error('tradity', gettext('Only 50\u00a0% of your assets may consist of a single stock!'));
              break;
            case 'stock-buy-not-enough-stocks':
              dialogs.error('tradity', gettext('Not enough stocks!'));
              break;
            case 'stock-buy-autodelay-sxnotopen':
              modal = dialogs.notify('tradity', gettext('The trade will be executed when the stock exchange opens'));
              modal.result.then(function(btn) {
                $state.go('game.depot.transactions');
              });
              break;
            case 'stock-buy-over-pieces-limit':

              dialogs.error('tradity', gettext('Unfortunately, your trade exceeds the maximum tradable amount of this stock'));
              break;
            case 'stock-buy-stock-not-found':
              dialogs.error('tradity', gettext('This stock could not be found!'));
              break;
          }
        });
      });
    };
    
    vm.searchStocks = function(stockname) {
      return socket.emit('stock-search', {
        name: stockname
      }).then(function(data) {
        if (data.code != 'stock-search-success')
          throw new Error('Stock search failed with ' + data.code);
        
        return orderByFilter(data.results.filter(function(stock) {
          return !stock.leader || stock.leader != vm.ownUser.uid;
        }).map(function(stock) {
          stock.textName = stock.leader ? gettext('Leader: %1').replace(/%1/g, stock.leadername) : stock.name;
          stock.extraInfo = (parseInt(stock.lastvalue / 100) / 100) +
            (stock.exchange ? '\u00a0' + stock.exchange : '');
          stock.sortingRank = searchStringSimilarity(stockname, stock.textName);
          return stock;
        }), 'sortingRank', true);
      });
    };
    
    vm.selectedStock = function(stock) {
      vm.stockname = stock.leader ? stock.textName : stock.name;
      vm.stockid = stock.leader ? null : stock.stockid;
      vm.leader = stock.leader || null;
      vm.cur = stock;
      vm.value = vm.amount = null;
    };
    
    vm.calcValue = function() {
      if (!vm.cur) return;
      if (vm.sellbuy == 1) {
        vm.value = String(vm.amount * (vm.cur.ask / 10000)).replace('.', ',');
      } else if (vm.sellbuy == -1) {
        vm.value = String(vm.amount * (vm.cur.bid / 10000)).replace('.', ',');
      }
      vm.calcFee();
    };
    vm.calcAmount = function() {
      if (!vm.cur) return;
      if (vm.sellbuy == 1) {
        vm.amount = Math.floor(parseFloat(vm.value.replace(',', '.')) / (vm.cur.ask / 10000));
      } else if (vm.sellbuy == -1) {
        vm.amount = Math.floor(parseFloat(vm.value.replace(',', '.')) / (vm.cur.bid / 10000));
      }
      vm.calcFee();
    };
    vm.calcFee = function() {
      vm.fee = Math.max(Math.abs(config.server().transactionFeePerc * parseFloat(vm.value.replace(',', '.'))), config.server().transactionFeeMin / 10000);
    };

    if ($stateParams.sellbuy) {
      if ($stateParams.sellbuy == 'sell') {
        vm.sellbuy = -1;
      } else if ($stateParams.sellbuy == 'buy') {
        vm.sellbuy = 1;
      }
      vm.stockid = $stateParams.stockId;

      /*if (vm.stockid != 'walkthrough') {*/
        socket.emit('stock-search', {
          name: vm.stockid
        }, function(data) {
          if (data.code == 'stock-search-success') {
            for (var i = 0; i < data.results.length; ++i) {
              if (data.results[i].stockid == vm.stockid) {
              vm.selectedStock(data.results[i]);
              break;
              }
            }
            vm.amount = parseInt($stateParams.amount);
            vm.calcValue();
          }
        });
      /*} else {
        console.log("sdfsdfdsfd")
        vm.stockname = 'google';

        vm.amount = 1;
        vm.ask = 4154500;
        vm.bid = 4133900;
        vm.lastvalue = 4139300;
        vm.name = 'Google';

        vm.cur = {
          amount: 1,
          ask: 4154500,
          bid: 4133900,
          lastvalue: 4139300,
          name: 'Google',
        }
        vm.amount = 1;
        vm.value = 1;
        vm.calcValue();
      }*/
    }
    
    socket.emit('list-popular-stocks', {_cache: 1800}, function(data) {
      vm.popularStocks = data.results;
    });
  });

})();

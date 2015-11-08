'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('TradeCtrl', function($scope, $stateParams, $state, $location, socket, gettext, gettextCatalog,
		dialogs, orderByFilter, searchStringSimilarity)
	{
		$scope.amount = null;
		$scope.value = null;
		$scope.stockid = null;
		$scope.stockname = null;
		$scope.leader = null;
		$scope.cur = null;
		$scope.xtype = 'market';
		$scope.xvalue = '';
		$scope.sellbuy = 1;
		$scope.fee = 0;
		$scope.forceNow = false;
		$scope.isMarketOrder = true;
		$scope.results = [];
		$scope.popularStocks = [];
		$scope.showPopularStocks = false;
		$scope.showTradeThrobber = false;

		$scope.togglePopularStocks = function() {
			$scope.showPopularStocks = !$scope.showPopularStocks;
		}

		$scope.buy = function() {
			if (!$scope.amount)
				return;
			if (!$scope.leader && !$scope.stockid)
				return dialogs.error(gettext('You need to choose a stock!'));
				
			var dlg = dialogs.confirm(gettext('Trade'),
				gettextCatalog.getString('Do you want to trade {{amount}} {{shares}} of {{stockname}}?', {
					stockname: $scope.stockname,
					amount: $scope.amount,
					shares: gettextCatalog.getPlural($scope.amount, 'share', 'shares')
				}));

			dlg.result.then(function(btn) {
				/*if ($scope.stockid == 'US38259P5089')  {
					$state.go('game.depot.listing');
					return;
				} else if ($scope.stockid = 'walkthrough') {
					$state.go('game.ranking.all');
					return;
				}*/

				var query = {
					amount: $scope.amount * $scope.sellbuy,
					stockid: $scope.stockid,
					leader: $scope.leader,
					forceNow: $scope.forceNow,
					retainUntilCode: 'stock-buy-success',
					dquerydata: { /* will be returned in the dquery-exec event */
						xtype: $scope.xtype,
						xvalue: parseFloat($scope.xvalue.replace(',', '.')),
						name: $scope.stockname,
						amount: $scope.amount * $scope.sellbuy,
						delayedquery: true,
						ordertime: new Date().getTime()
					}
				};
				var qtype = 'stock-buy';
				if ($scope.xtype != 'market') {
					if ($scope.xvalue == null)
						return dialogs.error(gettext('Please enter a numerical stop/limit value'));
					var fieldname = ($scope.amount >= 0) ^ ($scope.sellbuy < 0) ? 'ask' : 'bid';
					var compar = !(($scope.xtype == 'limit') ^ ($scope.amount >= 0) ^ ($scope.sellbuy < 0)) ? '<' : '>';
					
					var condition = '';
					var stockid = $scope.stockid;
					if (!$scope.leader)
						condition = 'stock::' + $scope.stockid + '::exchange-open > 0 ∧ ';
					else
						stockid = '__LEADER_' + $scope.leader + '__';
					condition += 'stock::' + stockid + '::' + fieldname + ' ' + compar + ' ' + (parseFloat($scope.xvalue.replace(',', '.')) * 10000);
					query.type = qtype;
					query = {
						condition: condition,
						query: query
					};
					qtype = 'dquery';
				}
				
				socket.emit(qtype, query, function(data) {
					switch (data.code) {
						case 'dquery-success':
							var modal = dialogs.notify('tradity', gettext('The trade will be executed as soon as the given conditions are fulfilled.'));
							modal.result.then(function(btn) {
								$state.go('game.depot.transactions');
							});
							break;
						case 'stock-buy-success':
							var modal = dialogs.notify('tradity', gettext('Successfully traded!'));
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
							var modal = dialogs.notify('tradity', gettext('The trade will be executed when the stock exchange opens'));
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
		
		$scope.searchStocks = function(stockname) {
			return socket.emit('stock-search', {
				name: stockname
			}).then(function(data) {
				if (data.code != 'stock-search-success')
					throw new Error('Stock search failed with ' + data.code);
				
				return orderByFilter(data.results.filter(function(stock) {
					return !stock.leader || stock.leader != $scope.ownUser.uid;
				}).map(function(stock) {
					stock.textName = stock.leader ? gettext('Leader: %1').replace(/%1/g, stock.leadername) : stock.name;
					stock.extraInfo = (parseInt(stock.lastvalue / 100) / 100)
						+ (stock.exchange ? '\u00a0' + stock.exchange : '');
					stock.sortingRank = searchStringSimilarity(stockname, stock.textName);
					return stock;
				}), 'sortingRank', true);
			});
		};
		
		$scope.selectedStock = function(stock) {
			$scope.stockname = stock.leader ? stock.textName : stock.name;
			$scope.stockid = stock.leader ? null : stock.stockid;
			$scope.leader = stock.leader || null;
			$scope.cur = stock;
			$scope.value = $scope.amount = null;
		};
		
		$scope.calcValue = function() {
			if (!$scope.cur) return;
			if ($scope.sellbuy == 1) {
				$scope.value = String($scope.amount * ($scope.cur.ask / 10000)).replace('.', ',');
			} else if ($scope.sellbuy == -1) {
				$scope.value = String($scope.amount * ($scope.cur.bid / 10000)).replace('.', ',');
			}
			$scope.calcFee();
		};
		$scope.calcAmount = function() {
			if (!$scope.cur) return;
			if ($scope.sellbuy == 1) {
				$scope.amount = Math.floor(parseFloat($scope.value.replace(',', '.')) / ($scope.cur.ask / 10000));
			} else if ($scope.sellbuy == -1) {
				$scope.amount = Math.floor(parseFloat($scope.value.replace(',', '.')) / ($scope.cur.bid / 10000));
			}
			$scope.calcFee();
		};
		$scope.calcFee = function() {
			$scope.fee = Math.max(Math.abs($scope.serverConfig.transactionFeePerc * parseFloat($scope.value.replace(',', '.'))), $scope.serverConfig.transactionFeeMin / 10000);
		};

		if ($stateParams.sellbuy) {
			if ($stateParams.sellbuy == 'sell') {
				$scope.sellbuy = -1;
			} else if ($stateParams.sellbuy == 'buy') {
				$scope.sellbuy = 1;
			}
			$scope.stockid = $stateParams.stockId;

			/*if ($scope.stockid != 'walkthrough') {*/
				socket.emit('stock-search', {
					name: $scope.stockid
				}, function(data) {
					if (data.code == 'stock-search-success') {
						for (var i = 0; i < data.results.length; ++i) {
							if (data.results[i].stockid == $scope.stockid) {
							$scope.selectedStock(data.results[i]);
							break;
							}
						}
						$scope.amount = parseInt($stateParams.amount);
						$scope.calcValue();
					}
				});
			/*} else {
				console.log("sdfsdfdsfd")
				$scope.stockname = 'google';

				$scope.amount = 1;
				$scope.ask = 4154500;
				$scope.bid = 4133900;
				$scope.lastvalue = 4139300;
				$scope.name = 'Google';

				$scope.cur = {
					amount: 1,
					ask: 4154500,
					bid: 4133900,
					lastvalue: 4139300,
					name: 'Google',
				}
				$scope.amount = 1;
				$scope.value = 1;
				$scope.calcValue();
			}*/
		}
		
		socket.emit('list-popular-stocks', {_cache: 1800}, function(data) {
			$scope.popularStocks = data.results;
		});
	});

angular.module('tradity').
	controller('TradeCtrl', function($scope, $stateParams, $state, $location, socket, dialogs) {
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

		$scope.togglePopularStocks = function() {
			$scope.showPopularStocks = !$scope.showPopularStocks;
		}

		$scope.buy = function() {
			if (!$scope.amount)
				return;
			if (!$scope.leader && !$scope.stockid)
				return dialogs.error('Du musst ein Wertpapier auswählen!');
				
			dlg = dialogs.confirm('Trade', 'Willst du ' + $scope.amount + ' ' + ($scope.amount > 1 ? 'Aktien' : 'Aktie') + ' von ' + $scope.stockname + ' ' + ($scope.sellbuy >= 0 ? 'kaufen' : 'verkaufen') + '?');

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
						return dialogs.error('Bitte geben Sie den Stop-/Limitwert als Zahl an');
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
							var modal = dialogs.notify('tradity', 'Der Trade wird ausgeführt, sobald die angegebenen Bedingungen erfüllt sind.');
							modal.result.then(function(btn) {
								$state.go('game.depot.transactions');
							});
							break;
						case 'stock-buy-success':
							var modal = dialogs.notify('tradity', 'Trade erfolgreich!');
							modal.result.then(function(btn) {
								$state.go('game.depot.listing');
							});
							break;
						case 'stock-buy-email-not-verif':
							dialogs.error('tradity', 'Deine E-Mail muss bestätigt sein, um Followertrades zu machen!');
							break;
						case 'stock-buy-out-of-money':
							dialogs.error('tradity', 'Nicht genügend Geld zum Trade!');
							break;
						case 'stock-buy-single-paper-share-exceed':
							dialogs.error('tradity', 'Dein Vermögen darf höchstens zu 50 % in ein einzelnes Wertpapier investiert sein!');
							break;
						case 'stock-buy-not-enough-stocks':
							dialogs.error('tradity', 'Nicht genug Wertpapiere');
							break;
						case 'stock-buy-autodelay-sxnotopen':
							var modal = dialogs.notify('tradity', 'Der Trade wird ausgeführt, sobald der Handelsplatz öffnet');
							modal.result.then(function(btn) {
								$state.go('game.depot.transactions');
							});
							break;
						case 'stock-buy-over-pieces-limit':

							dialogs.error('tradity', 'Leider übersteigt dein Trade die handelbare Menge für dieses Wertpapier!');
							break;
						case 'stock-buy-stock-not-found':
							dialogs.error('tradity', 'Wertpapier existiert nicht');
							break;
					}
				});
			});
		};
		var gotData;
		$scope.acFetcher = {
			fetchAutoComplete: function(ac, s) {
				socket.emit('stock-search', {
					name: s
				}, function(data) {
					if (data.code == 'stock-search-success') {
						var suggestions = [];
						for (var i in data.results) {
							if (data.results[i].leader == $scope.ownUser.uid)
								continue;
							data.results[i].getEntryName = 
							data.results[i].getInputTextValue = function() { return this.leader ? 'Leader: ' + this.leadername : this.name; };
							data.results[i].getExtra = function() { return (parseInt(this.lastvalue / 100) / 100) + (this.exchange ? ' ' + this.exchange : ''); };
							suggestions.push(data.results[i]);
						}
						$scope.results = suggestions;
						ac.putData(suggestions, s);
					}
				});
			},
			submit: gotData = function(ac, data) {
				document.getElementById('paper').value =
				$scope.stockname = data.leader ? 'Leader: ' + data.leadername : data.name;
				$scope.stockid = data.leader ? null : data.stockid;
				$scope.leader = data.leader ? data.leader : null;
				$scope.cur = data;
				$scope.value = $scope.amount = null;
			}, valuecreate: function(ac, data, element, focusHandlers) {
				focusHandlers.push(function(ac, data, type) { if (type == 'focus') $scope.$apply(function(){gotData(ac, data);}); });
			}
		};
		$scope.ac = new AC('paper', $scope.acFetcher, false, 3, null, 'img/throbber.gif');
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
							gotData($scope.ac, data.results[i]);
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

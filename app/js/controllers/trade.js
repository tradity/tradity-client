angular.module('tradity').
	controller('TradeCtrl', function($scope, $stateParams, $state, $location, socket, $modal) {
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
		$scope.isMarketOrder = true;
		$scope.page = 0;
		$scope.results = [];
		$scope.popularStocks = [];

		$scope.next = function() {
			$scope.page++;
		}

			$scope.back = function() {
			$scope.page--;
		}

		$scope.buy = function() {
			if (!$scope.amount && !$scope.value)
				return;
			if (!$scope.leader && !$scope.stockid)
				return alert('Du musst ein Wertpapier auswählen!');
			var query = {
				amount: $scope.amount * $scope.sellbuy,
				stockid: $scope.stockid,
				leader: $scope.leader,
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
					return alert('Bitte geben Sie den Stop-/Limitwert als Zahl an');
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
			socket.emit(qtype, query,
			function(data) {
				switch (data.code) {
					case 'dquery-success':
						alert('Der Trade wird ausgeführt, sobald die angegebenen Bedingungen erfüllt sind.');
						$state.gi('game.depot.opentransactions');
						break;
					case 'stock-buy-success':
						alert('Trade erfolgreich');
						$state.go('game.depot.listing');
						break;
					case 'stock-buy-out-of-money':
						alert('Nicht genügend Geld zum Trade');
						break;
					case 'stock-buy-single-paper-share-exceed':
						alert('Dein Vermögen darf höchstens zu 50 % in ein einzelnes Wertpapier investiert sein!');
						break;
					case 'stock-buy-not-enough-stocks':
						alert('Nicht genug Wertpapiere');
						break;
					case 'stock-buy-autodelay-sxnotopen':
						alert('Der Trade wird ausgeführt, sobald der Handelsplatz öffnet');
						$state.go('game.depot.transactions');
						break;
					case 'stock-buy-over-pieces-limit':
						alert('Leider übersteigt dein Trade die handelbare Menge für dieses Wertpapier!');
						break;
					case 'stock-buy-stock-not-found':
						alert('Wertpapier existiert nicht');
						break;
				}
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
			$scope.fee = Math.max(Math.abs($scope.serverConfig['transaction-fee-perc'] * parseFloat($scope.value.replace(',', '.'))), $scope.serverConfig['transaction-fee-min'] / 10000);
		};

		if ($stateParams.sellbuy) {
			if ($stateParams.sellbuy == 'sell') {
				$scope.sellbuy = -1;
			} else if ($stateParams.sellbuy == 'buy') {
				$scope.sellbuy = 1;
			}
			$scope.stockid = $stateParams.stockId;
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
		}
		
		socket.emit('list-popular-stocks', {_cache: 1800}, function(data) {
			$scope.popularStocks = data.results;
		});
	});

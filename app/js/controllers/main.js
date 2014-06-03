angular.module('tradity').
	controller('MainCtrl', function($sce, $rootScope, $scope, $location, $state, $stateParams, socket, $dialogs, $http, $timeout, API_HOST, API_CONNECT_TEST_PATH, DEFAULT_PROFILE_IMG) {
		$scope.Math = Math;
		$scope.vtime = function(t) { return vagueTime.get({to: t, units: 's', lang: 'de'}); };

		$scope.isAdmin = false;
		$scope.ownUser = null;
		$scope.loading = false;
		$scope.serverConfig = {};
		$scope.hasOpenQueries = socket.hasOpenQueries.bind(socket);

		
		$timeout(function() {
			if (socket.rxPackets() > 0)
				return; // everything okay
			
			var connectTest = $http.get(API_HOST + API_CONNECT_TEST_PATH);
			connectTest.error(function(data, status, headers, config) {
				$state.go('error.connection');	
			});
		}, 3141);

		$scope.toggleMenu = function() {
			$('body').toggleClass('menuShow');
		};

		$scope.showSearch = function() {
			$scope.search = true;
		}

		$scope.openSearch = function(query) {
			$state.go('game.search', {
				query: query
			});
		}

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) { 
			$('body').removeClass('menuShow');
			if (toParams.query) {
				$scope.searchBarText = toParams.query;
				$scope.search = true;
			}
			else {
				$scope.search = false;
				$scope.searchBarText = '';
			}
		})

		$scope.$on('makeadmin', function() { $scope.isAdmin = true; });

		$scope.$on('user-update', function() {
			if (!$scope.ownUser) {
				$scope.isAdmin = false;
				return;
			}
			
			socket.emit('get-ranking', {
				since: 0,
				_cache: 30,
				_prefill: { useForOwnUserRank: true }
			});

			if ($scope.isAdmin)
				return;

			if ($scope.ownUser.access.indexOf('*') != -1)
				$scope.$emit('makeadmin');

			$scope.ownUser.profilepic = DEFAULT_PROFILE_IMG;
		});

		$scope.isActive = function(route) {
			return route === $location.path();
		};

		$scope.logout = function() {
			$scope.eventIDs = {};
			$scope.messages = [];
			socket.emit('logout', function(data) {
				if (data.code == 'logout-success') {
					$scope.ownUser = null;
					$scope.isAdmin = false;
					$scope.$broadcast('user-update');
					$state.go('index.login');
				}
			});
		};
		socket.on('response', function(data) {
			if (data.code == 'not-logged-in' && !/^fetch-events/.test(data['is-reply-to'])) {
				$scope.ownUser = null;
				if ($state.includes('game'))
					$state.go('index.login');
			}
		}, $scope);
		
		socket.on('self-info', function(data) {
			$scope.ownUser = data;

			if ($scope.ownUser.schools.length > 0)
				$scope.ownUser.bottomLevelSchool = $scope.ownUser.schools[$scope.ownUser.schools.length-1];
				$scope.ownUser.topLevelSchool = $scope.ownUser.schools[0];

			$scope.$broadcast('user-update', data);
		}, $scope);
		
		socket.on('get-ranking', function(data) {
			if (!data.useForOwnUserRank || !$scope.ownUser)
				return;
			
			var ranking = rankify(data.result);
			
			for (var i = 0; i < ranking.length; ++i) {
				if (ranking[i].uid == $scope.ownUser.uid) {
					$scope.ownUser.rank = i+1;
					break;
				}
			}
		});

		socket.on('get-user-info', function(data) {
			var r = data.result;
			if (r && r.isSelf) {
				$scope.ownUser = r;

				if ($scope.ownUser.schools.length > 0)
					$scope.ownUser.bottomLevelSchool = $scope.ownUser.schools[$scope.ownUser.schools.length-1];
					$scope.ownUser.topLevelSchool = $scope.ownUser.schools[0];

				$scope.$broadcast('user-update', r);
			}
		}, $scope);

		socket.on('get-config', function(data) {
			var cfg = data.config;
			for (var k in cfg)
				$scope.serverConfig[k] = cfg[k];
		});

		var feedEvents = ['trade', 'watch-add', 'comment', 'dquery-exec', 'user-provchange', 'user-namechange', 'user-reset', 'mod-notification'];
		$scope.messages = [];
		$scope.eventIDs = {};

		for (var i = 0; i < feedEvents.length; ++i) {
			socket.on(feedEvents[i], function(ev) {
				var id = ev.eventid;
				if ($scope.eventIDs[id])
					return;
				$scope.eventIDs[id] = true;
				$scope.$broadcast(ev.type, ev);
				$scope.messages.sort(function(a, b) { return b.time - a.time; });

				// move first sticky notification to top
				for (var j = 0; j < $scope.messages.length; ++j) {
					var msg = $scope.messages[j];

					if (msg.type == 'mod-notification' && msg.sticky) {
						delete $scope.messages[j];
						$scope.messages.unshift(msg);
						break;
					}
				}

				$scope.$broadcast('messages-changed');
			}, $scope);
		}

		$scope.pokeEvents = function() {
			socket.emit('fetch-events', {
				since: 0,
				count: null,
				_expect_no_response: true
			});
		}

		$scope.fetchSelf = function(cb) {
			socket.emit('get-user-info', {
				lookfor: '$self',
				nohistory: true,
				_cache: 20
			}, cb);
		}

		$scope.fetchSelf(function() {
			$scope.pokeEvents();
		});
		
		socket.emit('get-config');

		/* events */
		$scope.$on('watch-add', function(angEv, data) {
			var typePerson = 'somebody';
			var type = 'watch-add';
			if (data.srcuser == $scope.ownUser.uid) {
				var typePerson = 'yourself';
				type += '-self';
			} else if (data.watcheduser == $scope.ownUser.uid) {
				type += '-me';
			}
			$scope.messages.push({
				type: type,
				typePerson: typePerson,
				srcusername: data.srcusername,
				targetid: data.watcheduser,
				targetname: data.watchedname,
				time: data.eventtime
			});
		});

		$scope.$on('trade', function(angEv, data) {
			var typePerson = 'somebody';
			if (data.amount < 0) {
				var type = 'trade-sell';
			} else {
				var type = 'trade-buy';
			}
			if (data.srcuser == $scope.ownUser.uid) {
				type += '-self';
				typePerson = 'yourself';
			} else if (data.stocktextid == '__LEADER_' + $scope.ownUser.uid + '__') {
				type += '-me';
			}
			$scope.messages.push({
				type: type,
				typePerson: typePerson,
				srcusername: data.srcusername,
				targetid: data.targetid,
				stocktextid: data.stocktextid,
				stockname: data.stockname,
				time: data.eventtime,
				leader: data.leader,
				amount: Math.abs(data.amount)
			});
		});

		$scope.$on('comment', function(angEv, data) {
			var typePerson = 'somebody';
			var type = 'comment';
			if (data.baseeventtype == 'trade') {
				type += '-trade';
			} else if (data.baseeventtype == 'user-register') {
				type += '-pinboard';
			} else if (data.baseeventtype == 'school-create') {
				type += '-schoolpinboard';
			} else {
				return;
			}

			if (data.srcuser == $scope.ownUser.uid) {
				typePerson = 'yourself';
				type += '-self';
			}
			if (data.traderid == $scope.ownUser.uid) {
				type += '-me';
			}
			var tn = data.tradername || data.schoolname;
			
			if (!data.profilepic) data.profilepic = DEFAULT_PROFILE_IMG;


			$scope.messages.push({
				type: type,
				typePerson: typePerson,
				srcusername: data.srcusername,
				comment: $sce.trustAsHtml(data.trustedhtml ? data.comment : escapeHTML(data.comment)),
				trustedhtml: data.trustedhtml,
				profilepic: DEFAULT_PROFILE_IMG,
				orderid: data.orderid,
				tradername: tn,
				tradername_genitive: 'xsXS'.indexOf(tn.charAt(tn.length-1)) == -1 ? tn + 's' : tn + '’',
				time: data.eventtime,
				schoolpath: data.schoolpath
			});
		});
		/*
		$scope.$on('dquery-exec', function(angEv, data) {
			if (data.result == 'stock-buy-success') {
				$scope.messages.push({
					type: 'dquery-exec',
					orderid: data.orderid,
					stockname: data.name,
					amount: data.amount,
					time: data.eventtime
				});
			}
		});*/
		$scope.$on('user-provchange', function(angEv, data) {
			var type = 'provchange';
			if (data.srcuser == $scope.ownUser.uid) {
				var typePerson = 'yourself';
				type += '-self';
			} else {
				var typePerson = 'somebody';
			}

			// cleanup after legacy events
			var oldwprov = data.oldwprov || data.oldprov;
			var oldlprov = data.oldlprov || 0;
			var newwprov = data.newwprov || data.newprov;
			var newlprov = data.newlprov || 0;

			$scope.messages.push({
				type: type,
				typePerson: typePerson,
				srcusername: data.srcusername,
				oldwprov: oldwprov,
				oldlprov: oldlprov,
				newwprov: newwprov,
				newlprov: newlprov,
				wprovchanged: oldwprov != newwprov,
				lprovchanged: oldlprov != newlprov,
				bothchanged: oldwprov != newwprov && oldlprov != newlprov,
				time: data.eventtime
			});
		});
		$scope.$on('user-namechange', function(angEv, data) {
			var type = 'namechange';
			if (data.srcuser == $scope.ownUser.uid) {
				var typePerson = 'yourself';
				type += '-self';
			} else {
				var typePerson = 'somebody';
			}
			$scope.messages.push({
				type: type,
				typePerson: typePerson,
				srcusername: data.srcusername,
				oldname: data.oldname,
				newname: data.newname,
				time: data.eventtime
			});
		});
		$scope.$on('user-reset', function(angEv, data) {
			var type = 'reset';
			if (data.srcuser == $scope.ownUser.uid) {
				var typePerson = 'yourself';
				type += '-self';
			} else {
				var typePerson = 'somebody';
			}
			$scope.messages.push({
				type: type,
				typePerson: typePerson,
				srcusername: data.srcusername,
				time: data.eventtime
			});
		});
		$scope.$on('mod-notification', function(angEv, data) {
			var type = 'mod-notification';

			$scope.messages.push({
				type: type,
				typePerson: 'important-item',
				time: data.eventtime,
				content: $sce.trustAsHtml(data.notifcontent),
				sticky: data.notifsticky,
			});
		});
	});

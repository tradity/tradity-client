angular.module('tradity').
	controller('MainCtrl', function($sce, chat, ranking, $rootScope, $scope, $location, $state, $stateParams, socket, safestorage, dailyLoginAchievements, $dialogs, $http, $interval, $timeout, API_HOST, API_CONNECT_TEST_PATH, DEFAULT_PROFILE_IMG) {
		$scope.Math = Math;
		$scope.vtime = function(t) { return vagueTime.get({to: t, units: 's', lang: 'de'}); };

		$scope.isAdmin = false;
		$rootScope.ownUser = $scope.ownUser = null;
		$scope.loading = false;
		$scope.serverConfig = {};
		$scope.hasOpenQueries = socket.hasOpenQueries.bind(socket);
		$scope.version = null;
		
		$scope.connectionLastRx = 0;
		$scope.connectionCheck = function() {
			var alive = function() {
				if ($state.includes('error')) {
					socket.reconnect();
					$state.go('game.feed');
				}
			};
			var dead = function() {
				$state.go('error.connection');
			};
			
			var curRx = socket.rxPackets();
			if (curRx > $scope.connectionLastRx) {
				$scope.connectionLastRx = curRx;
				return alive(); // everything okay
			}
			
			$scope.connectionLastRx = curRx;
			socket.emit('ping', {
				_expect_no_response: true
			}, alive);
			
			$timeout(function() {
				if (socket.rxPackets() > $scope.connectionLastRx)
					return;
				
				var connectTest = $http.get(API_HOST + API_CONNECT_TEST_PATH);
				connectTest.success(alive);
				connectTest.error(dead);
			}, 3000);
		};
		
		$timeout($scope.connectionCheck, 3141);
		var connectionCheck = $interval($scope.connectionCheck, 20000);
		
		$scope.$on('destroy', function() {
			$interval.cancel(connectionCheck);
		});

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

		$scope.$on('makeadmin', function() {
			$scope.isAdmin = true;
			
			socket.emit('set-debug-mode', { debugMode: true, __only_in_srv_dev_mode__: true });
		});

		$scope.$on('user-update', function() {
			if (!$scope.ownUser) {
				safestorage.clear();
				
				$scope.isAdmin = false;
				return;
			}
			
			safestorage.check().then(function() {
				dailyLoginAchievements.check();
			});

			if ($scope.isAdmin)
				return;

			if ($scope.ownUser.access.indexOf('*') != -1)
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
			
			socket.emit('logout', function(data) {
				safestorage.clear();
				
				$scope.ownUser = null;
				$scope.isAdmin = false;
				$scope.$broadcast('user-update', null);
				$state.go('index.login');
			});
		};
		socket.on('*', function(data) {
			if (data.code == 'not-logged-in' && !/^fetch-events/.test(data['is-reply-to'])) {
				$scope.ownUser = null;
				if ($state.includes('game'))
					$state.go('index.login');
			}
		}, $scope);
		
		socket.on('self-info', function(data) {
			$rootScope.ownUser = $scope.ownUser = data.result;

			if ($scope.ownUser.schools.length > 0)
				$scope.ownUser.bottomLevelSchool = $scope.ownUser.schools[$scope.ownUser.schools.length-1];
				$scope.ownUser.topLevelSchool = $scope.ownUser.schools[0];

			$scope.$broadcast('user-update', data.result);
		}, $scope);

		socket.on('get-user-info', function(data) {
			if (data.code == 'not-logged-in' && !/^fetch-events/.test(data['is-reply-to'])) {
				$scope.ownUser = null;
				if ($state.includes('game'))
					$state.go('index.login');
			}
			var r = data.result;
			if (r && r.isSelf) {
				$rootScope.ownUser = $scope.ownUser = r;

				if ($scope.ownUser.schools.length > 0)
					$scope.ownUser.bottomLevelSchool = $scope.ownUser.schools[$scope.ownUser.schools.length-1];
					$scope.ownUser.topLevelSchool = $scope.ownUser.schools[0];

				$scope.$broadcast('user-update', r);
			}
		}, $scope);

		socket.on('server-config', function(data) {
			var cfg = data.config;
			for (var k in cfg)
				$scope.serverConfig[k] = cfg[k];
			
			if (data.versionInfo)
				$scope.version = data.versionInfo;
			
			if (socket.protocolVersion() < $scope.version.minimum)
				notification('Deine Tradity-Clientversion wird leider nicht mehr unterstützt!');
			
			$scope.ownUserRanking = ranking.getRanking(null, $scope.serverConfig.ranking || {}, null, null, true);
			$scope.ownUserRanking.onRankingUpdated(function() {
				if ($scope.ownUser)
					$scope.ownUser.rank = $scope.ownUserRanking.get('all').rankForUser($scope.ownUser.uid);
			});
			
			$scope.$on('user-update', function() {
				if ($scope.ownUser)
					$scope.ownUserRanking.fetch();
			});
		});
		
		socket.on('internal-server-error', function() {
			notification('Es gab leider einen Fehler – das Tech-Team von Tradity wurde informiert!');
		});

		$scope.pokeEvents = function() {
			socket.emit('fetch-events', {
				since: 0,
				count: null,
				_expect_no_response: true
			});
		}

		$scope.hasPendingSelfFetch = false;
		$scope.fetchSelf = function() {
			if ($scope.hasPendingSelfFetch)
				return;
			
			$scope.hasPendingSelfFetch = true;
			socket.emit('get-user-info', {
				lookfor: '$self',
				nohistory: true,
				_cache: 20
			}, function(data) {
				$scope.hasPendingSelfFetch = false;
				
				if (data.code == 'get-user-info-success')
					$scope.pokeEvents();
			});
		}
		
		// server-config will also be pushed on reconnect
		socket.on('server-config', function() {
			$scope.fetchSelf();
		});
		
	});

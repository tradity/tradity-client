angular.module('tradity').
	controller('SearchCtrl', function($rootScope, $scope, $stateParams, $state, socket) {
		$scope.users = [];
		$scope.searchText = $stateParams.query;
		$scope.filter = "";
		$scope.groups = [];

		$scope.search = function() {
			if ($scope.searchText.length != 0)
				socket.emit('get-ranking', {
					rtype: 'general',
					search: $scope.searchText,
					_cache: 20
				},
				function(data) {
					if (data.code == 'get-ranking-success') {
						$scope.users = data.result;
					}
				});		

			if ($scope.searchText.length != 0) {
				$scope.filter = $scope.searchText;
				socket.emit('list-schools', { 
					_cache: 60,
					search: $scope.searchText,
				}, function(schoollist) {
					$scope.groups = schoollist.result;
				});	
			}

			if ($scope.searchText.length > 3) 
				socket.emit('stock-search', { 
					_cache: 60,
					name: $scope.searchText
				}, function(stocklist) {
					$scope.stocks = stocklist.results;
				});	
		}
		
		if($stateParams.query) $scope.search();


	});


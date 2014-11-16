'use strict';

angular.module('tradity').
	controller('RankingCtrl', function($scope, $state, $stateParams, $timeout, ranking) {
		$scope.totalDisplayed = 20;

		$scope.loadMore = function() {
			$scope.totalDisplayed += 10;
		};
		
		$scope.printRanking = function() {
			$scope.totalDisplayed = 2000000000; // Infinity possible after angular 1.3.2
			$timeout(function() { window.print(); }, 10);
		};
		
		$scope.rankifyOptions = {
			administrative: { 
				filter: function(r, s) { return r.uid; },
				key: function(r, s) { return r.uid; }
			},
			follower: {
				filter: function(r, s) { return r.fperf != null; },
				key: function(r, s) { return (r.hastraded || r.isSchoolEntry) ? 
					r.fperfval : -Infinity; }
			},
			xp: {
				filter: function(r, s) { return r.xp; },
				key: function(r, s) { return r.xp; }
			}
		};
		
		$scope.rankingCfg = function() { 
			if ($scope.school)
				return ($scope.school.config && $scope.school.config.ranking) || {};
			else
				return $scope.serverConfig.ranking || {};
		};
		
		$scope.spec = ranking.deserializeSpec($stateParams.spec, $scope.rankingCfg());
		
		$scope.resultDisplayFilter = function(result) {
			return result.isSchoolEntry ? ($scope.spec.showGroups && result.count > 1) : $scope.spec.showUsers;
		};
		
		// return a string representing a new ranking specification
		$scope.csr = $scope.changedSpecRef = function(changes) {
			var newSpec = $.extend(true, {}, $scope.spec, changes);
			
			return ranking.serializeSpec(newSpec);
		};
		
		$scope.markSchoolAdmins = function(rawResults) {
			var admins = [];
			
			var curScope = $scope;
			
			while (curScope) {
				if (curScope.school) {
					curScope.school.pendingMembers = [];
					
					for (var i = 0; curScope.school && i < rawResults.length; ++i) {
						for (var j = 0; curScope.school.admins && j < curScope.school.admins.length; ++j)
							rawResults[i].isSchoolAdmin = rawResults[i].isSchoolAdmin ||
								(rawResults[i].name == curScope.school.admins[j].adminname);
						
						if (rawResults[i].pending && rawResults[i].schoolpath == curScope.school.path)
							curScope.school.pendingMembers.push(rawResults[i]);
					}
				}
				
				curScope = curScope.$parent;
			}
			
			return rawResults;
		};
		
		$scope.rankingResult = ranking.getRanking($scope.school, $scope.spec, $scope.rankifyOptions,
			[$scope.markSchoolAdmins]);
		
		$scope.$on('school-info-update', function() {
			$scope.rankingResult.fetch();
		});
	});

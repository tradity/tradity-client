(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('AchievementsCtrl', function($scope, $rootScope, socket, achievements, $stateParams) {
		$scope.achievements = [];
		
		socket.emit('list-all-achievements', {
			_cache: 1800
		}, function(data) {
			$scope.achievements = data.result;
			
			for (var i = 0; i < $scope.achievements.length; ++i) 
				$scope.achievements[i].text = achievements.lookupText($scope.achievements[i].name);
			
			$scope.displayAchievements();
		});

		$scope.categories = {
			'TRADING': {
				name: "Trader",
				description: "Deine Achievements im Trading",
				// img: "http://placekitten.com/80/80",
				achievements: 0,
				achieved: 0,
			},
			'FOLLOWER': {
				name: "Follower",
				description: "Deine Achievements im Following",
				achievements: 0,
				achieved: 0,
			},
			'SOCIAL': {
				name: "Socializer",
				description: "Wie „social“ bist du?",
				achievements: 0,
				achieved: 0,
			},
			'LEADER': {
				name: "Leader",
				description: "Wie gut bist du als Leader?",
				achievements: 0,
				achieved: 0,
			},
			'LEARNING': {
				name: "Lektionen",
				description: "Was hast du schon bei Tradity gelernt?",
				achievements: 0,
				achieved: 0,
			},
		};
		
		for (var i in $scope.categories)
			$scope.categories[i].linkId = i.toLowerCase();

		$scope.categoryId = '';
		if ($stateParams.id) 
			$scope.categoryId = $stateParams.id.toUpperCase();

		$scope.category = function(id) {
			var achievements = [];
			for (var i = $scope.achievements.length - 1; i >= 0; i--) {
				if ($scope.achievements[i].category == id) 
					achievements.push($scope.achievements[i]);
			}
			return achievements;
		};

		$scope.achieved = function(id) {
			return ($scope.userAchievementIDs.indexOf(id) != -1);
		};
		
		$scope.displayAchievements = function() {
			$scope.userAchievementIDs = [];

			var i;
			for (i in $scope.$parent.userAchievements)
				$scope.userAchievementIDs.push($scope.$parent.userAchievements[i].achname);
				
			for (i in $scope.categories)
				$scope.categories[i].achievements = $scope.categories[i].achieved = 0;

			for (i = $scope.achievements.length - 1; i >= 0; i--) {
				$scope.achievements[i].achieved = $scope.achieved($scope.achievements[i].name);

				if (!$scope.categories[$scope.achievements[i].category] || $scope.achievements[i].xp === 0)
					continue;
				
				$scope.categories[$scope.achievements[i].category].achievements++;
				
				if ($scope.achievements[i].achieved)
					$scope.categories[$scope.achievements[i].category].achieved++;
			}
		};
		
		$scope.$watch('$parent.userAchievements', function() {
			$scope.displayAchievements();
		});
	});

})();

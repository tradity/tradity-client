angular.module('tradity').
	controller('AchievmentsCtrl', function($scope, socket, $stateParams) {
		$scope.achievments = [
			{
				id:20,
				name:"Tradity gespielt !",
				category:0
			}
		];

		$scope.categorys = {
			0:{
				name:"Tradity",
				description:"Allgemeines um Tradity",
				img:"http://placekitten.com/80/80"
			},
			1:{
				name:"Trading",
				description:"Alle Erfolge beim Traden"
			}
		}

		$scope.categoryId = 0;
		if ($stateParams.id) 
			$scope.categoryId = $stateParams.id;

		$scope.category = function(id) {
			var achievments = [];
			for (var i = $scope.achievments.length - 1; i >= 0; i--) {
				if ($scope.achievments[i].category == id) 
					achievments.push($scope.achievments[i]);
			};
			return achievments;
		}

		$scope.achieved = function(id) {
			return false;
		}


	});




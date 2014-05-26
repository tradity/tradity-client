angular.module('tradity').
	controller('LearningCtrl', function($scope, $stateParams, $state, socket) {
		$scope.learningQuestions = [
			{
				katalog:0,
				name:'Grundlage',
				description:'bin ich toll ?',
				answers:{
					0:'ja',
					1:'nein',
				},
				right:0
			}
		];

		$scope.learaningKatalog = [
			{
				id:0,
				name:'Grundlagen',
				description:'Da da daaa',
				requirements:[],
			}
		];

		$scope.questions = [];

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if (toParams.id) {
				$scope.questions = [];
				for (var i = $scope.learningQuestions.length - 1; i >= 0; i--) {
					if ($scope.learningQuestions[i].katalog == toParams.id)
						$scope.questions.push($scope.learningQuestions[i]);
				};
			}
		})

		$scope.prove = function() {
			console.log($scope.questions)
			for (var i = $scope.questions.length - 1; i >= 0; i--) {
				if ($scope.questions[i].answer == $scope.questions[i].right)
					$scope.questions[i].wrong = false;
				else
					$scope.questions[i].wrong = true;
			};
		}

		
	});

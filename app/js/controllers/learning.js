angular.module('tradity').
	controller('LearningCtrl', function($scope, $stateParams, $state, socket) {
		$scope.learningQuestions = [
			{
				catalog: 'green-investments',
				description: 'Aus welchen drei Komponenten besteht das sogenannte „Magische Dreieck“ bei Investments?',
				answers: {
					0: 'Preis, Leistung, Gebühren',
					1: 'Rendite, Risiko und Verfügbarkeit',
					2: 'Qualität, Marktlage, Nachrichten'
				},
				right: 1
			},
			{
				catalog: 'green-investments',
				description: 'Welche Eigenschaften sind bei „grünen“ Anlagen garantiert?',
				answers: {
					0: 'CO²-neutral und ohne Genpflanzen',
					1: 'Ausschließlich Verwendung nachwachsender Rohstoffe und Fairtrade',
					2: 'keine – die Bezeichnung ist nicht rechtlich geschützt'
				},
				right: 2
			},
			{
				catalog: 'green-investments',
				description: 'Was bedeutet das „Best-in-Class“-Prinzip bei nachhaltigen Anlagen? ',
				answers: {
					0: 'Es werden die klassenbesten Schüler in Entwicklungsländern mit einem Stipendium gefördert, damit sie weiter zur Schule gehen können.',
					1: 'Die Anbieter suchen Firmen aus, die in ihrer Branche in Sachen Umwelt- und/oder Sozialstandards eine Vorreiterrolle einnehmen. Keine Branche wird von vorneherein ausgeschlossen, auch Wirtschaftszweige wie die Atom- oder die Rüstungsindustrie können mit in einem Portfolio landen.',
					2: 'Es wird in die Sieger vom Öko-Siegel investiert.'
				},
				right: 1
			}
		];

		$scope.learningcatalog = [
			{
				id: 'green-investments',
				name: 'Grüne Geldanlage',
				description: 'Umwelt- und Klimaschutz fängt bei jedem zu Hause an, das ist klar. Aber ein großer Teil der Emissionen geht von Unternehmen aus. Wie kann man mit Investments ethische, nachhaltige und grüne Unternehmen fördern? Zielgerichtete „grüne“ Geldanlagen können hierbei eine wichtige Rolle spielen. Doch Achtung: Grün ist nicht gleich grün.',
				requirements: [],
				link: 'https://boersenspiel.tradity.de/learning/gruene-geldanlage/',
				show: false,
				achievement: 'LEARNING_GREEN_INVESTMENTS'
			}
		];

		$scope.questions = [];

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if (toParams.id) {
				$scope.questions = [];
				for (var i = $scope.learningQuestions.length - 1; i >= 0; i--) {
					if ($scope.learningQuestions[i].catalog == toParams.id)
						$scope.questions.push($scope.learningQuestions[i]);
				};
			}
		})

		$scope.prove = function() {
			$scope.proved = true;
			for (var i = $scope.questions.length - 1; i >= 0; i--) {
				$scope.questions[i].wrong = ($scope.questions[i].answer != $scope.questions[i].right);
			};
		}
	});

'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('LearningCtrl', function($scope, $stateParams, $state, socket, achievements) {
		$scope.learningQuestions = [
			//GREEN_INVESTMENTS
			{
				catalog: 'green-investments',
				description: 'Was bedeutet das „Best-in-Class“-Prinzip bei nachhaltigen Anlagen? ',
				answers: [
					{ id: 0, text: 'Es werden die klassenbesten Schüler in Entwicklungsländern mit einem Stipendium gefördert, damit sie weiter zur Schule gehen können.' },
					{ id: 1, text: 'Die Anbieter suchen Firmen aus, die in ihrer Branche in Sachen Umwelt- und/oder Sozialstandards eine Vorreiterrolle einnehmen. Keine Branche wird von vorneherein ausgeschlossen, auch Wirtschaftszweige wie die Atom- oder die Rüstungsindustrie können mit in einem Portfolio landen.' },
					{ id: 2, text: 'Es wird in die Sieger vom Öko-Siegel investiert.' }
				],
				correct: 1
			},
			{
				catalog: 'green-investments',
				description: 'Welche Eigenschaften sind bei „grünen“ Anlagen garantiert?',
				answers: [
					{ id: 0, text: 'CO²-neutral und ohne Genpflanzen' },
					{ id: 1, text: 'Ausschließlich Verwendung nachwachsender Rohstoffe und Fairtrade' },
					{ id: 2, text: 'keine – die Bezeichnung ist nicht rechtlich geschützt' }
				],
				correct: 2
			},
			{
				catalog: 'green-investments',
				description: 'Aus welchen drei Komponenten besteht das sogenannte „Magische Dreieck“ bei Investments?',
				answers: [
					{ id: 0, text: 'Preis, Leistung, Gebühren' },
					{ id: 1, text: 'Rendite, Risiko und Verfügbarkeit' },
					{ id: 2, text: 'Qualität, Marktlage, Nachrichten' }
				],
				correct: 1
			},
			//LOW_INTEREST-RATES
			{
				catalog: 'low-interest-rates',
				description: 'Worin besteht das Problem?',
				answers: [
					{ id: 0, text: 'Weil die Zinsen, die man z. B. bei Tages- oder Festgeld bekommt so niedrig sind, ist die Inflation so hoch.' },
					{ id: 1, text: 'Da die Zinsen, die man bei sicheren Geldanlagen wie Tages- oder Festgeld erhält, niedriger sind als die Preissteigerungsrate (Inflation), „verliert“ man effektiv Geld.' },
					{ id: 2, text: 'Da die Inflationsrate höher ist als die Zinsen, die man bei „sicheren“ Geldanlageformen erhält, „verliert“ man effektiv Geld. Hinzu kommt, dass das Zinsniveau im Verhältnis zu anderen Anlageformen deutlich niedriger ist, als es „gewöhnlich“ der Fall ist.' }
				],
				correct: 2
			},
			{
				catalog: 'low-interest-rates',
				description: 'Welche Anlageprodukte bieten sich als „Inflationsschutz“ an?',
				answers: [
					{ id: 0, text: 'Sparanlagen' },
					{ id: 1, text: 'Sachwerte' },
					{ id: 2, text: 'Staatsanleihen' }
				],
				correct: 1
			},
			{
				catalog: 'low-interest-rates',
				description: 'Welchen Vorteil bieten Investmentfonds gegenüber einzelnen Aktien? ',
				answers: [
					{ id: 0, text: 'Bereits bei niedrigerem Kapital ist eine Streuung (Diversifikation) möglich.' },
					{ id: 1, text: 'Investmentfonds erzielen generell höhere Renditen als einzelne Aktien.' },
					{ id: 2, text: 'Investmentfonds werden staatlich überwacht.' }
				],
				correct: 0
			},
			{
				catalog: 'low-interest-rates',
				description: 'Was ist eine Alternative zu Investmentfonds, die das Kapital ähnlich anlegt? ',
				answers: [
					{ id: 0, text: 'ETFs (Exchange Traded Funds)' },
					{ id: 1, text: 'Offene Immoblienfonds' },
					{ id: 2, text: 'Futures' }
				],
				correct: 0
			}
		];

		$scope.learningCatalog = [
			{
				id: 'green-investments',
				name: 'Grüne Geldanlage',
				description: 'Umwelt- und Klimaschutz fängt bei jedem zu Hause an, das ist klar. Aber ein großer Teil der Emissionen geht von Unternehmen aus. Wie kann man mit Investments ethische, nachhaltige und grüne Unternehmen fördern? Zielgerichtete „grüne“ Geldanlagen können hierbei eine wichtige Rolle spielen. Doch Achtung: Grün ist nicht gleich grün.',
				requirements: [],
				link: 'https://www.verbraucherzentrale-niedersachsen.de/link1811491A.html',
				show: false,
				achievementName: 'LEARNING_GREEN_INVESTMENTS',
				achievement: null
			},
			{
				id: 'low-interest-rates',
				name: '	Niedrigzinsen',
				description: 'Für Verbraucher, die ihr Geld möglichst sicher anlegen wollen, stellt sich die Situation derzeit düster dar. Stecken sie ihr Geld in sichere Anlageformen wie Sparbuch, Tagesgeld und Festgeld, bekommen sie dafür kaum Zinsen. Erste Banken verlangen sogar schon einen Negativzins. Das bedeutet, Sparer bekommen keine Zinsen, sie müssen dafür bezahlen, dass sie Geld anlegen. Wie soll man sein Geld heute noch anlegen?',
				requirements: [],
				link: 'https://www.vzsh.de/link1128833A.html',
				show: false,
				achievementName: 'LEARNING_LOW_INTEREST_RATES',
				achievement: null
			}
		];

		$scope.questions = [];

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if (toParams.id) {
				$scope.questions = [];
				
				for (var i = 0; i < $scope.learningQuestions.length; ++i) {
					var answers = $scope.learningQuestions[i].answers;
					for (var j = 0; j < answers.length; ++j)
						answers[j].orderIndex = Math.random();
					
					if ($scope.learningQuestions[i].catalog == toParams.id)
						$scope.questions.push($scope.learningQuestions[i]);
				};
			}
		})

		$scope.prove = function() {
			$scope.proved = true;
			for (var i = 0; i < $scope.questions.length; ++i) {
				$scope.questions[i].wrong = ($scope.questions[i].answer != $scope.questions[i].correct);
			};
		};
		
		achievements.listClientAchievements().then(function(clientAchievementList) {
			var learningCatalogByAchievement = {};
			for (var i = 0; i < $scope.learningCatalog.length; ++i)
				learningCatalogByAchievement[$scope.learningCatalog[i].achievementName] = $scope.learningCatalog[i];
			
			for (var i = 0; i < clientAchievementList.length; ++i)
				if (learningCatalogByAchievement[clientAchievementList[i].name])
					learningCatalogByAchievement[clientAchievementList[i].name].achievement = clientAchievementList[i];
		});
	});

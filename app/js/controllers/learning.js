'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('LearningCtrl', function($scope, $stateParams, $state, socket) {
		$scope.learningQuestions = [
			//GREEN_INVESTMENTS
			{
				catalog: 'green-investments',
				description: 'Was bedeutet das „Best-in-Class“-Prinzip bei nachhaltigen Anlagen? ',
				answers: {
					0: 'Es werden die klassenbesten Schüler in Entwicklungsländern mit einem Stipendium gefördert, damit sie weiter zur Schule gehen können.',
					1: 'Die Anbieter suchen Firmen aus, die in ihrer Branche in Sachen Umwelt- und/oder Sozialstandards eine Vorreiterrolle einnehmen. Keine Branche wird von vorneherein ausgeschlossen, auch Wirtschaftszweige wie die Atom- oder die Rüstungsindustrie können mit in einem Portfolio landen.',
					2: 'Es wird in die Sieger vom Öko-Siegel investiert.'
				},
				correct: 1
			},
			{
				catalog: 'green-investments',
				description: 'Welche Eigenschaften sind bei „grünen“ Anlagen garantiert?',
				answers: {
					0: 'CO²-neutral und ohne Genpflanzen',
					1: 'Ausschließlich Verwendung nachwachsender Rohstoffe und Fairtrade',
					2: 'keine – die Bezeichnung ist nicht rechtlich geschützt'
				},
				correct: 2
			},
			{
				catalog: 'green-investments',
				description: 'Aus welchen drei Komponenten besteht das sogenannte „Magische Dreieck“ bei Investments?',
				answers: {
					0: 'Preis, Leistung, Gebühren',
					1: 'Rendite, Risiko und Verfügbarkeit',
					2: 'Qualität, Marktlage, Nachrichten'
				},
				correct: 1
			},
			//LOW_INTEREST-RATES
			{
				catalog: 'low-interest-rates',
				description: 'Worin besteht das Problem?',
				answers: {
					0: 'Weil die Zinsen, die man z. B. bei Tages- oder Festgeld bekommt so niedrig sind, ist die Inflation so hoch.',
					1: 'Da die Zinsen, die man bei sicheren Geldanlagen wie Tages- oder Festgeld erhält, niedriger sind als die Preissteigerungsrate (Inflation), "verliert" man effektiv Geld.',
					2: 'Da die Inflationsrate höher ist, als die Zinsen, die man bei "sicheren" Geldanlageformen erhält, "verliert" man effektiv Geld. Hinzukommt, dass das Zinsniveau im Verhältnis zu anderen Anlageformen deutlich niedriger ist als es "gewöhnlich" der Fall ist.	'
				},
				correct: 2
			},
			{
				catalog: 'low-interest-rates',
				description: 'Welche Anlageprodukte bieten sich als "Inflationsschutz" an?',
				answers: {
					0: 'Sparanlagen',
					1: 'Sachwerte',
					2: 'Staatsanleihen'
				},
				correct: 1
			},
			{
				catalog: 'low-interest-rates',
				description: 'Welchen Vorteil bieten Investmentfonds gegenüber einzelnen Aktien? ',
				answers: {
					0: 'Bereits bei niedrigerem Kapital ist eine Streuung (Diversifikation) möglich.',
					1: 'Investmentfonds erzielen generell höhere Renditen als einzelne Aktien.',
					2: 'Investmentfonds werden staatlich überwarcht.'
				},
				correct: 0
			},
			{
				catalog: 'low-interest-rates',
				description: 'Was ist eine Alternative zu Investmentfonds, die das Kapital ähnlich anlegt? ',
				answers: {
					0: 'ETFs (Exchange Traded Funds)',
					1: 'Offene Immoblienfonds',
					2: 'Futures'
				},
				correct: 0
			}
		];

		$scope.learningcatalog = [
			{
				id: 'green-investments',
				name: 'Grüne Geldanlage',
				description: 'Umwelt- und Klimaschutz fängt bei jedem zu Hause an, das ist klar. Aber ein großer Teil der Emissionen geht von Unternehmen aus. Wie kann man mit Investments ethische, nachhaltige und grüne Unternehmen fördern? Zielgerichtete „grüne“ Geldanlagen können hierbei eine wichtige Rolle spielen. Doch Achtung: Grün ist nicht gleich grün.',
				requirements: [],
				link: 'https://www.verbraucherzentrale-niedersachsen.de/link1811491A.html',
				show: false,
				achievement: 'LEARNING_GREEN_INVESTMENTS'
			},
			{
				id: 'low-interest-rates',
				name: '	Niedrigzinsen',
				description: 'Für Verbraucher, die ihr Geld möglichst sicher anlegen wollen, stellt sich die Situation derzeit düster dar. Stecken sie ihr Geld in sichere Anlageformen wie Sparbuch, Tagesgeld und Festgeld, bekommen sie dafür kaum Zinsen. Erste Banken verlangen sogar schon einen Negativzins. Das bedeutet, Sparer bekommen keine Zinsen, sie müssen dafür bezahlen, dass sie Geld anlegen. Wie soll man sein Geld heute noch anlegen?',
				requirements: [],
				link: 'https://www.vzsh.de/link1128833A.html',
				show: false,
				achievement: 'LEARNING_LOW_INTEREST_RATES'
			}
		];

		$scope.questions = [];

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if (toParams.id) {
				$scope.questions = [];
				for (var i = 0; i < $scope.learningQuestions.length; ++i) {
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
		}
	});

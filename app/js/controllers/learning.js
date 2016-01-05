(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('LearningCtrl', function($scope, $stateParams, $state, $rootScope, socket, achievements) {
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
			},

			//WHAT ARE SHARES
			{
				catalog: 'what-are-shares',
				description: 'Für wen ist Börsenhandel attraktiv? ',
				answers: [
					{ id: 0, text: 'Nur für Privatpersonen mit hohem Einkommen.' },
					{ id: 1, text: 'Nur für Personen mit hoher Risikobereitschaft.' },
					{ id: 2, text: 'Nur für institutionelle Investoren wie zum Beispiel Banken.' },
					{ id: 3, text: 'Keine der Antworten ist völlig richtig.' }
				],
				correct: 3
			},
			{
				catalog: 'what-are-shares',
				description: 'Wieso ist eine Börse wertvoll?',
				answers: [
					{ id: 0, text: 'Sie führt zu überhöhten Preisen.' },
					{ id: 1, text: 'Sie erlaubt es, hohe Summen Geld zu leihen.' },
					{ id: 2, text: 'Sie bietet einen rechtlich und technisch sicheren Rahmen für Geschäfte mit Wertpapieren.' }
				],
				correct: 2
			},
			{
				catalog: 'what-are-shares',
				description: 'Stell Dir vor, Deine Großmutter Emma fragt Dich, ob Du sie bei der Verwaltung ihres Vermögens unterstützen kannst und zwei Angebote, welche sie vor kurzem gesehen hat, für sie einschätzen kannst. Die Angebote, beides Werbeplakate zweier verschiedener lokaler Banken, lauten:\n' +
'1) Legen Sie Ihr Geld jetzt bei der Bank-Bank in einem „Sparkonto“ an und erhalten Sie 1 % Rendite jährlich!\n' +
'2) Investieren Sie in unseren „Rendite-Fonds“ und sichern Sie sich 22 % Rendite jährlich!\n' +
'Du weißt über die durchschnittliche Inflationsrate (3 %) Bescheid. Welche Aussagen lassen sich daraus ableiten?',
				answers: [
					{ id: 0, text: 'Es ist sinnvoll, das Geld bei der Bank-Bank anzulegen, da die Rendite positiv ist.' },
					{ id: 1, text: 'Die Anlage in Fonds ist normalerweise empfehlenswert, da Fonds i. d. R. höhere Renditen erzielen als Sparkonten.' },
					{ id: 2, text: 'Es ist nicht unbedingt ratsam, das Geld bei der Bank-Bank anzulegen, wenn man eine positive Rendite erwirtschaften möchten, da die Inflation die Rendite des Sparkontos übersteigt.' },
					{ id: 3, text: 'Die Rendite ist ein verlässliches Kriterium, um die Sinnhaftigkeit einer Investition einzuschätzen. Andere Kriterien sind unbedeutend.' }
				],
				correct: 2
			},  
			//TERMINOLOGY
//			{
//				catalog: 'terminology',
//				description: 'Was ist der Unterschied zwischen Limit- und Stop-Order?',
//				answers: [
//					{ id: 0, text: 'Limit- und Stop-Orders sind als Gegenteile anzusehen' },
//					{ id: 1, text: 'Bei einer Stop-Order setzt der Käufer Mindestpreise' },
//					{ id: 2, text: 'Bei einer Limit-Order setzt der Käufer Mindestpreise' },
// 					{ id: 3, text: 'Bei einer Limit-Order setzt der Verkäufer Maximalpreise' }
//				],
//				correct: 1
//			},
			{
				catalog: 'terminology',
				description: 'Du besitzt eine Aktie der ABC AG, die sich bisher gut entwickelt hat. Du hast jedoch Sorge, dass es in Zukunft zu einem Abwärtstrend kommen könnte. Aktuell notiert die ABC AG bei 70 €. Einen Kursrutsch unter 60 € möchtest du nicht mitmachen. Welcher Ordertyp kann dir helfen, die Aktie rechtzeitig zu verkaufen, wenn es zu einem Abwärtstrend kommt?',
				answers: [
					{ id: 0, text: 'Limit' },
					{ id: 1, text: 'Stop' }
				],
				correct: 1
			},
			{
				catalog: 'terminology',
				description: 'Aktuell beobachtest du die Aktie der 123 AG. Du denkst, dass der faire Wert der Aktie bei 18 € liegt. Die Aktie notiert zurzeit bei 20 €. Wenn die Aktie auf 18 € fällt, möchtest du die Aktie kaufen. Mit welchem Ordertyp kannst du automatisch die Aktie kaufen?',
				answers: [
					{ id: 0, text: 'Limit' },
					{ id: 1, text: 'Stop' }
				],
				correct: 0
			},
			{
				catalog: 'terminology',
				description: 'Wer entscheidet über den gewählten Ordertyp?',
				answers: [
					{ id: 0, text: 'Der Auftraggeber' },
					{ id: 1, text: 'Dies hängt vom Wertpapiertyp ab' },
					{ id: 2, text: 'Der Broker'},
					{ id: 3, text: 'Die Börse'}
				],
				correct: 0
			},
			{
				catalog: 'terminology',
				description: 'Was passiert, wenn der angegebene Stop oder das Limit nicht erreicht wird?',
				answers: [
					{ id: 0, text: 'Die Order verfällt nach Ablauf des vom Auftraggebers angegebenen Ausführungszeitraums' },
					{ id: 1, text: 'Die Order verfällt sofort' },
					{ id: 2, text: 'Die Order wird automatisch erneut unter den gleichen Bedingungen aufgegeben'},
					{ id: 3, text: 'Der Broker benachrichtigt den Auftraggeber'}
				],
				correct: 0
			},
				{
				catalog: 'terminology',
				description: 'Welche Informationen enthält der Jahresabschluss?',
				answers: [
					{ id: 0, text: 'Bilanz' },
					{ id: 1, text: 'Bilanz und Gewinn- und Verlustrechnung' },
					{ id: 2, text: 'Multiplikatorbewertung'},
					{ id: 3, text: 'Discounted-Cashflow-Bewertung'}
				],
				correct: 1
			},
       		{
				catalog: 'terminology',
				description: 'Wer kann auf die Bilanz einer börsennotierten Aktiengesellschaft zugreifen?',
				answers: [
					{ id: 0, text: 'Jeder – der Zugang ist kostenlos' },
					{ id: 1, text: 'Jeder, der die entsprechende Gebühr bezahlt' },
					{ id: 2, text: 'Nur institutionelle Investoren'},
					{ id: 3, text: 'Nur Banken'}
				],
				correct: 0
			},
			//CHANCES AND RISKS
			{
				catalog: 'chances-and-risks',
				description: 'Ein Investor hat zwei Investitionsmöglichkeiten. Seine erste Option ist E.ON, ein Konkurrenten von RWE, der eine vergleichsweise niedrigere Volatilität aufweist. Alternativ könnte er ein Investment in Air Berlin, einen Konkurrenten von Lufthansa, tätigen. Die Aktie von Air Berlin ist dabei deutlich volatiler. Auf Basis dieser Informationen: Welches Investment sollte der Investor verfolgen, wenn er in die Aktie mit dem höheren erwarteten Gewinn investieren möchte? Welches Investment wenn er sehr riskoavers ist und Angst vor kurzfristigen Kursverlusten hat?',
				answers: [
					{ id: 0, text: 'Um einen höheren erwarteten Gewinn zu erzielen sollte er in E.ON investieren. Angenommen er ist sehr risikoavers, wird er sich ebenso für die E.ON Aktie entscheiden.' },
					{ id: 1, text: 'Um einen höheren erwarteten Gewinn zu erzielen sollte er in E.ON investieren. Angenommen er ist sehr risikoavers, wird er sich für die Air Berlin Aktie entscheiden.' },
					{ id: 2, text: 'Um einen höheren erwarteten Gewinn zu erzielen sollte er in Air Berlin investieren. Angenommen er ist sehr risikoavers, wird er sich für die E.ON Aktie entscheiden.' },
					{ id: 3, text: 'Um einen höheren erwarteten Gewinn zu erzielen sollte er in Air Berlin investieren. Angenommen er ist sehr risikoavers, wird er sich ebenso für die Air Berlin Aktie entscheiden.' }
				 ],
				correct: 2
			},
			{
				catalog: 'chances-and-risks',
				description: 'Nach einem Jahr, bewertet der Investor seine Entscheidung. Beide Aktien haben eine Wertsteigerung von 20 % erfahren, wobei ihre Volatilitäten unverändert sind. Welche der folgenden Aussagen ist richtig?',
				answers: [
					{ id: 0, text: 'Die Air Berlin Aktie hat relativ zur E.ON Aktie einen größeren Gewinn erzielt als erwartet. Der Sharpe-Ratio der Air Berlin Aktie für das letzte Jahr ist somit niedriger als der Sharpe-Ratio der E.ON Aktie.' },
					{ id: 1, text: 'Die Air Berlin Aktie hat relativ zur E.ON Aktie einen geringeren Gewinn erzielt als erwartet. Der Sharpe-Ratio der Air Berlin Aktie für das letzte Jahr ist somit niedriger als der Sharpe-Ratio der E.ON Aktie.' },
					{ id: 2, text: 'Die Air Berlin Aktie hat relativ zur E.ON Aktie einen größeren Gewinn erzielt als erwartet. Der Sharpe-Ratio der Air Berlin Aktie für das letzte Jahr ist somit höher als der Sharpe-Ratio der E.ON Aktie.' },
					{ id: 3, text: 'Die Air Berlin Aktie hat relativ zur E.ON Aktie einen größeren Gewinn erzielt als erwartet. Der Sharpe-Ratio der Air Berlin Aktie für das letzte Jahr ist somit höher als der Sharpe-Ratio der E.ON Aktie.'}
				],
				correct: 1
			},
			//FUNDAMENTAL-ANALYSIS
			{
				catalog: 'fundamental-analysis',
				description: 'Ein Investor möchte entscheiden, ob sich ein Investment in die E.ON Aktie und die Air Berlin Aktie (beide KGV = 10) lohnt. Dabei vergleicht er das KGV der beiden Unternehmen mit dem Durchschnitt der jeweiligen Industrien. Diese liegen für Energieversorger bei KGV = 15 und für Fluggesellschaften bei KGV = 6. Welche der folgenden Erwartungen sind zutreffend?',
				answers: [
					{ id: 0, text: 'Beide Aktien sind relativ zum Markt überbewertet. Ein Investment lohnt sich nicht.' },
					{ id: 1, text: 'Die E.ON Aktie ist relativ zum Markt überbewertet. Da die Air Berlin Aktie relativ zum Markt unterbewertet ist, sollte der Investor diese kaufen.' },
					{ id: 2, text: 'Die Air Berlin Aktie ist relativ zum Markt überbewertet. Da die E.ON Aktie relativ zum Markt unterbewertet ist, sollte der Investor diese kaufen.' },
					{ id: 3, text: 'Beide Aktien sind relativ zum Markt unterbewertet und könnten beide mit Gewinnaussicht gekauft werden.  ' }
				],
				correct: 2
			},
			{
				catalog: 'fundamental-analysis',
				description: 'Investor A und B sollten alleinig die Technische Analyse vorziehen, da sie Kursentwicklungen für beide Investmenthorizonte treffender voraussagen kann. Welche Empfehlung ist zutreffend?',
				answers: [
					{ id: 0, text: 'Investor A und B sollten alleinig die Technische Analyse vorziehen, da sie Kursentwicklungen für beide Investmenthorizonte treffender voraussagen kann.' },
					{ id: 1, text: 'Investor A und B sollten alleinig die Fundamentalanalyse vorziehen, da Technische Analyse nicht funktioniert.' },
					{ id: 2, text: 'Investor A sollte auf Grund seines kurzfristigen Investmenthorizonts die Fundamentalanalyse vorziehen, Investor B die Technische Analyse.' },
					{ id: 3, text: 'Investor A sollte auf Grund seines kurzfristigen Investmenthorizonts die Technische Analyse vorziehen, Investor B die Fundamentalanalyse.' }
				],
				correct: 3
			},
			// TECHNICAL ANALYSIS
			{
				catalog: 'technical-analysis',
				description: 'Die Kurse von Aktien A und B haben beide zunächst einen Aufwärtstrend verfolgt, welcher dann in einen Seitwärtstrend überging – in der Fachsprache auch „Flaggen“-Muster genannt. Nun durbricht Aktie A den Trading Channel deutlich nach oben, Aktie B ihn deutlich nach unten. Welche der folgende Aussagen ist zutreffend?',
				answers: [
					{ id: 0, text: 'Es kann erwartet werden, dass beide Aktien ihren Aufwärtstrend fortsetzen.' },
					{ id: 1, text: 'Es kann erwartet werden, dass Aktie A ihren Aufwärtstrend fortsetzt. Der Kurs von Aktie B hingegen wird wahrscheinlich wieder fallen.' },
					{ id: 2, text: 'Es kann erwartet werden, dass Aktie B ihren Aufwärtstrend fortsetzt. Der Kurs von Aktie A hingegen wird wahrscheinlich wieder fallen.' },
					{ id: 3, text: 'Es kann erwartet werden, dass beide Aktien eine Korrektur erfahren werden und die Kurse fallen.' }
				],
				correct: 1
			},
			{
				catalog: 'technical-analysis',
				description: 'Ein Investor versucht die in der Technischen Analyse verwendeten Charts besser zu verstehen. Dabei fällt ihm besonders eine Periode auf, welche durch eine Reihe wechselnder roter und grüner Kerzen im Kerzenchart geprägt ist. Dabei sind die Körper der roten Kerzen meist doppelt so lang wie die Körper der grünen Kerzen. Welche der folgenden Aussagen ist zutreffen?',
				answers: [
					{ id: 0, text: 'Der Investor betrachtet wahrscheinlich eine Periode die durch einen Aufwärtstrend geprägt ist.' },
					{ id: 1, text: 'Der Investor betrachtet wahrscheinlich eine Periode die durch einen Seitwärtstrend geprägt ist.' },
					{ id: 2, text: 'Der Investor betrachtet wahrscheinlich eine Periode die durch einen Abwärtstrend geprägt ist.' },
					{ id: 3, text: 'Es lassen sich auf Basis der Informationen keine Rückschlüsse auf den Kursverlauf ziehen.' },
				],
				correct: 2
			},
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
				name: 'Niedrigzinsen',
				description: 'Für Verbraucher, die ihr Geld möglichst sicher anlegen wollen, stellt sich die Situation derzeit düster dar. Stecken sie ihr Geld in sichere Anlageformen wie Sparbuch, Tagesgeld und Festgeld, bekommen sie dafür kaum Zinsen. Erste Banken verlangen sogar schon einen Negativzins. Das bedeutet, Sparer bekommen keine Zinsen, sie müssen dafür bezahlen, dass sie Geld anlegen. Wie soll man sein Geld heute noch anlegen?',
				requirements: [],
				link: 'https://www.vzsh.de/link1128833A.html',
				show: false,
				achievementName: 'LEARNING_LOW_INTEREST_RATES',
				achievement: null
			},
     	 	{
				id: 'what-are-shares',
				name: 'Was sind Aktien?',
				description: 'Was sind Aktien. Wo kann man überall sein Geld investieren? Wieso macht man das? Anlageklassen? Was ist eine Börse? Wie funktioniert eine Börse? Welche Funktionen hat der Börsenhandel? Die Grundbegriffe die für das Verständnis der Abläufe werden in dieser Lektion erläutert.',
				requirements: [],
				link: 'https://boersenspiel.tradity.de/was-sind-aktien/',
				show: false,
				achievementName: 'LEARNING_WHAT_ARE_SHARES',
				achievement: null
			},
			{
				id: 'terminology',
				name: 'Die Terminologie der Börse',
				description: 'Die Terminologie der Börse. Welche Ordertypen gibt es? Was ist Market Cap? Was ist ein Bullenmarkt? Ein Bärenmarkt? Die Terminologie der Börse. Welche Ordertypen gibt es? Was ist Market Cap? Was ist ein Bullenmarkt? Ein Bärenmarkt? Mit dem Wissen aus dieser Lektion, wird es dir deutlich leichter fallen, Börsen- und Wirtschaftsnachrichten zu verstehen.',
				requirements: [],
				link: 'https://boersenspiel.tradity.de/terminologie-der-boerse/',
				show: false,
				achievementName: 'LEARNING_TERMINOLOGY',
				achievement: null
			},
			{
				id: 'opportunities-and-risks',
				name: 'Chancen und Risiken im Aktienhandel',
				description: 'Jedem Kauf einer Aktie liegt nicht nur die Chance auf einen Gewinn, sondern auch ein damit verbundenes Risiko zu Grunde. Deshalb stellt sich die Frage, wie sich das Risiko einer bestimmten Aktie bemessen und in Zahlen ausdrücken lässt. Hierzu gibt es verschiedene Kennzahlen die Investoren heranziehen können. Wir möchten dir in diesem Kapitel eine der wichtigsten Kennzahlen, die sogenannte Volatilität, etwas genauer erklären.',
				requirements: [],
				link: 'https://boersenspiel.tradity.de/chancen-und-risiken-im-aktienhandel/',
				show: false,
				achievementName: 'LEARNING_OPPORTUNITIES_AND_RISKS',
				achievement: null
			},
			{
				id: 'fundamental-analysis',
				name: 'Die Fundamentalanalyse',
				description: 'Man unterscheidet grundsätzlich zwischen zwei Arten der Aktienanalyse und Aktienkursen. Zum einen gibt es die „Fundamentalanalyse“, welche sich mit der Bewertung und dem Erfolg des Unternehmens beschäftigt. Zum anderen gibt es die „Technische Analyse“, welche die historischen Kursverläufe genauer untersucht. In diesem Kapitel beschäftigen wir uns zunächst mit der Fundamentalanalyse.',
				requirements: [],
				link: 'https://boersenspiel.tradity.de/die-fundamental-analyse/',
				show: false,
				achievementName: 'LEARNING_FUNDAMENTAL_ANALYSIS',
				achievement: null
			},
  			{
				id: 'technical-analysis',
				name: 'Die technische Analyse von Kursverläufen',
				description: 'Ziel eines guten Investments ist es bei positiven Trendverläufen Gewinne lange wachsen zu lassen und Verluste möglichst zu begrenzen. Doch woher kann man wissen, wann sich die Richtung der Preisentwicklung umkehrt? Die „Technische Analyse“, also die Betrachtung von historischen Kursverläufen (sogenannten Charts), kann hierbei hilfreich sein. Zunächst müssen wir aber verstehen, welche Art von Charts es überhaupt gibt und welche sich zur Technischen Analyse eignen.',
				requirements: [],
				link: 'https://boersenspiel.tradity.de/technische-analyse-von-kursverlaeufen/',
				show: false,
				achievementName: 'LEARNING_TECHNICAL_ANALYSIS',
				achievement: null
			}
		];

		$scope.questions = [];
		$scope.catalogEntry = null;

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if (toParams.id) {
				$scope.questions = [];
				
				var i;
				for (i = 0; i < $scope.learningCatalog.length; ++i)
					if ($scope.learningCatalog[i].id == toParams.id)
						$scope.catalogEntry = $scope.learningCatalog[i];
				
				for (i = 0; i < $scope.learningQuestions.length; ++i) {
					var answers = $scope.learningQuestions[i].answers;
					for (var j = 0; j < answers.length; ++j)
						answers[j].orderIndex = Math.random();
					
					if ($scope.learningQuestions[i].catalog == toParams.id)
						$scope.questions.push($scope.learningQuestions[i]);
				}
			}
		});

		$scope.checkAnswers = function() {
			$scope.answersChecked = true;
			var madeAchievement = true;
			
			for (var i = 0; i < $scope.questions.length; ++i) {
				$scope.questions[i].wrong = ($scope.questions[i].answer != $scope.questions[i].correct);
				madeAchievement = madeAchievement && !$scope.questions[i].wrong;
			}
			
			if (madeAchievement) {
				achievements.markAsDone($scope.catalogEntry.achievementName);
			}
		};
		
		achievements.listClientAchievements().then(function(clientAchievementList) {
			var learningCatalogByAchievement = {};
			
			var i;
			for (i = 0; i < $scope.learningCatalog.length; ++i)
				learningCatalogByAchievement[$scope.learningCatalog[i].achievementName] = $scope.learningCatalog[i];
			
			for (i = 0; i < clientAchievementList.length; ++i)
				if (learningCatalogByAchievement[clientAchievementList[i].name])
					learningCatalogByAchievement[clientAchievementList[i].name].achievement = clientAchievementList[i];
		});
	});

})();

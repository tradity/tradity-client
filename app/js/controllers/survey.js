(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
directive('questionnaireAnswerText', ['$compile', function ($compile) {
  return {
    scope: {
      answerFreetextModel: '=',
      questionnaireAnswerText: '='
    },
    compile: function() {
      return function(scope, element, attrs) {
        element.html(scope.questionnaireAnswerText.replace(/%answer%/g,
          '<input type="text" ng-model="answerFreetextModel">'));
        
        $compile(element.contents())(scope);
      };
    }
  };
}]);

angular.module('tradity').
controller('SurveyCtrl', function($scope, $stateParams, $state, gettextCatalog, languageManager, dialogs, socket) {
  var vm = this;
  vm.lang = languageManager.getCurrentLanguage();
  vm.questionnaire = null;
  vm.results = [];
  vm.startTime = Date.now();
  
  vm.questionnaires = socket.get('/questionnaires').then(function(result) {
    if (!result._success ||
        Object.keys(result.data.questionnaires).length === 0) {
      return $state.go('game.feed');
    }
    
    var key = $stateParams.questionnaire ||
      Object.keys(result.data.questionnaires).sort()[0];
    
    vm.questionnaire = result.data.questionnaires[key];
    return vm.questionnaires = result.data.questionnaires;
  });
  
  vm.saveQuestionnaire = function() {
    var results = [];
    var questions = vm.questionnaire[vm.lang].questions;
    
    for (var i = 0; i < questions.length; i++) {
      var k = questions[i].question_id;
      var result = vm.results[k];
      if (result) {
        if (result.choice) // radio buttons
          result[result.choice] = true;
        
        results.push({
          question: k,
          // the keys of vm.results[i] are the answer identifiers
          answers: Object.keys(result).filter(function(a) { // jshint ignore:line
            // remove 'false' or empty entries
            return result[a] && a != 'choice';
          }).map(function(a) { // jshint ignore:line
            // strip possible :freetext suffix
            a = a.replace(/:freetext$/, '');
            return {
              answer: parseInt(a),
              answer_freetext: vm.results[k][a + ':freetext'] || null
            };
          }) // jshint ignore:line
        });
      } else if (questions[i].question_multiple_answers) {
        // it’s okay if the user did not enter anything
        // when multiple answers are allowed -> do not complain
        results.push({
          question: k,
          answers: []
        });
      } else {
        return dialogs.error('tradity', gettextCatalog.getString('Please answer all the questions'));
      }
    }
    
    socket.post('/questionnaire/' + vm.questionnaire.questionnaire_id, {
      data: {
        results: results,
        fill_time: Date.now() - vm.startTime,
        fill_language: vm.lang
      }
    }).then(function(result) {
      if (result._success)
        $state.go('game.feed');
      else
        return dialogs.error('tradity', gettextCatalog.getString('An error occurred during processing of the questionnaire\n' + JSON.stringify(result)));
    });
  };
});

})();

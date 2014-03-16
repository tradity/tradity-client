angular.module('tradity').
  controller('WalkthrougCtrl', function($scope, $timeout, $location, socket, $rootScope) {    
    $scope.steps = [
      {
        name: "Willkommen",
        description: "Um den tollsten Menschen der Welt zu Watchen ! Klicke auf die Rangliste !",
        condition:{
          type:'route',
          element:'#rangliste',
          path:'#/ranking'
        }
      },
      {
        name: "Toll",
        description: "Du hast es fast Geschaft noch ein Schritt zur Weltherschaft ! Suche einfacheruser",
        condition:{
          type:'submit',
          element:'#rankingSearch'
        }
      },
      {
        name: "jaaaa :)",
        description: "Klicke jetzt auf mich ! :D",
        condition:{
          type:'click',
          element:'#user-name-einfacheruser',
        }
      }
    ]

    $scope.step = 0;
    $scope.show = true;
    $scope.pp;

    $scope.initStep = function() {
      var thisStep = $scope.steps[$scope.step];

      var rm = function() {
        if ($scope.step != 0) {
          if ($scope.steps[$scope.step-1].condition.cb) $scope.steps[$scope.step-1].condition.cb();
          $($scope.steps[$scope.step-1].condition.element).unbind().removeClass('blink');
          if ($scope.pp.destroyPointPoint) $scope.pp.destroyPointPoint();
        }

        $scope.name = thisStep.name;
        $scope.description = thisStep.description;
        $scope.pp = $(thisStep.condition.element).pointPoint().addClass('blink');   

      }

      rm();

      var nextStep = function() {
        $scope.step++;
        if ($scope.step != $scope.steps.length) $scope.initStep();
        else {
          $scope.show = false;
          rm();
        }
      }
        
      
      if (thisStep.condition.type == 'click' || thisStep.condition.type == 'submit') {
        $(thisStep.condition.element).bind($scope.steps[$scope.step].condition.type,function() {
          $timeout(nextStep,500);
        })
      } else if (thisStep.condition.type == 'route') {
        thisStep.condition.cb = $rootScope.$on("$locationChangeSuccess", function(event, next, current) { 

          var parser = document.createElement('a');
          parser.href = next;

          if (parser.hash == thisStep.condition.path)
            $timeout(nextStep,100);
        });        
      }
    }

    $scope.initStep();
  });


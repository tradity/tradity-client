angular.module('tradity').
  controller('HerounitCtrl', function($scope, $stateParams, $state, socket, $window) {
    var onResize = function () {
      setTimeout(function() {
            $('#herounit').css('margin-top', -($('#herounit').height()/2));
            $('[ng-model="username"]').focus();
      }, 50);
    };
    $scope.$watch('ownUser', function() {
      if (!$scope.ownUser) {
        $window.document.getElementsByTagName('html')[0].className = 'herounitFix';
      } else {
        $window.document.getElementsByTagName('html')[0].className = '';
        $state.go('game.feed');
      }
    });

    $scope.goto = function (id) {
      $("#hero-wrapper").animate({scrollTop:$('#'+id).offset().top}, 1700)
    }



  });

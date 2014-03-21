angular.module('tradity').
  controller('HerounitCtrl', function($scope, $stateParams, $state, socket, $window) {
    var onResize = function () {
      setTimeout(function() {
            $('#herounit').css('margin-top', -($('#herounit').height()/2));
            $('[ng-model="username"]').focus();
      }, 50);
    };
    $scope.goto = function (id) {
      $("#hero-wrapper").animate({scrollTop:$('#'+id).offset().top}, 1700)
    }
  });

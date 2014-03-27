angular.module('tradity').
  controller('TradeDetailsCtrl', function($scope, $stateParams, socket) {
    $scope.getTradeInfo = function() {
      socket.emit('get-trade-info', {
        tradeid: $stateParams.tradeId,
        _cache: 20
      },
      function(data) {
        if (data.code == 'get-trade-info-notfound') {
          alert('Trade existiert nicht');
        } else if (data.code == 'get-trade-info-succes') {
          $scope.trade = data.trade;
          $scope.trade.price = Math.abs($scope.trade.money / $scope.trade.amount);
          data.comments.sort(function(a,b) { return b.time - a.time; });
          $scope.comments = data.comments;
          
          $.each($scope.comments, function(i, e) {
            if (e.trustedhtml)
              e.comment = $sce.trustAsHtml(e.comment);
          });
          
          $scope.getUserInfo();
        }
      });
    };
    $scope.getUserInfo = function() {
      socket.emit('get-user-info', {
        lookfor: $scope.trade.userid,
        nohistory: true,
        _cache: 20
      },
      function(data) {
        $scope.user = data.result;
        if (!$scope.user.profilepic)
            $scope.user.profilepic = $scope.serverConfig.defaultprofile;
      });
    };
    $scope.getTradeInfo();
  });

angular.module('tradity').
  controller('ProfileCtrl', function($scope, $sce, $stateParams, $location, socket) {
    tabbing($('#tabs'), '/user/' + $stateParams.userId + '/?', $stateParams.pageid, $location, $scope);
    $scope.values = [];
    $scope.user = null;
    
    $scope.getUserInfo = function() {
      socket.emit('get-user-info', {
        lookfor: $stateParams.userId,
        _cache: 20
      },
      function(data) {
        if (data.code == 'get-user-info-notfound') {
          alert('Benutzer existiert nicht');
        } else if (data.code == 'get-user-info-success') {
          $scope.user = data.result;
          $scope.values = data.values;
          var orders = data.orders;
          orders.sort(function(a,b) { return b.buytime - a.buytime; });
          for (var i in orders) {
            if (orders[i].money > 0) {
              orders[i].ordertype = 'depot-buy';
            } else if (orders[i].money < 0) {
              orders[i].ordertype = 'depot-sell';
            } else {
              orders[i].ordertype = '';
            }
            orders[i].price = Math.abs(orders[i].money / orders[i].amount);
          }
          $scope.orders = orders;
          if (!$scope.user.profilepic)
            $scope.user.profilepic = $scope.serverConfig.defaultprofile;
          data.pinboard.sort(function(a,b) { return b.time - a.time; });
          $scope.comments = data.pinboard;
          $.each($scope.comments, function(i, e) {
            if (e.trustedhtml)
              e.comment = $sce.trustAsHtml(e.comment);
          });
          
          $scope.draw();
        }
      });
    };
    $scope.drawMode = 4;  
    $scope.drawModes = [
      {name: '24 h', days: 1,  marker: true},
      {name: '48 h', days: 2,  marker: true},
      {name: '7 d',  days: 7,  marker: false},
      {name: '14 d', days: 14, marker: false},
      {name: 'seit Beginn', days: 1/0, marker: false}
    ];

    $scope.$watch('drawMode', function() {
      $scope.draw($scope.drawMode);
    });

    $scope.curPlot = null;
    $scope.draw = function(newMode) {    
      if (newMode != null)
        $scope.drawMode = newMode;
              
      var mode = $scope.drawModes[$scope.drawMode];
      var now = new Date().getTime();
      var tmin = now, tmax = 0,vmin = 1/0,vmax=0;
      
      var data = $.map($.grep($scope.values, function(e) {
        return now/1000 - e.time < 86400 * mode.days;
      }), function(e) {
        if (e.time*1000 < tmin) tmin = e.time*1000;
        if (e.time*1000 > tmax) tmax = e.time*1000;
        if (e.value/10000 < vmin) vmin = e.value/10000;
        if (e.value/10000 > vmax) vmax = e.value/10000;
        return [[e.time*1000, e.value/10000]];
      });
      
      if (!data || data.length == 0)
        return;
      
      if ($scope.curPlot) $scope.curPlot.destroy();
      $scope.curPlot = $.jqplot('chart', [data], {
        title: 'Performance ' + mode.name,
        axes: {
          xaxis: {
            renderer: $.jqplot.DateAxisRenderer,
            min: tmin,
            max: tmax,
            tickRenderer: $.jqplot.CanvasAxisTickRenderer,
            tickOptions: {
              angle: -30,
              formatString: '%d.%m, %R',
            }
          },
          yaxis: {
            min: vmin * 0.85,
            max: vmax / 0.85,
            tickOptions: {
              formatString: '%.2f €'
            }
          }
        },
        highlighter: {
          show: true,
          sizeAdjust: 2
        },
        cursor: {
          show: true,
          zoom: true
        },
        shadow: false,
        shadowAlpha: 1,
        series: [
          {
            showMarker: mode.marker,
            markerOptions: { style: 'circle', size: 2 }
          }
        ]
      });
    };
    $scope.addToWatchlist = function() {
      socket.emit('watchlist-add', {
        stockid: $scope.user.lstockid
      },
      function(data) {
        if (data.code == 'watchlist-add-success') {
          alert($scope.user.name + ' zur Watchlist hinzugefügt');
        } else if (data.code == 'watchlist-add-notfound') {
          alert('Benutzer nicht gefunden. Hier läuft etwas falsch.');
        }
      });
    };
    $scope.sendComment = $scope.createSendCommentFn($scope, function() { return $scope.user.registerevent; }, 'User nicht gefunden.');
    $scope.getUserInfo();
    /*
    var data = {
      labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni'],
      datasets: [{
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        data: [65, 59, 90, 81, 56, 55]
      }]
    };
    var ctx = document.getElementById("depotPerformanceChart").getContext("2d");
    var depotPerformanceChart = new Chart(ctx).Line(data);
    */
  });

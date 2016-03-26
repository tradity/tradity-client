(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('adminSustainabilityRankingCtrl', function($scope, socket) {
    $scope.schoolpath = '';
    $scope.sranking = [];
    
    $scope.loadSRanking = function() {
      return socket.post('/sustainability-ranking', {
        data: {
          schoolid: $scope.schoolpath || undefined,
          scoreTable: [
            { stocktextid: 'DE000A1EWWW0', score: 1.1 },
            { stocktextid: 'FR0000120073', score: 1.2 },
            { stocktextid: 'NL0000235190', score: 1.0 },
            { stocktextid: 'DE0008404005', score: 1.5 },
            { stocktextid: 'BE0003793107', score: 1.1 },
            { stocktextid: 'NL0010273215', score: 1.0 },
            { stocktextid: 'IT0000062072', score: 1.2 },
            { stocktextid: 'FR0000120628', score: 0.9 },
            { stocktextid: 'ES0113211835', score: 1.5 },
            { stocktextid: 'ES0113900J37', score: 1.1 },
            { stocktextid: 'DE000BASF111', score: 1.3 },
            { stocktextid: 'DE000BAY0017', score: 1.2 },
            { stocktextid: 'DE0005200000', score: 0.9 },
            { stocktextid: 'DE0005190003', score: 1.7 },
            { stocktextid: 'FR0000131104', score: 0.7 },
            { stocktextid: 'FR0000120172', score: 1.4 },
            { stocktextid: 'DE000CBK1001', score: 1.0 },
            { stocktextid: 'FR0000125007', score: 0.8 },
            { stocktextid: 'DE0005439004', score: 1.5 },
            { stocktextid: 'DE0007100000', score: 1.4 },
            { stocktextid: 'DE0005140008', score: 0.7 },
            { stocktextid: 'DE0005810055', score: 1.0 },
            { stocktextid: 'DE0008232125', score: 0.8 },
            { stocktextid: 'DE0005552004', score: 0.9 },
            { stocktextid: 'DE0005557508', score: 1.0 },
            { stocktextid: 'DE000ENAG999', score: 1.6 },
            { stocktextid: 'IT0003128367', score: 0.9 },
            { stocktextid: 'FR0010208488', score: 1.6 },
            { stocktextid: 'IT0003132476', score: 0.8 },
            { stocktextid: 'FR0000121667', score: 1.0 },
            { stocktextid: 'DE0005785604', score: 1.4 },
            { stocktextid: 'DE0005785802', score: 1.4 },
            { stocktextid: 'FR0000120644', score: 1.0 },
            { stocktextid: 'DE0006047004', score: 1.5 },
            { stocktextid: 'DE0006048432', score: 1.3 },
            { stocktextid: 'ES0144580Y14', score: 1.0 },
            { stocktextid: 'ES0148396007', score: 0.6 },
            { stocktextid: 'DE0006231004', score: 1.6 },
            { stocktextid: 'NL0000303600', score: 1.0 },
            { stocktextid: 'IT0000072618', score: 1.1 },
            { stocktextid: 'DE000KSAG888', score: 0.7 },
            { stocktextid: 'DE0006483001', score: 1.2 },
            { stocktextid: 'FR0000120321', score: 0.7 },
            { stocktextid: 'FR0000121014', score: 1.7 },
            { stocktextid: 'DE0006599905', score: 1.2 },
            { stocktextid: 'DE0008430026', score: 1.0 },
            { stocktextid: 'FI0009000681', score: 1.0 },
            { stocktextid: 'FR0000133308', score: 1.1 },
            { stocktextid: 'NL0000009538', score: 1.6 },
            { stocktextid: 'DE0007037129', score: 1.6 },
            { stocktextid: 'FR0000073272', score: 1.3 },
            { stocktextid: 'FR0000120578', score: 0.8 },
            { stocktextid: 'DE0007164600', score: 1.0 },
            { stocktextid: 'FR0000121972', score: 1.1 },
            { stocktextid: 'DE0007236101', score: 1.7 },
            { stocktextid: 'FR0000130809', score: 1.5 },
            { stocktextid: 'ES0178430E18', score: 1.0 },
            { stocktextid: 'DE0007500001', score: 0.6 },
            { stocktextid: 'FR0000120271', score: 0.6 },
            { stocktextid: 'FR0000124711', score: 1.1 },
            { stocktextid: 'IT0004781412', score: 1.1 },
            { stocktextid: 'NL0000009355', score: 1.4 },
            { stocktextid: 'FR0000125486', score: 1.0 },
            { stocktextid: 'FR0000127771', score: 0.8 },
            { stocktextid: 'DE0007664039', score: 0.85 },
            { stocktextid: 'DE000A1ML7J1', score: 0.7 }
          ]
        }
      }).then(function(result) {
        if (!result._success)
          return;
        
        $scope.sranking = result.data.map(function(entry) {
          entry.overallScore = ((entry.totalvalue / 10000.0) / 100000.0 - 1.0) * entry.totalscore;
          return entry;
        });
      });
    };
  });

})();

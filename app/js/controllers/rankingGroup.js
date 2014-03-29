angular.module('tradity').
  controller('RankingGroupCtrl', function($scope, $stateParams, $location, socket) {
  	$scope.results = [];
  	$scope.school = {};
    $scope.interGroupResults = [];

  	$scope.$on('user-update', function() {
      $scope.computeGroupRanking();
      
      $scope.selfIsSchoolMember = false;
      for (var i = 0; i < $scope.ownUser.schools.length; ++i) {
        if ($scope.ownUser.schools[i].id == $scope.schoolid) {
          $scope.selfIsSchoolMember = true;
          break;
        }
      }
    });
    
    $scope.computeGroupRanking = function() {
      socket.emit('list-schools', { 
        _cache: 60,
        parentPath: $scope.school ? $scope.school.path : null
      }, function(schoollist) {
        var schools = schoollist.result || [];
        
        $scope.interGroupResults = [];
        
        // linearize intergroup results
        $.each(schools, function(i, s) {
          var students = [];
          $scope.pendingMembers = [];
          
          $.each($scope.results, function(i, e) {
            if (e.schoolpath && (e.schoolpath == s.path || e.schoolpath.substr(0, s.path.length + 1) == s.path + '/') && e.hastraded && !e.pending)
              students.push(e);
              
            if ($scope.school && e.schoolpath == $scope.school.path && e.pending)
              $scope.pendingMembers.push(e);
          });
      
          students.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
          
          if (students.length == 0)
            return;
            
          var avg = {prov_sum: 0, totalvalue: 0, school: s.id, schoolname: s.name, schoolpath: s.path};
          var n = 0;
          for (var i = 0; i < students.length && i < 5; ++i) {
            ++n;
            avg.prov_sum += students[i].prov_sum;
            avg.totalvalue += students[i].totalvalue;
          }
          
          if (n > 0) {
            avg.count = students.length;
            avg.prov_sum /= n;
            avg.totalvalue /= n;
            
            $scope.interGroupResults.push(avg);
          }
        });
        
        $scope.interGroupResults.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
        for (var i = 0; i < $scope.interGroupResults.length; ++i)
          $scope.interGroupResults[i].rank = i+1;
        
        $scope.school.usercount = $scope.results.length - $scope.pendingMembers.length;
        
        $.each($scope.results, function(i, e) {
          if (e.uid == $scope.ownUser.uid)
            $scope.selfIsSchoolMember = true;
        });
        
        if ($scope.school.admins) {
          $.each($scope.school.admins, function(i, e) {
            if (e.adminid == $scope.ownUser.uid)
              $scope.selfIsSchoolAdmin = true;
          });
        }
      });
    };

  	socket.emit('get-ranking', {
  		rtype: 'general',
  		_cache: 20
  	},
  	function(data) {
  		if (data.code == 'get-ranking-success') {
  			$scope.results = data.result;
  			$scope.computeGroupRanking();
  		}
  	});
  });

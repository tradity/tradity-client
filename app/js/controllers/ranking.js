angular.module('tradity').
  controller('RankingCtrl', function($scope, $stateParams, $location, socket) { 
    $scope.school = {};
    $scope.selfIsSchoolAdmin = false;
    $scope.selfIsSchoolMember = false;
    $scope.pendingMembers = [];
    $scope.comments = [];
    $scope.schoolid = null;
    $scope.descpage = '';
    $scope.editingDescpage = false;
    
    if ($stateParams.schoolid) {
      if (parseInt($stateParams.schoolid) == $stateParams.schoolid)
        $scope.schoolid = $stateParams.schoolid;
      else
        $scope.schoolid = '/' + $stateParams.schoolid;
      
      socket.emit('get-school-info', {
        lookfor: $scope.schoolid
      }, function(data) {
        if (data.code == 'get-school-info-success') {
          $scope.school = data.result;
          $scope.comments = $scope.school.comments;
          $scope.descpage = $scope.school.descpage;
          $scope.schoolid = $scope.school.id;
          $scope.computeGroupRanking();
        }
      });
      
      tabbing($('#tabs'), '/s/?/' + ($stateParams.schoolid || ''), $stateParams.pageid || 'general', $location, $scope);
      

      $scope.enterTeam = function () {
        socket.emit('get-own-options', function(data) {
          data.result.school = $scope.schoolid;
          $scope.selfIsSchoolMember = true;
          socket.emit('change-options',data.result);
        });
      };

      $scope.leaveTeam = function () {
        if (confirm("Willst du wirklich die Gruppe verlassen ?")) {
          socket.emit('get-own-options', function(data) {
            data.result.school = null;
            socket.emit('change-options',data.result);
            $scope.selfIsSchoolMember = false;
            notification("Gruppe verlassen");
          });          
        }
      };

      $scope.sendComment = $scope.createSendCommentFn($scope, function() { return $scope.school.eventid; }, 'Gruppe nicht gefunden.');
    
      $scope.deleteCommentSA = function(comment) {
        socket.emit('school-delete-comment', {
          schoolid: $scope.schoolid,
          commentid: comment.commentid
        }, function() { alert('Ok!'); });
      };
      
      $scope.kickUser = function(user) {
        if (!confirm('Wirklich User „' + user.name + '“ aus der Gruppe „' + user.schoolname + '“ löschen?'))
          return;
        
        socket.emit('school-kick-user', {
          schoolid: user.school,
          uid: user.uid
        }, function() {
          $scope.getRanking();
          alert('Ok!');
        });
      };
      
      $scope.promoteUserToAdmin = function(user) {
        if (!confirm('Wirklich User „' + user.name + '“ zum Admin der Gruppe „' + $scope.school.name + '“ machen?'))
          return;
        
        socket.emit('school-change-member-status', {
          schoolid: $scope.schoolid,
          uid: user.uid,
          status: 'admin'
        }, function() {
          $scope.getRanking();
          alert('Ok!');
        });
      };
      
      $scope.enterDescpageEdit = function() {
        $scope.editingDescpage = true;
      };
      
      $scope.changeDescription = function() {
        socket.emit('school-change-description', {
          schoolid: $scope.schoolid,
          descpage: $scope.descpage
        }, function() {
          alert('Ok!');
        });
      };
      
      $scope.verifyMember = function(user) {
        socket.emit('school-change-member-status', {
          schoolid: $scope.schoolid,
          uid: user.uid,
          status: 'member'
        }, function() {
          $scope.getRanking();
          alert('Ok!');
        });
      };
      
      $scope.createSchool = function() {
        var n = prompt('Gruppenname:').trim();
        if (!n)
          return;
        
        socket.emit('create-school', {
          schoolname: n,
          schoolpath: $scope.school.path + '/' + n.replace(/[^\w_-]/g, '-').replace(/-+/g, '-'),
        }, function(data) {
          if (data.code == 'create-school-success')
            alert('Ok!');
          else
            alert('Fehler: ' + data.code);
        });
      };
    } else {
      tabbing($('#tabs'), '/ranking/?', $stateParams.pageid, $location, $scope);
      
      $scope.sendComment = function() {};
    }

    $scope.results = [];
    $scope.resultsWeek = [];
    $scope.resultsFollower = [];
    $scope.resultsFollowerWeek = [];
    $scope.intraGroupResults = [];
    $scope.interGroupResults = [];

    $scope.searchText = '';
    $scope.totalDisplayed = 20;

    $scope.loadMore = function() {
      $scope.totalDisplayed += 10;
    };

    $scope.$on('user-update', function() { $scope.computeGroupRanking(); });
    
    $scope.computeGroupRanking = function() {
      $scope.intraGroupResults = [];
      $scope.interGroupResults = [];
      var schools = [];
      
      $.each($scope.results, function(i, e) {
        if (e.school == null)
          return;
        
        if (schools.indexOf(e.schoolpath) == -1 && e.hastraded)
          schools.push(e.schoolpath);
        
        if (($scope.ownUser && e.school == $scope.ownUser.schoolid) || $scope.school)
          $scope.intraGroupResults.push(e);
      });
      
      // linearize intergroup results
      $.each(schools, function(i, s) {
        var students = [];
        $.each($scope.results, function(i, e) {
          if (e.schoolpath && (e.schoolpath == s || e.schoolpath.substr(0, s.length + 1) == s + '/') && e.hastraded && !e.pending)
            students.push(e);
            
          if ($scope.school && e.schoolpath == $scope.school.path && e.pending) 
            $scope.pendingMembers.push(e);
        });
    
        students.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
        
        if (students.length == 0)
          throw new Error('School ' + s + ' has no students');
          
        var avg = {prov_sum: 0, totalvalue: 0, school: s, schoolname: students[0].schoolname, schoolpath: students[0].schoolpath};
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
      
      /* linearize intragroup results */
      $scope.intraGroupResults.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
      for (var i = 0; i < $scope.intraGroupResults.length; ++i)
        $scope.intraGroupResults[i].igrank = i+1;
        
      $scope.school.usercount = $scope.results.length - $scope.pendingMembers.length;
      
      $.each($scope.results, function(i, e) {
        if (e.uid == $scope.ownUser.uid)
          $scope.selfIsSchoolMember = true;
      });
      
      if ($scope.school.admins) {
        $.each($scope.school.admins, function(i, e) {
          if (e.uid == $scope.ownUser.uid)
            $scope.selfIsSchoolAdmin = true;
        });
      }
    };
    
    $scope.getRanking = function() {
      var page = $stateParams.pageid;

      switch (page) {
        case 'all':
        default:
          socket.emit('get-ranking', {
            rtype: 'general',
            search:$scope.searchText,
            schoolid:$scope.schoolid,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.results = data.result;
            $scope.resultsCount = data.count;
          });
          break;
        case 'general':
        case 'intragroup':
        case 'intergroup':
          socket.emit('get-ranking', {
            rtype: 'general',
            schoolid: $scope.schoolid,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.results = data.result;
            $scope.resultsCount = data.count;
            $scope.computeGroupRanking();
          });
          break;
        case 'all-withprov':
          socket.emit('get-ranking', {
            rtype: 'general-wprov',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsWithProvision = data.result;
            $scope.resultsWithProvisionCount = data.count;
          });
          break;
        case 'follower':
          socket.emit('get-ranking', {
            rtype: 'following',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsFollower = data.result;
            $scope.resultsFollowerCount = data.count;
          });
          break;
        case 'all-week':
          socket.emit('get-ranking', {
            rtype: 'general-week',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsWeek = data.result;
            $scope.resultsWeekCount = data.count;
          });
          break;
        case 'follower-week':
          socket.emit('get-ranking', {
            rtype: 'following-week',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsFollowerWeek = data.result;
            $scope.resultsFollowerWeekCount = data.count;
          });
          break;
      }
    };
    $scope.getRanking();
  });

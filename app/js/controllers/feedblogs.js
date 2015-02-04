angular.module('tradity').
	controller('FeedblogsCtrl', function($scope, socket) {
		$scope.newblog = {
			bloguser: null,
			endpoint: null,
			category: null
		};
		
		$scope.addFeedblog = function() {
			if (!$scope.newblog.bloguser)
				$scope.newblog.bloguser = null;
			else
				$scope.newblog.bloguser = parseInt($scope.newblog.bloguser);
			
			var curScope = $scope;
			$scope.newblog.schoolid = null;
			
			while ($scope.newblog.schoolid == null && curScope) {
				if (curScope.schoolid)
					$scope.newblog.schoolid = curScope.schoolid;
				
				curScope = curScope.$parent;
			}
			
			return socket.emit('add-wordpress-feed', $scope.newblog).then(function(data) {
				if (data.code == 'add-wordpress-feed-success') {
					alert('Ok!');
					socket.emit('list-wordpress-feeds');
				} else {
					alert('Fehler: ' + data.code);
				}
			});
		};
		
		$scope.removeFeedblog = function(id) {
			return socket.emit('remove-wordpress-feed', { blogid: id }).then(function(data) {
				if (data.code == 'remove-wordpress-feed-success') {
					alert('Ok!');
					socket.emit('list-wordpress-feeds');
				} else {
					alert('Fehler: ' + data.code);
				}
			});
		};
		
		$scope.processBlogs = function() {
			socket.emit('process-wordpress-feed').then(function(data) {
				if (data.code == 'process-wordpress-feed-success')
					alert('Ok!');
				else
					alert('Fehler: ' + data.code);
			});
		};
	});

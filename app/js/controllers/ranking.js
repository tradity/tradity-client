function parseDateSpec(arg) {
	// relative unix timestamp
	if (arg && (arg[0] == '+' || arg[0] == '-') && parseInt(arg) == arg)
		return new Date(parseInt(arg) * 1000 + Date.now());
	
	// absolute unix timestamp
	if (arg === 0 || parseInt(arg) == arg)
		return new Date(arg * 1000);
	
	// do not accepty falsey values except for 0
	if (!arg)
		return null;
	
	arg = String(arg).toLowerCase();
	
	// "week" or "3 months"-style formats
	var match;
	var units = [
		[/^s(ec(onds?)?)?$/, 1],
		[/^min(utes?)?$$/,    60],
		[/^h(ours?)?$/,      60 * 60],
		[/^d(ays?)?$/,       60 * 60 * 24],
		[/^w(eeks?)?$/,      60 * 60 * 24 * 7],
		[/^m(onths?)?$/,     60 * 60 * 24 * 30.4368],
		[/^y(ears?)?$/,      60 * 60 * 24 * 365.242],
	];
	
	if (match = arg.match(/^\s*(\d+)?\s*(\w+)\s*$/)) {
		var amount = parseInt(match[1] || 1);
		var unit = match[2];
		
		for (var i = 0; i < units.length; ++i)
			if (amount && units[i][0].test(unit))
				return new Date(Date.now() - units[i][1] * 1000 * amount);
	}
	
	// parseable as Date
	if (new Date(arg).getTime())
		return new Date(arg);
	
	return null;
}

angular.module('tradity').
	controller('RankingCtrl', function($scope, $stateParams, socket) {
		$scope.totalDisplayed = 20;

		$scope.loadMore = function() {
			$scope.totalDisplayed += 10;
		};
		
		/* filter and sort a ranking list (by some given key) and add .rank properties */
		$scope.rankify = function(res, schools, key_, filter_) {
			filter = function(r) { return filter_ ? filter_(r, $scope.spec) : true; };
			key    = function(r) { return key_(r, $scope.spec); };
			
			res = $.extend(true, [], res); // deep copy (so user.rank does not get carried over)
			res = res.filter(filter);
			
			for (var i = 0; i < res.length; ++i)
				res.isSchoolEntry = false;
			
			if (schools && schools.length > 0) {
				// linearize intergroup results
				$.each(schools, function(i, s) {
					var students = [];
					
					$.each(res, function(i, e) {
						if (e.schoolpath && (e.schoolpath == s.path || e.schoolpath.substr(0, s.path.length + 1) == s.path + '/')
							&& !e.pending)
							students.push(e);
					});
					
					if (students.length == 0)
						return;
					
					students.sort(function(a, b) { return key(b) - key(a); });
					
					var avg = {
						prov_sum: 0,
						totalvalue: 0,
						fperfval: 0,
						fperf: 0,
						school: s.id,
						schoolname:
						s.name,
						schoolpath:
						s.path,
						isSchoolEntry: true
					};
					
					var n = 0;
					for (var i = 0; i < students.length && i < 5; ++i) {
						++n;
						avg.prov_sum += students[i].prov_sum;
						avg.totalvalue += students[i].totalvalue;
						avg.fperfval += students[i].fperfval;
						avg.fperf += students[i].fperf;
					}
					
					if (n > 0) {
						avg.count = students.length;
						avg.prov_sum /= n;
						avg.totalvalue /= n;
						avg.fperfval /= n;
						avg.fperf /= n;
						
						res.push(avg);
					}
				});
			}
			
			res.sort(function(a, b) {
				return key(b) - key(a);
			});
			
			var r = 1;
			for (var i = 0; i < res.length; ++i)
				if (!res[i].isSchoolEntry)
					res[i].rank = r++;
			
			return res;
		};
		
		$scope.rankifyOptions = {
			administrative: { 
				filter: function(r, s) { return r.uid; },
				key: function(r, s) { return r.uid; }
			},
			all: {
				key: function(r, s) { return (r.hastraded || r.isSchoolEntry) ?
					r.totalvalue - (s.includeProvision ? 0 : r.prov_sum) : -Infinity; }
			},
			follower: {
				filter: function(r, s) { return r.fperf != null; },
				key: function(r, s) { return (r.hastraded || r.isSchoolEntry) ? 
					r.fperfval : -Infinity; }
			},
			xp: {
				filter: function(r, s) { return r.xp != null; },
				key: function(r, s) { return r.xp; }
			}
		};
		
		$scope.updateRanking = function() {
			if (!$scope.rawResults)
				return;
			
			$scope.markSchoolAdmins();
			
			$scope.results = {};
			for (var type in $scope.rankifyOptions)
				$scope.results[type] = $scope.rankify(
					$scope.rawResults,
					$scope.schools,
					$scope.rankifyOptions[type].key,
					$scope.rankifyOptions[type].filter);
			
			if ($scope.school)
				$scope.school.usercount = $scope.rawResults.length - $scope.pendingMembers.length;
		};
		
		$scope.markSchoolAdmins = function() {
			var admins = [];
			
			var curScope = $scope;
			
			while (curScope) {
				if (curScope.school && curScope.school.admins)
					for (var i = 0; i < curScope.school.admins.length; ++i)
						admins.push(curScope.school.admins[i].adminname);
				
				curScope = curScope.$parent;
			}
			
			for (var i = 0; i < $scope.rawResults.length; ++i) 
				$scope.rawResults[i].isSchoolAdmin = admins.indexOf($scope.rawResults[i].name) != -1;
		}
		
		$scope.rawResults = [];
		$scope.results = {};
		$scope.schools = [];
		
		for (var type in $scope.rankifyOptions)
			$scope.results[type] = [];
		
		$scope.spec = {};
		var spec = ($stateParams.spec || '').split(':');
		
		if (spec.length > 0 && /^[-_A-Za-z]+$/.test(spec[0]) && $scope.rankifyOptions[spec[0]])
			$scope.spec.type = spec[0];
		else
			$scope.spec.type = 'all'; // default type
		spec.shift();
		
		if ($scope.spec.since = parseDateSpec(spec[0])) spec.shift();
		if ($scope.spec.upto  = parseDateSpec(spec[0])) spec.shift();
		
		// various flags
		$scope.spec.showGroups = true;
		$scope.spec.showUsers  = true;
		$scope.spec.includeProvision = false;
		
		for (var i = 0; i < spec.length; ++i) {
			switch (spec[i]) {
				case 'nogroup': $scope.spec.showGroups = false; break;
				case 'nouser':  $scope.spec.showUsers  = false; break;
				case 'wprov':   $scope.spec.includeProvision = true; break;
			}
		}
		
		// return a string representing a new ranking specification
		$scope.csr = $scope.changedSpecRef = function(changes) {
			var newSpec = $.extend(true, {}, $scope.spec, changes);
			var specArray = [newSpec.type];
			if (newSpec.since) specArray.push(newSpec.since.toDateString());
			if (newSpec.upto)  specArray.push(newSpec.upto .toDateString());
			if (!newSpec.showGroups) specArray.push('nogroup');
			if (!newSpec.showUsers)  specArray.push('nouser');
			if (newSpec.includeProvision) specArray.push('wprov');
			
			return specArray.join(':');
		};
		
		socket.emit('get-ranking', {
			since: $scope.spec.since ? $scope.spec.since.getTime() / 1000 : null,
			upto:  $scope.spec.upto  ? $scope.spec.upto .getTime() / 1000 : null,
			schoolid: $scope.schoolid,
			_cache: 30
		}, function(data) {
			if (data.code != 'get-ranking-success')
				return notification('Es gab ein Problem beim Laden der Rangliste!');
			
			$scope.rawResults = data.result;
			
			$scope.updateRanking();
		});
		
		$scope.$on('user-update', function() {
			$scope.updateRanking();
		});
		
		socket.emit('list-schools', { 
			_cache: 60,
			parentPath: $scope.school ? $scope.school.path : null
		}, function(schoollist) {
			$scope.schools = schoollist.result;
			$scope.updateRanking();
		});
	});

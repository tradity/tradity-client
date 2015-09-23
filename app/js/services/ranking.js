'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.ranking
 * @description
 * # provides ranking information
 * Factory
 */
angular.module('tradity')
	.factory('ranking', function (socket, gettext) {
		var Ranking = function(school, spec, rankifyOptions, resultFilters, noAutoFetch) {
			this.school = school || null;
			this.spec = spec;
			this.rankifyOptions = rankifyOptions || {};
			this.resultFilters = resultFilters || [];
			this.onRankingUpdatedHandlers = [];
			
			this.schools = [];
			this.rawResults = [];
			this.results = {};
			
			for (var type in this.rankifyOptions)
				this.results[type] = [];
			
			if (!noAutoFetch)
				this.fetch();
		};
		
		Ranking.prototype.fetch = function() {
			var self = this;
			
			socket.emit('list-schools', { 
				_cache: 60,
				parentPath: self.school ? self.school.path : null
			}, function(schoollist) {
				self.schools = schoollist.result;
				self.updateRanking();
			});
			
			var schoolid;
			if (!self.school || (schoolid = self.school.id || self.school.schoolid || self.school.path))
			socket.emit('get-ranking', {
				since: self.spec.since ? self.spec.since.getTime() / 1000 : null,
				upto:  self.spec.upto  ? self.spec.upto .getTime() / 1000 : null,
				schoolid: schoolid,
				includeAll: self.spec.includeAll,
				_cache: 30
			}, function(data) {
				if (data.code != 'get-ranking-success')
					return notification(gettext('There was a problem while loading the current ranking!'));
				
				self.rawResults = self.filterRawResults(data.result);
				
				self.updateRanking();
			});
		};
		
		Ranking.prototype.filterRawResults = function(r) {
			for (var i = 0; i < this.resultFilters.length; ++i)
				r = this.resultFilters[i](r);
			
			return r;
		};

		/* filter and sort a ranking list (by some given key) and add .rank properties */
		Ranking.prototype.rankify = function(key_, filter_) {
			var self = this;
			
			var filter = function(r) { return filter_ ? filter_(r, self.spec) : true; };
			var key    = function(r) { return key_(r, self.spec); };
			
			var res = $.extend(true, [], this.rawResults); // deep copy (so user.rank does not get carried over)
			res = res.filter(filter);
			
			for (var i = 0; i < res.length; ++i) {
				res[i].isSchoolEntry = false;
				res[i].key = key(res[i]);
			}
			
			if (this.schools && this.schools.length > 0) {
				// linearize intergroup results
				$.each(this.schools, function(i, s) {
					var students = [];
					
					$.each(res, function(i, e) {
						if (e.schoolpath && (e.schoolpath == s.path || e.schoolpath.substr(0, s.path.length + 1) == s.path + '/')
							&& !e.pending)
							students.push(e);
					});
					
					if (students.length == 0)
						return;
					
					students.sort(function(a, b) { return b.key - a.key; });
					
					var additiveKeys = [
						'prov_sum', 'past_prov_sum', 'totalvalue', 'past_totalvalue', 'fperfval', 'fperf', 'xp'
					];
					
					var avg = {
						hastraded: 0,
						school: s.id,
						schoolname: s.name,
						schoolpath: s.path,
						isSchoolEntry: true
					};
					
					for (var j = 0; j < additiveKeys.length; ++j)
						avg[additiveKeys[j]] = 0;
					
					var n = 0;
					for (var i = 0; i < students.length && i < 5; ++i) {
						++n;
						
						avg.hastraded |= students[i].hastraded;
						for (var j = 0; j < additiveKeys.length; ++j)
							avg[additiveKeys[j]] += students[i][additiveKeys[j]];
					}
					
					if (n > 0) {
						avg.count = students.length;
						avg.rankCount = n;
						
						for (var j = 0; j < additiveKeys.length; ++j)
							avg[additiveKeys[j]] /= n;
						
						avg.key = key(avg);
						
						res.push(avg);
					}
				});
			}
			
			res.sort(function(a, b) {
				return b.key - a.key;
			});
			
			var r = 1;
			for (var i = 0; i < res.length; ++i)
				if (!res[i].isSchoolEntry)
					res[i].rank = r++;
			
			res.rankForUser = function(uid) {
				for (var i = 0; i < this.length; ++i)
					if (this[i].uid == uid || this[i].name == uid)
						return this[i].rank;
				
				return null;
			};
			
			return res;
		};
		
		Ranking.prototype.updateRanking = function() {
			if (!this.rawResults || !this.rawResults.length)
				return;
			
			this.results = {};
			for (var type in this.rankifyOptions)
				this.results[type] = this.rankify(
					this.rankifyOptions[type].key,
					this.rankifyOptions[type].filter);
			
			if (this.school)
				this.school.usercount = this.rawResults.length - this.school.pendingMembers.length;
			
			for (var i = 0; i < this.onRankingUpdatedHandlers.length; ++i)
				this.onRankingUpdatedHandlers[i](this);
		};
		
		Ranking.prototype.onRankingUpdated = function(handler) {
			this.onRankingUpdatedHandlers.push(handler);
		};
		
		Ranking.prototype.get = function(id) {
			if (!id)
				return this.rawResults;
			
			return this.results[id];
		};
		
		var RankingProvider = function () {
		};
		
		RankingProvider.prototype.parseDateSpec = function (arg, defaultDate) {
			// relative unix timestamp
			if (arg && (arg[0] == '+' || arg[0] == '-') && parseInt(arg) == arg)
				return new Date(parseInt(arg) * 1000 + Date.now());
			
			// absolute unix timestamp
			if (arg === 0 || parseInt(arg) == arg)
				return new Date(arg * 1000);
			
			// do not accepty falsey values except for 0
			if (!arg || arg === 'null')
				return defaultDate;
			
			if (arg === 'weekstart') {
				var now = new Date();
				return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay(), 0, 0, 0, 0);
			}
			
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
			
			return defaultDate;
		};
		
		RankingProvider.prototype.serializeSpec = function(spec) {
			var specArray = [spec.type];
			if (spec.since) specArray.push(spec.since.toDateString ? spec.since.toDateString() : spec.since);
			if (spec.upto)  specArray.push(spec.upto .toDateString ? spec.upto .toDateString() : spec.upto);
			if (!spec.showGroups) specArray.push('nogroup');
			if (!spec.showUsers)  specArray.push('nouser');
			if (spec.includeProvision) specArray.push('wprov');
			if (spec.includeAll) specArray.push('wall');
			
			return specArray.join(':');
		};
		
		RankingProvider.prototype.deserializeSpec = function(str, rankingCfg) {
			str = str || '';
			
			var specArray = str.split(':');
			var spec = {};
			
			if (specArray.length > 0 && /^[-_A-Za-z]+$/.test(specArray[0]))
				spec.type = specArray[0];
			else
				spec.type = 'all'; // default type
			specArray.shift();
			
			if (spec.since = this.parseDateSpec(specArray[0], rankingCfg.since)) specArray.shift();
			if (spec.upto  = this.parseDateSpec(specArray[0], rankingCfg.upto))  specArray.shift();
			
			/* various flags */
			// default values
			spec.showGroups = true;
			spec.showUsers  = true;
			spec.includeProvision = false;
			spec.includeAll = false;
			
			for (var i = 0; i < specArray.length; ++i) {
				switch (specArray[i]) {
					case 'nogroup': spec.showGroups = false; break;
					case 'nouser':  spec.showUsers  = false; break;
					case 'wprov':   spec.includeProvision = true; break;
					case 'wall':    spec.includeAll = true; break;
				}
			}
			
			return spec;
		};
		
		RankingProvider.defaultRankifyOptions = {
			all: {
				key: function(r, s) { return (r.hastraded || r.isSchoolEntry) ?
					(r.totalvalue - (s.includeProvision ? 0 : r.prov_sum)) /
					(r.past_totalvalue - (s.includeProvision ? 0 : r.past_prov_sum)) : -Infinity; }
			}
		};
		
		RankingProvider.prototype.getRanking = function(school, spec, rankifyOptions, resultFilters, noAutoFetch) {
			rankifyOptions = $.extend(true, {}, RankingProvider.defaultRankifyOptions, rankifyOptions || {});
			return new Ranking(school, spec, rankifyOptions, resultFilters, noAutoFetch || false);
		};
		
		return new RankingProvider();
	});

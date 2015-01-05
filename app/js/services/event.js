'use strict';

angular.module('tradity')
	.factory('event', function ($sce,$user,config) {
		var escapeHTML = function(s) {
			if (!s)
				return s;
			return s.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/, '&gt;')
				.replace(/'/, '&#039;')
				.replace(/"/, '&quot;');
		};
		/**
		 * @ngdoc service
		 * @name tradity.event
		 * @description
		 * # event
		 * Factory in the tradityApp.
		 */
		return {
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#modNotification
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'mod-notification' event
			 */
			modNotification:function(event) {
				return {
					type: 'mod-notification',
					typePerson: 'important-item',
					time: event.eventtime,
					content: $sce.trustAsHtml(event.notifcontent),
					sticky: event.notifsticky,
				};
			},
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#watchAdd
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'watch-add' event
			 */
			watchAdd:function(event) {
				var typePerson = 'somebody';
				var type = 'watch-add';
				if (event.srcuser == $user.id) {
					var typePerson = 'yourself';
					type += '-self';
				} else if (event.watcheduser == $user.id) {
					type += '-me';
				}
				return {
					type: type,
					typePerson: typePerson,
					srcusername: event.srcusername,
					targetid: event.watcheduser,
					targetname: event.watchedname,
					time: event.eventtime
				};
			},
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#trade
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'trade' event
			 */
			trade:function(event) {
				var typePerson = 'somebody';
				if (event.amount < 0) {
					var type = 'trade-sell';
				} else {
					var type = 'trade-buy';
				}
				if (event.srcuser == $user.id) {
					type += '-self';
					typePerson = 'yourself';
				} else if (event.stocktextid == '__LEADER_' + $user.id + '__') {
					type += '-me';
				}
				return {
					type: type,
					typePerson: typePerson,
					srcusername: event.srcusername,
					targetid: event.targetid,
					stocktextid: event.stocktextid,
					stockname: event.stockname,
					time: event.eventtime,
					leader: event.leader,
					amount: Math.abs(event.amount)
				};
			},
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#comment
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'comment' event
			 */
			comment:function(event) {
				var typePerson = 'somebody';
				var type = 'comment';
				if (event.baseeventtype == 'trade') {
					type += '-trade';
				} else if (event.baseeventtype == 'user-register') {
					type += '-pinboard';
				} else if (event.baseeventtype == 'school-create') {
					type += '-schoolpinboard';
				} else {
					return;
				}

				if (event.srcuser == $user.id) {
					typePerson = 'yourself';
					type += '-self';
				}
				if (event.traderid == $user.id) {
					type += '-me';
				}
				var tn = event.tradername || event.schoolname;
				
				if (!event.profilepic)
					event.profilepic = config.HOST + config.DEFAULT_PROFILE_IMG;
				else
					event.profilepic = config.HOST + event.profilepic;

				return {
					type: type,
					typePerson: typePerson,
					srcusername: event.srcusername,
					comment: $sce.trustAsHtml(event.trustedhtml ? event.comment : escapeHTML(event.comment)),
					trustedhtml: event.trustedhtml,
					profilepic: event.profilepic,
					orderid: event.orderid,
					tradername: tn,
					tradername_genitive: tn ? 'xsXS'.indexOf(tn.charAt(tn.length-1)) == -1 ? tn + 's' : tn + '’' : null,
					time: event.eventtime,
					schoolpath: event.schoolpath
				};
			},
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#userProvchange
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'user-provchange' event
			 */
			userProvchange:function(event) {
				var type = 'provchange';
				if (event.srcuser == $user.id) {
					var typePerson = 'yourself';
					type += '-self';
				} else {
					var typePerson = 'somebody';
				}

				// cleanup after legacy events
				var oldwprov = event.oldwprov || event.oldprov;
				var oldlprov = event.oldlprov || 0;
				var newwprov = event.newwprov || event.newprov;
				var newlprov = event.newlprov || 0;

				return {
					type: type,
					typePerson: typePerson,
					srcusername: event.srcusername,
					oldwprov: oldwprov,
					oldlprov: oldlprov,
					newwprov: newwprov,
					newlprov: newlprov,
					wprovchanged: oldwprov != newwprov,
					lprovchanged: oldlprov != newlprov,
					bothchanged: oldwprov != newwprov && oldlprov != newlprov,
					time: event.eventtime
				};
			},
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#userNamechange
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'user-namechange' event
			 */
			userNamechange:function(event) {
				var type = 'namechange';
				if (event.srcuser == $user.id) {
					var typePerson = 'yourself';
					type += '-self';
				} else {
					var typePerson = 'somebody';
				}
				return {
					type: type,
					typePerson: typePerson,
					srcusername: event.srcusername,
					oldname: event.oldname,
					newname: event.newname,
					time: event.eventtime
				};
			},
			/**
			 * @ngdoc method
			 * @kind function
			 * @name tradity.event#userReset
			 * @methodOf tradity.event
			 * @param {object} event with detailed information
			 * @description
			 * parse the 'user-reset' event
			 */
			userReset:function(event) {
				var type = 'reset';
				if (event.srcuser == $user.id) {
					var typePerson = 'yourself';
					type += '-self';
				} else
					var typePerson = 'somebody';
				return {
					type: type,
					typePerson: typePerson,
					srcusername: event.srcusername,
					time: event.eventtime
				};
			}
		};
	});

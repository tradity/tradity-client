'use strict';

angular.module('tradity')
	/**
	 * @ngdoc service
	 * @name tradity.feed
	 * @description
	 * # feed
	 * Factory in the tradityApp.
	 */
	.factory('feed', function ($rootScope,socket,event) {

		var	$feed = $rootScope.$new(true);
				$feed.items = [];
		var	feedEvents = ['trade', 'watch-add', 'comment', 'dquery-exec', 'user-provchange', 'user-namechange', 'user-reset', 'mod-notification'];

		var updateFeed = function(res) {
			if (res.type == 'mod-notification') $feed.items.push(event.modNotification(res));
			if (res.type == 'watch-add') $feed.items.push(event.watchAdd(res));
			if (res.type == 'trade') $feed.items.push(event.trade(res));
			if (res.type == 'comment') $feed.items.push(event.comment(res));
			if (res.type == 'user-provchange') $feed.items.push(event.userProvchange(res));
			if (res.type == 'user-namechange') $feed.items.push(event.userNamechange(res));
			if (res.type == 'user-reset') $feed.items.push(event.userReset(res));
			$feed.$emit('change')
		}

		for (var i = 0; i < feedEvents.length; ++i) 
			socket.on(feedEvents[i],updateFeed);

		socket.emit('fetch-events', {
			since: 0,
			count: null,
			_expect_no_response: true
		});

		return {
			/**
			 * @ngdoc property
			 * @name tradity.feed#scope
			 * @methodOf tradity.feed
			 * @description
			 * feed scope acces
			 */
			scope:$feed
		}
	})
	/**
	 * @ngdoc service
	 * @name tradity.$feed
	 * @description
	 * alias of tradity.feed.scope
	 */
	.factory('$feed', function (feed) {
		return feed.scope;
	});


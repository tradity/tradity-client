'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('FeedCtrl', function($scope, $feed) {
		var vm = this;
		vm.displaymessages = [];
		vm.messageCount = 12;
		
		vm.displayFeed = function() {
			vm.displaymessages = $feed.items.sort(function(a, b) {
				if (b.sticky && !a.sticky) return +1;
				if (!b.sticky && a.sticky) return -1;
				return b.time - a.time;
			}).slice(0, parseInt(vm.messageCount));
		};

		vm.lastScrollCheck = 0;
		$(window).scroll(function(e) {
			var now = new Date().getTime();
			if (now - vm.lastScrollCheck < 250)
				return;
			vm.lastScrollCheck = now;
			
			var d = document.documentElement;
			if ((d.scrollTop + d.clientHeight)/(d.scrollHeight) > 0.7 && vm.messageCount < $feed.items.length) {
				vm.messageCount /= 0.8;
				$scope.$apply(vm.displayFeed);
			}
		});
		
		$feed.$on('change', function() {
			vm.displayFeed();
		});
		
		vm.displayFeed();
	});

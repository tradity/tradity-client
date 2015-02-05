'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	directive('tradityProfile', function() {
		return function(scope, element, attrs) {
			//console.log(element);
			attrs.$set('popover', 'popover-test');
			attrs.$set('popover-trigger', 'mouseenter');
		};
	});

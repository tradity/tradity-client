(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('ProfileOverviewCtrl', function($scope) {
		$scope.drawMode = 4;
		$scope.drawModes = [
			{name: '24 h', days: 1,  marker: true},
			{name: '48 h', days: 2,  marker: true},
			{name: '7 d',  days: 7,  marker: false},
			{name: '14 d', days: 14, marker: false},
			{name: 'seit Beginn', days: 1/0, marker: false}
		];

		$scope.$watch('drawMode', function() {
			$scope.draw($scope.drawMode);
		});

		$scope.$watch('$parent.values', function() {
			$scope.draw($scope.drawMode);
		});

		$scope.curPlot = null;
		$scope.draw = function(newMode) {
			if (newMode != null)
				$scope.drawMode = newMode;

			var mode = $scope.drawModes[$scope.drawMode];
			var now = new Date().getTime();
			var tmin = now, tmax = 0,vmin = 1/0,vmax=0;

			var data = $.map($.grep($scope.$parent.values, function(e) {
				return now/1000 - e.time < 86400 * mode.days;
			}), function(e) {
				if (e.time*1000        < tmin) tmin = e.time*1000;
				if (e.time*1000        > tmax) tmax = e.time*1000;
				if (e.totalvalue/10000 < vmin) vmin = e.totalvalue/10000;
				if (e.totalvalue/10000 > vmax) vmax = e.totalvalue/10000;
				return [[e.time * 1000, e.totalvalue/10000]];
			});
			
			var vcenter = (vmin + vmax) / 2;
			var vdiff = (vmax - vcenter) * 1.30 + 1;

			if (!data || data.length === 0)
				return;

			if ($scope.curPlot)
				$scope.curPlot.destroy();
			
			$scope.curPlot = $.jqplot('chart', [data], {
				title: 'Performance ' + mode.name,
				axes: {
					xaxis: {
						renderer: $.jqplot.DateAxisRenderer,
						min: tmin,
						max: tmax,
						tickRenderer: $.jqplot.CanvasAxisTickRenderer,
						tickOptions: {
							angle: -30,
							formatString: '%d.%m, %R',
						}
					},
					yaxis: {
						min: vcenter - vdiff,
						max: vcenter + vdiff,
						tickOptions: {
							formatString: '%.2f €'
						}
					}
				},

				grid:{
					background:'#fff',
					borderColor:'#F3F3F3',
					gridLineColor:'#F3F3F3',
					borderWidth:1,
					shadow:false,
				},
				highlighter: {
					show: true,
					sizeAdjust: 2
				},
				cursor: {
					show: true,
					zoom: true
				},
				shadow: false,
				shadowAlpha: 1,
				series: [
					{
						showMarker: mode.marker,
						markerOptions: { style: 'circle', size: 2 },
						shadow:false
					}
				]
			});
		};
	});

})();

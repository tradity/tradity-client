'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.lzma
 * @description
 * # lzma
 * Factory
 */
angular.module('tradity')
	.factory('lzma', function () {
		var workerURL = null;
		var pool = [];
		var counter = 0;
		
		try {
			if (typeof LZMA != 'undefined' && typeof Blob != 'undefined' && typeof Uint8Array != 'undefined' && 
				window.URL && window.URL.createObjectURL && typeof lzma_worker_js != 'undefined' && lzma_worker_js)
			{
				workerURL = URL.createObjectURL(new Blob([lzma_worker_js], {type: 'application/x-javascript'}));
				
				while (pool.length < 2)
					pool.push(new LZMA(workerURL));
			}
		} catch(e) {
			console.error(e);
		}
		
		return {
			compress: function() {
				counter++; counter %= pool.length;
				return pool[counter].compress.apply(pool[counter], arguments);
			},
			decompress: function() {
				counter++; counter %= pool.length;
				return pool[counter].decompress.apply(pool[counter], arguments);
			}
		};
	});

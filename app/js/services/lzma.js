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
		var lzma = null;
		try {
			if (typeof LZMA != 'undefined' && typeof Blob != 'undefined' && typeof Uint8Array != 'undefined' && 
				window.URL && window.URL.createObjectURL && lzma_worker_js)
			{
				lzma = new LZMA(URL.createObjectURL(new Blob([lzma_worker_js], {type: 'application/x-javascript'})));
			}
		} catch(e) {
			console.error(e);
		}
		
		return lzma;
	});

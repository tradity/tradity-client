'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.maybeCompress
 * @description
 * # maybeCompress
 * Factory
 */
angular.module('tradity')
	.factory('maybeCompress', function (lzma, $q) {
		var MaybeCompress = function() {
			this.canCompress = true;
			
			// perform minimal self-test to make sure the compression enviroment works
			var testString = 'Banana';
			this.compress(testString, 5).then(this.decompress.bind(this)).then(function(decompressed) {
				if (decompressed != testString) {
					console.warn('Decompressed string does not match input', decompressed);
					this.canCompress = false;
				}
			});
		};
		
		MaybeCompress.prototype.compress = function(input, threshold) {
			if (input.length < threshold || !lzma || !this.canCompress)
				return $q.when('r:' + input); // raw encoding
			
			var deferred = $q.defer();
			
			// some browsers have a limit of 2.5 million characters for localStorage
			// feed data is rather well compressible, so LZMA level 3 should be just fine
			lzma.compress(input, input.length > threshold * 4 ? 9 : 3, function(compressed) {
				deferred.resolve('0x' + compressed.map(function(byte) { return (byte+256).toString(16).substr(-2); }).join(''));
			});
			
			return deferred.promise;
		};
		
		MaybeCompress.prototype.decompress = function(input) {
			if (input == '' || input == 'null' || input == null)
				return $q.when(null);
			
			var encodingID = input.substr(0, 2);
			if (encodingID == 'r:')
				return $q.when(input.substr(2));
			
			if (encodingID != '0x') {
				console.warn('Unknown encoding:', encodingID);
				return $q.when(null);
			}
			
			if (!lzma) {
				console.warn('No LZMA present for decoding');
				return $q.when(null);
			}
			
			var deferred = $q.defer();
			
			// unhex input
			var byteArray = input.substr(2).replace(/(..)/g, '$1:').split(':').slice(0, -1)
				.map(function(s) { return parseInt(s, 16); });
			
			lzma.decompress(byteArray, function(decompressed) {
				deferred.resolve(decompressed);
			});
			
			return deferred.promise;
		};
		
		return new MaybeCompress();
	});

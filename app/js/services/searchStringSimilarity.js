(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.searchStringSimilarity
 * @description
 * # searchStringSimilarity
 * Factory
 */
angular.module('tradity')
	.factory('searchStringSimilarity', function () {
		var levenshtein = function(a,b) {
			if (a == b) return 0;
			if (!a) return b.length;
			if (!b) return a.length;
			
			var matrix = [], i, j;
			for (i = 0; i <= b.length; ++i)
				matrix[i] = [i];
			for (j = 0; j <= a.length; ++j)
				matrix[0][j] = j;
			for (i = 1; i <= b.length; ++i) {
				for (j = 1; j <= a.length; ++j) {
					if (b.charAt(i-1) == a.charAt(j-1)) {
						matrix[i][j] = matrix[i-1][j-1];
						continue;
					}
					
					matrix[i][j] = Math.min(matrix[i-1][j-1], matrix[i][j-1], matrix[i-1][j]) + 1;
				}
			}
			
			return matrix[b.length][a.length];
		};
		
		return function(searchString, entryName) {
			/* currently also from https://github.com/addaleax/autocomp */
	
			var a = String(entryName).toUpperCase().split(/\b/);
			var b = String(searchString).toUpperCase().split(/\b/);
			
			var i, j;
			for (i = 0; i < a.length; ++i) a[i] = a[i].trim();
			for (i = 0; i < b.length; ++i) b[i] = b[i].trim();
			
			/* remove empty strings from a, b */
			{
				while ((i = a.indexOf('')) != -1) a.splice(i, 1);
				while ((i = b.indexOf('')) != -1) b.splice(i, 1);
			}
			
			/* make sure the similarity matrix has at least as many columns as rows */
			if (a.length > b.length) {
				var tmp = a;
				a = b;
				b = tmp;
			}
			
			/* compute the similarities between the words and note them in a matrix */
			var similarityMatrix = [];
			
			// computes log(sqrt(|a|·|b|)) / (dist(a, b)+1))
			var lengthAdjustedLevenshtein = function(a, b) {
				return Math.log(a.length * b.length) / 2 -
					 Math.log(levenshtein(a, b) + 1.0);
			};
			for (i = 0; i < a.length; ++i) {
				similarityMatrix[i] = [];
				
				for (j = 0; j < b.length; ++j) {
					var fullDistance = lengthAdjustedLevenshtein(a[i], b[j]);
					
					// it is quite likely that users entering “pea...” expect
					// “peace” to appear before “speak”
					var minlen = Math.min(a[i].length, b[j].length);
					var prefixDistance = lengthAdjustedLevenshtein(a[i].substr(0, minlen), b[j].substr(0, minlen));
					similarityMatrix[i][j] = Math.min(fullDistance, prefixDistance);
				}
			}
			
			var totalSimilarity = 0.0;
			
			/* Test for availability of the munkres/hungarian algorithm to find the best similarity assignment */
			var munkres;
			if (typeof window != 'undefined' && window && window.Munkres && window.make_cost_matrix)
				munkres = window;
			
			if (typeof require != 'undefined' && require)
				try { munkres = require('munkres-js'); } catch (e) {}
			
			if (munkres) {
				var m = new munkres.Munkres();
				var indices = m.compute(munkres.make_cost_matrix(similarityMatrix));
				
				for (var k = 0; k < indices.length; ++k) {
					i = indices[k][0], j = indices[k][1];
					totalSimilarity += similarityMatrix[i][j];
				}
			} else {
				/* simply pick the available maximum of each row greedily */
				var takenColumns = [];
				for (i = 0; i < similarityMatrix.length; ++i) {
					var row = similarityMatrix[i];
					var maxColumn = -1;
					
					for (j = 0; j < row.length; ++j) {
						if (takenColumns.indexOf(j) != -1)
							continue;
						if (maxColumn == -1 || row[j] > row[maxColumn])
							maxColumn = j;
					}
					
					takenColumns.push(maxColumn);
					totalSimilarity += row[maxColumn];
				}
			}
			
			return totalSimilarity;
		};
	});

})();

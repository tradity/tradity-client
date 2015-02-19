'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(document).ready(function() {
	initNotifications();
});

var initNotifications = function() {
	var notificationContainer = $('<div id="notifications"></div>');
	$('body').append(notificationContainer);
};

var notification = function (text, icon) { // icon === true -> success
	var classes = '';
	
	if (!icon)
		icon = 'fa-exclamation-triangle';
	
	if (icon === true) {
		classes = 'success';
		icon = 'fa-check';
	}
	
	var notificationItem = $('<div class="notification-item ' + classes + '"><span class="fa ' + icon + '"></span> ' + text + '</div>');
	notificationItem.hide();
	$('#notifications').prepend(notificationItem);
	notificationItem.fadeIn(500);
	setTimeout(function() {
		notificationItem.hide();
	}, 3000);
};

var useSchoolAC = function($scope, socket) {
	$scope.onLSResult = $scope.onLSResult || [];
	$scope.schoolList = $scope.schoolList || [];
	
	socket.on('list-schools', function(result) {
		$scope.schoolList = result.result;
		$scope.schoolIndexByPath = {};
		for (var i = 0; i < $scope.schoolList.length; ++i)
			$scope.schoolIndexByPath[$scope.schoolList[i].path] = $scope.schoolList[i];
		
		for (var i = 0; i < $scope.schoolList.length; ++i) {
			$scope.schoolList[i].getExtra = function() { return this.usercount + ' Personen'; };
			
			$scope.schoolList[i].getInputTextValue = function() { return this.name; };
			$scope.schoolList[i].getEntryName = function() {
				var sep = ' » '; // note that the spaces here are U+2009 (thin space) for compactness
				var prefix = '';
				
				if (parentPath(this.path) != '/') {
					var parent = $scope.schoolIndexByPath[parentPath(this.path)];
					prefix = parent.getEntryName() + sep;
				}
				
				return prefix + this.name;
			};
		}
		
		for (var i = 0; i < $scope.onLSResult.length; ++i)
			$scope.onLSResult[i]();
	}, $scope);
	
	socket.emit('list-schools', {_cache: 20});
	
	$scope.acFetcher = {
		fetchAutoComplete: function(ac, s) {
			var enter = function() {
				ac.putData($scope.schoolList, s);
			};
			
			if ($scope.schoolList.length)
				enter();
			else
				$scope.onLSResult.push(enter);
		},
		submit: function(ac, data) {
			$scope.schoolname = document.getElementById('schoolname').value = data.name;
			$scope.school = data.id;
		},
		valuecreate: function(ac, data, element) {
			if ($scope.prevschool && $scope.prevschool == data.id)
				element.className += ' ac-prevschool';
		}
	};
	$scope.ac = new AC('schoolname', $scope.acFetcher, false, 1, 1, null, true);
};

var fileemit = function(socket, input, evtype, template, serverconfig, callback) {
	var filename = null; 
	var mime = null;
	
	var fail = function() { notification('Leider gab es ein technisches Problem beim Hochladen deiner Datei. :('); };
	
	try {
		var goPublish = function(data) {
			try {
				var encoded = data.buffer ? data.buffer : data;
				
				template.content = encoded;
				template.mime = template.mime || mime;
				template.name = template.name || filename;
				
				socket.emit(evtype, template, function(data) {
					callback(data.code);
				});
			} catch (e) {
				fail();
				throw e;
			}
		};
		
		if (input.name) { // File
			filename = input.name;
			if (/\.jpe?g$/i.test(filename)) mime = 'image/jpeg';
			if (/\.png$/i.test(filename))   mime = 'image/png';
			if (/\.gif$/i.test(filename))   mime = 'image/gif';
			
			if (!mime) {
				return alert('Dein Profilbild musst du als JPEG, PNG oder GIF hochladen');
			}
			
			var reader = new FileReader();
		
			reader.readAsArrayBuffer(input);
			
			reader.onload = function() { 
				var buf = reader.result;
				if (!buf)
					return alert('Konnte Profilbild nicht laden');
					
				if (serverconfig && reader.result.byteLength > serverconfig.fsdb.userquota)
					return alert('Die Profilbilddatei ist leider zu groß (höchstens 3 MB)');
				
				goPublish(buf);
			};
		} else {
			goPublish(input);
		}
	} catch (e) {
		fail();
		throw e;
	}
};

var rg1 = /&/g;
var rg2 = /</g;
var rg3 = />/g;
var rg4 = /'/g;
var rg5 = /"/g;
 
var escapeHTML = function(s) {
	if (!s)
		return s;

	return s.replace(rg1, '&amp;')
			.replace(rg2, '&lt;')
			.replace(rg3, '&gt;')
			.replace(rg4, '&#039;')
			.replace(rg5, '&quot;');
};

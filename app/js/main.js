'use strict';

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
		for (var i = 0; i < $scope.schoolList.length; ++i) {
			$scope.schoolList[i].getInputTextValue = 
			$scope.schoolList[i].getEntryName = function() { return this.name; };
			$scope.schoolList[i].getExtra = function() { return this.usercount + ' Personen'; };
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

var escapeHTML = function(s) {
	if (!s)
		return s;
	
	return s.replace(/&/g, '&amp;')
	        .replace(/</g, '&lt;')
	        .replace(/>/, '&gt;')
	        .replace(/'/, '&#039;')
	        .replace(/"/, '&quot;');
};

var rankify = function(res, key, filter) {
	filter = filter || function() { return true; };
	key = key || function(r) { return r.hastraded ? r.totalvalue - r.prov_sum : -Infinity; };
	
	res = res.filter(filter);
	res.sort(function(a, b) {
		return key(b) - key(a);
	});
	
	for (var i = 0; i < res.length; ++i)
		res[i].rank = i + 1;
	
	return res;
};

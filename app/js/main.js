'use strict';

$(document).ready(function() {
	initNotifications();
});

var initNotifications = function() {
	var notificationContainer = $('<div id="notifications"></div>');
	$('body').append(notificationContainer);
};

var notification = function (text,icon) { // icon == true -> success
	var classes;
	
	if (!icon)
		icon = 'fa-exclamation-triangle';
	
	if (icon == true) {
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
}

var tabbing = function(div, targeturl, def, $location, $scope) {
  div.tabs();
  $(div.children('ul').get(0)).find('a').each(function(i, e) {
    if ($(e).attr('href').split('/').pop().replace(/#/g, '') == def)
      div.tabs('option', {active: i});
  });
  div.tabs({activate: function(event, ui) {
    if (!ui.newTab)
      return;
    $scope.$apply(function() { $location.path(targeturl.replace(/\?/g, ui.newTab.children('a').attr('href').replace(/#/g, ''))); });
  }});
};

var useSchoolAC = function($scope, socket) {
  $scope.onLSResult = [];
  $scope.schoolList = [];
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
      var enter = function() { ac.putData($scope.schoolList, s); };
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
  var filename = input.name;
  var mime = null;
  if (/\.jpe?g$/.test(filename)) mime = 'image/jpeg';
  if (/\.png$/.test(filename))   mime = 'image/png';
  if (/\.gif$/.test(filename))   mime = 'image/gif';
  
  if (!mime) {
    return alert('Dein Profilbild musst du als JPEG, PNG oder GIF hochladen');
  }
  
  var reader = new FileReader();
  
  reader.onload = function() {
    var buf = reader.result;
    if (!buf)
      return alert('Konnte Profilbild nicht laden');
    if (serverconfig && reader.result.length > serverconfig.fsdb.userquota)
      return alert('Die Profilbilddatei ist leider zu groß (höchstens 3 MB)');
    
    var bytes = new Uint8Array(buf);
    
    var uint6ToB64 = function (nUint6) {
      return nUint6 < 26 ?
	  nUint6 + 65
	: nUint6 < 52 ?
	  nUint6 + 71
	: nUint6 < 62 ?
	  nUint6 - 4
	: nUint6 === 62 ?
	  43
	: nUint6 === 63 ?
	  47
	:
	  65;
    }

    var base64EncArr = function (aBytes) {
      var nMod3, sB64Enc = "";
      for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
	nMod3 = nIdx % 3;
	nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
	if (nMod3 === 2 || aBytes.length - nIdx === 1) {
	  sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
	  nUint24 = 0;
	}
      }
      return sB64Enc.replace(/A(?=A$|$)/g, "=");
    }
    
    var encoded = template.base64 ? base64EncArr(bytes) : bytes;
    
    template.content = encoded;
    template.mime = template.mime || mime;
    template.name = template.name || filename;
    
    socket.emit(evtype, template, function(data) {
      cb(data.code);
    });
  };
  
  reader.readAsArrayBuffer(input);
};

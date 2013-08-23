/**
 * ac.js - Simple autocompletion for JavaScript
 * Copyright (C) 2010,2011,2013 Hauke Henningsen <sqrt@entless.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 **/

/**
 * AC API:
 *
 * new AC(id, fetcher, lastonly, minlen, timer, throbber, automatch):
 *    constructor arguments:
 *       id: [string] html/xml id of the input field to enable
 *           autocompletion for
 *       fetcher: [object] backend for AC, see below
 *       lastonly: [boolean] use only the last word of the input's content? (optional)
 *       minlen: [integer] minimal length of the current word required to fetch
 *           the autocompletion data (optional)
 *       timer: [integer] milliseconds to wait for more input until
 *           autocompletion will be fetched; if non-null, AC will make the
 *           assumption that setTimeout() exists and works (optional)
 *       throbber: [string] path to an image that indicates loading of data (optional)
 *       automatch: [function/true/null] if non-null, uses a constant list of possible entries.
 *           If a function is given, it should take (data, str) as parameters and return a
 *           similarity value from 0.0 to 1.0. If true, a default comparison function will be used.
 *           In both cases, fetchAutoComplete() will still be called each time.
 *
 *    member functions:
 *       putData(data, value):
 * 	         value should be identical to the second argument
 *           of fetchAutoComplete, i. e. the search string
 *           data should be an array of object, with every object
 *           representing one entry.
 * 
 *           data should be an array of entries, of which each has the
 *           following format:
 *            * ['text']
 *            * ['text', 'extra information']
 *           or has the methods getEntryName(), getExtra() and getInputTextValue() implemented.
 *
 * fetcher object:
 *    member functions:
 *       submit(ac, data):
 *           called when the user chooses a value (by clicking on it)
 *           (optional)
 *       valuecreate(ac, data, element, focusnotify):
 *           called when a value entry is created, just before it is inserted
 *           into the DOM tree, so you can install extra stuff on your own.
 *           focusnotify is an object on which you can .push() handlers for focusevents,
 *           which have the form (ac, data, 'focus'/'unfocus').
 *       fetchAutoComplete(ac, value):
 *           called when AC decides to fetch autocompletion data;
 *           should probably always call ac.putData().
 **/

/**
 * Changelog:
 *
 * Version 1.1
 *  - Cleanup
 * Version 1.0
 *  - Initial version after some good bunch of untracked development
 */

if (typeof(AC_INCLUDED) == "undefined") { var AC_INCLUDED = 1; 
"use strict";

function AC(id, fetcher, lastonly, minlen, timer, throbber, automatch) {
	this.managedElements = {}; // Element ID -> ACInputElement
	if (typeof id == 'string')
		id = [id];

	for (var i = 0; i < id.length; ++i) 
		this.managedElements[id] = new ACInputElement(id, this, lastonly, minlen, timer, throbber, automatch);
	
	this.masterID = id[0];
	this.respCache = {}; // response cache
	this.dataFetcher = fetcher;
	this.lastWanted = null;

	if (!this.dataFetcher.submit) this.dataFetcher.submit = function() {}
	if (!this.dataFetcher.valuecreate) this.dataFetcher.valuecreate = function() {}
}

function ACInputElement(id, master, lastonly, minlen, timer, throbber, automatch) {
	this.e = document.getElementById(id);
	this.acPanel = null;
	this.master = master;
	this.throbber = null;
	
	if (!this.e)
		console.warn('AC: No such element: ', id);
	
	this.entries = [];
	
	this.lastOnly = lastonly || false;
	this.curFocusIndex = -1;
	this.minlen = minlen || 3;
	this.timer = parseInt(timer) || 500;
	this.blockBlur = false;
	this.automatch = automatch;
	
	if (this.automatch === true)
		this.automatch = master.defaultComparison;
	
	var _this = this;
	
	this.e.addEventListener('focus', function(e) { _this.handleKey(e); });
	this.e.addEventListener('keyup', function(e) { _this.handleKey(e); });
	this.e.addEventListener('blur', function (e) { if (!_this.blockBlur) _this.removeACData(); });
	this.e.setAttribute('autocomplete', 'off');
	
	this.inputWrap = document.createElement('div');
	this.e.parentNode.insertBefore(this.inputWrap, this.e);
	this.inputWrap.appendChild(this.e);
	this.inputWrap.style.position = 'relative';
	this.inputWrap.style.display = this.e.style.display ? this.e.style.display : 'inline';
	this.inputWrap.className = 'autocomplete-inputwrap';
	
	if (throbber) {
		this.throbber = document.createElement('img');
		this.throbber.style.display = 'none';
		this.throbber.setAttribute('class', 'autocomplete-throbber');
		this.throbber.setAttribute('src', throbber);
		this.inputWrap.appendChild(this.throbber);
	}
}

function ACEntry(master, data) {
	this.master = master;
	this.data = data;
	this.e = document.createElement('li');
	this.e.className = 'autocomplete-inactive';
	var _this = this;
	this.e.addEventListener('mouseover', function() { master.focus(_this); });
	this.e.addEventListener('mousedown', function() { master.blockBlur = true; });
	this.e.addEventListener('mouseout', function() { master.blockBlur = false; });
	this.e.addEventListener('mouseup', function() { master.blockBlur = false; master.focus(_this); master.master.dataFetcher.submit(master, _this.data); master.removeACData(); });
	
	var _name = this.data.getEntryName ? this.data.getEntryName() : this.data[0];
	var _number = this.data.getExtra ? this.data.getExtra() : (this.data.length > 1 ? this.data[1] : null);

	var name = document.createElement('span');
	name.appendChild(document.createTextNode(_name));
	name.className = 'autocomplete-left';
	this.e.appendChild(name);

	if (_number !== null) {
		var number = document.createElement('span');
		number.appendChild(document.createTextNode(_number));
		number.className = 'autocomplete-right';
		this.e.appendChild(number);
	}
	
	this.focushandlers = [];
	master.master.dataFetcher.valuecreate(master, this.data, this.e, this.focushandlers);
}

ACEntry.prototype.unfocus = function() {
	this.e.className = this.e.className.replace(/(?:^|\s)autocomplete-(in)?active(?!\S)/g, '') + ' autocomplete-inactive';
	for (var i = 0; i < this.focushandlers.length; ++i) 
		this.focushandlers[i](this.master, this.data, 'unfocus', this.e);
}

ACEntry.prototype.focus = function() {
	this.e.className = this.e.className.replace(/(?:^|\s)autocomplete-(in)?active(?!\S)/g, '') + ' autocomplete-active';
	for (var i = 0; i < this.focushandlers.length; ++i) 
		this.focushandlers[i](this.master, this.data, 'focus', this.e);
}

ACEntry.prototype.getInputTextValue = function() {
	return this.data.getInputTextValue ? this.data.getInputTextValue() : this.data[0];
}

ACInputElement.prototype.focusnth = function(n) {
	this.focus(this.entries[n]);
}

ACInputElement.prototype.focus = function(entry) {
	var oldFocusIndex = this.curFocusIndex;
	var old = this.entries[oldFocusIndex];
	for (var i = 0; i < this.entries.length; ++i)
		if (entry && entry == this.entries[i])
			this.curFocusIndex = i;
	
	if (this.curFocusIndex == oldFocusIndex)
		return;
	
	if (old)
		old.unfocus();
	entry.focus();

	var newString = entry.getInputTextValue();

	if (this.lastOnly) {
		var s = this.e.value;
		s = s.split(' ');
		s.pop()
		s.push(newString);
		this.e.value = s.join(' ');
	} else {
		this.e.value = newString;
	}
}

ACInputElement.prototype.removeACData = function() {
	if (this.acPanel) {
		this.acPanel.parentNode.removeChild(this.acPanel);
		this.acPanel = null;
	}
}

AC.prototype.displayACData = function(req, cacheid, cached, inputElement) {
	var s = null;
	if (!cached) {
		s = req;
		this.master.respCache[cacheid] = s;
	} else {
		s = req; // the data have been cache-fetched
	}

	if (cacheid != this.lastWanted)
		return;

	if (!inputElement)
		inputElement = this.managedElements[0];

	inputElement.displayACData(s);
}

ACInputElement.prototype.getInputHeight = function() { 
	var inputRect = this.e.getBoundingClientRect();
	return parseInt(inputRect.height ? inputRect.height : this.e.clientHeight);
}

ACInputElement.prototype.getInputWidth = function() { 
	var inputRect = this.e.getBoundingClientRect();
	return parseInt(inputRect.width ? inputRect.width : this.e.clientWidth);
}

ACInputElement.prototype.displayACData = function(s) {
	var _this = this;
		
	var d = document.createElement('ul');
	d.className = 'autocomplete';
	
	d.style.position = 'absolute';
	
	d.style.left = '0px';
	d.style.top = this.getInputHeight() + 3 + 'px';
	d.style.width = this.getInputWidth() + 'px';
	
	this.entries = [];
	this.curFocusIndex = -1;
	
	for (var e in s) {
		var entry = new ACEntry(this, s[e]);
		d.appendChild(entry.e);
		this.entries.push(entry);
	}
	
	this.removeACData();
	this.acPanel = d;
	
	if (this.throbber)
		this.throbber.style.display = 'none';
		
	this.inputWrap.appendChild(d);
}

ACInputElement.prototype.handleKeyMove = function(up) {
	var newIndex = this.curFocusIndex;
	
	if (up) {
		if (--newIndex < 0)
			newIndex = this.entries.length - 1;
	} else {
		if (++newIndex >= this.entries.length)
			newIndex = 0;
	}
	
	this.focusnth(newIndex);
}

ACInputElement.prototype.handleKey = function(ev) {
	if (!ev)
		ev = window.event;
	var w = ev.which ? ev.which : ev.keyCode;
	
	if (w == 38 || w == 40) 
		return this.handleKeyMove (w == 38);

	var s = this.e.value;

	if (this.lastOnly) {
		s = s.split(' ');
		s = s[s.length-1];
	}

	this.lastWanted = s;

	if (this.master.respCache[s]) {
		this.master.displayACData(this.respCache[s], s, true, this);
		return;
	}

	var _this = this;

	var fnc = function() {
		if (_this.lastWanted == s) {
			if (_this.throbber) {
				var h = _this.getInputHeight();
				_this.throbber.style.top = h * 0.1 + 'px';
				_this.throbber.style.width =
				_this.throbber.style.height = (h * 0.6) + 'px';
				_this.throbber.style.display = 'block';
			}
			
			_this.master.dataFetcher.fetchAutoComplete(_this, s);
		}
	};

	if (s.length < this.minlen)
		return;
	
	if (!this.timer)
		fnc();
	else
		setTimeout(fnc, this.timer);
}

ACInputElement.prototype.putData = function(data, s) {
	if (this.automatch) {
		var newData = [];
		for (var i = 0; i < data.length; ++i)
			newData.push([data[i], this.automatch(data[i], s)]);
		newData.sort(function(a,b) { return b[1] - a[1]; });
		for (var i = 0; i < newData.length; ++i)
			newData[i] = newData[i][0];
		data = newData;
	}
	
	this.displayACData(data, s, false, null);
}

AC.prototype.keyStroke = function() {
	for (var i = 0; i < this.managedElements.length; ++i)
		this.managedElements[i].handleKey({which: 20});
}

AC.prototype.defaultComparison = function(data, str) {
	var levenshtein = function(a,b) {
		if (a == b) return 0;
		if (!a) return b.length;
		if (!b) return a.length;
		
		var matrix = [];
		for (var i = 0; i <= b.length; ++i)
			matrix[i] = [i];
		for (var j = 0; j <= a.length; ++j)
			matrix[0][j] = j;
		for (var i = 1; i <= b.length; ++i) {
			for (var j = 1; j <= a.length; ++j) {
				if (b.charAt(i-1) == a.charAt(j-1)) {
					matrix[i][j] = matrix[i-1][j-1];
					continue;
				}
				
				matrix[i][j] = Math.min(matrix[i-1][j-1], matrix[i][j-1], matrix[i-1][j]) + 1;
			}
		}
		
		return matrix[b.length][a.length];
	}	
	
	var a = (data.getEntryName ? data.getEntryName() : data[0]).toUpperCase();
	var b = str.toUpperCase();
	var dist = levenshtein(a, b) / a.length;
	return 1.0/(dist + 1.0);
}

}

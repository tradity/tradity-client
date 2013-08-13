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
 * new AC(id, fetcher, lastonly, minlen, timer):
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
 *       submit(ac):
 *           called when the user chose a value (by clicking on it)
 *           (optional)
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

function AC(id, fetcher, lastonly, minlen, timer) {
	this.managedElements = {}; // Element ID -> ACInputElement
	if (typeof id == 'string')
		id = [id];

	for (var i = 0; i < id.length; ++i) 
		this.managedElements[id] = new ACInputElement(id, this, lastonly, minlen, timer);
	
	this.masterID = id[0];
	this.respCache = {}; // response cache
	this.dataFetcher = fetcher;
	this.lastWanted = null;

	if (!this.dataFetcher.submit) this.dataFetcher.submit = function() {}
}

function ACInputElement(id, master, lastonly, minlen, timer) {
	this.e = document.getElementById(id);
	this.acPanel = null;
	this.inputWrap = null;
	this.master = master;
	
	if (!this.e)
		console.warn('AC: No such element: ', id);
	
	this.entries = [];
	
	this.lastOnly = lastonly || false;
	this.curFocusIndex = -1;
	this.minlen = minlen || 3;
	this.timer = parseInt(timer) || 500;
	
	var _this = this;
	
	this.e.addEventListener('keyup', function(e) { _this.handleKey(e); });
	this.e.addEventListener('blur', function (e) { _this.removeACData(); });
	this.e.setAttribute('autocomplete', 'off');
}

function ACEntry(master, data) {
	this.master = master;
	this.data = data;
	this.e = document.createElement('li');
	this.e.setAttribute('class', 'autocomplete-inactive');
	var _this = this;
	this.e.addEventListener('mouseover', function() { master.focus(_this); });
	this.e.addEventListener('mouseup', function() { master.focus(_this); master.master.dataFetcher.submit(master); });

	var _name = this.data.getEntryName ? this.data.getEntryName() : this.data[0];
	var _number = this.data.getExtra ? this.data.getExtra() : (this.data.length > 1 ? this.data[1] : null);

	var name = document.createElement('span');
	name.appendChild(document.createTextNode(_name));
	name.setAttribute('class', 'autocomplete-left');
	this.e.appendChild(name);

	if (_number !== null) {
		var number = document.createElement('span');
		number.appendChild(document.createTextNode(_number));
		number.setAttribute('class', 'autocomplete-right');
		this.e.appendChild(number);
	}
}

ACEntry.prototype.unfocus = function() {
	this.e.setAttribute('class', 'autocomplete-inactive');
}

ACEntry.prototype.getInputTextValue = function() {
	return this.data.getInputTextValue ? this.data.getInputTextValue() : this.data[0];
}

ACInputElement.prototype.focusnth = function(n) {
	this.focus(this.entries[n]);
}

ACInputElement.prototype.focus = function(entry) {
	var old = this.entries[this.curFocusIndex];
	if (old)
		old.unfocus();
	for (var i = 0; i < this.entries.length; ++i)
		if (entry == this.entries[i])
			this.curFocusIndex = i;
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

ACEntry.prototype.focus = function() {
	this.e.setAttribute('class', 'autocomplete-active');
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

ACInputElement.prototype.displayACData = function(s) {
	var _this = this;
	
	if (!this.inputWrap) {
		this.inputWrap = document.createElement('div');
		this.e.parentNode.insertBefore(this.inputWrap, this.e);
		this.inputWrap.appendChild(this.e);
		this.inputWrap.style.position = 'relative';
		this.inputWrap.style.display = this.e.style.display ? this.e.style.display : 'inline';
		this.inputWrap.setAttribute('class', 'autocomplete-inputwrap');
	}
	
	var d = document.createElement('ul');
	d.setAttribute('class', 'autocomplete');
	
	var inputRect = this.e.getBoundingClientRect();
	d.style.position = 'absolute';
	d.style.top = parseInt(inputRect.height ? inputRect.height : this.e.clientHeight) + 3 + 'px';
	d.style.left = '0px';
	d.style.width = parseInt(inputRect.width ? inputRect.width : this.e.clientWidth) + 'px';

	for (var e in s) {
		var entry = new ACEntry(this, s[e]);
		d.appendChild(entry.e);
		this.entries.push(entry);
	}
	
	this.removeACData();
	this.acPanel = d;
	
	this.inputWrap.appendChild(d);
}

ACInputElement.prototype.handleKeyMove = function(up) {
	var newIndex = this.curFocusIndex;
	
	if (up) {
		if (--newIndex < 0)
			newIndex = this.entries.length - 1;
	} else {
		if (++newIndex > this.entries.length)
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
		if (_this.lastWanted == s)
			_this.master.dataFetcher.fetchAutoComplete(_this, s);
	};

	if (s.length < this.minlen)
		return;
	
	if (!this.timer)
		fnc();
	else
		setTimeout(fnc, this.timer);
}

ACInputElement.prototype.putData = function(data, s) {
	this.displayACData(data, s, false, null);
}

}

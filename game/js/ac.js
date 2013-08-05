/**
 * ac.js - Simple autocompletion for JavaScript
 * Copyright (C) 2010,2011 Hauke Henningsen <sqrt@entless.org>
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/

/**
 * AC API:
 *
 * new AC(id, fetcher, lastonly, minlen, timer):
 *    constructor arguments:
 *       id: [string] sgml/xml id of the input field to enable
 *           autocompletion for; .onkeyup and .onblur will be set.
 *       fetcher: [object] backend for AC, see below
 *       lastonly: [boolean] use only the last word of the input's content?
 *       minlen: [integer] minimal length of the current word required to fetch
 *           the autocompletion data
 *       timer: [integer] milliseconds to wait for more input until
 *           autocompletion will be fetched; if non-null, AC will make the
 *           assumption that setTimeout() exists and words
 *
 *    member functions:
 *       putData(data, value):
 * 	         value should be identical to the second argument
 *           of fetchAutoComplete, i. e. the search string
 *           data should be an array of object, with every object
 *           representing one entry.
 *
 *           Default actions if entryValue, entryName, entryExtra are not set:
 *           Each entry is an sub-array of the second parameter.
 *           These sub-arrays have one or two entries, of which
 *           the first is the possible result and the optional
 *           second one describes some associated text, e. g.
 *           the number of entries found for the given search string.
 *
 * fetcher object:
 *    member functions:
 *       submit(ac):
 *           called when the user chose a value (by clicking on it)
 *           (facultative)
 *       fetchAutoComplete(ac, value):
 *           called when AC decides to fetch autocompletion data;
 *           should proably always call ac.putData()
 *       entryValue(ac, entry):
 *       entryName(ac, entry):
 *       entryExtra(ac, entry):
 *           yield the value, name and extra information associated to an
 *           single entry returned from putData()
 *           (facultative, all three)
 **/

/**
 * Changelog:
 *
 * Version 1.0
 *  - Initial version after some good bunch of untracked development
 */

if (typeof(AC_INCLUDED) == "undefined") { var AC_INCLUDED = 1;

function AC(id, fetcher, lastonly, minlen, timer) {
	if (typeof id == 'string')
		id = [id];
	this.id = id[0];
	this.e = {}

	for (var _id in id) {
		this.e[id[_id]] = document.getElementById(id[_id]);
	}

	this.respCache = {}
	this.curFocus = -1;
	this.maxFocus = 0;
	this.dataFetcher = fetcher;
	this.lastOnly = lastonly;
	this.minlen = minlen;
	this.timer = timer;
	this.lastWanted = null;
	var _this = this;

	if (!('submit' in this.dataFetcher)) this.dataFetcher.submit = function() {}
	if (!('entryValue' in this.dataFetcher)) this.dataFetcher.entryValue = function(ac, e) { return e[0]; }
	if (!('entryName' in this.dataFetcher)) this.dataFetcher.entryName = function(ac, e) { return e[0]; }
	if (!('entryExtra' in this.dataFetcher)) this.dataFetcher.entryExtra = function(ac, e) { return e.length > 1 ? e[1] : null; }

	for (var key in this.e) {
		this.e[key].onkeyup = function(k) { return function (e) { _this.ac(e, k); } } (key);
		this.e[key].onblur = function (e) { _this.removeAc(); }
		this.e[key].setAttribute('autocomplete', 'off');
	}
}

AC.prototype.unfocusAc = function() {
	var e = document.getElementById('autocomplete_' + this.id + '_' + this.curFocus);
	if (!e) return;
	e.setAttribute('class', 'autocomplete-inactive');
}

AC.prototype.focusAc = function(n) {
	var e = document.getElementById('autocomplete_' + this.id + '_' + n);
	if (!e) return;
	e.setAttribute('class', 'autocomplete-active');

	for (var _id in this.e) {
		var new_s = document.getElementById('autocomplete_' + this.id + '_' + n + '_' + _id + '_value').firstChild.data;

		if (this.lastOnly) {
			var s = this.e[_id].value;
			s = s.split(' ');
			s.pop()
			s.push(new_s);
			this.e[_id].value = s.join(' ');
		} else {
			this.e[_id].value = new_s;
		}
	}
}

AC.prototype.getAc = function() { return document.getElementById('autocomplete_' + this.id); }
AC.prototype.removeAc = function() { var e = this.getAc(); if(e) e.parentNode.removeChild(e); }

AC.prototype.displayAc = function(req, cacheid, cached, id) {
	var s = null;
	if (!cached) {
		s = req;
		this.respCache[cacheid] = s;
	} else {
		s = req; // we have been cache-fetched
	}

	if (cacheid != this.lastWanted) return;

	if (id == null)
		id = this.id;

	this.curFocus = -1;
	this.maxFocus = s.length - 1;
	var _this = this;
	var input = this.e[id];
	var inputRect = input.getBoundingClientRect();
	var d = document.createElement('div');
	d.id = 'autocomplete_' + this.id;
	d.style.position = 'absolute';
	d.style.top = parseInt(inputRect.top) + parseInt(inputRect.height ? inputRect.height : input.clientHeight) + 3 + 'px';
	d.style.left = parseInt(inputRect.left) + 'px';
	d.style.width = parseInt(inputRect.width ? inputRect.width : input.clientWidth) + 'px';
	d.setAttribute('class', 'autocomplete');

	for (var e in s) {
		var subd = document.createElement('div');
		subd.idnumber = e;
		subd.setAttribute('id', 'autocomplete_' + this.id + '_' + e);
		subd.style.padding = '1%%';
		subd.setAttribute('class', 'autocomplete-inactive');
		subd.onmouseover = function() { _this.unfocusAc(); _this.curFocus = this.idnumber; _this.focusAc(this.idnumber); }
		subd.onmousedown = function() { _this.focusAc(this.idnumber); _this.dataFetcher.submit(_this); }

		var _value = this.dataFetcher.entryValue(this, s[e]);
		var _name = this.dataFetcher.entryName(this, s[e]);
		var _number = this.dataFetcher.entryExtra(this, s[e]);

		if (typeof(_value) == 'string') {
			_value = {};
			_value[this.id] = _value;
		}

		for (var key in _value) {
			var value = document.createElement('span');
			value.id = 'autocomplete_' + this.id + '_' + e + '_' + key + '_value';
			value.appendChild(document.createTextNode(_value[key]));
			value.style.display = 'none';
			subd.appendChild(value);
		}

		var name = document.createElement('span');
		name.id = 'autocomplete_' + this.id + '_' + e + '_name';
		name.appendChild(document.createTextNode(_name));
		name.setAttribute('class', 'autocomplete-left');
		subd.appendChild(name);

		if (_number !== null) {
			var number = document.createElement('span');
			number.appendChild(document.createTextNode(_number));
			number.setAttribute('class', 'autocomplete-right');
			subd.appendChild(number);
		}

		d.appendChild(subd);
	}
	this.removeAc();
	document.body.appendChild(d);
}

AC.prototype.handleAc = function(up) {
	this.unfocusAc();
	if (this.curFocus == -1) {
		if (up)
			this.curFocus = this.maxFocus;
		else
			this.curFocus = 0;
	} else {
		if (up) {
			if (--this.curFocus == -1)
				this.curFocus = this.maxFocus;
		} else {
			if (++this.curFocus > this.maxFocus)
				this.curFocus = 0;
		}
	}
	this.focusAc(this.curFocus);
}

AC.prototype.ac = function(ev, id) {
	if (!ev) ev = window.event;
	var w = ev.which ? ev.which : ev.keyCode;
	if (w == 38 || w == 40) {
		this.handleAc(w == 38);
		return;
	}

	var s = this.e[id].value;

	if (this.lastOnly) {
		s = s.split(' ');
		s = s[s.length-1];
	}

	this.lastWanted = s;

	if (this.respCache[s]) {
		this.displayAc(this.respCache[s], s, true, id);
		return;
	}

	var _this = this;

	var fnc = function() {
		if (_this.lastWanted == s)
			_this.dataFetcher.fetchAutoComplete(_this, s);
	}

	if (s.length < this.minlen) return;
//	alert(s);
//	alert(this.timer);
	if (!this.timer)
		fnc();
	else
		setTimeout(fnc, this.timer);
}

AC.prototype.putData = function(data, s) {
	this.displayAc(data, s, false, null);
}

}

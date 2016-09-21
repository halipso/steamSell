var Request = require('request');
var SteamID = require('steamid');

module.exports = SteamSell;

function SteamSell() {
	this._jar = Request.jar();
	this.request = Request.defaults({"jar": this._jar, "timeout": 50000, "gzip": true});

	// UTC, English
	this.setCookie("timezoneOffset=0,0");
	this.setCookie("Steam_Language=english");
}

SteamSell.prototype.setCookie = function(cookie) {
	var cookieName = cookie.match(/(.+)=/)[1];
	if(cookieName == 'steamLogin') {
		this.steamID = new SteamID(cookie.match(/=(\d+)/)[1]);
	}

	var isSecure = !!cookieName.match(/(^steamMachineAuth|^steamLoginSecure$)/);
	this._jar.setCookie(Request.cookie(cookie), (isSecure ? "https://" : "http://") + "store.steampowered.com");
};

SteamSell.prototype.setCookies = function(cookies) {
	var self = this;
	cookies.forEach(function(cookie) {
		var cookieName = cookie.match(/(.+)=/)[1];
		self._jar.setCookie(Request.cookie(cookie), (cookieName.match(/^steamMachineAuth/) || cookieName.match(/Secure$/) ? "https://" : "http://") + "steamcommunity.com");
	});
};

SteamSell.prototype.getSessionID = function() {
	var cookies = this._jar.getCookieString("http://steamcommunity.com").split(';');
	for(var i = 0; i < cookies.length; i++) {
		var match = cookies[i].trim().match(/([^=]+)=(.+)/);
		if(match[1] == 'sessionid') {
			return decodeURIComponent(match[2]);
		}
	}
	
	var sessionID = generateSessionID();
	this._jar.setCookie(Request.cookie('sessionid=' + sessionID), "http://steamcommunity.com");
	return sessionID;
};

function generateSessionID() {
	return require('crypto').randomBytes(12).toString('hex');
}

SteamSell.prototype._checkHttpError = function(err, response, callback) {
	if(err) {
		callback(err);
		return true;
	}

	if(response.statusCode >= 300 && response.statusCode <= 399 && response.headers.location.indexOf('/login') != -1) {
		callback(new Error("Not Logged In"));
		return true;
	}

	if(response.statusCode >= 400) {
		var error = new Error("HTTP error " + response.statusCode);
		error.code = response.statusCode;
		callback(error);
		return true;
	}

	return false;
};

require('./components/market.js');

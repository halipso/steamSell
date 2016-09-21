var SteamSell = require('../index.js');
var Cheerio = require('cheerio');

SteamSell.prototype.sellItem = function(item, price, steamid, callback) {
	var self = this;
	self.request.post({
		headers: {'Referer' : 'http://steamcommunity.com/profiles/'+steamid+'/inventory'},
		uri: "https://steamcommunity.com/market/sellitem/",
		form: {
			sessionid: self.getSessionID(),
			appid : item.appid,
			contextid : item.contextid,
			assetid : item.id,
			amount : 1,
			price : price
		}
	}, function(err, response, body) {
		try {
			body = JSON.parse(body);
			if(!body.success)
				callback(body.message);
			else
				callback(err, response, body);
		} catch (error) {
			callback(error);
		}		
	});
};

SteamSell.prototype.cancelListing = function(listing, callback) {
	var self = this;
	self.request.post({
		headers: {'Referer' : 'http://steamcommunity.com/market/'},
		uri: "http://steamcommunity.com/market/removelisting/"+listing,
		form: {
			sessionid: self.getSessionID()
		}
	}, function(err, response, body) {
		if(self._checkHttpError(err, response, callback))
			return;
		callback();
	});
};

SteamSell.prototype.getListings = function(callback) {
	var self = this;
	this.request.get("http://steamcommunity.com/market/", function(err, response, body) {
		if(self._checkHttpError(err, response, callback)) {
			return;
		}

		var $ = Cheerio.load(body);
		var $listings = $('.my_listing_section > .market_recent_listing_row');

		var userListings = [];

		var gtbc = function(parent, _class) {
			return parent.find(_class).text();
		}

		$listings.each(function(key, item) {
			item = $(item);
			var listingId = item.find('.item_market_action_button_edit').attr('href').split(',')[1].trim().slice(1, -1);
			var appId = item.find('.item_market_action_button_edit').attr('href').split(',')[2].trim();
			var listing = {'game_name' : gtbc(item ,'.market_listing_game_name'), 'listed_date' : gtbc(item ,'.market_listing_listed_date_combined').trim(), 'item_name' : gtbc(item ,'.market_listing_item_name_link'), 'appid' : appId, 'listingid' : listingId };
			userListings.push(listing);
		});

		callback(null, userListings);
		
	});
};

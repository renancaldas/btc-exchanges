'use strict';

/* Dependencies
---------------------------------*/
const debug = require('debug')('btc-exchanges:lib:routes.js');
const config = require('config').get("config");
const express = require('express');
const app = express();
const Q = require("q");
const request = require('request');

const Responses = require('./Responses.js');
const validExchanges = ['btc-e', 'mercadobitcoin', 'foxbit'];

// Parse body in json format
var router = express.Router();

function getLastPrice(url) {
	var deferred = Q.defer();

	request({
		url: url, 
		method: 'GET'
	}, function(err, res, body) {
		if(err)
			deferred.reject(err);
		else if(res.statusCode != 200) 
			deferred.reject(new Error('Status code: ' + res.statusCode));
		else 
			deferred.resolve(body);
	});

	return deferred.promise;
}

router.route('/last/:exchange')
  .get(function(req, res, next) {  

  	switch(req.params.exchange) {
  		case 'btc-e': 
  			getLastPrice('https://btc-e.com/api/3/ticker/btc_usd').then(function(result){
  				Responses(res).success(JSON.parse(result).btc_usd.last);
  			}, function(err){
  				Responses(res).serverError(err);
  			});
  			break;

  		default: Responses(res).clientError('Exchange not found. Valid exchanges: ' + validExchanges.join(', '));
  			break;
  	}
	
  });

module.exports = router;
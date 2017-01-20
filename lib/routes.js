'use strict';

/* Dependencies
---------------------------------*/
const debug = require('debug')('btc-exchanges:lib:routes.js');
const config = require('config').get("config");
const express = require('express');
const app = express();
const Q = require("q");
const request = require('request');

const Responses = require('./responses.js');
const validExchanges = ['btc-e', 'mercadobitcoin', 'foxbit', 'satoshitango'];

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
  				Responses(res).success(parseFloat(JSON.parse(result).btc_usd.last));
  			}, function(err){
  				Responses(res).serverError(err);
  			});
  			break;

  		case 'mercadobitcoin':
  			getLastPrice('https://www.mercadobitcoin.net/api/ticker').then(function(result){
  				Responses(res).success(parseFloat(JSON.parse(result).ticker.last));
  			}, function(err){
  				Responses(res).serverError(err);
  			});
  			break;

  		case 'foxbit':
  			getLastPrice('https://api.blinktrade.com/api/v1/BRL/ticker').then(function(result){
  				Responses(res).success(parseFloat(JSON.parse(result).last));
  			}, function(err){
  				Responses(res).serverError(err);
  			});
  			break;

      case 'satoshitango':
        // https://www.satoshitango.com/api/ticker?currency=ARS
        getLastPrice('https://api.satoshitango.com/v2/ticker').then(function(result){
          Responses(res).success(parseFloat(JSON.parse(result).data.venta.arsbtc));
        }, function(err){
          Responses(res).serverError(err);
        });
        break;

      case 'ripio':
        getLastPrice('https://www.ripio.com/api/v1/rates/').then(function(result){
          Responses(res).success(parseFloat(JSON.parse(result).rates.ARS_SELL));
        }, function(err){
          Responses(res).serverError(err);
        });
        break; 
  		

  		default: Responses(res).clientError('Exchange not found. Valid exchanges: ' + validExchanges.join(', '));
  			break;
  	}
	
  });

module.exports = router;
'use strict';

/* Dependencies
---------------------------------*/
const express = require('express');
const app = express();
const config = require('config').get('config');
const bodyParser  = require( 'body-parser' );
const debug = require('debug')('btc-exchanges:lib:http.js');

// Parse body in json format
app.use( bodyParser.json() );

// Routers
app.use(require('./routes.js'));
app.use(function(err, req, res, next) { console.error(err.stack); });

// Starting the server
var server = app.listen(config.serverPort, function () {
  debug('App listening on port %s', config.serverPort);
  debug('Press Ctrl+C to quit.');
});

module.exports = server;
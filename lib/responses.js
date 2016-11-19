'use strict';

/* Dependencies
---------------------------------*/
const debug = require("debug")("btc-exchanges:lib:responses.js");

module.exports = function(res) {
	return {
		success: function(data) {
			res.status(200).json(data);
		},
		clientError: function(errorMessage) {
			var message = (errorMessage ? errorMessage : 'Client error. Please contact the server admin.');
			res.status(400).json(message);
		},
		requiredField: function(field) {
			res.status(400).json('Required body field: ' + field);
		},
		serverError: function(error) {
			var errorMessage = 'Server error. Please contact the server admin.';
				
			if(error.message)
				errorMessage = error.message;
			else if(error && error !== '')
				errorMessage = error;

			res.status(500).json(errorMessage);
		}
	};
}



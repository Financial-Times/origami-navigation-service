'use strict';

const itRespondsWithStatus = require('./helpers/it-responds-with-status');
const setupRequest = require('./helpers/setup-request');

describe('POST /__origami/service/navigation/purge/', function () {

	describe('if no api key is provided', function() {
		setupRequest('POST', '/__origami/service/navigation/purge/');
		itRespondsWithStatus(401);
	});

	describe('if an incorrect api key is provided', function() {
		setupRequest('POST', '/__origami/service/navigation/purge?apiKey=incorrect');
		itRespondsWithStatus(403);
	});

});

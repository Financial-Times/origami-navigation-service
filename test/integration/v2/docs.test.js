'use strict';

const assert = require('proclaim');
const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

describe('GET /v2/', function () {

	setupRequest('GET', '/v2/');
	itRespondsWithStatus(200);
	itRespondsWithContentType('text/html');

	it('has a <base> element with the expected path', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
		}).end(done);
	});

});

describe('GET /__origami/service/navigation/v2/', function () {

	setupRequest('GET', '/__origami/service/navigation/v2/');
	itRespondsWithStatus(200);
	itRespondsWithContentType('text/html');

	it('has a <base> element with the expected path', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
		}).end(done);
	});

});

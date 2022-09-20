'use strict';

const assert = require('proclaim');
const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

describe('GET /__origami/service/navigation/v2/links', function () {
	setupRequest('GET', '/__origami/service/navigation/v2/links?source=test');
	itRespondsWithStatus(200);
	itRespondsWithContentType('application/json');

	it('responds with the links JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			assert.deepEqual(json, require('../../../build/v2/links.json'));
		}).end(done);
	});

});

describe('GET /__origami/service/navigation/v2/links.json', function () {
	setupRequest('GET', '/__origami/service/navigation/v2/links.json');
	itRespondsWithStatus(200);
	itRespondsWithContentType('application/json');

	it('responds with the links JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			assert.deepEqual(json, require('../../../build/v2/links.json'));
		}).end(done);
	});

});

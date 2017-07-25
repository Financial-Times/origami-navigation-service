'use strict';

const assert = require('proclaim');
const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

describe('GET /v2/links', function() {

	setupRequest('GET', '/v2/links?source=test');
	itRespondsWithStatus(200);
	itRespondsWithContentType('application/json');

	it('responds with the links JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			// Note: mock data can be found in ../mock/store.js
			assert.deepEqual(json, [
				{
					label: 'Link 1'
				},
				{
					label: 'Link 2'
				}
			]);
		}).end(done);
	});

});

'use strict';

const assert = require('proclaim');
const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');
const navigation = require('../../../build/v2/navigation.json');

describe('GET /__origami/service/navigation/v2/navigation.json', function () {
	setupRequest('GET', '/__origami/service/navigation/v2/navigation.json');
	itRespondsWithStatus(200);
	itRespondsWithContentType('application/json');

	it('responds with the navigation JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			assert.deepEqual(json, navigation);
		}).end(done);
	});

});

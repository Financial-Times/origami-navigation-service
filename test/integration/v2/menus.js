'use strict';

const assert = require('proclaim');
const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

describe('GET /v2/menus', function() {

	setupRequest('GET', '/v2/menus');
	itRespondsWithStatus(200);
	itRespondsWithContentType('application/json');

	it('responds with the menu JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			// Note: mock data can be found in ../mock/store.js
			assert.deepEqual(json, {
				menu1: {
					label: 'Menu 1'
				},
				menu2: {
					label: 'Menu 2'
				}
			});
		}).end(done);
	});

});

describe('GET /v2/menus/:validName', function() {

	setupRequest('GET', '/v2/menus/menu1');
	itRespondsWithStatus(200);
	itRespondsWithContentType('application/json');

	it('responds with the menu JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			// Note: mock data can be found in ../mock/store.js
			assert.deepEqual(json, {
				label: 'Menu 1'
			});
		}).end(done);
	});

});

describe('GET /v2/menus/:invalidName', function() {

	setupRequest('GET', '/v2/menus/notamenu');
	itRespondsWithStatus(404);
	itRespondsWithContentType('application/json');

	it('responds with error JSON', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			const json = JSON.parse(response.text);
			// Note: mock data can be found in ../mock/store.js
			assert.deepEqual(json, {
				error: 'Menu "notamenu" was not found'
			});
		}).end(done);
	});

});

'use strict';

const assert = require('proclaim');
const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

describe('GET /v2/menus', function () {

	setupRequest('GET', '/v2/menus?source=test');
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

	setupRequest('GET', '/v2/menus/menu1?source=test');
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

	setupRequest('GET', '/v2/menus/notamenu?source=test');
	itRespondsWithStatus(404);
	itRespondsWithContentType('text/html');

	it('responds with an error message', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			// Note: mock data can be found in ../mock/store.js
			assert.include(response.text, 'Menu &quot;notamenu&quot; was not found');
		}).end(done);
	});

});

describe('GET /v2/menus/:nosourceparam', function() {

	setupRequest('GET', '/v2/menus/menu1');
	itRespondsWithStatus(400);
	itRespondsWithContentType('text/html');

	it('responds with an error message', function(done) {
		this.request.expect(response => {
			assert.isString(response.text);
			// Note: mock data can be found in ../mock/store.js
			assert.include(response.text, 'The source parameter is required and must be a valid system code');
		}).end(done);
	});

});

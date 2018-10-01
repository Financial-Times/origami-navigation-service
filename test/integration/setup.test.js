'use strict';

const createMockStore = require('./mock/store');
const navigationService = require('../..');
const supertest = require('supertest');

const noop = () => {};
const mockLog = {
	info: noop,
	error: noop,
	warn: noop
};

before(function() {
	return Promise.resolve()
		.then(() => {
			return createMockStore();
		})
		.then(mockStore => {
			this.mockStore = mockStore;
		})
		.then(() => {
			return navigationService({
				environment: 'test',
				log: mockLog,
				navigationDataStore: this.mockStore.address,
				port: 0,
				requestLogFormat: null
			}).listen();
		})
		.then(app => {
			this.agent = supertest.agent(app);
			this.app = app;
		});
});

after(function() {
	this.app.ft.server.close();
	this.mockStore.server.close();
});

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
				logLevel: process.env.LOG_LEVEL || 'trace',
				port: process.env.PORT || null,
				suppressLogs: true,
				navigationDataStore: this.mockStore.address
			});
		})
		.then(service => {
			this.agent = supertest.agent(service);
			this.service = service;
		});
});

after(function() {
	this.service.server.close();
	this.mockStore.server.close();
});

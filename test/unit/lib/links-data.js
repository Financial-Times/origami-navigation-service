'use strict';

const assert = require('proclaim');
const mockery = require('mockery');

describe('lib/links-data', () => {
	let linksData;
	let Poller;

	beforeEach(() => {
		Poller = require('../mock/ft-poller.mock');
		mockery.registerMock('ft-poller', Poller);

		linksData = require('../../../lib/links-data');
	});

	it('exports a function', () => {
		assert.isFunction(linksData);
	});

	describe('linksData(config)', () => {
		let config;
		let returnValue;

		beforeEach(() => {
			config = {
				dataStore: 'http://navstore/',
				version: 5
			};
			returnValue = linksData(config);
		});

		it('creates a Poller with the expected options', () => {
			assert.calledOnce(Poller);
			assert.calledWith(Poller, {
				autostart: true,
				refreshInterval: 60 * 1000,
				url: 'http://navstore/v5/links.json'
			});
		});

		it('returns the created Poller', () => {
			assert.strictEqual(returnValue, Poller.mockPoller);
		});

		describe('when `config.dataStore` has no trailing slash', () => {

			beforeEach(() => {
				Poller.reset();
				config.dataStore = 'http://navstore';
				returnValue = linksData(config);
			});

			it('creates a Poller with the expected options', () => {
				assert.calledOnce(Poller);
				assert.calledWith(Poller, {
					autostart: true,
					refreshInterval: 60 * 1000,
					url: 'http://navstore/v5/links.json'
				});
			});

		});

		describe('when `config.dataStore` is not a string', () => {

			it('throws an error', () => {
				config.dataStore = null;
				assert.throws(() => linksData(config), 'dataStore must be a string');
			});

		});

		describe('when `config.version` is not a number', () => {

			it('throws an error', () => {
				config.version = 'v8';
				assert.throws(() => linksData(config), 'version must be a number');
			});

		});

	});

});

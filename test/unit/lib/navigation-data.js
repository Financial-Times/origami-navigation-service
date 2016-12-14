'use strict';

const assert = require('proclaim');
const mockery = require('mockery');

describe('lib/navigation-data', () => {
	let navigationData;
	let Poller;

	beforeEach(() => {
		Poller = require('../mock/ft-poller.mock');
		mockery.registerMock('ft-poller', Poller);

		navigationData = require('../../../lib/navigation-data');
	});

	it('exports a function', () => {
		assert.isFunction(navigationData);
	});

	describe('navigationData(config)', () => {
		let config;
		let returnValue;

		beforeEach(() => {
			config = {
				dataStore: 'http://navstore/',
				version: 5
			};
			returnValue = navigationData(config);
		});

		it('creates a Poller with the expected options', () => {
			assert.calledOnce(Poller);
			assert.calledWith(Poller, {
				autostart: true,
				refreshInterval: 60 * 1000,
				url: `http://navstore/v5/navigation.json`
			});
		});

		it('returns the created Poller', () => {
			assert.strictEqual(returnValue, Poller.mockPoller);
		});

		describe('when `config.dataStore` has no trailing slash', () => {

			beforeEach(() => {
				Poller.reset();
				config.dataStore = 'http://navstore';
				returnValue = navigationData(config);
			});

			it('creates a Poller with the expected options', () => {
				assert.calledOnce(Poller);
				assert.calledWith(Poller, {
					autostart: true,
					refreshInterval: 60 * 1000,
					url: `http://navstore/v5/navigation.json`
				});
			});

		});

		describe('when `config.dataStore` is not a string', () => {

			it('throws an error', () => {
				config.dataStore = null;
				assert.throws(() => navigationData(config), 'dataStore must be a string');
			});

		});

		describe('when `config.version` is not a number', () => {

			it('throws an error', () => {
				config.version = 'v8';
				assert.throws(() => navigationData(config), 'version must be a number');
			});

		});

	});

});

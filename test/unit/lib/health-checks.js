'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/health-checks', () => {
	let healthChecks;
	let requestPromise;

	beforeEach(() => {
		requestPromise = require('../mock/request-promise.mock');
		mockery.registerMock('./request-promise', requestPromise);

		healthChecks = require('../../../lib/health-checks');
	});

	it('exports an object', () => {
		assert.isObject(healthChecks);
	});

	it('has an `init` method', () => {
		assert.isFunction(healthChecks.init);
	});

	describe('.init(config)', () => {

		beforeEach(() => {
			healthChecks.pingService = sinon.stub();
			sinon.stub(global, 'setInterval');
			healthChecks.init({
				navigationDataStore: 'http://navstore/'
			});
		});

		afterEach(() => {
			global.setInterval.restore();
		});

		it('calls `pingService` with a v2 navigation data store URL', () => {
			assert.calledWithExactly(healthChecks.pingService, 'navigationDataStoreV2', 'http://navstore/v2/navigation.json');
		});

		it('sets an interval to ping the services again', () => {
			assert.calledOnce(global.setInterval);
			assert.isFunction(global.setInterval.firstCall.args[0]);
			assert.strictEqual(global.setInterval.firstCall.args[1], 60 * 1000);
		});

	});

	it('has a `pingService` method', () => {
		assert.isFunction(healthChecks.pingService);
	});

	describe('.pingService(name, url)', () => {

		beforeEach(() => {
			requestPromise.resolves({
				statusCode: 200
			});
			return healthChecks.pingService('foo', 'bar');
		});

		it('requests the given URL', () => {
			assert.calledOnce(requestPromise);
			assert.calledWith(requestPromise, {
				uri: 'bar',
				method: 'HEAD'
			});
		});

		it('sets the status of the check to `true`', () => {
			assert.isTrue(healthChecks.statuses.foo);
		});

		describe('when the response from the URL is not OK', () => {

			beforeEach(() => {
				requestPromise.resolves({
					statusCode: 400
				});
				return healthChecks.pingService('foo', 'bar');
			});

			it('sets the status of the check to `false`', () => {
				assert.isFalse(healthChecks.statuses.foo);
			});

		});

		describe('when the fetch errors', () => {

			beforeEach(() => {
				requestPromise.rejects(new Error('request-error'));
				return healthChecks.pingService('foo', 'bar');
			});

			it('sets the status of the check to `false`', () => {
				assert.isFalse(healthChecks.statuses.foo);
			});

		});

		describe('when the `TEST_HEALTHCHECK_FAILURE` environment variable is set', () => {
			let originalEnv;

			beforeEach(() => {
				originalEnv = process.env.TEST_HEALTHCHECK_FAILURE;
				process.env.TEST_HEALTHCHECK_FAILURE = 'YESPLEASE';
				return healthChecks.pingService('foo', 'bar');
			});

			afterEach(() => {
				process.env.TEST_HEALTHCHECK_FAILURE = originalEnv;
			});

			it('sets the status of the check to `false`', () => {
				assert.isFalse(healthChecks.statuses.foo);
			});

		});

	});

	it('has a `navigationDataStoreV2` property', () => {
		assert.isObject(healthChecks.navigationDataStoreV2);
	});

	describe('.navigationDataStoreV2', () => {

		it('has a `getStatus` method', () => {
			assert.isFunction(healthChecks.navigationDataStoreV2.getStatus);
		});

		describe('.getStatus()', () => {

			it('returns an object', () => {
				assert.isObject(healthChecks.navigationDataStoreV2.getStatus());
			});

		});

	});

});

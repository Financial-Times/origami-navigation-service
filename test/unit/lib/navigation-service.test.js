'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const path = require('path');
const sinon = require('sinon');

describe('lib/navigation-service', () => {
	let about;
	let basePath;
	let healthChecks;
	let linksData;
	let navigationData;
	let navigationService;
	let origamiService;
	let requireAll;

	beforeEach(() => {
		basePath = path.resolve(`${__dirname}/../../..`);

		about = {mockAboutInfo: true};
		mockery.registerMock('../about.json', about);

		origamiService = require('../mock/origami-service.mock');
		mockery.registerMock('@financial-times/origami-service', origamiService);

		healthChecks = require('../mock/health-checks.mock');
		mockery.registerMock('./health-checks', healthChecks);

		linksData = {};
		mockery.registerMock('../build/v2/links.json', linksData);

		navigationData = {};
		mockery.registerMock('../build/v2/navigation.json', navigationData);

		requireAll = require('../mock/require-all.mock');
		mockery.registerMock('require-all', requireAll);

		navigationService = require(basePath);
	});

	it('exports a function', () => {
		assert.isFunction(navigationService);
	});

	describe('navigationService(options)', () => {
		let options;
		let returnValue;
		let routes;

		beforeEach(() => {
			options = {
				environment: 'test',
				port: 1234,
			};
			routes = {
				foo: sinon.spy(),
				bar: sinon.spy()
			};
			requireAll.returns(routes);
			returnValue = navigationService(options);
		});

		it('creates an Origami Service application', () => {
			assert.calledOnce(origamiService);
		});

		it('creates a healthChecks object', () => {
			assert.calledOnce(healthChecks);
			assert.calledWithExactly(healthChecks, options);
		});

		it('sets `options.healthCheck` to the created health check function', () => {
			assert.calledOnce(healthChecks.mockHealthChecks.checks);
			assert.strictEqual(options.healthCheck, healthChecks.mockChecksFunction);
		});

		it('sets `options.goodToGoTest` to the created health check gtg function', () => {
			assert.calledOnce(healthChecks.mockHealthChecks.gtg);
			assert.strictEqual(options.goodToGoTest, healthChecks.mockGtgFunction);
		});

		it('sets `options.about` to the contents of about.json', () => {
			assert.strictEqual(options.about, about);
		});

		it('loads all of the routes', () => {
			assert.calledOnce(requireAll);
			assert.isObject(requireAll.firstCall.args[0]);
			assert.strictEqual(requireAll.firstCall.args[0].dirname, `${basePath}/lib/routes`);
			assert.isFunction(requireAll.firstCall.args[0].resolve);
		});

		it('calls each route with the Origami Service application', () => {
			const route = sinon.spy();
			requireAll.firstCall.args[0].resolve(route);
			assert.calledOnce(route);
			assert.calledWithExactly(route, origamiService.mockApp);
		});

		it('creates and mounts not found middleware', () => {
			assert.calledOnce(origamiService.middleware.notFound);
			assert.calledWithExactly(origamiService.middleware.notFound);
			assert.calledWith(origamiService.mockApp.use, origamiService.middleware.notFound.firstCall.returnValue);
		});

		it('creates and mounts error handling middleware', () => {
			assert.calledOnce(origamiService.middleware.errorHandler);
			assert.calledWithExactly(origamiService.middleware.errorHandler);
			assert.calledWith(origamiService.mockApp.use, origamiService.middleware.errorHandler.firstCall.returnValue);
		});

		it('sets the application `linksDataV2` property to the links data', () => {
			assert.strictEqual(origamiService.mockApp.linksDataV2, linksData);
		});

		it('sets the application `navigationDataV2` property to the navigation data', () => {
			assert.strictEqual(origamiService.mockApp.navigationDataV2, navigationData);
		});

		it('returns the created application', () => {
			assert.strictEqual(returnValue, origamiService.mockApp);
		});

	});

});

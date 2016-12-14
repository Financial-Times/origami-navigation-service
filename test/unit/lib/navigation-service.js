'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const path = require('path');
const sinon = require('sinon');

describe('lib/navigation-service', () => {
	let basePath;
	let express;
	let getBasePath;
	let handleErrors;
	let healthChecks;
	let morgan;
	let navigationData;
	let navigationService;
	let notFound;
	let requireAll;

	beforeEach(() => {
		basePath = path.resolve(`${__dirname}/../../..`);

		express = require('../mock/n-express.mock');
		mockery.registerMock('@financial-times/n-express', express);

		getBasePath = sinon.spy();
		mockery.registerMock('./middleware/get-base-path', getBasePath);

		handleErrors = sinon.stub().returns(sinon.spy());
		mockery.registerMock('./middleware/handle-errors', handleErrors);

		healthChecks = require('../mock/health-checks.mock');
		mockery.registerMock('./health-checks', healthChecks);

		morgan = require('../mock/morgan.mock');
		mockery.registerMock('morgan', morgan);

		navigationData = require('../mock/ft-poller.mock');
		mockery.registerMock('./navigation-data', navigationData);

		notFound = sinon.spy();
		mockery.registerMock('./middleware/not-found', notFound);

		requireAll = require('../mock/require-all.mock');
		mockery.registerMock('require-all', requireAll);

		navigationService = require(basePath);
	});

	it('exports a function', () => {
		assert.isFunction(navigationService);
	});

	describe('navigationService(config)', () => {
		let config;
		let returnedPromise;
		let routes;

		beforeEach(() => {
			config = {
				environment: 'test',
				port: 1234,
				systemCode: 'example-system-code',
				navigationDataStore: 'http://navstore/'
			};
			routes = {
				foo: sinon.spy(),
				bar: sinon.spy()
			};
			requireAll.returns(routes);
			returnedPromise = navigationService(config);
		});

		it('returns a promise', () => {
			assert.instanceOf(returnedPromise, Promise);
		});

		it('creates an Express application', () => {
			assert.calledOnce(express);
		});

		it('passes health-checks into the created application', () => {
			const options = express.firstCall.args[0];
			assert.isObject(options);
			assert.isArray(options.healthChecks);
			assert.strictEqual(options.healthChecks[0], healthChecks.navigationDataStoreV2);
		});

		it('configures handlebars', () => {
			const options = express.firstCall.args[0];
			assert.isObject(options);
			assert.isTrue(options.withHandlebars);
			assert.strictEqual(options.layoutsDir, path.resolve(__dirname, '../../../views/layouts'));
			assert.deepEqual(options.partialsDir, [path.resolve(__dirname, '../../../views')]);
		});

		it('configures assets (turns them off)', () => {
			const options = express.firstCall.args[0];
			assert.isObject(options);
			assert.isFalse(options.withAssets);
		});

		it('sets the application system code', () => {
			const options = express.firstCall.args[0];
			assert.isObject(options);
			assert.strictEqual(options.systemCode, 'example-system-code');
		});

		it('disables service metrics', () => {
			const options = express.firstCall.args[0];
			assert.isObject(options);
			assert.isFalse(options.withServiceMetrics);
		});

		it('creates an error handling middleware', () => {
			assert.calledOnce(handleErrors);
			assert.calledWith(handleErrors, config);
		});

		it('sets the Express application `navigationServiceConfig` property to `config`', () => {
			assert.strictEqual(express.mockApp.navigationServiceConfig, config);
		});

		it('creates a navigation data poller', () => {
			assert.calledOnce(navigationData);
			assert.calledWith(navigationData, {
				dataStore: config.navigationDataStore,
				version: 2
			});
		});

		it('sets the Express application `navigationDataV2` property to the navigation data poller', () => {
			assert.strictEqual(express.mockApp.navigationDataV2, navigationData.mockPoller);
		});

		it('initialises the health-checks', () => {
			assert.calledOnce(healthChecks.init);
			assert.calledWithExactly(healthChecks.init, config);
		});

		it('mounts Morgan middleware to log requests', () => {
			assert.calledWithExactly(morgan, 'combined');
			assert.calledWithExactly(express.mockApp.use, morgan.mockMiddleware);
		});

		it('mounts the getBasePath middleware', () => {
			assert.calledWithExactly(express.mockApp.use, getBasePath);
		});

		it('registers a "/__gtg" route', () => {
			assert.calledWith(express.mockApp.get, '/__gtg');
		});

		describe('"/__gtg" route', () => {
			let gtgRoute;

			beforeEach(() => {
				gtgRoute = express.mockApp.get.withArgs('/__gtg').firstCall.args[1];
				gtgRoute(express.mockRequest, express.mockResponse);
			});

			it('sets the response status to 200', () => {
				assert.calledOnce(express.mockResponse.status);
				assert.calledWithExactly(express.mockResponse.status, 200);
			});

			it('sets the response body to "OK"', () => {
				assert.calledOnce(express.mockResponse.send);
				assert.calledWithExactly(express.mockResponse.send, 'OK');
			});

		});

		it('loads all of the routes', () => {
			assert.calledOnce(requireAll);
			assert.isObject(requireAll.firstCall.args[0]);
			assert.strictEqual(requireAll.firstCall.args[0].dirname, `${basePath}/lib/routes`);
			assert.isFunction(requireAll.firstCall.args[0].resolve);
		});

		it('mounts a static middleware', () => {
			assert.calledOnce(express.static);
			assert.calledWithExactly(express.static, 'public');
			assert.calledWithExactly(express.mockApp.use, express.mockStaticMiddleware);
		});

		it('calls each route with the Express application', () => {
			const route = sinon.spy();
			requireAll.firstCall.args[0].resolve(route);
			assert.calledOnce(route);
			assert.calledWithExactly(route, express.mockApp);
		});

		it('mounts middleware to handle routes that are not found', () => {
			assert.calledWith(express.mockApp.use, notFound);
		});

		it('mounts middleware to handle errors', () => {
			assert.calledWith(express.mockApp.use, handleErrors.firstCall.returnValue);
		});

		it('starts the Express application on the port in `config.port`', () => {
			assert.calledOnce(express.mockApp.listen);
			assert.calledWith(express.mockApp.listen, config.port);
		});

		describe('.then()', () => {
			let service;

			beforeEach(() => {
				return returnedPromise.then(value => {
					service = value;
				});
			});

			it('resolves with the created Express application', () => {
				assert.strictEqual(service, express.mockApp);
			});

			it('stores the created server in the Express application `server` property', () => {
				assert.strictEqual(service.server, express.mockServer);
			});

		});

		describe('when the Express application errors on startup', () => {
			let expressError;

			beforeEach(() => {
				expressError = new Error('Express failed to start');
				express.mockApp.listen.rejects(expressError);
				returnedPromise = navigationService(config);
			});

			describe('.catch()', () => {
				let caughtError;

				beforeEach(done => {
					returnedPromise.then(done).catch(error => {
						caughtError = error;
						done();
					});
				});

				it('fails with the Express error', () => {
					assert.strictEqual(caughtError, expressError);
				});

			});

		});

		describe('when `config.suppressLogs` is `true`', () => {

			beforeEach(() => {
				morgan.reset();
				express.mockApp.use.reset();
				config.suppressLogs = true;
				returnedPromise = navigationService(config);
			});

			it('does not mount Morgan middleware', () => {
				assert.notCalled(morgan);
				assert.neverCalledWith(express.mockApp.use, morgan.mockMiddleware);
			});

		});

	});

});

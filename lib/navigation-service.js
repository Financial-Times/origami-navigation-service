'use strict';

const express = require('@financial-times/n-express');
const getBasePath = require('./middleware/get-base-path');
const handleErrors = require('./middleware/handle-errors');
const healthChecks = require('./health-checks');
const morgan = require('morgan');
const navigationData = require('./navigation-data');
const notFound = require('./middleware/not-found');
const path = require('path');
const requireAll = require('require-all');

module.exports = navigationService;

function navigationService(config) {

	const app = createExpressApp(config);
	const errorHandler = handleErrors(config);
	app.navigationServiceConfig = config;

	app.navigationDataV2 = navigationData({
		dataStore: config.navigationDataStore,
		version: 2
	});

	healthChecks.init(config);

	if (!config.suppressLogs) {
		app.use(morgan('combined'));
	}
	app.use(getBasePath);
	mountRoutes(app);
	app.use(notFound);
	app.use(errorHandler);

	return app.listen(config.port).then(server => {
		app.server = server;
		return app;
	});
}

function createExpressApp(config) {
	const app = express({
		healthChecks: [
			healthChecks.navigationDataStoreV2
		],
		healthChecksAppName: `Origami Navigation Service in ${process.env.REGION || 'unknown region'}`,
		systemCode: config.systemCode,
		withHandlebars: true,
		withAssets: false,
		withServiceMetrics: false,
		layoutsDir: path.resolve(__dirname, '../views/layouts'),
		partialsDir: [path.resolve(__dirname, '../views')]
	});
	app.enable('case sensitive routing');
	return app;
}

function mountRoutes(app) {
	app.get('/__gtg', (request, response) => {
		response.status(200).send('OK');
	});
	app.use(express.static('public'));
	requireAll({
		dirname: `${__dirname}/routes`,
		resolve: initRoute => initRoute(app)
	});
}

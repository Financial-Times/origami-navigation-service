'use strict';

const HealthChecks = require('./health-checks');
const navigationData = require('./navigation-data');
const origamiService = require('@financial-times/origami-service');
const requireAll = require('require-all');

module.exports = navigationService;

function navigationService(options) {

	const healthChecks = new HealthChecks(options);
	options.healthCheck = healthChecks.getFunction();
	options.goodToGoTest = healthChecks.getGoodToGoFunction();
	options.about = require('../about.json');

	const app = origamiService(options);

	app.use(origamiService.middleware.getBasePath());
	mountRoutes(app);
	app.use(origamiService.middleware.notFound());
	app.use(origamiService.middleware.errorHandler());

	app.navigationDataV2 = navigationData({
		dataStore: options.navigationDataStore,
		version: 2
	});

	return app;
}

// NOTE: should this be in Origami Service?
function mountRoutes(app) {
	requireAll({
		dirname: `${__dirname}/routes`,
		resolve: initRoute => initRoute(app)
	});
}

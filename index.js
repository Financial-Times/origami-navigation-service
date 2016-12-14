'use strict';

require('dotenv').load({
	silent: true
});

const throng = require('throng');
const config = require('./config');
if (!config.navigationDataStore) {
	config.log.error('The navigation data store is not configured, the app cannot run without it. Please specify a NAVIGATION_DATA_STORE environment variable.');
	process.exit(1);
}

throng({
  workers: process.env.WEB_CONCURRENCY || 1,
  start: (id) => {
		console.log(`Started worker ${ id }`);

		const navigationService = require('./lib/navigation-service');

		navigationService(config).catch(error => {
			config.error(error.stack);
			process.exit(1);
		});
	}
});

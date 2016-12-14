'use strict';

require('dotenv').load({
	silent: true
});

const throng = require('throng');

throng({
  workers: process.env.WEB_CONCURRENCY || 1,
  start: (id) => {
		console.log(`Started worker ${ id }`);

		const config = require('./config');
		const navigationService = require('./lib/navigation-service');

		navigationService(config).catch(error => {
			config.error(error.stack);
			process.exit(1);
		});
	}
});

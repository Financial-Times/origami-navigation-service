'use strict';

const dotenv = require('dotenv');
const navigationService = require('./lib/navigation-service');
const throng = require('throng');

dotenv.load({
	silent: true
});
const options = {
	defaultLayout: 'main',
	log: console,
	name: 'Origami Navigation Service',
	navigationDataStore: process.env.NAVIGATION_DATA_STORE || 'https://origami-navigation-data.in.ft.com',
	testHealthcheckFailure: process.env.TEST_HEALTHCHECK_FAILURE || false,
	workers: process.env.WEB_CONCURRENCY || 1
};

throng({
	workers: options.workers,
	start: startWorker
});

function startWorker(id) {
	console.log(`Started worker ${id}`);
	navigationService(options).listen().catch(() => {
		process.exit(1);
	});
}

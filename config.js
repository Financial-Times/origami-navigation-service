'use strict';

module.exports = {
	environment: process.env.NODE_ENV || 'development',
	hostname: process.env.HOSTNAME,
	systemCode: 'origami-navigation-service',
	log: console,
	logLevel: process.env.LOG_LEVEL || 'info',
	navigationDataStore: process.env.NAVIGATION_DATA_STORE,
	port: process.env.PORT || 9001
};

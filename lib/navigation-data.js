'use strict';

const Poller = require('ft-poller');

module.exports = navigationData;

function navigationData(config) {
	validateConfig(config);
	const dataStore = config.dataStore.replace(/\/+$/, '');
	const version = config.version;
	const url = `${dataStore}/v${version}/navigation.json`;
	const refreshInterval = 60 * 1000; // one minute
	return new Poller({
		autostart: true,
		refreshInterval,
		url
	});
}

function validateConfig(config) {
	if (typeof config.dataStore !== 'string') {
		throw new Error('dataStore must be a string');
	}
	if (typeof config.version !== 'number') {
		throw new Error('version must be a number');
	}
}

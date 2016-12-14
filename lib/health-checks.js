'use strict';

const requestPromise = require('./request-promise');
const pingInterval = 60 * 1000;

let navigationDataStoreBaseUrl;
let navigationDataStoreV2Url;

// Health checks
const healthChecks = module.exports = {

	// Service status store
	statuses: {},

	// Initialise the health-checks
	init(config) {

		navigationDataStoreBaseUrl = config.navigationDataStore.replace(/\/+$/, '');
		navigationDataStoreV2Url = `${navigationDataStoreBaseUrl}/v2/navigation.json`;

		// Ping services that the navigation service relies on
		function pingServices() {
			healthChecks.pingService('navigationDataStoreV2', navigationDataStoreV2Url);
		}

		pingServices();
		setInterval(pingServices, pingInterval);
	},

	// Ping a service and record its status
	pingService(name, url) {
		if (!!process.env.TEST_HEALTHCHECK_FAILURE) {
			return healthChecks.statuses[name] = false;
		}
		return requestPromise({
			uri: url,
			method: 'HEAD'
		})
		.then(response => {
			if (response.statusCode >= 400) {
				healthChecks.statuses[name] = false;
			} else {
				healthChecks.statuses[name] = true;
			}
		})
		.catch(() => {
			healthChecks.statuses[name] = false;
		});
	},

	// Check that the navigation data store (S3 bucket) is available
	navigationDataStoreV2: {
		getStatus: () => ({
			id: 'navigation-data-store-v2',
			name: 'V2 navigation data can be retrieved from the store',
			ok: healthChecks.statuses.navigationDataStoreV2,
			severity: 1,
			businessImpact: 'Users may not be able to see links in the navigation of sites that use this service',
			technicalSummary: 'Hits the given url and checks that it responds successfully',
			panicGuide: `Check that ${navigationDataStoreV2Url} still exists and that the AWS Region is up`
		})
	}
};

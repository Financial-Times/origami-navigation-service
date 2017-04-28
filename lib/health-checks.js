'use strict';

const HealthCheck = require('@financial-times/health-check');

module.exports = healthChecks;

function healthChecks(options) {

	// Create and return the health check
	return new HealthCheck({
		checks: [

			// This check ensures that the navigation data
			// store is available. It will fail on a non-200
			// response
			{
				type: 'ping-url',
				url: () => {
					const navigationDataStoreBaseUrl = options.navigationDataStore.replace(/\/+$/, '');
					return `${navigationDataStoreBaseUrl}/v2/navigation.json`;
				},
				interval: 30000,
				id: 'navigation-data-store-v2',
				name: 'V2 navigation data can be retrieved from the store',
				severity: 1,
				businessImpact: 'Users may not be able to see links in the navigation of sites that use this service',
				technicalSummary: 'Hits the given url and checks that it responds successfully',
				panicGuide: `Check that ${options.navigationDataStore}/__gtg is responding with a 200 status and that the AWS Region is up`
			},

			// This check monitors the process memory usage
			// It will fail if usage is above the threshold
			{
				type: 'memory',
				threshold: 75,
				interval: 15000,
				id: 'system-memory',
				name: 'System memory usage is below 75%',
				severity: 1,
				businessImpact: 'Application may not be able to serve all navigation requests',
				technicalSummary: 'Process has run out of available memory',
				panicGuide: 'Restart the service dynos on Heroku'
			},

			// This check monitors the system CPU usage
			// It will fail if usage is above the threshold
			{
				type: 'cpu',
				threshold: 75,
				interval: 15000,
				id: 'system-load',
				name: 'System CPU usage is below 75%',
				severity: 1,
				businessImpact: 'Application may not be able to serve all navigation requests',
				technicalSummary: 'Process is hitting the CPU harder than expected',
				panicGuide: 'Restart the service dynos on Heroku'
			}

		],
		log: options.log
	});
}

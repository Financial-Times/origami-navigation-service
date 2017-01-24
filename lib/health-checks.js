'use strict';

const requestPromise = require('./request-promise');
const pingInterval = 60 * 1000;

module.exports = class HealthChecks {

	constructor(options) {
		this.options = options;

		const navigationDataStoreBaseUrl = options.navigationDataStore.replace(/\/+$/, '');
		this.navigationDataStoreV2Url = `${navigationDataStoreBaseUrl}/v2/navigation.json`;

		this.statuses = {
			navigationDataStoreV2: {
				id: 'navigation-data-store-v2',
				name: 'V2 navigation data can be retrieved from the store',
				ok: true,
				severity: 1,
				businessImpact: 'Users may not be able to see links in the navigation of sites that use this service',
				technicalSummary: 'Hits the given url and checks that it responds successfully',
				panicGuide: `Check that ${this.navigationDataStoreV2Url} still exists and that the AWS Region is up`
			}
		};

		this.retrieveData();
		setInterval(this.retrieveData.bind(this), pingInterval);
	}

	retrieveData() {
		this.pingService('navigationDataStoreV2', this.navigationDataStoreV2Url);
	}

	pingService(name, url) {
		if (!!this.options.testHealthcheckFailure) {
			return this.statuses[name].ok = false;
		}
		return requestPromise({
			uri: url,
			method: 'HEAD'
		})
		.then(response => {
			if (response.statusCode >= 400) {
				this.statuses[name].ok = false;
			} else {
				this.statuses[name].ok = true;
			}
		})
		.catch(() => {
			this.statuses[name].ok = false;
		});
	}

	getFunction() {
		return () => {
			return this.getPromise();
		};
	}

	getGoodToGoFunction() {
		return () => {
			return this.getGoodToGoPromise();
		};
	}

	getPromise() {
		return Promise.resolve(this.getStatusArray());
	}

	getGoodToGoPromise() {
		return Promise.resolve(this.getStatusArray().every(status => status.ok));
	}

	getStatusArray() {
		return Object.keys(this.statuses).map(key => this.statuses[key]);
	}

};

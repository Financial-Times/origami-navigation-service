'use strict';

module.exports = app => {

	// Service home page
	app.get('/', (request, response) => {
		response.redirect(301, `${request.basePath}v2/`);
	});

	// TEMPORARY health
	app.get('/__health.2', (request, response) => {
		response.send({
			"schemaVersion": 1,
			"name": "origami-navigation-service",
			"systemCode": "origami-navigation-service",
			"description": "Provides consistent navigation for FT applications.",
			"checks": [
			]
		});
	});

};

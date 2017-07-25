'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');
const sourceParam = require('@financial-times/source-param-middleware');

module.exports = app => {

	const requireValidSourceParam = sourceParam({
		verifyUsingCmdb: false
	});

	// v2 links endpoint
	app.get(
		'/v2/links',
		requireValidSourceParam,
		cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response, next) => {
			const data = app.linksDataV2.getData();
			if (!isValidLinksData(data)) {
				return next(httpError(500, 'Links data is invalid'));
			}
			response.send(data);
		}
	);

};

function isValidLinksData(data) {
	return Array.isArray(data);
}

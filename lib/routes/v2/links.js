'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');
const sourceParam = require('@financial-times/source-param-middleware');
const links = require('../../../build/v2/links.json');

module.exports = app => {

	const requireValidSourceParam = sourceParam({
		verifyUsingCmdb: false
	});

	// v2 links endpoint
	app.get([
			'/v2/links',
			'/__origami/service/navigation/v2/links',
		],
		requireValidSourceParam,
		cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response, next) => {
			const data = app.linksDataV2;
			if (!isValidLinksData(data)) {
				return next(httpError(500, 'Links data is invalid'));
			}
			response.send(data);
		}
	);
	app.get([
			'/v2/links.json',
			'/__origami/service/navigation/v2/links.json',
		],
		cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response) => {
			response.json(links);
		}
	);

};

function isValidLinksData(data) {
	return Array.isArray(data);
}

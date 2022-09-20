'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');
const sourceParam = require('@financial-times/source-param-middleware');

module.exports = app => {

	const requireValidSourceParam = sourceParam({
		verifyUsingCmdb: false
	});

	// v2 menus endpoint
	app.get([
			'/__origami/service/navigation/v2/menus',
		],
		requireValidSourceParam,
		cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response, next) => {
			const data = app.navigationDataV2;
			if (!isValidMenuData(data)) {
				return next(httpError(500, 'Menu data is invalid'));
			}
			response.send(data);
		}
	);

	// v2 individual menu endpoint
	app.get([
			'/__origami/service/navigation/v2/menus/:name',
		],
		requireValidSourceParam,
		cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response, next) => {
			const data = app.navigationDataV2;
			const menu = request.params.name;
			if (!isValidMenuData(data)) {
				return next(httpError(500, 'Menu data is invalid'));
			}
			if (!data.hasOwnProperty(menu)) {
				const error = httpError(404, `Menu "${menu}" was not found`);
				error.cacheMaxAge = '30s';
				return next(error);
			}
			if (!isValidMenuData(data[menu])) {
				return next(httpError(500, `Menu data for "${menu}" is invalid`));
			}
			response.send(data[menu]);
		}
	);

};

function isValidMenuData(data) {
	return (typeof data === 'object' && !Array.isArray(data) && data !== null);
}

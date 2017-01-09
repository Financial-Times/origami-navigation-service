'use strict';

const httpError = require('http-errors');
const middleware = require('@financial-times/origami-service').middleware;

module.exports = app => {

	// v2 menus endpoint
	app.get(
		'/v2/menus',
		middleware.requireSourceParam(),
		middleware.cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response, next) => {
			const data = app.navigationDataV2.getData();
			if (!isValidMenuData(data)) {
				return next(httpError(500, 'Menu data is invalid'));
			}
			response.send(data);
		}
	);

	// v2 individual menu endpoint
	app.get(
		'/v2/menus/:name',
		middleware.requireSourceParam(),
		middleware.cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response, next) => {
			const data = app.navigationDataV2.getData();
			const menu = request.params.name;
			if (!isValidMenuData(data)) {
				return next(httpError(500, 'Menu data is invalid'));
			}
			if (!data.hasOwnProperty(menu)) {
				return next(httpError(404, `Menu "${menu}" was not found`));
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

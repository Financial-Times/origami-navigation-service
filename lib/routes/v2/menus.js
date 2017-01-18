'use strict';

const httpError = require('http-errors');
const requireSourceParam = require('../../middleware/require-source-param');

const oneWeek = 60 * 60 * 24 * 7;
const tenMinutes = 60 * 10;

module.exports = app => {

	// v2 menus endpoint
	app.get('/v2/menus', requireSourceParam(), (request, response, next) => {
		const data = app.navigationDataV2.getData();
		if (!isValidMenuData(data)) {
			return next(httpError(500, 'Menu data is invalid'));
		}
		response.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${tenMinutes}, stale-if-error=${oneWeek}, max-age=${tenMinutes}`
		});
		response.send(data);
	});

	// v2 individual menu endpoint
	app.get('/v2/menus/:name', requireSourceParam(), (request, response, next) => {
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
		response.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${tenMinutes}, max-age=${tenMinutes}`
		});
		response.send(data[menu]);
	});

};

function isValidMenuData(data) {
	return (typeof data === 'object' && !Array.isArray(data) && data !== null);
}

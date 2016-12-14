'use strict';

const oneHour = 60 * 60;

module.exports = app => {

	// v2 menus endpoint
	app.get('/v2/menus', (request, response) => {
		const data = app.navigationDataV2.getData();
		if (!isValidMenuData(data)) {
			return response.status(500).send({
				error: 'Menu data is invalid'
			});
		}
		response.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneHour}, max-age=${oneHour}`
		});
		response.send(data);
	});

	// v2 individual menu endpoint
	app.get('/v2/menus/:name', (request, response) => {
		const data = app.navigationDataV2.getData();
		const menu = request.params.name;
		if (!isValidMenuData(data)) {
			return response.status(500).send({
				error: 'Menu data is invalid'
			});
		}
		if (!data.hasOwnProperty(menu)) {
			return response.status(404).send({
				error: `Menu "${menu}" was not found`
			});
		}
		if (!isValidMenuData(data[menu])) {
			return response.status(500).send({
				error: `Menu data for "${menu}" is invalid`
			});
		}
		response.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneHour}, max-age=${oneHour}`
		});
		response.send(data[menu]);
	});

};

function isValidMenuData(data) {
	return (typeof data === 'object' && !Array.isArray(data) && data !== null);
}

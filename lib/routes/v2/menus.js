'use strict';

const oneHour = 60 * 60;

module.exports = app => {

	// v2 menus endpoint
	app.get('/v2/menus', (request, response) => {
		response.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneHour}, max-age=${oneHour}`
		});
		response.status(501);
		response.send({});
	});

	// v2 individual menu endpoint
	app.get('/v2/menus/:name', (request, response) => {
		response.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneHour}, max-age=${oneHour}`
		});
		response.status(501);
		response.send({});
	});

};

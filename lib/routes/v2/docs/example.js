'use strict';
const fetch = require('node-fetch');

const oneWeek = 60 * 60 * 24 * 7;

module.exports = app => {
	let navData;
	fetch('https://www.ft.com/__origami/service/navigation/v2/menus')
    	.then(res => res.json())
		.then(json => {
			navData = json;
    	});

	// v2 example documentation page
	app.get('/v2/docs/example', (request, response) => {
		response.set({
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneWeek}, stale-if-error=${oneWeek}, max-age=${oneWeek}`
		});
		response.render('example', {
			layout: 'example',
			title: 'Example Reference - Origami Navigation Service',
			navigationLists: navData,
			edition: 'UK',
			editions: ['International']
		});
	});

};

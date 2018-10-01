'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const navigation = require('../../../../data/navigation.json');

module.exports = app => {

	// v2 api documentation page
	app.get('/v2/docs/api', cacheControl({maxAge: '7d'}), (request, response) => {
		navigation.items[0].current = false;
		navigation.items[1].current = true;
		navigation.items[2].current = false;
		response.render('api', {
			layout: 'main',
			title: 'API Reference - Origami Navigation Service',
			navigation
		});
	});

};

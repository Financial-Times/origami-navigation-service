'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const navigation = require('../../../../data/navigation.json');

module.exports = app => {
	navigation.items.map(item => item.current = false);

	// v2 migration page
	app.get('/v2/docs/migration', cacheControl({maxAge: '7d'}), (request, response) => {
		navigation.items[2].current = true;
		response.render('migration', {
			layout: 'main',
			title: 'Migration Guide - Origami Navigation Service',
			navigation
		});
	});

};

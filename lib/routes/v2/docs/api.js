'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const { getPageNavigation } = require('../../../../data/navigation');

module.exports = app => {
	// v2 api documentation page
	app.get('/v2/docs/api', cacheControl({maxAge: '7d'}), (request, response) => {
		const pageNavData = getPageNavigation();
		pageNavData.items.find(i => i.id === 'api').current = true;

		response.render('api', {
			layout: 'main',
			title: 'API Reference - Origami Navigation Service',
			navigation: pageNavData
		});
	});

};

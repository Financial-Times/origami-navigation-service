'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const { getPageNavigation } = require('../../../data/navigation');
module.exports = app => {

	// v2 home page
	app.get([
			'/v2',
			'/__origami/service/navigation/v2',
		], cacheControl({maxAge: '7d'}), (request, response) => {
		const pageNavData = getPageNavigation();
		pageNavData.items.find(i => i.id === 'overview').current = true;

		response.render('index', {
			layout: 'landing',
			title: 'Origami Navigation Service',
			navigation: pageNavData
		});
	});

};

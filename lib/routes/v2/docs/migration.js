'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const { getPageNavigation } = require('../../../../data/navigation');

module.exports = app => {
	// v2 migration page
	app.get([
			'/v2/docs/migration',
			'/__origami/service/navigation/v2/docs/migration',
		], cacheControl({maxAge: '7d'}), (request, response) => {
		const pageNavData = getPageNavigation();
		pageNavData.items.find(i => i.id === 'migration').current = true;

		response.render('migration', {
			layout: 'main',
			title: 'Migration Guide - Origami Navigation Service',
			navigation: pageNavData
		});
	});

};

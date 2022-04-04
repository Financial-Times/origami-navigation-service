'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const navigation = require('../../../build/v2/navigation.json');

module.exports = app => {

	app.get([
			'/v2/navigation.json',
			'/__origami/service/navigation/v2/navigation.json',
		],
		cacheControl({
			maxAge: '10m',
			staleIfError: '7d'
		}),
		(request, response) => {
			response.json(navigation);
		}
	);

};

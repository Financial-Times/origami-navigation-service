'use strict';

const httpError = require('http-errors');

module.exports = app => {

	// v1 endpoint gone
	app.use('/v1', (request, response, next) => {
		const error = httpError(410);
		error.cacheMaxAge = '7d';
		next(error);
	});

};

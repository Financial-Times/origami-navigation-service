'use strict';

const httpError = require('http-errors');

module.exports = requireSourceParam;

function requireSourceParam() {
	return (request, response, next) => {
		if (!isValidSourceParam(request.query.source)) {
			return next(httpError(400, 'The source parameter is required and should be a valid system code'));
		}
		next();
	};
}

function isValidSourceParam(source) {
	return (typeof source === 'string' && source.length >= 1 && source.length <= 255);
}

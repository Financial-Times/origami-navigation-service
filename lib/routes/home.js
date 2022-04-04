'use strict';

module.exports = app => {

	// Service home page
	app.get([
			'/',
			'/__origami/service/navigation/',
		], (request, response) => {
		response.redirect(301, `${request.basePath}v2/`);
	});

};

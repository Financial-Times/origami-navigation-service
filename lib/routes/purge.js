'use strict';

const purgeUrls = require('@financial-times/origami-service').middleware.purgeUrls;

module.exports = app => {

	// Paths to purge
	const paths = [
		'/__about.json',
		'/main.css',
		'/main.js',
		'/v1',
		'/v1/',
		'/v2',
		'/v2/',
		'/v2/docs/api',
		'/v2/docs/api/',
		'/v2/docs/example',
		'/v2/docs/example/',
		'/v2/docs/migration',
		'/v2/docs/migration/'
	];

	// Purge page
	app.post('/purge', purgeUrls({
		urls: paths.map(path => `https://www.ft.com/__origami/service/navigation${path}`)
	}));

};

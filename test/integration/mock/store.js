'use strict';

const express = require('express');

module.exports = createMockStore;

function createMockStore() {
	const mockStore = express();

	mockStore.get('/v2/links.json', (request, response) => {
		response.send([
			{
				label: 'Link 1'
			},
			{
				label: 'Link 2'
			}
		]);
	});

	mockStore.get('/v2/navigation.json', (request, response) => {
		response.send({
			menu1: {
				label: 'Menu 1'
			},
			menu2: {
				label: 'Menu 2'
			}
		});
	});

	return new Promise((resolve, reject) => {
		const server = mockStore.listen((error) => {
			if (error) {
				return reject(error);
			}
			const port = server.address().port;
			mockStore.server = server;
			mockStore.address = `http://localhost:${port}/`;
			resolve(mockStore);
		});
	});
}

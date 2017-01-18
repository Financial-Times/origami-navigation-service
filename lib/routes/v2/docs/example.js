'use strict';
const fetch = require('node-fetch');

const oneWeek = 60 * 60 * 24 * 7;

let navData;

const breadcrumb = (request, response, next) => {

	// Exit early if there is no data to construct a breadcrumb from
	if (navData === undefined) {
		next();
		return;
	}

	let done = false;
	const findUrlInMenu = (url, menu, breadcrumb) => {
		for (const item of menu.items) {
			if (item.submenu) {
				findUrlInMenu(url, item.submenu, breadcrumb);
				if (done) {
					if (item.label && item.url){
						breadcrumb.push(item);
					}
					break;
				} else if (item.url === url) {
					done = true;
					breadcrumb.push(item);
					break;
				}
			} else {
				if (item.url === url) {
					done = true;
					breadcrumb.push(item);
					break;
				}
			}
		}
		return breadcrumb;
	};

	const menus = Object.values(navData);

	for (const menu of menus) {
		// Hard coded for example purposes
		const breadcrumb = findUrlInMenu('/world/uk', menu, []);

		// const breadcrumb = findUrlInMenu(request.path, menu, []);

		if (breadcrumb.length) {
			breadcrumb.reverse();
			response.locals.breadcrumb = breadcrumb;
			response.locals.subsections = breadcrumb[breadcrumb.length-1].submenu;
			break;
		}
	}

	next();
};

module.exports = app => {
	fetch('https://www.ft.com/__origami/service/navigation/v2/menus?source=example')
		.then(res => res.json())
		.then(json => {
			navData = json;
		});

	// v2 example documentation page
	app.get('/v2/docs/example', breadcrumb, (request, response) => {
		response.set({
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneWeek}, stale-if-error=${oneWeek}, max-age=${oneWeek}`
		});
		response.render('example', {
			layout: 'example',
			title: 'Example Reference - Origami Navigation Service',
			navigationLists: navData,
			edition: 'UK',
			editions: ['International'],
			currentPath: request.path,
			helpers: {
				replace: replaceHelper
			}
		});
	});

};

// Copied from https://github.com/helpers/handlebars-helpers
function replaceHelper(string, find, replace) {
	if (string && typeof string === 'string') {
		if (!find || typeof find !== 'string') {
			return string;
		}
		if (!replace || typeof replace !== 'string') {
			replace = '';
		}
		return string.split(find).join(replace);
	}
}

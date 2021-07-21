'use strict';

// {
// 	'label': 'Example Menu',
// 	'items': [item]
// }
const menu = {
	id: 'menu',
	required: ['label', 'items'],
	properties: {
		label: {
			anyOf: [{
				type: 'null'
			}, {
				type: 'string'
			}]
		},
		items: {
			type: 'array',
			minItems: 1,
			uniqueItems: true,
			items: {
				$ref: 'item'
			},
			additionalItems: false
		}
	},
	additionalProperties: false
};

// {
// 	'label': 'Example Item',
// 	'url': 'http://example.com/',
// 	'submenu': null || menu
// }

const item = {
	id: 'item',
	type: 'object',
	required: ['label', 'url', 'submenu'],
	properties: {
		label: {
			anyOf: [{
				type: 'null'
			}, {
				type: 'string'
			}]
		},
		url: {
			anyOf: [{
				type: 'null'
			}, {
				type: 'string',
				format: 'uri'
			}]
		},
		submenu: {
			anyOf: [{
				type: 'null'
			}, {
				$ref: 'menu'
			}]
		},
		disableTracking: {
			anyOf: [{
				type: 'null'
			}, {
				type: 'boolean'
			}]
		}
	},
	additionalProperties: false
};

// {
// 	nameOfMenuObject: menu,
// 	nameOfMenuObject: menu
// }
const root = {
	id: 'root',
	type: 'object',
	minProperties: 1,
	required: ['account', 'drawer-uk', 'drawer-international', 'user', 'anon', 'footer', 'navbar-simple', 'navbar-right', 'navbar-right-anon', 'navbar-uk', 'navbar-international'],
	'patternProperties': {
		'^.*$': { $ref: 'menu' }
	},
	additionalProperties: false
};

const Ajv = require('ajv');
const ajv = new Ajv();
ajv.addSchema(menu);
ajv.addSchema(item);
ajv.addSchema(root);

module.exports = ajv;

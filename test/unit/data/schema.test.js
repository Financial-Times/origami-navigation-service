'use strict';

const assert = require('proclaim');

describe('Schema', () => {
	let schema;

	beforeEach(() => {
		schema = require('../../../data/schema');
	});

	it('has a validate function', () => {
		assert.isFunction(schema.validate);
	});

	it('has an errors property', () => {
		assert.isDefined(schema.errors);
	});
});



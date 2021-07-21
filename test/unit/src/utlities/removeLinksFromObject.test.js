'use strict';

const proclaim = require('proclaim');

describe('removeLinksFromObj', () => {
	let removeLinksFromObj;

	beforeEach(() => {

		removeLinksFromObj = require('../../../../src/utilities/removeLinksFromObj');
	});

	it('is a function', () => {
		proclaim.isFunction(removeLinksFromObj);
	});

	it('remove `links` from from passed in object', () => {
		const obj = {
			links: true
		};
		proclaim.ok(obj.links);
		proclaim.deepEqual(removeLinksFromObj(obj), obj);
		proclaim.notOk(obj.links);
	});
});



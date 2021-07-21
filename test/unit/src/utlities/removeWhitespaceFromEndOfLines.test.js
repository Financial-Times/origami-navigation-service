'use strict';

const proclaim = require('proclaim');

describe('removeWhitespaceFromEndOfLines', () => {
	let removeWhitespaceFromEndOfLines;

	beforeEach(() => {
		removeWhitespaceFromEndOfLines = require('../../../../src/utilities/removeWhitespaceFromEndOfLines');
	});

	it('is a function', () => {
		proclaim.isFunction(removeWhitespaceFromEndOfLines);
	});

	it('trims whitespace from end of lines', () => {
		const file = 'hello         \n      world. \n\n\nThis is a test.';
		proclaim.equal(removeWhitespaceFromEndOfLines(file), 'hello\n      world.\n\n\nThis is a test.');
	});
});

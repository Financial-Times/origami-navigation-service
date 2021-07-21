'use strict';

const proclaim = require('proclaim');
const mockery = require('mockery');

describe('readAndConcatFiles', () => {
	let readAndConcatFiles;
	let fs;

	beforeEach(() => {
		fs = require('../../../mock/fs.mock');
		mockery.registerMock('fs', fs);

		readAndConcatFiles = require('../../../../src/utilities/readAndConcatFiles');
	});

	it('is a function', () => {
		proclaim.isFunction(readAndConcatFiles);
	});

	it('takes an array of file locations and reads them as utf8 text', () => {
		const files = ['../../testfile.txt', 'testfile2.json'];

		readAndConcatFiles(files);

		proclaim.isTrue(fs.readFileSync.calledTwice, 'fs.readFileSync should be called twice');
		proclaim.isTrue(fs.readFileSync.calledWithExactly('../../testfile.txt', 'utf8'), 'fs.readFileSync should be called with \'../../testfile.txt\', \'utf8\'');
		proclaim.isTrue(fs.readFileSync.calledWithExactly('testfile2.json', 'utf8'), 'fs.readFileSync should be called with \'testfile2.json\', \'utf8\'');
	});

	it('concats text from files together using a new line, in order given', () => {
		const files = ['../../testfile.txt', 'testfile2.json'];

		fs.readFileSync.withArgs('../../testfile.txt').returns('hello world, this is testfile.txt.');
		fs.readFileSync.withArgs('testfile2.json').returns('hello world, this is testfile2.json.');

		proclaim.equal(readAndConcatFiles(files), 'hello world, this is testfile.txt.\nhello world, this is testfile2.json.');
	});
});



'use strict';

const sinon = require('sinon');

module.exports = {
	mkdirSync: sinon.stub(),
	readFileSync: sinon.stub(),
	statSync: sinon.stub(),
};

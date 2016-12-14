'use strict';

const sinon = require('sinon');
require('sinon-as-promised');

const Poller = module.exports = sinon.stub();

const mockPoller = module.exports.mockPoller = {
	getData: sinon.stub(),
	start: sinon.stub(),
	stop: sinon.stub()
};

Poller.returns(mockPoller);

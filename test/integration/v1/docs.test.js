'use strict';

const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

describe('GET /v1/', function () {
	setupRequest('GET', '/v1/');
	itRespondsWithStatus(410);
});

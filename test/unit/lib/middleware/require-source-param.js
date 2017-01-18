'use strict';

const assert = require('proclaim');
const sinon = require('sinon');

describe('lib/middleware/require-source-param', () => {
	let express;
	let requireSourceParam;

	beforeEach(() => {
		express = require('../../mock/n-express.mock');
		requireSourceParam = require('../../../../lib/middleware/require-source-param');
	});

	it('exports a function', () => {
		assert.isFunction(requireSourceParam);
	});

	describe('requireSourceParam()', () => {
		let middleware;

		beforeEach(() => {
			middleware = requireSourceParam();
		});

		it('returns a middleware function', () => {
			assert.isFunction(middleware);
		});

		describe('middleware(request, response, next)', () => {
			let next;

			beforeEach(() => {
				next = sinon.spy();
				express.mockRequest.query.source = 'test';
				middleware(express.mockRequest, express.mockResponse, next);
			});

			it('calls `next` with no error', () => {
				assert.calledOnce(next);
				assert.calledWithExactly(next);
			});

			describe('when the `source` query parameter is missing', () => {

				beforeEach(() => {
					next.reset();
					delete express.mockRequest.query.source;
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('calls `next` with a 400 error', () => {
					assert.calledOnce(next);
					assert.instanceOf(next.firstCall.args[0], Error);
					assert.strictEqual(next.firstCall.args[0].status, 400);
					assert.strictEqual(next.firstCall.args[0].message, 'The source parameter is required and should be a valid system code');
				});

			});

			describe('when the `source` query parameter is an empty string', () => {

				beforeEach(() => {
					next.reset();
					express.mockRequest.query.source = '';
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('calls `next` with a 400 error', () => {
					assert.calledOnce(next);
					assert.instanceOf(next.firstCall.args[0], Error);
					assert.strictEqual(next.firstCall.args[0].status, 400);
					assert.strictEqual(next.firstCall.args[0].message, 'The source parameter is required and should be a valid system code');
				});

			});

			describe('when the `source` query parameter is longer than 255 characters', () => {

				beforeEach(() => {
					next.reset();
					express.mockRequest.query.source = Array(256).fill('x').join('');
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('calls `next` with a 400 error', () => {
					assert.calledOnce(next);
					assert.instanceOf(next.firstCall.args[0], Error);
					assert.strictEqual(next.firstCall.args[0].status, 400);
					assert.strictEqual(next.firstCall.args[0].message, 'The source parameter is required and should be a valid system code');
				});

			});

		});

	});

});

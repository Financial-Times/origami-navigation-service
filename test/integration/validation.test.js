'use strict';

const assert = require('proclaim');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const throat = require('throat')(10);
const heads = require('heads');
const url = require('url');
const schema = require('../../data/schema');


describe('Navigation data', () => {
	let navigationData;

	beforeEach(() => {
		navigationData = require('../../build/v2/navigation');
	});

	it('adheres to navigation schema', () => {
		const valid = schema.validate('root', navigationData);
		assert.isNull(schema.errors, 'The navigation data did not match the scheme:' + JSON.stringify(schema.errors, null, 4));
		assert.equal(valid, true, 'The navigation data did not match the scheme');
	});

	describe('links', () => {

		const linkYaml = yaml.load(
			fs.readFileSync(
				path.join(__dirname, '../../data/links.yaml'), 'utf8'
			)
		);

		const urls = linkYaml.links
			// Replace "currentPath" with an example path, as this will now error otherwise
			.map(link => link.url.replace('${currentPath}', '/'))
			// Resolve the link URL against FT.com
			.map(linkUrl => url.resolve('https://www.ft.com', linkUrl));


		urls.map(url => {
			throat(() => {
				it.skip(`${url} returns a 200 status code`, () => {
					return heads(url,
                                                {
                                                        headers: {
                                                                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
                                                        }
                                                }
                                        )
					.then(statusCode => assert.equal(statusCode, 200))
					.catch(function() {
						return heads(url,
                                         	       {
                                                	        headers: {
                                                        	        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
	                                                        }
        	                                        }
                	                        ).then(statusCode => assert.equal(statusCode, 200));
					});
				});
			});
		});
	});
});

describe('Links data', () => {
	let linksData;

	beforeEach(() => {
		linksData = require('../../build/v2/links');
	});

	it('adheres to navigation schema', () => {
		linksData.forEach(link => {
			const valid = schema.validate('item', link);
			assert.isNull(schema.errors, 'The navigation data did not match the scheme:' + JSON.stringify(schema.errors, null, 4));
			assert.equal(valid, true, 'The navigation data did not match the scheme');
		});
	});

});

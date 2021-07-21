'use strict';

const proclaim = require('proclaim');

describe('yamlToJSON', () => {
	let yamlToJSON;

	beforeEach(() => {
		yamlToJSON = require('../../../../src/utilities/yamlToJSON');
	});

	it('is a function', () => {
		proclaim.isFunction(yamlToJSON);
	});

	it('takes a string of yaml and returns the JSON equivalent', () => {
		const yaml = `
breakfast:
  cereal: granola

lunch:
  sandwich:
    - sourdough
    - poached-egg
    - avocado
    - bacon

dinner:
  burger:
    bread: brioche
    filling:
      - falafel
      - tomato
      - lettuce
      - emmental`;

		const expected = {
			breakfast: {
				cereal: 'granola'
			},
			lunch: {
				sandwich: ['sourdough', 'poached-egg', 'avocado', 'bacon']
			},
			dinner: {
				burger: {
					bread: 'brioche',
					filling: ['falafel', 'tomato', 'lettuce', 'emmental']
				}
			}
		};

		proclaim.deepEqual(yamlToJSON(yaml), expected);
	});
});



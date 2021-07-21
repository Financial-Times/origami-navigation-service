'use strict';

const yaml = require('js-yaml');

module.exports = function yamlToJSON(yamlString) {
	const source = yaml.load(yamlString);
	return source;
};

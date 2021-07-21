'use strict';

const removeTrailingSpaces = require('./utilities/removeWhitespaceFromEndOfLines');
const readAndConcatFiles = require('./utilities/readAndConcatFiles');
const removeLinksFromObject = require('./utilities/removeLinksFromObj');
const yamlToJSON = require('./utilities/yamlToJSON');
const saveLinksToFile = require('./utilities/saveLinksToFile');
const saveToFile = require('./utilities/saveToFile');

module.exports = function (files) {
	return Promise.resolve(files)
		.then(readAndConcatFiles)
		.then(removeTrailingSpaces)
		.then(yamlToJSON)
		.then(saveLinksToFile)
		.then(removeLinksFromObject)
		.then(saveToFile);
};

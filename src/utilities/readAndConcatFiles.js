'use strict';

const fs = require('fs');

module.exports = function readAndConcatFiles(files) {
	const strings = files.map(file => fs.readFileSync(file, 'utf8'));
	return strings.join('\n');
};

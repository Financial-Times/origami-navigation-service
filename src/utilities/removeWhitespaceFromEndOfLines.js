'use strict';

function removeTrailingSpaces(file) {
	const normalised = file.split('\n')
		.map(line => line.trimRight())
		.join('\n');
	return normalised;
}

module.exports = removeTrailingSpaces;

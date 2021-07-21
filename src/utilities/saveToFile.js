'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = function saveToFile(data) {
	const destDir = path.resolve(__dirname, '../../', 'build/v2');

	fs.ensureDirSync(destDir);

	fs.writeJsonSync(path.join(destDir, 'navigation.json'), data);

	return data;
};

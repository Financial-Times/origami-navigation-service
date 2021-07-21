'use strict';

module.exports = function removeLinksFromObject(obj) {
	delete obj.links;
	return obj;
};

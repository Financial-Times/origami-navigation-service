'use strict';

module.exports.getPageNavigation = () => {
	return {
		'items': [
			{
				'id': 'overview',
				'name': 'Overview',
				'href': '/__origami/service/navigation/v2'
			},
			{
				'id': 'api',
				'name': 'API Reference',
				'href': '/__origami/service/navigation/v2/docs/api'
			},
			{
				'id': 'migration',
				'name': 'Migration Guide',
				'href': '/__origami/service/navigation/v2/docs/migration'
			},
			{
				'id': 'example',
				'name': 'Example',
				'href': '/__origami/service/navigation/v2/docs/example'
			}
		]
	};
};

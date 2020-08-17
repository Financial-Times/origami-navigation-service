module.exports.getPageNavigation = () => {
	return {
		'items': [
			{
				'id': 'overview',
				'name': 'Overview',
				'href': 'v2'
			},
			{
				'id': 'api',
				'name': 'API Reference',
				'href': 'v2/docs/api'
			},
			{
				'id': 'migration',
				'name': 'Migration Guide',
				'href': 'v2/docs/migration'
			},
			{
				'id': 'example',
				'name': 'Example',
				'href': 'v2/docs/example'
			}
		]
	};
};

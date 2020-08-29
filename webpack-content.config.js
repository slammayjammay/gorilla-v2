const path = require('path');

const contentScripts = ['events', 'document-start', 'document-end', 'document-idle'];

module.exports = contentScripts.map(name => {
	return {
		mode: process.env.NODE_ENV || 'production',
		entry: `./src/content/${name}.js`,
		output: {
			path: `${__dirname}/extension/built`,
			filename: `${name}.js`
		}
	};
});

const path = require('path');

const contentScripts = ['document-start', 'document-end', 'document-idle'];

module.exports = contentScripts.map(name => {
	return {
		mode: process.env.NODE_ENV || 'production',
		devtool: 'source-map',
		entry: `./src/content/${name}.js`,
		output: {
			path: `${__dirname}/extension/built/content`,
			filename: `${name}.js`
		}
	};
});

const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'production',
	devtool: 'source-map',
	entry: './src/dom/index.js',
	output: {
		path: `${__dirname}/extension/built`,
		filename: 'popup.js'
	}
};

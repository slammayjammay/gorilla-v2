const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'production',
	entry: `./src/background/index.js`,
	output: {
		path: `${__dirname}/extension/built/background`,
		filename: `index.js`
	}
};

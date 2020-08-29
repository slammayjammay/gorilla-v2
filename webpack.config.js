const path = require('path');
const DomScriptPlugin = require('./DomScriptPlugin');

module.exports = {
	mode: process.env.NODE_ENV || 'production',
	entry: './src/dom/index.js',
	output: {
		path: `${__dirname}/extension/built`,
		filename: 'dom.js'
	},
	plugins: [new DomScriptPlugin()]
};

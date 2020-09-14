const configs = [];

module.exports = (process.env.TARGETS || '').split(',').forEach(name => {
	const config = require(`./webpack-${name}.config.js`);
	Array.isArray(config) ? configs.push(...config) : configs.push(config);
});

module.exports = configs;

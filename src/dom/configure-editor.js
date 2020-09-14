const { $, $$ } = require('../helpers/query-selector');
const storage = require('./storage');

module.exports = async () => {
	await storage.loadOnce();

	$$('.editor-container').forEach(el => {
		const fn = decodeURIComponent(storage.get('aceOptions'));
		fn && eval(`(${fn})(el.editor)`);
	});
};

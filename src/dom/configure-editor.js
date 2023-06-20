const { $, $$ } = require('../helpers/query-selector');
const storage = require('./storage');

module.exports = async () => {
	await storage.loadOnce();

	$$('.editor-container').forEach(el => {
		const stored = decodeURIComponent(storage.get('aceOptions'));
		let json;
		try {
			json = JSON.parse(stored);
		} catch(e) {
			return;
		}

		el.editor.setTheme('ace/theme/monokai');
		el.editor.session.setMode('ace/mode/javascript');
		json.keyboard && el.editor.setKeyboardHandler(json.keyboard);

		el.editor.getSession().setUseWorker(false);
	});
};

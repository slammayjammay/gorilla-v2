const { $, $$ } = require('../helpers/query-selector');
const formatCode = require('../helpers/format-code');
const ConfigPanel = require('./ConfigPanel');

module.exports = class WindowConfig extends ConfigPanel {
	static get optionPath() {
		return 'windowOptions';
	}

	static get editorCode() {
		return formatCode.dedent(`
			{
				"type": "popup",
				"top": 40,
				"left": 20,
				"width": 730,
				"height": 540
			}
		`).trim();
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<details>
				<summary>Configure extension window</summary>
				<p>This options object will be used when opening this extension in a separate window (see <a href="https://developer.chrome.com/extensions/windows#method-create">docs</a> for details).</p>
				<p><button class="button restore-default" title="Restore defaults"><small>restore defaults</small></button></p>
				<small class="save" data-saved="Saved." data-saving="Saving...">Saved.</small>
				<div class="editor-container"></div>
			</details>
		`;
		return dummy.children[0];
	}
};

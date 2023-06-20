const { $, $$ } = require('../helpers/query-selector');
const formatCode = require('../helpers/format-code');
const ConfigPanel = require('./ConfigPanel');
const configureEditor = require('./configure-editor');

module.exports = class AceConfig extends ConfigPanel {
	static get optionPath() {
		return 'aceOptions';
	}

	static get editorCode() {
		return formatCode.dedent(`
			{
				"keyboard": "ace/keyboard/sublime"
			}
		`).trim();
	}

	constructor() {
		super(...arguments);
		$('.apply', this.el).addEventListener('click', () => configureEditor(this.editor));
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<details>
				<summary>Configure Editor</summary>
				<p>This extension uses the <a href="https://ace.c9.io/">Ace editor</a> for text editing. You can provide a keybinding option in the JSON config below (only 'ace/keyboard/sublime' or 'ace/keyboard/vim' acceptable).</p>
				<p>
					<button class="button restore-default" title="Restore defaults"><small>restore defaults</small></button>
					<button class="button apply" title="Apply"><small>apply</small></button>
				</p>
				<small class="save" data-saved="Saved." data-saving="Saving...">Saved.</small>
				<div class="editor-container"></div>
			</details>
		`;
		return dummy.children[0];
	}
};

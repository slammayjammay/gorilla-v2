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
			function configureEditor(editor) {
				editor.setTheme('ace/theme/monokai');
				editor.session.setMode('ace/mode/javascript');
				editor.setKeyboardHandler('ace/keyboard/sublime');
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
				<p>This extension loads the <a href="https://ace.c9.io/">Ace editor</a> <a href="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js">CDN</a> for text editing. You can configure the editor by adjusting the function below. This function will be called for all instances of Ace editors used in this extension.</p>
				<p>
					<button class="restore-default" title="Restore defaults"><small>restore defaults</small></button>
					<button class="apply" title="Apply"><small>apply</small></button>
				</p>
				<small class="save" data-saved="Saved." data-saving="Saving...">Saved.</small>
				<div class="editor-container"></div>
			</details>
		`;
		return dummy.children[0];
	}
};

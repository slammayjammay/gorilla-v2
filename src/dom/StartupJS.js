const { $, $$ } = require('../helpers/query-selector');
const storage = require('./storage');
const eventBus = require('./event-bus');
const formatCode = require('../helpers/format-code');
const ConfigPanel = require('./ConfigPanel');

module.exports = class StartupJS extends ConfigPanel {
	static get optionPath() {
		return 'startupJSOptions';
	}

	static get editorCode() {
		return formatCode.dedent(`
			function onStartup() {
				const html = document.documentElement;
				if (html.classList.contains('popup')) {
					html.style.minWidth = '540px';
				}
			}
		`).trim();
	}

	constructor() {
		super(...arguments);
		$('.run', this.el).addEventListener('click', () => this.run());
		eventBus.on('isPopup', () => this.run());
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<details>
				<summary>Startup JS</summary>
				<p>Run this code when this extension window/popup is created.</p>
				<p>
					<button class="button restore-default" title="Restore defaults"><small>restore defaults</small></button>
					<button class="button run" title="run"><small>run</small></button>
				</p>
				<small class="save" data-saved="Saved." data-saving="Saving...">Saved.</small>
				<div class="editor-container"></div>
			</details>
		`;
		return dummy.children[0];
	}

	run() {
		const fn = this.constructor.getOption();
		fn && eval(`(${fn})()`);
	}
};

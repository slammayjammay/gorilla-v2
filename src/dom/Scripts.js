const { $, $$ } = require('../helpers/query-selector');
const eventBus = require('./event-bus');
const storage = require('./storage');
const generateScript = require('../helpers/generate-script');
const createEditor = require('./create-editor');
const configureEditor = require('./configure-editor');
const ExtensionData = require('./ExtensionData');
const AceConfig = require('./AceConfig');
const WindowConfig = require('./WindowConfig');
const StartupJS = require('./StartupJS');

const boilerplate = `function script($, $$) {\n\t/* your code here */\n}`;

module.exports = class Scripts {
	constructor() {
		this.onScriptClick = this.onScriptClick.bind(this);

		this.extensionData = new ExtensionData();
		this.aceConfig = new AceConfig();
		this.windowConfig = new WindowConfig();
		this.startupJS = new StartupJS();

		this.el = this.createEl();

		$('.extension-data', this.el).append(this.extensionData.el);
		$('.ace-config', this.el).append(this.aceConfig.el);
		$('.window-config', this.el).append(this.windowConfig.el);
		$('.startup-js', this.el).append(this.startupJS.el);

		this.addEvents();

		this.editor = createEditor($('.editor-container', this.el));

		const codePreview = $('.preview-inner', this.el);
		const nameInput = $('input[name="name"]', this.el);
		const previewUserCode = () => {
			const name = nameInput.value;
			const userScript = `<span class="userscript">${this.editor.getValue()}</span>`;
			const script = generateScript(userScript).trim();
			codePreview.innerHTML = script;
		};
		previewUserCode();
		this.editor.on('change', previewUserCode);
	}

	addEvents() {
		storage.loadOnce().then(() => storage.forEach('scripts', key => this.add(key)));
		eventBus.on('storage-save', () => {
			this.clear();
			storage.forEach('scripts', key => this.add(key));
		});

		$('.scripts-list', this.el).addEventListener('click', this.onScriptClick);

		$('.script-item.create button', this.el).addEventListener('click', () => {
			this.openEditing();
		});
		$('.cancel', this.el).addEventListener('click', () => {
			this.closeEditing(boilerplate);
		});

		$('form', this.el).addEventListener('submit', e => this.onSubmit(e));

		eventBus.on('scriptStatus', e => {
			const { name, error } = e.detail;
			const scriptItem = $(`.script-item[data-name="${name}"]`, this.el);
			const scriptInfo = $('.script-info', this.el);

			scriptItem.setAttribute('data-script-status', error ? 'error' : 'success');

			const text = error ? this.formatErrorMessage(name, error) : 'No errors.';
			scriptInfo.innerHTML = text;
			scriptInfo.setAttribute('data-script-status', error ? 'error' : 'success');
		});

		eventBus.on('resize', () => {
			this.editor && this.el.classList.contains('editing') && this.editor.resize();
		});
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<div class="scripts">
				<div>
					<h2>Scripts</h2>
					<div class="tab-selection"></div>
					<ul class="scripts-list">
						<li class="script-item create">
							<button class="script-button" title="Create new script">+</button>
						</li>
					</ul>
					<p><small>Meta+click to run a script and close this window.</small></p>
					<pre class="script-info"> </pre>
				</div>
				<form>
						<h2>Script editor</h2>
						<p>
							<button type="button" class="cancel" title="Cancel">&#x00D7;</button>
							<button type="submit" title="Submit">&check;</button>
						</p>
						<details>
							<summary>How it works</summary>
							<p>Write your code inside the function template. The function takes two arguments <strong>$</strong> and <strong>$$</strong>, which are similar to <strong>document.querySelector</strong> and <strong>document.querySelectorAll</strong>. These are locally defined functions and are not defined on <strong>window</strong>.</p>
							<p>Note: If "run at" is set to document start, end, or idle, the code will not have access to the <strong>window</strong> object.</p>
						</details>
						<details>
							<summary>Preview</summary>
							<pre class="preview"><span class="preview-inner"></span></pre>
						</details>
						<br/>
						<p>
							<label for="name"><strong>Name: </strong></label>
							<input id="name" name="name" type="text" autocomplete="off" required/>
						</p>
						<div class="editor-container"></div>
						<br/>
						<div>
							<div><span class="middle"><strong>Run at: </strong></span></div>
							<div><input type="radio" class="middle" name="run-at" value="click" id="run-at-click"><span class="middle">button click</span></label></div>
							<div><input type="radio" class="middle" name="run-at" value="document-start" id="run-at-document-start"><span class="middle">document start</span></label></div>
							<div><input type="radio" class="middle" name="run-at" value="document-end" id="run-at-document-end"><span class="middle">document end</span></label></div>
							<div><input type="radio" class="middle" name="run-at" value="document-idle" id="run-at-document-idle"><span class="middle">document idle</span></label></div>
							<small>(<a href="https://developer.chrome.com/extensions/content_scripts#run_time">https://developer.chrome.com/extensions/content_scripts#run_time</a>)</small>
						</div>
				</form>
				<div class="extension-data"></div>
			</div>
		`;
		return dummy.children[0];
	}

	createItem(name) {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<li class="script-item" data-name="${name}">
				<button class="script-button" data-action="run" title="Run script '${name}'">${name}</button>
				<span class="actions">
					<button data-action="delete" title="Delete script">&#x00D7;</button>
					<button data-action="edit" title="Edit script">&#x270E;</button>
				</span>
			</li>
		`;
		return dummy.children[0];
	}

	clear() {
		Array.from($$('.script-item:not(.create)', this.el)).forEach(el => el.remove());
	}

	add(name) {
		const item = this.createItem(name);
		$('.scripts-list', this.el).append(item);
	}

	openEditing(text = boilerplate, name = '') {
		this.el.classList.add('editing');
		this.el.setAttribute('data-edit-for', name);

		$('input[name="name"]', this.el).value = name;
		const runAt = (name && storage.get(`scripts.${name}`).runAt) || 'click';
		$(`input[id="run-at-${runAt}"]`).checked = true;

		this.editor.resize();
		text && this.editor.setValue(text, 1);
	}

	closeEditing(text) {
		this.el.classList.remove('editing');
		this.el.removeAttribute('data-edit-for');
		$('input[name="name"]', this.el).value = '';
		this.editor.resize();
		text && this.editor.setValue(text, 1);
	}

	onSubmit(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		data.set('script', this.editor.getValue());

		const isValid = data.get('name') && data.get('script'); // TODO

		if (isValid) {
			const name = data.get('name');
			const editedItem = $(`.script-item[data-name="${name}"]`, this.el);
			editedItem && this.delete(editedItem);

			this.add(name, data.get('script'));
			eventBus.emit('scriptCreated', data);
			this.closeEditing(boilerplate);
		}
	}

	onScriptClick(e) {
		if (e.target === e.currentTarget) {
			return;
		}

		const li = e.target.closest('li');
		const action = e.target.getAttribute('data-action');

		if (action === 'delete') {
			if (e.metaKey) {
				this.delete(li);
			} else {
				confirm('Permanently delete script?') && this.delete(li);
			}
		} else if (action === 'edit') {
			this.edit(li);
		} else if (action === 'run') {
			eventBus.emit('scriptRun', li.getAttribute('data-name'));
			e.metaKey && eventBus.emit('close');
		}
	}

	delete(scriptItem) {
		scriptItem.remove();
		eventBus.emit('scriptDeleted', scriptItem.getAttribute('data-name'));
	}

	edit(scriptItem) {
		const name = scriptItem.getAttribute('data-name');
		const { script } = storage.get(`scripts.${name}`);
		this.openEditing(decodeURIComponent(script), name);
	}

	formatErrorMessage(name, error) {
		if (typeof error === 'string') {
			return error;
		}

		const lineNumber = this.getLineNumberFromStack(error.stack) - generateScript.codeBeginLine;
		const code = decodeURIComponent(storage.get(`scripts.${name}`).script).split('\n');
		code[lineNumber - 1] = `<span class="error">${code[lineNumber - 1]}</span>`;
		return `Error found on line ${lineNumber}:\n\n<span class="userscript">${code.join('\n')}</span>\n\n${error.stack}`;
	}

	getLineNumberFromStack(stack) {
		const match = /at[^\d]*:(\d+):\d+/.exec(stack);
		return match && match[1];
	}
};

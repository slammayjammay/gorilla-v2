const { $, $$ } = require('./query-selector');
const eventBus = require('./event-bus');
const storage = require('./storage');
const generateScript = require('./generate-script');
const loadMonaco = require('./load-monaco');

const boilerplate = `function($, $$) {\n\t/* your code here */\n}`;

module.exports = class Scripts {
	constructor() {
		this.onDataCopy = this.onDataCopy.bind(this);
		this.onDataEdit = this.onDataEdit.bind(this);
		this.onScriptClick = this.onScriptClick.bind(this);

		this.editor = null;
		this.el = this.createEl();
		this.addEvents();

		storage.loadOnce().then(() => this.updateStorage());

		loadMonaco().then(monaco => {
			this.editor = monaco.editor.create($('.monaco-container', this.el), {
				value: boilerplate,
				language: 'javascript',
				theme: 'vs-dark'
			});

			const codePreview = $('.code-preview', this.el);
			const nameInput = $('input[name="name"]', this.el);
			const previewUserCode = () => {
				const name = nameInput.value;
				// careful...
				const userScript = `<span class="userscript">${this.editor.getValue()}</span>`;
				const script = generateScript(name, userScript, { indentLevel: 1 });
				codePreview.innerHTML = script;
			};
			previewUserCode();
			this.editor.onDidChangeModelContent(previewUserCode);

			eventBus.on('resize', () => {
				this.editor && this.el.classList.contains('editing') && this.editor.layout();
			});
		});
	}

	addEvents() {
		$('.storage-copy', this.el).addEventListener('click', this.onDataCopy);
		$('.storage-save', this.el).addEventListener('click', this.onDataEdit);

		$('.scripts-list', this.el).addEventListener('click', this.onScriptClick);

		$('.script-item.create button', this.el).addEventListener('click', () => {
			this.openEditing();
		});
		$('.cancel', this.el).addEventListener('click', () => {
			this.closeEditing(boilerplate);
		});

		$('form', this.el).addEventListener('submit', e => this.onSubmit(e));

		eventBus.on('scriptSuccess', e => {
			const { name } = e.detail;
			const scriptItem = $(`.script-item[data-name="${name}"]`, this.el);
			scriptItem.setAttribute('data-script-status', 'success');
			$('.script-info', this.el).textContent = `No errors.`;
		});
		eventBus.on('scriptError', e => {
			const { name, error } = e.detail;
			const scriptItem = $(`.script-item[data-name="${name}"]`, this.el);
			scriptItem.setAttribute('data-script-status', 'error');
			$('.script-info', this.el).innerHTML = this.formatErrorMessage(name, error);
		});

		eventBus.on('storage-set:done', () => this.updateStorageText());
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<div class="scripts">
				<div class="blur">
					<details>
						<summary>About</summary>
						<p>Create, save, and run scripts on document start, document end, document idle, or on click.</p>
						<h3><strong>What this bookmarklet does:</strong></h3>
						<ul class="about-list">
							<li>Creates an instance of this bookmarklet and stores under <strong>window._gorilla</strong>.</li>
							<li>Creates a <strong>&lt;div id="gorilla"&gt;</strong> and prepends to <strong>document.body</strong>.</li>
							<li>Loads the <a href="https://github.com/microsoft/monaco-editor">Monaco text editor</a> for creating and editing scripts.</li>
						</ul>
					</details>
					<details>
						<summary>View/Edit extension json</summary>
						<button class="storage-copy">Copy</button>
						<button class="storage-save">Save</button>
						<p><small>(Note: scripts must be <a href="https://developer.mozilla.org/en-US/search?q=encodeuricomponent">URI encoded</a>.)</small></p>
						<div class="storage-container">
							<textarea></textarea>
							<pre class="storage" contenteditable="true"></pre>
						</div>
					</details>
					<ul class="scripts-list">
						<li class="script-item create">
							<button class="script-button" title="Create new script">+</button>
						</li>
					</ul>
					<p><small>Meta+click to run a script and close this window.</small></p>
					<p><strong>Status of last script:</strong></p>
					<pre class="script-info"> </pre>
				</div>
				<form>
					<details>
						<summary>How it works</summary>
						<p>Write your code inside the function template. The function takes two arguments <strong>$</strong> and <strong>$$</strong>, which are similar to <strong>document.querySelector</strong> and <strong>document.querySelectorAll</strong>. These are variables are not defined on <strong>window</strong>.</p>
						<p>Choose when to run the code. If running on extension click, a <strong>&lt;script&gt;</strong> tag will be created and injected into the page.</p>
						<p>If "run at" is set to document start, end, or idle, the code will not have access to the <strong>window</strong> object.</p>
					</details>
					<details>
						<summary>Preview injected script</summary>
						<pre>&lt;script&gt;<span class="code-preview"></span>&lt;/script&gt;</pre>
					</details>
					<br/>
					<p>
						<label for="name"><strong>Script name: </strong></label>
						<input id="name" name="name" type="text" autocomplete="off" required/>
					</p>
					<p class="label-row">
						<label for="script"><strong>Code: </strong></label>
						<span>
							<button type="button" class="cancel">×</button>
							<button type="submit">✓</button>
						</span>
					</p>
					<div class="monaco-container"></div>
					<br/>
					<div>
						<div><span class="middle"><strong>Run at: (<a href="https://developer.chrome.com/extensions/content_scripts#run_time">more here</a>)</strong></span></div>
						<div><input type="radio" class="middle" name="run-at" value="click" id="run-at-click"><span class="middle">extension click</span></label></div>
						<div><input type="radio" class="middle" name="run-at" value="document-start" id="run-at-document-start"><span class="middle">document start</span></label></div>
						<div><input type="radio" class="middle" name="run-at" value="document-end" id="run-at-document-end"><span class="middle">document end</span></label></div>
						<div><input type="radio" class="middle" name="run-at" value="document-idle" id="run-at-document-idle"><span class="middle">document idle</span></label></div>
					</div>
				</form>
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
					<button data-action="delete" title="Delete script">×</button>
					<button data-action="edit" title="Edit script">✎</button>
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
		const open = () => {
			this.el.classList.add('editing');
			this.el.setAttribute('data-edit-for', name);

			$('input[name="name"]', this.el).value = name;
			const runAt = (name && storage.get(name).runAt) || 'click';
			$(`input[id="run-at-${runAt}"]`).checked = true;

			this.editor.layout();
			text && this.editor.setValue(text);
		};

		this.editor ? open() : loadMonaco().then(open);
	}

	closeEditing(text) {
		this.el.classList.remove('editing');
		this.el.removeAttribute('data-edit-for');
		$('input[name="name"]', this.el).value = '';
		this.editor.layout();
		text && this.editor.setValue(text);
	}

	updateStorage() {
		this.clear();
		storage.forEach((_, key) => this.add(key));
		this.updateStorageText();
	}

	updateStorageText() {
		$('.storage', this.el).textContent = storage.toJSONString(null, 2);
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

	onDataCopy() {
		const textarea = $('.storage-container textarea', this.el);
		textarea.value = storage.toJSONString(null, 2);
		textarea.select();
		document.execCommand('copy');
	}

	onDataEdit() {
		let json;
		try {
			json = JSON.parse($('.storage', this.el).textContent);
		} catch(e) {
			return alert('JSON is not valid.');
		}

		storage.clear();
		storage.setJSON(json);
		storage.save();
		this.updateStorage();
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
			e.metaKey && eventBus.emit('remove');
		}
	}

	delete(scriptItem) {
		scriptItem.remove();
		eventBus.emit('scriptDeleted', scriptItem.getAttribute('data-name'));
	}

	edit(scriptItem) {
		const name = scriptItem.getAttribute('data-name');
		const { script } = storage.get(name);
		this.openEditing(decodeURIComponent(script), name);
	}

	formatErrorMessage(name, error) {
		if (typeof error === 'string') {
			return error;
		}

		const lineNumber = this.getLineNumberFromStack(error.stack) - generateScript.codeBeginLine;
		const code = decodeURIComponent(storage.get(name).script).split('\n');
		code[lineNumber - 1] = `<span class="error">${code[lineNumber - 1]}</span>`;
		return `Error found on line ${lineNumber}:\n\n<span class="userscript">${code.join('\n')}</span>\n\n${error.stack}`;
	}

	getLineNumberFromStack(stack) {
		const match = /at[^\d]*:(\d+):\d+/.exec(stack);
		return match && match[1];
	}
};

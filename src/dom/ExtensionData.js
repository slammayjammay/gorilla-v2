const { $, $$ } = require('../helpers/query-selector');
const storage = require('./storage');
const eventBus = require('./event-bus');

module.exports = class ExtensionData {
	constructor() {
		this.el = this.createEl();

		this.updateBytes();

		$('.storage-copy', this.el).addEventListener('click', () => this.copyData());
		$('.storage-save', this.el).addEventListener('click', () => this.editData());
		$('.storage-download', this.el).addEventListener('click', () => this.downloadData());
		$('.bytes-refresh', this.el).addEventListener('click', () => this.updateBytes());

		storage.loadOnce().then(() => this.updateStorage());
		eventBus.on('storage-save', () => this.updateStorageText());
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<details>
				<summary>Misc</summary>
				<details>
					<summary>View/Edit extension json</summary>
					<p><strong><span class="bytes"></span></strong> bytes stored locally. <button class="bytes-refresh" title="refresh">&orarr;</button></p>
					<p>
						<button class="storage-copy" title="Copy json">Copy</button>
						<button class="storage-save" title="Save json">Save</button>
						<button class="storage-download" title="Download json">Download</button>
					</p>
					<p><small>(Note: scripts must be <a href="https://developer.mozilla.org/en-US/search?q=encodeuricomponent">URI encoded</a>.)</small></p>
					<div class="storage-container">
						<textarea></textarea>
						<pre class="storage" contenteditable="true"></pre>
					</div>
				</details>
				<div class="ace-config"></div>
				<div class="window-config"></div>
				<div class="startup-js"></div>
			</details>
		`;
		return dummy.children[0];
	}

	async updateBytes() {
		const bytes = await new Promise(r => chrome.storage.local.getBytesInUse(r));
		$('.bytes', this.el).textContent = bytes;
	}

	copyData() {
		const textarea = $('.storage-container textarea', this.el);
		textarea.value = storage.toString(null, 2);
		textarea.select();
		document.execCommand('copy');
	}

	editData() {
		let json;
		try {
			json = JSON.parse($('.storage', this.el).textContent);
		} catch(e) {
			return alert('JSON is not valid.');
		}

		storage.json = json;
		storage.save();
		this.updateStorage();
	}

	downloadData() {
		const a = document.createElement('a');
		const data = storage.toString(null, 2);
		const href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
		a.setAttribute('href', href);
		a.setAttribute('download', 'gorilla.json');
		a.click();
	}

	updateStorage() {
		this.updateStorageText();
	}

	updateStorageText() {
		$('.storage', this.el).textContent = storage.toString(null, 2);
	}
}

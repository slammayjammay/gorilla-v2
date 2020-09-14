const css = require('./css');
const { $, $$ } = require('../helpers/query-selector');
const eventBus = require('./event-bus');
const storage = require('./storage');
const TabSelection = require('./TabSelection');
const Scripts = require('./Scripts');

module.exports = class Gorilla {
	constructor() {
		this.container = document.getElementById('gorilla');
		this.scripts = new Scripts();

		this.el = this.createEl();
		this.container.append(this.el);

		eventBus.on('scriptCreated', e => this.onScriptCreated(e));
		eventBus.on('scriptDeleted', e => this.onScriptDeleted(e));
		eventBus.on('scriptRun', e => this.onScriptRun(e));
		eventBus.on('close', e => window.close());

		this._isPopup = this._tabSelection = null;
		this.isPopup().then(bool => {
			this._isPopup = bool;
			document.documentElement.classList.add(bool ? 'window' : 'popup');
			this._isPopup ? this.addPopupHTML() : this.addInlineHTML();
			eventBus.emit('isPopup');
		});

		this.inject();
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<div>
				<h1>Gorilla</h1>
			</div>
		`;
		dummy.children[0].append(this.scripts.el);
		return dummy.children[0];
	}

	async isPopup() {
		return new Promise(resolve => {
			chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
				resolve(tabs[0].url === chrome.extension.getURL('/popup.html'));
			});
		});
	}

	addInlineHTML() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `<button class="open-popup" title="Open in separate window">&#8689;</button>`;
		const button = dummy.children[0];
		this.el.prepend(button);

		button.addEventListener('click', () => {
			chrome.runtime.sendMessage({ name: 'open-popup' });
			window.close();
		});
	}

	addPopupHTML() {
		this._tabSelection = new TabSelection();
		$('.tab-selection', this.scripts.el).append(this._tabSelection.el);
	}

	inject() {
		this.injectCSS();
		this.isActive = true;
	}

	injectCSS() {
		const style = document.createElement('style');
		style.id = '_gorilla-style';
		style.textContent = css;
		this.container.prepend(style);
	}

	onScriptCreated(e) {
		const data = e.detail;
		storage.set(`scripts.${data.get('name')}`, {
			script: encodeURIComponent(data.get('script')),
			runAt: data.get('run-at')
		});
		storage.save();
	}

	onScriptDeleted(e) {
		const name = e.detail;
		storage.delete(`scripts.${name}`);
		storage.save();
	}

	onScriptRun(e) {
		chrome.runtime.sendMessage({
			name: 'run-script',
			scriptName: e.detail,
			tabQuery: this._tabSelection && this._tabSelection.getSelectedTab()
		}, response => {
			eventBus.emit('scriptStatus', { name: e.detail, error: response.error });
		});
	}
};

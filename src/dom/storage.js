const DelimitedMap = require('./DelimitedMap');
const eventBus = require('./event-bus');

class Storage extends DelimitedMap {
	constructor() {
		super(...arguments);
		this._loadOnce = null;
		this.loadOnce();
	}

	loadOnce() {
		if (!this._loadOnce) {
			this._loadOnce = this.load();
		}
		return this._loadOnce;
	}

	load() {
		return new Promise(resolve => {
			chrome.storage.local.get(data => {
				this.json = data.gorilla;
				resolve();
			});
		});
	}

	save() {
		return new Promise(resolve => {
			chrome.storage.local.set({ gorilla: this.json }, () => {
				eventBus.emit('storage-save');
				resolve();
			});
		});
	}
};

module.exports = new Storage();

const eventBus = require('./event-bus');

class Storage extends Map {
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
			eventBus.on('storage-get:done', e => {
				const json = JSON.parse(e.detail);
				Object.entries(json).forEach(([key, val]) => this.set(key, val));
				resolve();
			});
			eventBus.emit('storage-get');
		});
	}

	save() {
		const json = {};
		this.forEach((val, key) => json[key] = val);
		eventBus.emit('storage-set', JSON.stringify(json));
	}
};

module.exports = new Storage();

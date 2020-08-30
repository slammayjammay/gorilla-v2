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
				this.setJSON(JSON.parse(e.detail));
				resolve();
			});
			eventBus.emit('storage-get');
		});
	}

	setJSON(json) {
		Object.entries(json).forEach(([key, val]) => this.set(key, val));
	}

	save() {
		eventBus.emit('storage-set', this.toJSONString());
	}

	toJSONString(...options) {
		return JSON.stringify(this.toJSON(), ...options);
	}

	toJSON() {
		const json = {};
		this.forEach((val, key) => json[key] = val);
		return json;
	}
};

module.exports = new Storage();

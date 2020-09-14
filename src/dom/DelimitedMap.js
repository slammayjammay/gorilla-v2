// Map-like API, except uses JSON structure and '.' deliminated keys:
// { root: { nested: true } } --> get('root.nested')
module.exports = class DelimitedMap {
	constructor(json = {}) {
		this.json = json;
	}

	deliminateKeys(keys) {
		return Array.isArray(keys) ? keys : keys.split('.');
	}

	splitLast(keys) {
		keys = this.deliminateKeys(keys);
		const rest = keys.slice(0, -1);
		const last = keys[keys.length - 1];
		return [rest, last];
	}

	get(keys) {
		if (!Array.isArray(keys) && typeof keys !== 'string') {
			return this.json;
		}

		keys = this.deliminateKeys(keys);
		let cur = this.json;
		keys.forEach(key => cur = cur[key]);
		return cur;
	}

	has(keys) {
		return !!this.get(keys);
	}

	set(keys, val) {
		const [rest, last] = this.splitLast(keys);
		let cur = this.json;

		rest.forEach(key => {
			(cur[key] === undefined) && (cur[key] = {});
			cur = cur[key];
		});

		cur[last] = val;
	}

	delete(keys) {
		if (typeof keys !== 'string') {
			return false;
		}

		keys = this.deliminateKeys(keys);
		const [rest, last] = this.splitLast(keys);
		const almost = this.get(rest);

		if (!almost || !last) {
			return false;
		}

		return delete almost[last];
	}

	clear(keys) {
		return keys ? this.set(keys, {}) : (this.json = {});
	}

	forEach(keys, cb) {
		if (typeof keys !== 'string') {
			cb = keys;
			keys = null;
		}

		const obj = this.get(keys);
		if (typeof obj !== 'object') {
			return;
		}

		const entries = Object.entries(obj);
		return entries.forEach(([key, val], idx) => cb(key, val, idx));
	}

	toString(...options) {
		return JSON.stringify(this.json, ...options);
	}
};

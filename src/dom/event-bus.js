class EventBus {
	constructor(el = document.documentElement) {
		this.el = el;
	}

	on() {
		this.el.addEventListener(...arguments);
	}

	once(name, listener) {
		const fn = (...args) => {
			this.off(name, fn);
			listener(...args);
		};
		this.on(name, fn);
	}

	off() {
		this.el.removeEventListener(...arguments);
	}

	emit(eventName, data) {
		this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }));
	}
}

module.exports = new EventBus();

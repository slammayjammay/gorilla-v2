const css = require('./css');
const { $, $$ } = require('./query-selector');
const eventBus = require('./event-bus');
const storage = require('./storage');
const Window = require('./Window');
const Scripts = require('./Scripts');
const generateScript = require('./generate-script');

module.exports = class Gorilla {
	constructor() {
		this.$ = $;
		this.$$ = $$;
		this.eventBus = eventBus;
		this.storage = storage;

		this.container = document.getElementById('gorilla');
		this.container.setAttribute('data-init', '');
		this.window = new Window();
		this.scripts = new Scripts();

		$('.resizeable', this.window.el).append(this.scripts.el);

		eventBus.on('remove', e => this.remove(e));
		eventBus.on('scriptCreated', e => this.onScriptCreated(e));
		eventBus.on('scriptDeleted', e => this.onScriptDeleted(e));
		eventBus.on('scriptRun', e => this.onScriptRun(e));

		this.inject();
	}

	inject() {
		this.injectCSS();
		this.container.append(this.window.el);
		this.isActive = true;
	}

	injectCSS() {
		const style = document.createElement('style');
		style.id = '_gorilla-style';
		style.textContent = css;
		this.container.prepend(style);
	}

	unremove() {
		this.container.append(this.window.el);
		this.isActive = true;
	}

	remove() {
		this.window.el.remove();
		this.isActive = false;
	}

	toggle() {
		this.isActive ? this.remove() : this.unremove();
	}

	onScriptCreated(e) {
		const data = e.detail;
		storage.set(data.get('name'), {
			script: encodeURIComponent(data.get('script')),
			runAt: data.get('run-at')
		});
		storage.save();
	}

	onScriptDeleted(e) {
		const name = e.detail;
		storage.delete(name);
		storage.save();
	}

	onScriptRun(e) {
		const script = document.createElement('script');

		const name = e.detail;
		const userScript = decodeURIComponent(storage.get(name).script);
		script.textContent = generateScript(name, userScript);

		this.container.append(script);
	}

	onScriptSuccess(name) {
		eventBus.emit('scriptSuccess', { name });
	}

	onScriptError(name, error) {
		eventBus.emit('scriptError', { name, error });
	}
};

const { $, $$ } = require('../helpers/query-selector');
const storage = require('./storage');
const createEditor = require('./create-editor');
const configureEditor = require('./configure-editor');

module.exports = class OptionPanel {
	static get optionPath() {
		throw new Error('Missing optionPath.');
	}

	static getOption() {
		const stored = storage.get(this.optionPath);
		return stored ? decodeURIComponent(stored) : this.constructor.editorCode;
	}

	static get editorCode() {
		return '';
	}

	constructor() {
		this.el = this.createEl();
		this.editor = null;
		this._id = null;

		this.createEditor();
		$('.restore-default', this.el).addEventListener('click', () => this.restoreDefault());
	}

	createEl() {
		throw new Error('Missing createEl.');
	}

	async createEditor() {
		await storage.loadOnce();
		if (!storage.has(this.constructor.optionPath)) {
			storage.set(this.constructor.optionPath, encodeURIComponent(this.constructor.editorCode));
		}
		this.editor = createEditor($('.editor-container', this.el));
		this.editor.setValue(this.constructor.getOption(), -1);
		this.editor.on('change', () => this.onChange());
		configureEditor();
	}

	onChange() {
		clearTimeout(this._id);
		this._id = setTimeout(() => this._onChange(...arguments), 500);
		const save = $('.save', this.el);
		save && (save.textContent = save.getAttribute('data-saving'));
	}

	_onChange() {
		storage.set(this.constructor.optionPath, encodeURIComponent(this.editor.getValue()));
		storage.save();
		const save = $('.save', this.el);
		save && (save.textContent = save.getAttribute('data-saved'));
	}

	restoreDefault() {
		storage.set(this.constructor.optionPath, encodeURIComponent(this.constructor.editorCode));
		storage.save();
		this.editor.setValue(this.constructor.getOption(), -1);
	}
};

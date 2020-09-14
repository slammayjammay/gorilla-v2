const addResizeEvent = require('./add-resize-event');

module.exports = (el) => {
	const editor = window.ace.edit(el);
	addResizeEvent(el);
	el.addEventListener('resize', () => editor.resize());
	el.editor = editor;
	return editor;
};

module.exports = (el) => {
	const editor = window.ace.edit(el);
	el.editor = editor;
	return editor;
};

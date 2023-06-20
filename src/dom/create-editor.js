require('../../vendor/ace-builds/src-min-noconflict/ace.js');
require('../../vendor/ace-builds/src-min-noconflict/theme-monokai.js');
require('../../vendor/ace-builds/src-min-noconflict/mode-javascript.js');
require('../../vendor/ace-builds/src-min-noconflict/keybinding-sublime.js');
require('../../vendor/ace-builds/src-min-noconflict/keybinding-vim.js');
const addResizeEvent = require('./add-resize-event');

module.exports = (el) => {
	const editor = window.ace.edit(el);
	addResizeEvent(el);
	el.addEventListener('resize', () => editor.resize());
	el.editor = editor;
	return editor;
};

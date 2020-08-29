const { $, $$ } = require('./query-selector');
const formatCode = require('../helpers/format-code');

const DEFAULTS = { indentLevel: 0 };

const LINE = 6;

module.exports = (name, userScript, options) => {
	options = { ...DEFAULTS, ...options };

	let code = formatCode.dedent(`
		(function() {
			const $ = ${$.toString()};
			const $$ = ${$$.toString()};

			try {
				// line 6
				window._gorilla.onScriptSuccess('${name}');
			} catch(e) {
				console.error(e);
				window._gorilla.onScriptError('${name}', e);
			}
		})();
	`);

	if (options.indentLevel) {
		code = formatCode.indent(code, options.indentLevel);
	}

	const numIndents = formatCode.getNumIndentsAtLine(code, LINE);
	userScript = formatCode.indent(`(${userScript})($, $$)`, numIndents, '\t');

	return formatCode.replaceLine(code, LINE, userScript).replace(/\s*$/, '\n');
};

module.exports.codeBeginLine = LINE;

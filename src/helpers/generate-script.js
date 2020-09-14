const { $, $$ } = require('./query-selector');
const formatCode = require('./format-code');

const DEFAULTS = { indentLevel: 0 };

const LINE = 5;

module.exports = (userScript, options) => {
	options = { ...DEFAULTS, ...options };

	let code = formatCode.dedent(`
		(function() {
			const $ = ${$.toString()};
			const $$ = ${$$.toString()};

			// line 5

			// boilerplate error handling
			try {
				const ret = (gorillaScript)($, $$);
				ret instanceof Promise ? ret.then(finish).catch(finish) : finish();
			} catch(e) {
				finish(e);
			}

			function finish(error) {
				error instanceof Error && console.error(error);
				const data = { detail: error };
				const event = new CustomEvent('gorilla-script-status', data);
				document.documentElement.dispatchEvent(event);
			}
		})();
	`);

	if (options.indentLevel) {
		code = formatCode.indent(code, options.indentLevel);
	}

	const numIndents = formatCode.getNumIndentsAtLine(code, LINE);
	userScript = formatCode.indent(`const gorillaScript = ${userScript};`, numIndents, '\t');

	return formatCode.replaceLine(code, LINE, userScript).replace(/\s*$/, '\n');
};

module.exports.codeBeginLine = LINE;

const path = require('path');
const fs = require('fs');
const formatCode = require('./src/helpers/format-code');

module.exports = class DomScriptPlugin {
	apply(compiler) {
		compiler.hooks.afterEmit.tap('DomScriptPlugin', () => {
			const { output } = compiler.options;
			const dest = path.join(output.path, output.filename);
			this.rewrite(dest);
		});
	}

	rewrite(source, dest = source) {
		const contents = fs.readFileSync(dest).toString();
		const rewrite = formatCode.dedent(`
			(function(encoded) {
				const script = document.createElement('script');
				script.innerHTML = decodeURIComponent(encoded);
				(document.getElementById('gorilla') || document.body).append(script);
			})("${encodeURIComponent(contents)}");
		`).split('\n').slice(1).join('\n');
		fs.writeFileSync(dest, rewrite);
	}
};

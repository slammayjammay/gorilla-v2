/**
 * Removes annoying extra indents when using template literals. Assumes the
 * given string is correctly formatted. Expects something like this (important
 * to begin with newline):
 *
 * const code = `
 *	function () {
 *		console.log(10 * 10);
 *	}
 * `;
 * dedent(code);
 */
module.exports = {
	dedent(code) {
		const numIndents = this.getNumIndentsAtLine(code, 1);
		return code.split('\n').map(line => line.slice(numIndents)).join('\n');
	},

	/**
	 * Code must begin with newline. First "line" of code is at lineNum 1.
	 */
	getNumIndentsAtLine(code, lineNum) {
		const line = code.split('\n')[lineNum];
		return /^(\s*)/.exec(line)[1].split(/\s/).length - 1;
	},

	indent(code, num = 0, char = '\t') {
		const indentString = new Array(num).fill(char).join('');
		return code.split('\n').map(line => `${indentString}${line}`).join('\n');
	},

	replaceLine(code, lineNum, string) {
		const lines = code.split('\n');
		lines[lineNum] = string;
		return lines.join('\n');
	}
};

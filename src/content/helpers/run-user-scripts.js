const { $, $$ } = require('../../helpers/query-selector');

module.exports = (runAt) => {
	chrome.storage.local.get('gorilla', data => {
		if (!data.gorilla || !data.gorilla.scripts) {
			return;
		}

		Object.entries(data.gorilla.scripts).forEach(([name, value]) => {
			if (runAt === value.runAt) {
				runScript(name);
			}
		});
	});
};

function runScript(name) {
	chrome.runtime.sendMessage({ name: 'run-script', scriptName: name });
}

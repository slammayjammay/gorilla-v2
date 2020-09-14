const { $, $$ } = require('../../helpers/query-selector');

module.exports = (runAt) => {
	chrome.storage.local.get('gorilla', data => {
		if (!data.gorilla || !data.gorilla.scripts) {
			return;
		}

		Object.entries(data.gorilla.scripts).forEach(([name, value]) => {
			if (runAt === value.runAt) {
				runScript(value.script);
			}
		});
	});
};

function runScript(encodedJS) {
	const js = `(${decodeURIComponent(encodedJS)})(${$}, ${$$})`;

	if (document.body) {
		const script = document.createElement('script');
		script.innerHTML = js;
		(document.getElementById('gorilla') || document.body).append(script);
	} else {
		window.location = `javascript:${encodeURIComponent(js)}`;
	}
}

const { $, $$ } = require('../../dom/query-selector');

module.exports = (runAt) => {
	chrome.storage.local.get('gorilla', data => {
		const json = JSON.parse(data.gorilla || '{}');
		Object.entries(json).forEach(([name, value]) => {
			if (runAt === value.runAt) {
				runScript(value.script);
			}
		});
	})
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

const generateScript = require('../helpers/generate-script');
const generateContentScript = require('../helpers/generate-content-script');

chrome.runtime.onMessage.addListener((request, sender, respond) => {
	if (request.name === 'open-popup') {
		createWindow();
	} else if (request.name === 'run-script') {
		runScript(request.scriptName, request.tabQuery).then(respond);
		return true;
	}
});

async function createWindow(tab) {
	const data = await new Promise(r => chrome.storage.local.get(r));

	let options = {
		type: 'popup',
		top: 40,
		left: 20,
		width: 730,
		height: 540
	};

	if (data.gorilla.windowOptions) {
		options = eval(`(${decodeURIComponent(data.gorilla.windowOptions)})()`);
	}

	chrome.windows.create({ ...options, url: 'popup.html' });
}

function runScript(name, tabQuery = { active: true, currentWindow: true }) {
	return new Promise(async resolve => {
		const data = await new Promise(r => chrome.storage.local.get(r));
		const domScript = generateScript(decodeURIComponent(data.gorilla.scripts[name].script));
		const code = generateContentScript(domScript);

		chrome.runtime.onMessage.addListener(function once(request) {
			if (request.name === 'script-status') {
				chrome.runtime.onMessage.removeListener('script-status', once);
				resolve(request);
			}
		});

		chrome.tabs.query(tabQuery || { active: true, currentWindow: true }, tabs => {
			chrome.tabs.executeScript(tabs[0].id, { code });
		});
	});
}

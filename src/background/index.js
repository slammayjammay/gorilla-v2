const generateScript = require('../helpers/generate-script');

chrome.runtime.onMessage.addListener((request, sender, respond) => {
	if (request.name === 'open-popup') {
		createWindow();
	} else if (request.name === 'run-script') {
		getScript(request.scriptName).then(code => {
			let tabQuery;

			if (!request.tabQuery && !sender.tab) {
				tabQuery = { active: true, currentWindow: true };
			} else if (request.tabQuery) {
				tabQuery = request.tabQuery;
			} else if (sender.tab) {
				tabQuery = { id: sender.tab.id };
			}

			runScript(code, tabQuery).then(respond);
		});
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

	if (data.gorilla && data.gorilla.windowOptions) {
		let json;
		try {
			json = JSON.parse(decodeURIComponent(data.gorilla.windowOptions));
		} catch(e) {}
		options = json || options;
	}

	chrome.windows.create({ ...options, url: 'popup.html' });
}

async function getScript(name) {
	const data = await new Promise(r => chrome.storage.local.get(r));
	return decodeURIComponent(data.gorilla.scripts[name].script);
}

function runScript(code, tabQuery = { active: true, currentWindow: true }) {
	return new Promise(async resolve => {
		code = generateScript(code);

		chrome.runtime.onMessage.addListener(function once(request) {
			if (request.name === 'script-status') {
				chrome.runtime.onMessage.removeListener(once);
				resolve(request);
			}
		});

		if (tabQuery.id) {
			return chrome.tabs.executeScript(tabQuery.id, { code });
		}

		chrome.tabs.query(tabQuery || { active: true, currentWindow: true }, tabs => {
			chrome.tabs.executeScript(tabs[0].id, { code });
		});
	});
}

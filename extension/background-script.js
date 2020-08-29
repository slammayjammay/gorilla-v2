chrome.browserAction.onClicked.addListener(tab => {
	chrome.tabs.executeScript(tab.id, { file: './built/events.js' });
	chrome.tabs.executeScript(tab.id, { file: './built/dom.js' });
});

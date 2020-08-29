const eventBus = require('../dom/event-bus');

if (!document.getElementById('gorilla').hasAttribute('data-init')) {
	eventBus.on('extension-base-get', () => {
		const url = chrome.extension.getURL('/');
		eventBus.emit('extension-base-get:done', url);
	});

	eventBus.on('storage-get', () => {
		chrome.storage.local.get('gorilla', data => {
			eventBus.emit('storage-get:done', data.gorilla || '{}');
		});
	});

	eventBus.on('storage-set', (e) => {
		chrome.storage.local.set({ gorilla: e.detail }, () => {
			eventBus.emit('storage-set:done');
		});
	});
}

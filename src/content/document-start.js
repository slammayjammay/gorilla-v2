document.documentElement.addEventListener('gorilla-script-status', e => {
	const error = e.detail ? { message: e.detail.message, stack: e.detail.stack } : null;
	chrome.runtime.sendMessage({ name: 'script-status', error });
});

require('./helpers/run-user-scripts')('document-start');

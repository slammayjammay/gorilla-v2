module.exports = (script) => {
	return `(${contentScript})("${encodeURIComponent(script)}");`;
};

function contentScript(domScript) {
	const html = document.documentElement;

	html.addEventListener('gorilla-script-status', function once(e) {
		html.removeEventListener('gorilla-script-status', once);
		const error = e.detail ? { message: e.detail.message, stack: e.detail.stack } : null;
		chrome.runtime.sendMessage({ name: 'script-status', error });
	});

	if (!document.getElementById('gorilla')) {
		const gorilla = document.createElement('div');
		gorilla.id = 'gorilla';
		document.body.append(gorilla);
	}

	const script = document.createElement('script');
	script.innerHTML = decodeURIComponent(domScript);
	document.getElementById('gorilla').append(script);
}

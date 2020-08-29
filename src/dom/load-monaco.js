const eventBus = require('./event-bus');

module.exports = () => {
	return new Promise(resolve => {
		eventBus.once('extension-base-get:done', e => {
			const monacoBase = `${e.detail}node_modules/monaco-editor/min`;

			const temp = window.define;
			window.define = null;

			const script = document.createElement('script');
			script.src = `${monacoBase}/vs/loader.js`;
			document.getElementById('gorilla').append(script);

			script.addEventListener('load', () => {
				// https://github.com/Microsoft/monaco-editor/blob/master/docs/integrate-amd-cross.md#option-1-use-a-data-worker-uri
				window.MonacoEnvironment = {
					getWorkerUrl: () => `data:text/javascript;charset=utf-8,${encodeURIComponent(`
						self.MonacoEnvironment = { baseUrl: '${monacoBase}' };
						importScripts('${monacoBase}/vs/base/worker/workerMain.js');`
					)}`
				};

				window.require.config({ paths: { vs: `${monacoBase}/vs` } });

				window.require(['vs/editor/editor.main'], () => {
					resolve(window.monaco);
				});

				// TODO: when does loading stop?
				setTimeout(() => window.define = temp, 5000);
			});
		});

		eventBus.emit('extension-base-get');
	});
};

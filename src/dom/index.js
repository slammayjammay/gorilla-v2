const Gorilla = require('./Gorilla');

if (!window._gorilla) {
	try {
		window._gorilla = new Gorilla();
	} catch(e) {
		console.log(e);
	}
} else {
	window._gorilla.toggle();
}

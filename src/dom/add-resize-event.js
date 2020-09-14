// expects el to have CSS `resize`
module.exports = (el, debounce = 100) => {
	const { style } = el;
	let id;

	const debouncer = (...args) => {
		clearTimeout(id);
		id = setTimeout(() => cb(...args), debounce);
	};

	const cb = (mutationsList) => {
		let resized = false;

		for (const mutation of mutationsList) {
			if (mutation.attributeName === 'style') {
				['width', 'height'].forEach(prop => {
					if (el.getAttribute(`data-prev-${prop}`) !== style[prop]) {
						resized = true;
					}

					el.setAttribute(`data-prev-${prop}`, style[prop])
				});
			}
		}

		if (resized) {
			el.dispatchEvent(new CustomEvent('resize'));
		}
	};

	const observer = new MutationObserver(debouncer);
	observer.observe(el, { attributes: true });
};

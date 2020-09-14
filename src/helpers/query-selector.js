module.exports = {
	$: (sel, node = document) => { return node.querySelector(sel); },
	$$: (sel, node = document) => { return node.querySelectorAll(sel); }
};

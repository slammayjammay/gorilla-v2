const { $, $$ } = require('../helpers/query-selector');

module.exports = class TabSelection {
	constructor() {
		this.el = this.createEl();
		this.populateTabs();
		this.addEvents();
	}

	createEl() {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<div>
				<select class="tab-hrefs"></select>
				<button class="button last-active" title="Get last active tab">last active</button>
				<button class="button refresh" title="refresh">&orarr;</button>
			</div>
		`;
		return dummy.children[0];
	}

	populateTabs() {
		const select = $('.tab-hrefs', this.el);
		Array.from(select.children).forEach(el => el.remove());

		chrome.tabs.query({ currentWindow: false }, tabs => {
			tabs.forEach(tab => {
				const option = document.createElement('option');
				option.setAttribute('data-url', tab.url);
				option.setAttribute('data-index', tab.index);
				option.textContent = tab.url;
				option.selected = tab.selected;
				select.append(option);
			});
		});
	}

	addEvents() {
		$('.last-active', this.el).addEventListener('click', () => {
			chrome.tabs.query({ currentWindow: false, active: true }, tabs => {
				const option = $(`option[data-url="${tabs[0].url}"]`, this.el);
				option.selected = true;
			});
		});

		$('.refresh', this.el).addEventListener('click', () => this.populateTabs());
	}

	getSelectedTab() {
		const select = $('select', this.el);
		const option = select.children[select.selectedIndex];
		return {
			url: option.getAttribute('data-url'),
			index: parseInt(option.getAttribute('data-index'))
		};
	}
};

const { $, $$ } = require('./query-selector');
const Draggable = require('./Draggable');
const eventBus = require('./event-bus');

module.exports = class Window {
	constructor(tagname) {
		this.onMaximize = this.onMaximize.bind(this);
		this.onExit = this.onExit.bind(this);
		this.onMinimize = this.onMinimize.bind(this);
		this.onOpacity = this.onOpacity.bind(this);

		this.el = this.createEl(tagname);

		const bar = $('.bar', this.el);
		this.draggable = new Draggable(this.el, e => e.target === bar);
		this.draggable.setPosition(10, 10);

		$('.bar', this.el).addEventListener('dblclick', this.onMaximize);
		$('.exit', this.el).addEventListener('click', this.onExit);
		$('.minimize', this.el).addEventListener('click', this.onMinimize);
		$('.slider', this.el).addEventListener('input', this.onOpacity);

		this.lookForResize();
	}

	createEl(tagname = 'div') {
		const dummy = document.createElement('div');
		dummy.innerHTML = `
			<${tagname} class="gorilla-window">
				<div class="bar">
					<button class="control-button exit" title="Exit">×</button>
					<button class="control-button minimize" title="Minimize">−</button>
					<input class="control-button slider" title="Adjust opacity" type="range" value="100" min="30"/>
				</div>
				<div class="resizeable"></div>
			</${tagname}>
		`;
		return dummy.children[0];
	}

	lookForResize() {
		const resizeable = $('.resizeable', this.el);
		const { style } = resizeable;

		const cb = (mutationsList) => {
			let resized = false;

			for (const mutation of mutationsList) {
				if (mutation.attributeName === 'style') {
					['width', 'height'].forEach(prop => {
						if (resizeable.getAttribute(`data-prev-${prop}`) !== style[prop]) {
							resized = true;
						}

						resizeable.setAttribute(`data-prev-${prop}`, style[prop])
					});
				}
			}

			if (resized) {
				this.onResize();
			}
		};

		const observer = new MutationObserver(cb);
		observer.observe(resizeable, { attributes: true });
	}

	onResize() {
		eventBus.emit('resize');
	}

	onMaximize(e) {
		if (e.target !== e.currentTarget) {
			return;
		}

		const resizeable = $('.resizeable', this.el);
		const bar = $('.bar', this.el);
		const [x, y] = this.draggable.getPosition();
		const targetWidth = innerWidth - 20;
		const targetHeight = innerHeight - 20 - bar.offsetHeight;

		if (
			x !== 10 ||
			y !== 10 ||
			resizeable.offsetWidth !== targetWidth ||
			resizeable.offsetHeight !== targetHeight
		) {
			const prevDimensions = [
				x,
				y,
				resizeable.offsetWidth,
				resizeable.offsetHeight
			];
			resizeable.setAttribute('data-previous-dimensions', prevDimensions.join(','));
			this.draggable.setPosition(10, 10);
			resizeable.style.width = `${targetWidth}px`;
			resizeable.style.height = `${targetHeight}px`;
		} else if (resizeable.hasAttribute('data-previous-dimensions')) {
			const dimensions = resizeable.getAttribute('data-previous-dimensions');
			const match = /([^,]*),([^,]*),([^,]*),([^,]*)/.exec(dimensions);
			const [_, x, y, width, height] = match.map(string => parseFloat(string));
			this.draggable.setPosition(x, y);
			resizeable.style.width = `${width}px`;
			resizeable.style.height = `${height}px`;
		}
	}

	onExit() {
		eventBus.emit('remove');
	}

	onMinimize() {
		const { style } = $('.resizeable', this.el);
		if (parseFloat(style.height) === 0) {
			style.height = style.getPropertyValue('--height');
			style.setProperty('--height', '');
		} else {
			style.setProperty('--height', style.height);
			style.height = '0';
		}
	}

	onOpacity(e) {
		this.el.style.opacity = parseFloat(e.currentTarget.value) / 100;
	}
};


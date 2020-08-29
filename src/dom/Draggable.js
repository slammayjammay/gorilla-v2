module.exports = class Draggable {
	constructor(el, filter) {
		this.el = el;
		this.filter = filter;

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);

		this.isDragging = false;
		this.startX = this.startY = null;
		[this.x, this.y] = this.getPosition();
		this.setPosition(this.x, this.y);

		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mouseup', this.onMouseUp);
		window.addEventListener('mousemove', this.onMouseMove);
	}

	getPosition() {
		if (!this.el.style.transform) {
			return [0, 0];
		}

		const reg = /translate\(([\d\.\-]+)px,\s*([\d\.\-]+)px\)/;
		return reg.exec(this.el.style.transform).slice(1, 3).map(n => parseFloat(n));
	}

	setPosition(x, y) {
		this.el.style.transform = `translate(${x}px, ${y}px)`;

		if (!this.isDragging) {
			[this.x, this.y] = [x, y];
		}
	}

	onMouseDown(e) {
		if (this.filter && !this.filter(e)) {
			return;
		}

		this.isDragging = true;
		this.startX = e.clientX;
		this.startY = e.clientY;

		this.el.dispatchEvent(new Event('dragStart'));
	}

	onMouseUp(e) {
		if (!this.isDragging) {
			return;
		}

		this.isDragging = false;

		this.x = this.x + e.clientX - this.startX;
		this.y = this.y + e.clientY - this.startY;

		this.startX = this.startY = null;

		this.el.dispatchEvent(new Event('dragEnd'));
	}

	onMouseMove(e) {
		if (!this.isDragging) {
			return;
		}

		const x = this.x + e.clientX - this.startX;
		const y = this.y + e.clientY - this.startY;
		this.setPosition(x, y);
	}

	destroy() {
		window.removeEventListener('mousedown', this.onMouseDown);
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousemove', this.onMouseMove);
	}
};

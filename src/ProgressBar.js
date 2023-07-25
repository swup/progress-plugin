export default class ProgressBar {
	styleElement = null;
	progressElement = null;

	value = 0;
	visible = false;
	hiding = false;
	trickleInterval = null;

	constructor({
		className = 'progress-bar',
		styleAttr = 'data-progressbar-styles data-swup-theme',
		animationDuration = 300,
		minValue = 0.1,
		initialValue = 0.25,
		trickleValue = 0.03
	} = {}) {
		this.className = className;
		this.styleAttr = styleAttr;
		this.animationDuration = animationDuration;
		this.minValue = minValue;
		this.initialValue = initialValue;
		this.trickleValue = trickleValue;

		this.styleElement = this.createStyleElement();
		this.progressElement = this.createProgressElement();
	}

	get defaultStyles() {
		return `
		.${this.className} {
				position: fixed;
				display: block;
				top: 0;
				left: 0;
				height: 3px;
				background-color: black;
				z-index: 9999;
				transition:
					width ${this.animationDuration}ms ease-out,
					opacity ${this.animationDuration / 2}ms ${this.animationDuration / 2}ms ease-in;
				transform: translate3d(0, 0, 0);
			}
		`;
	}

	show() {
		if (!this.visible) {
			this.visible = true;
			this.installStyleElement();
			this.installProgressElement();
			this.startTrickling();
		}
	}

	hide() {
		if (this.visible && !this.hiding) {
			this.hiding = true;
			this.fadeProgressElement(() => {
				this.uninstallProgressElement();
				this.stopTrickling();
				this.visible = false;
				this.hiding = false;
			});
		}
	}

	setValue(value) {
		this.value = Math.min(1, Math.max(this.minValue, value));
		this.refresh();
	}

	// Private

	installStyleElement() {
		document.head.insertBefore(this.styleElement, document.head.firstChild);
	}

	installProgressElement() {
		this.progressElement.style.width = '0%';
		this.progressElement.style.opacity = '1';
		document.documentElement.insertBefore(this.progressElement, document.body);
		this.progressElement.scrollTop = 0; // Force reflow to ensure initial style takes effect
		this.setValue(Math.random() * this.initialValue);
	}

	fadeProgressElement(callback) {
		this.progressElement.style.opacity = '0';
		setTimeout(callback, this.animationDuration * 1.5);
	}

	uninstallProgressElement() {
		if (this.progressElement.parentNode) {
			document.documentElement.removeChild(this.progressElement);
		}
	}

	startTrickling() {
		if (!this.trickleInterval) {
			this.trickleInterval = window.setInterval(this.trickle, this.animationDuration);
		}
	}

	stopTrickling() {
		window.clearInterval(this.trickleInterval);
		delete this.trickleInterval;
	}

	trickle = () => {
		const advance = Math.random() * this.trickleValue;
		this.setValue(this.value + advance);
	};

	refresh() {
		requestAnimationFrame(() => {
			this.progressElement.style.width = `${this.value * 100}%`;
		});
	}

	createStyleElement() {
		const element = document.createElement('style');
		this.styleAttr.split(' ').forEach((attr) => element.setAttribute(attr, ''));
		element.textContent = this.defaultStyles;
		return element;
	}

	createProgressElement() {
		const element = document.createElement('div');
		element.className = this.className;
		return element;
	}
}

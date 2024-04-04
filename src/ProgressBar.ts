export default class ProgressBar {
	value: number = 0;
	visible: boolean = false;
	hiding: boolean = false;

	className: string = 'progress-bar';
	styleAttr: string = 'data-progressbar-styles data-swup-theme';
	animationDuration: number = 300;
	minValue: number = 0.1;
	initialValue: number = 0.25;
	trickleValue: number = 0.03;
	trickleInterval?: number;

	styleElement: HTMLStyleElement;
	progressElement: HTMLDivElement;

	constructor({
		className,
		styleAttr,
		animationDuration,
		minValue,
		initialValue,
		trickleValue
	}: {
		className?: string;
		styleAttr?: string;
		animationDuration?: number;
		minValue?: number;
		initialValue?: number;
		trickleValue?: number;
	} = {}) {
		if (className !== undefined) {
			this.className = String(className);
		}
		if (styleAttr !== undefined) {
			this.styleAttr = String(styleAttr);
		}
		if (animationDuration !== undefined) {
			this.animationDuration = Number(animationDuration);
		}
		if (minValue !== undefined) {
			this.minValue = Number(minValue);
		}
		if (initialValue !== undefined) {
			this.initialValue = Number(initialValue);
		}
		if (trickleValue !== undefined) {
			this.trickleValue = Number(trickleValue);
		}

		this.styleElement = this.createStyleElement();
		this.progressElement = this.createProgressElement();
	}

	get defaultStyles(): string {
		return `
		.${this.className} {
			position: fixed;
			display: block;
			top: 0;
			left: 0;
      width: 100%;
			height: 3px;
			background-color: black;
			z-index: 9999;
			transition:
				transform ${this.animationDuration}ms ease-out,
				opacity ${this.animationDuration / 2}ms ${this.animationDuration / 2}ms ease-in;
      transform: translate3d(0, 0, 0);
      transform-origin: 0;
		}
	`;
	}

	show(): void {
		if (!this.visible) {
			this.visible = true;
			this.installStyleElement();
			this.installProgressElement();
			this.startTrickling();
		}
	}

	hide(): void {
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

	setValue(value: number): void {
		this.value = Math.min(1, Math.max(this.minValue, value));
		this.refresh();
	}

	private installStyleElement(): void {
		document.head.insertBefore(this.styleElement!, document.head.firstChild);
	}

	private installProgressElement(): void {
		this.progressElement.style.transform = 'translate3d(0, 0, 0) scaleX(0)';
		this.progressElement.style.opacity = '1';
		document.documentElement.insertBefore(this.progressElement!, document.body);
		this.progressElement.scrollTop = 0; // Force reflow to ensure the initial style takes effect
		this.setValue(Math.random() * this.initialValue);
	}

	private fadeProgressElement(callback: () => void): void {
		this.progressElement.style.opacity = '0';
		setTimeout(callback, this.animationDuration * 1.5);
	}

	private uninstallProgressElement(): void {
		if (this.progressElement.parentNode) {
			document.documentElement.removeChild(this.progressElement!);
		}
	}

	private startTrickling(): void {
		if (!this.trickleInterval) {
			this.trickleInterval = window.setInterval(this.trickle, this.animationDuration);
		}
	}

	private stopTrickling(): void {
		window.clearInterval(this.trickleInterval);
		delete this.trickleInterval;
	}

	private trickle = (): void => {
		const advance = Math.random() * this.trickleValue;
		this.setValue(this.value + advance);
	};

	private refresh(): void {
		requestAnimationFrame(() => {
			this.progressElement.style.transform = `translate3d(0, 0, 0) scaleX(${this.value})`;
		});
	}

	private createStyleElement(): HTMLStyleElement {
		const element = document.createElement('style');
		this.styleAttr.split(' ').forEach((attr) => element.setAttribute(attr, ''));
		element.textContent = this.defaultStyles;
		return element;
	}

	private createProgressElement(): HTMLDivElement {
		const element = document.createElement('div');
		element.className = this.className;
    element.setAttribute('aria-hidden', 'true');
		return element;
	}
}

import Plugin from '@swup/plugin';
import ProgressBar from './ProgressBar';

export default class SwupProgressPlugin extends Plugin {
	name = 'SwupProgressPlugin';

	defaults = {
		className: 'swup-progress-bar',
		delay: 300,
		transition: undefined,
		minValue: undefined,
		initialValue: undefined,
		hideImmediately: true
	};

	constructor(options = {}) {
		super();

		this.options = { ...this.defaults, ...options };

		this.showProgressBarTimeout = null;
		this.hideProgressBarTimeout = null;

		this.progressBar = new ProgressBar({
			className: this.options.className,
			animationDuration: this.options.transition,
			minValue: this.options.minValue,
			initialValue: this.options.initialValue
		});
	}

	mount() {
		this.swup.hooks.on('visit:start', this.startShowingProgress);
		this.swup.hooks.on('content:replace', this.stopShowingProgress);
	}

	unmount() {
		this.swup.hooks.off('visit:start', this.startShowingProgress);
		this.swup.hooks.off('content:replace', this.stopShowingProgress);
	}

	startShowingProgress = () => {
		this.progressBar.setValue(0);
		this.showProgressBarAfterDelay();
	};

	stopShowingProgress = () => {
		this.progressBar.setValue(1);
		if (this.options.hideImmediately) {
			this.hideProgressBar();
		} else {
			this.finishAnimationAndHideProgressBar();
		}
	};

	showProgressBar = () => {
		this.cancelHideProgressBarTimeout();
		this.progressBar.show();
	};

	showProgressBarAfterDelay = () => {
		this.cancelShowProgressBarTimeout();
		this.cancelHideProgressBarTimeout();
		this.showProgressBarTimeout = window.setTimeout(this.showProgressBar, this.options.delay);
	};

	hideProgressBar = () => {
		this.cancelShowProgressBarTimeout();
		this.progressBar.hide();
	};

	finishAnimationAndHideProgressBar = () => {
		this.cancelShowProgressBarTimeout();
		this.hideProgressBarTimeout = window.setTimeout(this.hideProgressBar, this.options.transition);
	};

	cancelShowProgressBarTimeout = () => {
		window.clearTimeout(this.showProgressBarTimeout);
		delete this.showProgressBarTimeout;
	};

	cancelHideProgressBarTimeout = () => {
		window.clearTimeout(this.hideProgressBarTimeout);
		delete this.hideProgressBarTimeout;
	};
}

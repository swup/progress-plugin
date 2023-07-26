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
		finishAnimation: true
	};

	showProgressBarTimeout = null;
	hideProgressBarTimeout = null;

	constructor(options = {}) {
		super();
		this.options = { ...this.defaults, ...options };
		const { className, minValue, initialValue, transition: animationDuration } = this.options;
		this.progressBar = new ProgressBar({ className, minValue, initialValue, animationDuration });
	}

	mount() {
		this.on('visit:start', this.startShowingProgress);
		this.on('page:view', this.stopShowingProgress);
	}

	startShowingProgress() {
		this.progressBar.setValue(0);
		this.showProgressBarAfterDelay();
	}

	stopShowingProgress() {
		this.progressBar.setValue(1);
		if (this.options.finishAnimation) {
			this.finishAnimationAndHideProgressBar();
		} else {
			this.hideProgressBar();
		}
	}

	showProgressBar() {
		this.cancelHideProgressBarTimeout();
		this.progressBar.show();
	}

	showProgressBarAfterDelay() {
		this.cancelShowProgressBarTimeout();
		this.cancelHideProgressBarTimeout();
		this.showProgressBarTimeout = window.setTimeout(this.showProgressBar.bind(this), this.options.delay);
	}

	hideProgressBar() {
		this.cancelShowProgressBarTimeout();
		this.progressBar.hide();
	}

	finishAnimationAndHideProgressBar() {
		this.cancelShowProgressBarTimeout();
		this.hideProgressBarTimeout = window.setTimeout(this.hideProgressBar.bind(this), this.options.transition);
	}

	cancelShowProgressBarTimeout() {
		window.clearTimeout(this.showProgressBarTimeout);
		delete this.showProgressBarTimeout;
	}

	cancelHideProgressBarTimeout() {
		window.clearTimeout(this.hideProgressBarTimeout);
		delete this.hideProgressBarTimeout;
	}
}

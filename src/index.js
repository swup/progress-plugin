import Plugin from '@swup/plugin';
import ProgressBar from './ProgressBar';

export default class SwupProgressPlugin extends Plugin {
	name = 'SwupProgressPlugin';

	constructor(options = {}) {
		super();
		const defaultOptions = {
			className: 'swup-progress-bar',
			delay: 300,
			transition: undefined,
			minValue: undefined,
			initialValue: undefined,
			hideImmediately: true
		};

		this.options = {
			...defaultOptions,
			...options
		};

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
		this.swup.on('transitionStart', this.startShowingProgress);
		this.swup.on('contentReplaced', this.stopShowingProgress);
	}

	unmount() {
		this.swup.off('transitionStart', this.startShowingProgress);
		this.swup.off('contentReplaced', this.stopShowingProgress);
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

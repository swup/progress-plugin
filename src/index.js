import Plugin from '@swup/plugin';
import ProgressBar from './ProgressBar';

export default class SwupProgressPlugin extends Plugin {
	name = 'SwupProgressPlugin';

	constructor(options) {
		super();
		const defaultOptions = {
			className: 'swup-progress-bar',
			transition: 300,
			delay: 300
		};

		this.options = {
			...defaultOptions,
			...options
		};

		this.progressBarTimeout = null;
		this.progressBar = new ProgressBar({
			className: this.options.className,
			animationDuration: this.options.transition
		});
	}

	mount() {
		this.swup.on('transitionStart', this.startShowingProgress);
		this.swup.on('contentReplaced', this.stopShowingProgress);
	}

	unmount() {
		this.swup.off('transitionStart', this.startShowingProgress);
		this.swup.on('contentReplaced', this.stopShowingProgress);
	}

	startShowingProgress = () => {
		this.progressBar.setValue(0);
		this.showProgressBarAfterDelay();
	};

	stopShowingProgress = () => {
		this.progressBar.setValue(1);
		this.hideProgressBar();
	};

	showProgressBar = () => {
		this.progressBar.show();
	};

	showProgressBarAfterDelay = () => {
		this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.options.delay);
	};

	hideProgressBar = () => {
		this.progressBar.hide();
		if (this.progressBarTimeout != null) {
			window.clearTimeout(this.progressBarTimeout);
			delete this.progressBarTimeout;
		}
	};
}

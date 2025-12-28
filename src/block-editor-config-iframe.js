/* global wp */

/**
 * Customisations for the block editor iframe
 */
wp.domReady(() => {
	// Add HTML so that the post title inherits Comet page header styling
	wrapPostTitle();
});

function wrapPostTitle() {
	const observer = new MutationObserver(function (mutations, obs) {
		const titleElement = document.querySelector('.editor-visual-editor__post-title-wrapper');

		// Check if already wrapped to avoid double-wrapping
		if (titleElement && !titleElement.closest('.page-header')) {
			const wrapper = document.createElement('section');
			wrapper.classList.add('page-header');
			wrapper.setAttribute('data-size', comet.defaults?.PageHeader?.size || 'contained');
			wrapper.setAttribute('data-color-theme', comet.defaults?.PageHeader?.colorTheme || 'primary');
			wrapper.setAttribute('data-background', comet.defaults?.PageHeader?.backgroundColor || 'white');

			const container = document.createElement('div');
			container.classList.add('page-header__container');

			// Insert wrapper before the title element
			titleElement.parentNode.insertBefore(wrapper, titleElement);

			// Move (not clone) the title element into the container
			wrapper.appendChild(container);
			container.appendChild(titleElement);

			obs.disconnect();
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

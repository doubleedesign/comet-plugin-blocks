/* global wp */
/* global comet */

/**
 * Customisations for the block editor interface broadly
 * (not individual blocks)
 */
document.addEventListener('DOMContentLoaded', async function () {
	// Disable full-screen mode by default
	const isFullscreenMode = wp.data.select('core/edit-post').isFeatureActive('fullscreenMode');
	if (isFullscreenMode) {
		wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode');
	}

	wp.domReady(() => {
		const { select, dispatch } = wp.data;

		// Open list view by default
		const listViewIsOpen = select('core/editor').isListViewOpened();
		if (!listViewIsOpen) {
			dispatch('core/editor').setIsListViewOpened(true);
		}

		// Add HTML so that the post title inherits Comet page header styling
		wrapPostTitle();

		// Collapse some metaboxes by default
		collapseMetaboxesByDefault(['breadcrumb-settings', 'tsf-inpost-box', 'acf-group_67ca2ef6a0243']);

	});
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

function collapseMetaboxesByDefault(metaboxIds) {
	function closeMetaboxes() {
		metaboxIds.forEach(function (id) {
			const metabox = document.getElementById(id);
			if (metabox && !metabox.classList.contains('closed')) {
				metabox.classList.add('closed');
			}
		});
	}

	// Try immediately
	closeMetaboxes();

	// Watch for meta boxes being added async
	const observer = new MutationObserver(closeMetaboxes);
	const container = document.querySelector('.metabox-location-normal, .metabox-location-side, .metabox-location-advanced');

	if (container) {
		observer.observe(container, { childList: true, subtree: true });

		// Stop observing after a few seconds
		setTimeout(function () {
			observer.disconnect();
		}, 5000);
	}
}

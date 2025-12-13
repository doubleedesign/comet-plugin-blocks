/* global wp */

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

	// Open list view by default
	wp.domReady(() => {
		const { select, dispatch } = wp.data;
		const listViewIsOpen = select('core/editor').isListViewOpened();

		if (!listViewIsOpen) {
			dispatch('core/editor').setIsListViewOpened(true);
		}
	});
});

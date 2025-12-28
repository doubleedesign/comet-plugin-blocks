/* global wp */
/* global comet */
/* global acf */

/**
 * Customisations for the block editor interface broadly
 * (not individual blocks)
 */

wp.domReady(() => {
	const { select, dispatch } = wp.data;

	// Open list view by default and remove the preference setting from the DOM when the preferences modal is opened
	const listViewIsOpen = select('core/editor').isListViewOpened();
	if (!listViewIsOpen) {
		dispatch('core/editor').setIsListViewOpened(true);
	}
	hackPreferencesModal();

	// Add HTML so that the post title inherits Comet page header styling
	wrapPostTitle();

	// Collapse some metaboxes by default
	collapseMetaboxesByDefault(['breadcrumb-settings', 'tsf-inpost-box', 'acf-group_67ca2ef6a0243']);

	// On ACF preview load
	acf.addAction('render_block_preview', function (element, block) {
		if (block.name === 'comet/accordion') {
			window.dispatchEvent(new Event('ReloadVueAccordions'));
		}
		if (block.name === 'comet/tabs') {
			window.dispatchEvent(new Event('ReloadVueTabs'));
		}
		if (block.name === 'comet/responsive-panels') {
			window.dispatchEvent(new Event('ReloadVueResponsivePanels'));
		}
		
		// Hackily remove the responsive preview menu because the non-desktop preview mode breaks ACF block previews
		const observer = new MutationObserver(function () {
			const btn = document.querySelector('.editor-preview-dropdown');
			if (btn) btn.remove();
		});
		observer.observe(document.body, { childList: true, subtree: true });
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

function hackPreferencesModal() {
	const modalObserver = new MutationObserver(function (mutations, obs) {
		const modal = document.querySelector('.preferences-modal');
		if (modal) {
			watchPreferencesModalContent(modal);
			obs.disconnect();
		}
	});

	modalObserver.observe(document.body, { childList: true, subtree: true });

	function watchPreferencesModalContent(modal) {
		const contentObserver = new MutationObserver(function (mutations, obs) {
			const tabs = modal.querySelector('.preferences__tabs');
			if (tabs) {
				removePreferenceByLabelText(tabs, 'Always open List View');
				removePreferenceByLabelText(tabs, 'Use theme styles');
			}
		});

		contentObserver.observe(modal, { childList: true, subtree: true });
	}
}

function removePreferenceByLabelText(parent, labelText) {
	setTimeout(() => {
		const preferences = parent.querySelectorAll('.preference-base-option');
		preferences.forEach(function (preference) {
			const label = preference.querySelector('label');
			if (label.textContent.trim() === labelText) {
				preference.remove();
			}
		});
	}, 100);
}


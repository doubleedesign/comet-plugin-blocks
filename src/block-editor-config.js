/* global wp */
/* global comet */
/* global acf */
/* global tinymce */

/**
 * Customisations for the block editor interface broadly
 * (not individual blocks)
 */

wp.domReady(() => {
	const { select, dispatch } = wp.data;

	function unsubscribe() {
		wp.data.subscribe(function () {
		});
	}

	// Open list view by default and remove the preference setting from the DOM when the preferences modal is opened
	const listViewIsOpen = select('core/editor').isListViewOpened();
	if (!listViewIsOpen) {
		dispatch('core/editor').setIsListViewOpened(true);
	}
	hackPreferencesModal();

	// Collapse some metaboxes by default
	collapseMetaboxesByDefault(['breadcrumb-settings', 'tsf-inpost-box', 'acf-group_67ca2ef6a0243']);

	acf.addAction('render_block_preview', function (element, block) {
		let blockCount = select('core/block-editor').getBlockCount();
		const blocks = select('core/block-editor').getBlocks();

		// On ACF block add, open the v3 block editing panel automatically
		wp.data.subscribe(function () {
			const newBlockCount = select('core/block-editor').getBlockCount();
			if (newBlockCount > blockCount) {
				// A new block has been added
				const updatedBlocks = select('core/block-editor').getBlocks();
				const newBlock = updatedBlocks.find(b => !blocks.some(ob => ob.clientId === b.clientId));
				const panel = document.querySelector('.acf-block-form-modal');
				const trigger = document.querySelector('.acf-blocks-open-expanded-editor-btn');
				// If the new block was found successfully, is active, and the ACF block editing panel is not already open, open it by "clicking" the trigger
				if (!panel && newBlock && trigger && newBlock?.name?.startsWith('comet/')) {
					trigger.click();
					unsubscribe();
					blockCount = newBlockCount; // Update block count to prevent it re-opening when closed
				}
			}
		});

		// If there is only one block on the page, it is an ACF block, and it is empty,
		// open the block editing panel automatically (useful for new pages)
		if (blockCount === 1 && block.name.startsWith('comet/')) {
			let isProbablyEmpty = true;
			if (block?.data) {
				isProbablyEmpty = Object.entries(block?.data)
					?.filter(([key, value]) => !key.startsWith('_'))
					?.every(([key, value]) => {
						return !value || (Array.isArray(value) && value.length === 0);
					});
			}

			if (isProbablyEmpty) {
				element.focus();
				setTimeout(() => {
					const panel = document.querySelector('.acf-block-form-modal');
					const trigger = document.querySelector('.acf-blocks-open-expanded-editor-btn');
					if (!panel && trigger) {
						trigger.click();
					}
				}, 100);
			}
		}
	});


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
	});

	// On mount of the ACF block editing form that opens in an overlay panel as of ACF Blocks v3
	// @see https://www.advancedcustomfields.com/blog/acf-6-6-released/
	acf.addAction('remount_field/type=wysiwyg', function (field) {
		// Check if modal is open first (because remount action also fires at other times)
		const modal = document.querySelector('.acf-block-form-modal');
		if (modal) {
			// Get the client ID of the parent block
			const blockId = field?.$el[0]?.offsetParent?.getAttribute('data-block-id')?.replace('block_', '');
			if (blockId) {
				const attributes = select('core/block-editor').getBlockAttributes(blockId); // native block attributes
				const editor = tinymce.activeEditor;
				// Make sure the active editor matches the current field
				if (editor?.acf?.cid === field?.cid) {
					// Set TinyMCE body attributes based on the block attributes
					if (attributes?.colorTheme) {
						editor.getBody().setAttribute('data-color-theme', attributes.colorTheme);
					}
					if (attributes?.backgroundColor) {
						editor.getBody().setAttribute('data-background', attributes.backgroundColor);
					}
				}
			}
		}
	});
});


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
				removeTabByLabelText(tabs, 'Blocks');
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
	}, 50);
}

function removeTabByLabelText(parent, labelText) {
	setTimeout(() => {
		const tabs = parent.querySelectorAll('[role="tab"]');
		tabs.forEach(function (tab) {
			if (tab.textContent.trim() === labelText) {
				const tabPanelId = tab.getAttribute('aria-controls');
				const tabPanel = parent.querySelector(`[role='tabpanel']#${tabPanelId}`);

				tab.remove();
				tabPanel.remove();
			}
		});
	}, 50);
}


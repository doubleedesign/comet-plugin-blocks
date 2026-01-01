/* global wp */

/**
 * Make sure disallowed blocks are not shown in the inserter.
 * NFI why they still are with all the filtering done elsewhere that should result in correct settings being sent to the editor from PHP, but here we are.
 */
wp.domReady(() => {
	function unsubscribe() {
		wp.data.subscribe(function () {
		});
	}

	wp.data.subscribe(function () {
		const allowed = wp.data.select('core/block-editor').getSettings().allowedBlockTypes;

		// Wait for it to be an object (not a boolean), and then unregister all the disallowed blocks
		if (typeof allowed === 'object' && allowed !== null) {
			const registered = wp.blocks.getBlockTypes().map(block => block.name);
			registered.forEach(function (name) {
				if (!Object.values(allowed).includes(name)) {
					wp.blocks.unregisterBlockType(name);
				}
			});

			// Unsubscribe to prevent unnecessary future calls
			unsubscribe();
		}
	});

	// Use new API version for third-party blocks so that all blocks can use the new iframe-based editor experience
	wp.hooks.addFilter('blocks.registerBlockType', 'comet/use-new-block-api', (settings, name) => {
		if (name.startsWith('ninja-forms')) {
			return {
				...settings,
				apiVersion: 3,
			};
		}

		return settings;
	});

	// Customise other settings of some third-party blocks
	wp.hooks.addFilter('blocks.registerBlockType', 'comet/customise-third-party-blocks', (settings, name) => {
		if (name.startsWith('ninja-forms')) {
			return {
				...settings,
				category: 'widgets',
				// un-brand Ninja block titles
				title: settings.title.replace('Ninja Forms', '').replace('Ninja', '').trim(),
				// Add custom attributes that match Comet blocks for layout and theming
				// Note: This only affects the editor; this ALSO needs to be done in PHP for them to exist server-side
				attributes: {
					...settings.attributes,
					size: {
						'type': 'string',
						'default': 'contained'
					},
					colorTheme: {
						'type': 'string',
						'default': 'primary'
					}
				}
			};
		}

		return settings;
	});
});

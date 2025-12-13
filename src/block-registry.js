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

	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'comet/customise-block-categories',
		(settings, name) => {
			// Change category for a specific block
			if (name.startsWith('ninja-forms')) {
				return {
					...settings,
					category: 'misc',
				};
			}

			return settings;
		}
	);
});

import { LayoutControls } from '../LayoutControls/LayoutControls.dist.js';
import { ColorControls } from '../ColorControls/ColorControls.dist.js';
import { BLOCKS_WITH_TINYMCE } from '../constants.dist.js';

/* global wp */
const {
	addFilter,
	addAction
} = wp.hooks;
const {
	InspectorControls
} = wp.blockEditor;

/** @type {{ PluginManager: import('tinymce').AddOnManager }} */
const tinymce = window.tinymce;

/**
 * Note: This file needs to be compiled (Rollup is configured for this)
 * and loaded into the editor via the enqueue_block_editor_assets PHP hook
 */
wp.domReady(() => {
	function unsubscribe() {
		wp.data.subscribe(function () {});
	}

	// Add attributes to the inner <body> of TinyMCE editors inside blocks on first load
	// (Changes are taken care of in the relevant attribute control components)
	wp.data.subscribe(() => {
		const blocks = wp.data.select('core/block-editor').getBlocks();
		if (blocks.length > 0) {
			unsubscribe(); // Stop listening once blocks are loaded

			// For each block with a TinyMCE editor, match the editor instance and set attributes
			blocks.forEach((block, index) => {
				if (BLOCKS_WITH_TINYMCE.includes(block.name)) {
					const clientId = block.clientId;
					// Split name after "acf-block_" up until the first [ to match the editor to the block
					const editor = tinymce?.editors.find(editor => editor.targetElm.name.slice(10, editor.targetElm.name.indexOf('[')) === clientId);
					if (editor) {
						const iframe = editor.iframeElement;
						if (iframe) {
							const iframeBody = iframe.contentDocument.body;
							iframeBody.setAttribute('data-color-theme', block.attributes?.colorTheme ?? '');
							iframeBody.setAttribute('data-background', block.attributes?.backgroundColor ?? '');
						}
					}
				}
			});
		}
	});
	addFilter('editor.BlockEdit', 'comet-plugin-blocks/custom-controls', BlockEdit => props => {
		return /*#__PURE__*/React.createElement('div', {
			className: 'comet-block-edit-wrapper',
			'data-block': props.name,
			'data-background': props?.attributes?.backgroundColor ?? comet?.globalBackground ?? 'white',
			'data-size': props?.attributes?.backgroundSize ?? 'fullwidth'
		}, /*#__PURE__*/React.createElement('div', {
			className: 'comet-plugin-blocks-custom-controls'
		}, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(LayoutControls, props), /*#__PURE__*/React.createElement(ColorControls, props))), /*#__PURE__*/React.createElement(BlockEdit, props));
	});
});
//# sourceMappingURL=CustomControlsWrapper.dist.js.map

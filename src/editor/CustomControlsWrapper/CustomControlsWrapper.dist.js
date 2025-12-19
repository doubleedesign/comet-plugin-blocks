import { LayoutControls } from '../LayoutControls/LayoutControls.dist.js';
import { ColorControls } from '../ColorControls/ColorControls.dist.js';

/* global wp */
const {
	addFilter
} = wp.hooks;
const {
	InspectorControls
} = wp.blockEditor;

/**
 * Note: This file needs to be compiled (Rollup is configured for this)
 * and loaded into the editor via the enqueue_block_editor_assets PHP hook
 */
wp.domReady(() => {
	addFilter('editor.BlockEdit', 'comet-plugin-blocks/custom-controls', BlockEdit => props => {
		return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement('div', {
			className: 'comet-plugin-blocks-custom-controls'
		}, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(LayoutControls, props), /*#__PURE__*/React.createElement(ColorControls, props))), /*#__PURE__*/React.createElement(BlockEdit, props));
	});
});
//# sourceMappingURL=CustomControlsWrapper.dist.js.map

/* global wp */
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { LayoutControls } from '../LayoutControls/LayoutControls.jsx';
import { ColorControls } from '../ColorControls/ColorControls.jsx';

/**
 * Note: This file needs to be compiled (Rollup is configured for this)
 * and loaded into the editor via the enqueue_block_editor_assets PHP hook
 */
wp.domReady(() => {
	addFilter(
		'editor.BlockEdit',
		'comet-plugin-blocks/custom-controls',
		(BlockEdit) => (props) => {
			return (
				<>
					<div className="comet-plugin-blocks-custom-controls">
						<InspectorControls>
							<LayoutControls {...props} />
							<ColorControls {...props} />
						</InspectorControls>
					</div>
					<BlockEdit {...props} />
				</>
			);
		});
});

/* global wp */
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { LayoutControls } from '../LayoutControls/LayoutControls.jsx';
import { ColorControls } from '../ColorControls/ColorControls.jsx';

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

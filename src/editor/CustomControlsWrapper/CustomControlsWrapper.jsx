/* global wp */
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { LayoutControls } from '../LayoutControls/LayoutControls.jsx';
import { ColorControls } from '../ColorControls/ColorControls.jsx';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

/**
 * Note: This file needs to be compiled (Rollup is configured for this)
 * and loaded into the editor via the enqueue_block_editor_assets PHP hook
 */
wp.domReady(() => {
	addFilter(
		'editor.BlockEdit',
		'comet-plugin-blocks/custom-controls',
		(BlockEdit) => (props) => {

			const BlockEditComponent = useMemo(() => {
				if (props?.name === 'ninja-forms/form') {
					return NinjaFormsControls;
				}

				return CometBlockEdit;
			}, [props?.name]);

			return (
				<div className="comet-block-edit-wrapper" data-block={props.name}>
					<BlockEditComponent BlockEdit={BlockEdit} {...props} />
				</div>
			);
		});
});


/**
 * Render BlockEdit component with controls for custom attributes
 * @param BlockEdit The original BlockEdit component
 * @param {Object} props The block edit props
 * @returns {JSX.Element}
 * @constructor
 */
function CometBlockEdit({ BlockEdit, ...props }) {
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
}

/**
 * Recreate the Ninja Form selector dropdown control so that it is wrapped in the same components as our custom controls,
 * and also enables us to use server-side rendering for the block preview instead of BlockEdit
 * (which would render both the default preview + the default form selector)
 * @param {Object} props The block edit props
 *
 * FIXME: This currently gets stuck on the loading spinner when rendering the form.
 */
function NinjaFormsControls(props) {
	const { name, attributes, setAttributes } = props;
	if (name !== 'ninja-forms/form') {
		return null;
	}

	const options = Object.values(window?.nfFormsBlock?.forms)?.map(({ formID, formTitle }) => ({
		label: `${formTitle} (ID: ${formID})`,
		value: formID,
	}));

	return (
		<>
			<div className="comet-plugin-blocks-custom-controls">
				<InspectorControls>
					<LayoutControls {...props} />
					<ColorControls {...props} />
					<PanelBody title="Content" initialOpen={true}>
						<SelectControl
							label="Form"
							size={'__unstable-large'}
							value={attributes.formID}
							options={options ?? []}
							onChange={(value) => {
								setAttributes({
									formID: parseInt(value),
									formTitle: options.find(option => option.value === parseInt(value))?.label || '',
								});
							}}
						/>
					</PanelBody>
				</InspectorControls>
			</div>
			<ServerSideRender block="ninja-forms/form" attributes={props.attributes}/>
		</>
	);
}

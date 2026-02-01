import { FieldTooltip } from '../FieldTooltip/FieldTooltip.jsx';
import { ToggleControl } from '@wordpress/components';

export const GalleryControls = ({ name, attributes, setAttributes }) => {
	if (name !== 'comet/gallery') {
		return null;
	}

	return (
		<>
			<ToggleControl
				checked={attributes.lightbox}
				label={
					<>
						<span>Enable lightbox</span>
						<FieldTooltip
							tooltip={'When a visitor clicks on an image, open a larger version in an overlay'}
						/>
					</>
				}
				onChange={(value) => setAttributes({ lightbox: value })}
			/>
			<ToggleControl
				checked={attributes.captions}
				label="Show image captions if available"
				onChange={(value) => setAttributes({ captions: value })}
			/>
		</>
	);
};

/* global wp */
/* eslint-disable max-len */
import { RangeControl } from '@wordpress/components';
import { FieldTooltip } from '../FieldTooltip/FieldTooltip.jsx';

export const ContentMaxWidth = ({ name, attributes, setAttributes }) => {
	if (!attributes?.contentMaxWidth) {
		return null;
	}

	const defaultValue = comet?.defaults?.[name.replace('comet/', '')]?.contentMaxWidth
		?? wp.data.select('core/blocks').getBlockType(name)?.attributes?.contentMaxWidth?.default
		?? 50;

	return (
		<RangeControl
			label={<>
				Content max width
				<FieldTooltip
					tooltip={'The preferred width of the inner content relative to the container on viewports large enough to accommodate it; may be wider on smaller viewports'}/>
			</>}
			__next40pxDefaultSize
			initialPosition={attributes.contentMaxWidth}
			onChange={(value) => setAttributes({ contentMaxWidth: value })}
			max={100}
			min={30}
			allowReset={true}
			resetFallbackValue={defaultValue}
		/>
	);
};

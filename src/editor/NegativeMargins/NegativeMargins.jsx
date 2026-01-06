import { PanelRow, BaseControl, __experimentalUnitControl } from '@wordpress/components';
import { FieldTooltip } from '../FieldTooltip/FieldTooltip';

export const NegativeMargins = ({ name, attributes, setAttributes }) => {
	// Checking against potentially empty attribute values causes problems here so we have to check actual block types :(
	if (name !== 'comet/image') {
		return null;
	}

	const UnitControl = __experimentalUnitControl;

	return (
		<BaseControl label={<>Negative margins <FieldTooltip
			tooltip={'Bring the elements above or below this block closer to sit on top of the image by the given amount; note that on smaller viewports this may be overridden to ensure the image remains visible'}
		/></>}>
			<PanelRow>
				<UnitControl
					label="Top"
					__next40pxDefaultSize
					max={0}
					value={attributes.negativeTopMargin}
					onChange={(value) => setAttributes({ negativeTopMargin: value })}
					onUnitChange={(unit) => setAttributes({ negativeTopMargin: `${parseFloat(attributes.negativeTopMargin)}${unit}` })}
				/>
				<UnitControl
					label="Bottom"
					__next40pxDefaultSize
					max={0}
					value={attributes.negativeBottomMargin}
					onChange={(value) => {
						console.log(value);

						return setAttributes({ negativeBottomMargin: value });
					}}
					onUnitChange={(unit) => {
						console.log(unit);

						return setAttributes({ negativeBottomMargin: `${parseFloat(attributes.negativeBottomMargin)}${unit}` });
					}}
				/>
			</PanelRow>
		</BaseControl>
	);
};

import { __experimentalNumberControl } from '@wordpress/components';
import { FieldTooltip } from '../FieldTooltip/FieldTooltip.jsx';

export const ItemCount = ({ attributes, setAttributes }) => {
	if (!attributes?.itemCount) {
		return null;
	}

	const NumberControl = __experimentalNumberControl;

	return (
		<NumberControl
			__next40pxDefaultSize
			label={
				<>
					Item count
					<FieldTooltip
						tooltip={'How many items to display in total, if available'}
					/>
				</>
			}
			value={attributes.itemCount}
			min={2}
			max={12}
			onChange={(newCount) => setAttributes({ itemCount: newCount })}
		/>
	);
};


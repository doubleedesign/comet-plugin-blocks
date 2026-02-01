/* global wp */
import { __experimentalToggleGroupControl, __experimentalToggleGroupControlOption } from '@wordpress/components';

export const LayoutOrder = ({ attributes, setAttributes }) => {
	if (!attributes?.order) {
		return null;
	}

	const ToggleGroupControl = __experimentalToggleGroupControl;
	const ToggleGroupControlOption = __experimentalToggleGroupControlOption;

	return (
		<ToggleGroupControl
			className="comet-toggle-group"
			__next40pxDefaultSize
			isBlock
			label="Order"
			onChange={(value) => setAttributes({ order: value })}
			value={attributes.order}
		>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"/>
				</svg>}
				aria-label="L-R"
				showTooltip
				value="row"
			/>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M20 11.2H6.8l3.7-3.7-1-1L3.9 12l5.6 5.5 1-1-3.7-3.7H20z"/>
				</svg>}
				aria-label="R-L"
				showTooltip
				value="row-reverse"
			/>
		</ToggleGroupControl>
	);
};

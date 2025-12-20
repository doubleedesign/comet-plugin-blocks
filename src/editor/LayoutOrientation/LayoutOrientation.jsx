/* global wp */
import { __experimentalToggleGroupControl, __experimentalToggleGroupControlOption } from '@wordpress/components';

export const LayoutOrientation = ({ attributes, setAttributes }) => {
	// TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
	if (!attributes?.orientation) {
		return null;
	}

	const ToggleGroupControl = __experimentalToggleGroupControl;
	const ToggleGroupControlOption = __experimentalToggleGroupControlOption;

	return (
		<ToggleGroupControl
			className="comet-toggle-group"
			__next40pxDefaultSize
			isBlock
			label="Orientation"
			onChange={(value) => setAttributes({ orientation: value })}
			value={attributes.orientation}
		>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"/>
				</svg>}
				aria-label="Horizontal"
				showTooltip
				value="horizontal"
			/>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="m16.5 13.5-3.7 3.7V4h-1.5v13.2l-3.8-3.7-1 1 5.5 5.6 5.5-5.6z"/>
				</svg>}
				aria-label="Vertical"
				showTooltip
				value="vertical"
			/>
		</ToggleGroupControl>
	);
};

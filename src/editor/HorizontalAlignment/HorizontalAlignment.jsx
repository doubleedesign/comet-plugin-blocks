/* global wp */
import { __experimentalToggleGroupControl, __experimentalToggleGroupControlOption } from '@wordpress/components';

export const HorizontalAlignment = ({ attributes, setAttributes }) => {
	if (!attributes?.horizontalAlignment) {
		return null;
	}

	const ToggleGroupControl = __experimentalToggleGroupControl;
	const ToggleGroupControlOption = __experimentalToggleGroupControlOption;

	return (
		<ToggleGroupControl
			className="comet-toggle-group"
			__next40pxDefaultSize
			isBlock
			label="Horizontal alignment"
			onChange={(value) => setAttributes({ horizontalAlignment: value })}
			value={attributes.horizontalAlignment}
		>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M9 9v6h11V9H9zM4 20h1.5V4H4v16z"/>
				</svg>}
				aria-label="Start"
				showTooltip
				value="start"
			/>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z"/>
				</svg>}
				aria-label="Middle"
				showTooltip
				value="center"
			/>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z"/>
				</svg>}
				aria-label="End"
				showTooltip
				value="end"
			/>
		</ToggleGroupControl>
	);
};

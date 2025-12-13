/* global wp */
import { __experimentalToggleGroupControl, __experimentalToggleGroupControlOption } from '@wordpress/components';

export const VerticalAlignment = ({ attributes, setAttributes }) => {
	if (!attributes?.verticalAlignment) {
		return null;
	}

	const ToggleGroupControl = __experimentalToggleGroupControl;
	const ToggleGroupControlOption = __experimentalToggleGroupControlOption;

	return (
		<ToggleGroupControl
			className="comet-toggle-group"
			__next40pxDefaultSize
			isBlock
			label="Vertical alignment"
			onChange={(value) => setAttributes({ verticalAlignment: value })}
			value={attributes.verticalAlignment}
		>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z"/>
				</svg>}
				aria-label="Start"
				showTooltip
				value="start"
			/>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z"/>
				</svg>}
				aria-label="Middle"
				showTooltip
				value="center"
			/>
			<ToggleGroupControlOption
				label={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z"/>
				</svg>}
				aria-label="End"
				showTooltip
				value="end"
			/>
		</ToggleGroupControl>
	);
};

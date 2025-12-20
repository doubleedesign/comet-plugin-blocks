/* global wp */
/* global comet */
import {
	PanelBody,
	Dropdown,
	Button,
	ColorIndicator,
	ColorPalette,
	__experimentalToggleGroupControl,
	__experimentalToggleGroupControlOption
} from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';

const ColorPaletteDropdown = ({ label, palette, onChange }) => {
	const [hex, setHex] = useState('');
	const triggerRef = useRef();

	const getNameByColorValue = (colorValue) => {
		const color = palette.find((c) => c.color === colorValue);

		return color ? color.name : colorValue;
	};


	return (
		<Dropdown
			renderToggle={({ onToggle, isOpen }) => (
				<Button onClick={onToggle}
					aria-expanded={isOpen}
					ref={triggerRef}
					__next40pxDefaultSize
				>
					<ColorIndicator colorValue={hex}/>
					{label}
				</Button>
			)}
			renderContent={() => (
				<ColorPalette
					label={label}
					value={hex}
					colors={palette}
					onChange={(color) => {
						setHex(color ?? '');
						onChange(getNameByColorValue(color));
						triggerRef.current?.focus();
					}}
				/>
			)}
		/>
	);
};

export const ColorControls = ({ attributes, setAttributes }) => {
	// TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
	// Use refs to keep track of the presence of attribute support without the fields disappearing when the colour field is cleared
	const hasColorTheme = useRef(!!attributes?.colorTheme);
	const hasBackgroundColor = useRef(!!attributes?.backgroundColor);
	if (!hasColorTheme.current && !hasBackgroundColor.current) {
		return null;
	}

	const palette = wp.data.select('core/block-editor').getSettings().colors;
	if (!palette || palette.length === 0) {
		console.warn('No colour palette found in block editor settings. Please ensure it is configured in theme.json to access colour attribute controls.');

		return null;
	}

	const getValueByColorName = (colorName) => {
		const color = palette.find((c) => c.name === colorName);

		return color ? color.color : colorName;
	};

	// TODO: Limit valid combinations of background + theme where appropriate
	return (
		<PanelBody title="Colours" initialOpen={true} className="comet-color-controls">
			{hasColorTheme.current && (
				<div className="comet-color-controls__item">
					<ColorPaletteDropdown
						label="Theme"
						value={getValueByColorName(attributes?.colorTheme) ?? ''}
						palette={palette}
						onChange={(name) => {
							setAttributes({ colorTheme: name ?? '' });
						}}
					/>
				</div>
			)}
			{hasBackgroundColor.current && (
				<div className="comet-color-controls__item">
					<ColorPaletteDropdown
						label="Background"
						value={getValueByColorName(attributes?.backgroundColor) ?? ''}
						palette={palette}
						onChange={(name) => {
							setAttributes({ backgroundColor: name ?? '' });
						}}
					/>
				</div>
			)}
		</PanelBody>
	);
};

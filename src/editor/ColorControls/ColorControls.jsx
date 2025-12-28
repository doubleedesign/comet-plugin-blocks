/* global wp */
import { PanelBody, Dropdown, Button, ColorIndicator, ColorPalette } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { BLOCKS_WITH_TINYMCE } from '../constants.js';

/** @type {{ PluginManager: import('tinymce').AddOnManager }} */
const tinymce = window.tinymce;

const ColorPaletteDropdown = ({ label, hexValue, palette, onChange }) => {
	const [hex, setHex] = useState(hexValue);
	const triggerRef = useRef();

	const getNameByColorValue = (colorValue) => {
		const color = palette.find((c) => c.color === colorValue);

		return color ? color.slug : colorValue;
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

export const ColorControls = (props) => {
	const { attributes, setAttributes } = props;

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
		const color = palette.find((c) => c.slug === colorName);

		return color ? color.color : colorName;
	};

	const handleThemeChange = (name) => {
		setAttributes({ colorTheme: name ?? '' });
	};

	const handleBackgroundChange = (name) => {
		setAttributes({ backgroundColor: name ?? '' });
	};

	// TODO: Limit valid combinations of background + theme where appropriate
	return (
		<PanelBody title="Colours" initialOpen={true} className="comet-color-controls">
			{hasColorTheme.current && (
				<div className="comet-color-controls__item">
					<ColorPaletteDropdown
						label="Theme"
						hexValue={getValueByColorName(attributes?.colorTheme) ?? ''}
						palette={palette}
						onChange={handleThemeChange}
					/>
				</div>
			)}
			{hasBackgroundColor.current && (
				<div className="comet-color-controls__item">
					<ColorPaletteDropdown
						label="Background"
						hexValue={getValueByColorName(attributes?.backgroundColor) ?? ''}
						palette={palette}
						onChange={handleBackgroundChange}
					/>
				</div>
			)}
		</PanelBody>
	);
};

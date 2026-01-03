/* global wp */
import { PanelBody, Dropdown, Button, ColorIndicator, ColorPalette, GradientPicker } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';

export const ColorControls = ({ name, attributes, setAttributes }) => {
	const palette = Object.entries(comet?.palette)
		?.filter(([key, value]) => !['black', 'white'].includes(key))
		?.map(([key, value]) => ({ slug: key, name: key, color: value }))
		?? wp.data.select('core/block-editor').getSettings().colors;

	if (!palette || palette.length === 0) {
		// eslint-disable-next-line max-len
		console.error('No colour palette found in component library configuration. You can use theme.json or the comet_canvas_theme_colours filter to add colours. Developers: See set_colours() in ThemeStyle.php in the plugin source for more implementation details.');

		return null;
	}

	const componentDefault = comet?.defaults[name.replace('comet/', '')] ?? {};
	const startValues = {
		colorTheme: attributes?.colorTheme ?? componentDefault?.colorTheme ?? null,
		backgroundColor: attributes?.backgroundColor ?? componentDefault?.backgroundColor ?? null,
	};


	// Use refs to keep track of the presence of attribute support without the fields disappearing when the colour field is cleared
	const hasColorThemeSupport = useRef(!!startValues.colorTheme);
	const hasBackgroundColorSupport = useRef(!!startValues.backgroundColor);

	if (!hasColorThemeSupport.current && !hasBackgroundColorSupport.current) {
		return null;
	}

	const [foregroundColor, setForegroundColor] = useState(startValues.colorTheme);
	const [backgroundColor, setBackgroundColor] = useState(startValues.backgroundColor);

	const getValueByColorName = (colorName) => {
		const color = palette.find((c) => c.slug === colorName);

		return color ? color.color : colorName;
	};

	const handleThemeChange = (name) => {
		setForegroundColor(name);
		setAttributes({ colorTheme: name ?? '' });
	};

	const handleBackgroundChange = (name) => {
		setBackgroundColor(name);
		setAttributes({ backgroundColor: name ?? '' });
	};

	// If background colour is not supported, provide single colour theme option
	if (!hasBackgroundColorSupport.current) {
		return (
			<div className="comet-color-controls__item">
				<ColorPaletteDropdown
					label="Theme"
					hexValue={getValueByColorName(attributes?.colorTheme) ?? ''}
					palette={palette}
					onChange={handleThemeChange}
				/>
			</div>
		);
	}

	// If both colour theme and background colour are available, provide colour pair selection
	return (
		<div className="comet-color-controls__item">
			<ColorPairPaletteDropdown
				label="Theme"
				value={{
					foreground: foregroundColor,
					background: backgroundColor,
				}}
				pairs={comet?.colourPairs ?? []}
				onChange={(newValue) => {
					handleThemeChange(newValue.foreground);
					handleBackgroundChange(newValue.background);
				}}
			/>
		</div>
	);
};

function ColorPaletteDropdown({ label, hexValue, palette, onChange }) {
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
			renderContent={({ onToggle }) => (
				<ColorPalette
					label={label}
					value={hex}
					colors={palette}
					onChange={(color) => {
						setHex(color ?? '');
						onChange(getNameByColorValue(color));
						onToggle(); // close dropdown after selection
					}}
				/>
			)}
		/>
	);
}

function ColorPairPaletteDropdown({ label, value, pairs, onChange }) {
	const [foreground, setForeground] = useState(value?.foreground ?? '');
	const [background, setBackground] = useState(value?.background !== 'transparent' ? value?.background : (comet?.globalBackground ?? 'white'));
	const triggerRef = useRef();

	const palette = pairs.map((pair) => ({
		name: `${pair.foreground} on ${pair.background}`,
		slug: `${pair.foreground}-${pair.background}`,
		gradient: `linear-gradient(135deg, var(--color-${pair.foreground}) 0%, var(--color-${pair.foreground}) 50%, var(--color-${pair.background}) 50%, var(--color-${pair.background}) 100%)`,
	}));

	const gradientPreview = useMemo(() => {
		return `linear-gradient(135deg, var(--color-${foreground}) 0%, var(--color-${foreground}) 50%, var(--color-${background}) 50%, var(--color-${background}) 100%)`;
	}, [foreground, background]);

	const handleChange = (newValue) => {
		// New value is the gradient string; find the matching palette object
		const matchedPair = palette.find((pair) => pair.gradient === newValue);

		if (matchedPair) {
			const [newForeground, newBackground] = matchedPair.slug.split('-');
			setForeground(newForeground);
			setBackground(newBackground);
			onChange({
				foreground: newForeground,
				background: newBackground,
			});
		}
	};

	return (
		<Dropdown
			renderToggle={({ onToggle, isOpen }) => (
				<Button onClick={onToggle}
					aria-expanded={isOpen}
					ref={triggerRef}
					__next40pxDefaultSize
				>
					<ColorIndicator colorValue={gradientPreview}/>
					{label}
				</Button>
			)}
			renderContent={({ isOpen, onToggle }) => (
				<GradientPicker
					label={label}
					value={gradientPreview}
					gradients={palette}
					disableCustomGradients={true}
					onChange={(value) => {
						handleChange(value);
						onToggle(); // close dropdown after selection
					}}
				/>
			)}
		/>
	);
}

import { BLOCKS_WITH_TINYMCE } from '../constants.dist.js';

/* global wp */
const {
	PanelBody,
	Dropdown,
	Button,
	ColorIndicator,
	ColorPalette
} = wp.components;
const {
	useEffect,
	useRef,
	useState
} = wp.element;

/** @type {{ PluginManager: import('tinymce').AddOnManager }} */
const tinymce = window.tinymce;
const ColorPaletteDropdown = ({
	label,
	hexValue,
	palette,
	onChange
}) => {
	const [hex, setHex] = useState(hexValue);
	const triggerRef = useRef();
	const getNameByColorValue = colorValue => {
		const color = palette.find(c => c.color === colorValue);

		return color ? color.name : colorValue;
	};

	return /*#__PURE__*/React.createElement(Dropdown, {
		renderToggle: ({
			onToggle,
			isOpen
		}) => /*#__PURE__*/React.createElement(Button, {
			onClick: onToggle,
			'aria-expanded': isOpen,
			ref: triggerRef,
			__next40pxDefaultSize: true
		}, /*#__PURE__*/React.createElement(ColorIndicator, {
			colorValue: hex
		}), label),
		renderContent: () => /*#__PURE__*/React.createElement(ColorPalette, {
			label: label,
			value: hex,
			colors: palette,
			onChange: color => {
				setHex(color ?? '');
				onChange(getNameByColorValue(color));
				triggerRef.current?.focus();
			}
		})
	});
};
const ColorControls = props => {
	const {
		attributes,
		setAttributes
	} = props;
	console.log(attributes);
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
	const getValueByColorName = colorName => {
		const color = palette.find(c => c.name === colorName);

		return color ? color.color : colorName;
	};
	const setTinyMceBodyAttribute = (attribute, value) => {
		if (BLOCKS_WITH_TINYMCE.includes(attributes.name)) {
			const iframe = tinymce?.activeEditor?.iframeElement;
			if (iframe) {
				const iframeBody = iframe.contentDocument.body;
				iframeBody.setAttribute(attribute, value ?? '');
			}
		}
	};
	const handleThemeChange = name => {
		setAttributes({
			colorTheme: name ?? ''
		});
		setTinyMceBodyAttribute('data-color-theme', name ?? '');
	};
	const handleBackgroundChange = name => {
		setAttributes({
			backgroundColor: name ?? ''
		});
		setTinyMceBodyAttribute('data-background', name ?? '');
	};

	// On load, set the TinyMCE body attributes if applicable
	useEffect(() => {
		setTinyMceBodyAttribute('data-color-theme', attributes?.colorTheme ?? '');
		setTinyMceBodyAttribute('data-background', attributes?.backgroundColor ?? '');
	}, []);

	// TODO: Limit valid combinations of background + theme where appropriate
	return /*#__PURE__*/React.createElement(PanelBody, {
		title: 'Colours',
		initialOpen: true,
		className: 'comet-color-controls'
	}, hasColorTheme.current && /*#__PURE__*/React.createElement('div', {
		className: 'comet-color-controls__item'
	}, /*#__PURE__*/React.createElement(ColorPaletteDropdown, {
		label: 'Theme',
		hexValue: getValueByColorName(attributes?.colorTheme) ?? '',
		palette: palette,
		onChange: handleThemeChange
	})), hasBackgroundColor.current && /*#__PURE__*/React.createElement('div', {
		className: 'comet-color-controls__item'
	}, /*#__PURE__*/React.createElement(ColorPaletteDropdown, {
		label: 'Background',
		hexValue: getValueByColorName(attributes?.backgroundColor) ?? '',
		palette: palette,
		onChange: handleBackgroundChange
	})));
};

export { ColorControls };
//# sourceMappingURL=ColorControls.dist.js.map

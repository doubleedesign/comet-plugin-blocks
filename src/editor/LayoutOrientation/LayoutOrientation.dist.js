/* global wp */
const {
	__experimentalToggleGroupControl,
	__experimentalToggleGroupControlOption
} = wp.components;
const LayoutOrientation = ({
	attributes,
	setAttributes
}) => {
	if (!attributes?.orientation) {
		return null;
	}
	const ToggleGroupControl = __experimentalToggleGroupControl;
	const ToggleGroupControlOption = __experimentalToggleGroupControlOption;

	return /*#__PURE__*/React.createElement(ToggleGroupControl, {
		className: 'comet-toggle-group',
		__next40pxDefaultSize: true,
		isBlock: true,
		label: 'Orientation',
		onChange: value => setAttributes({
			orientation: value
		}),
		value: attributes.orientation
	}, /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
		label: /*#__PURE__*/React.createElement('svg', {
			xmlns: 'http://www.w3.org/2000/svg',
			viewBox: '0 0 24 24'
		}, /*#__PURE__*/React.createElement('path', {
			d: 'm14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z'
		})),
		'aria-label': 'Horizontal',
		showTooltip: true,
		value: 'horizontal'
	}), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
		label: /*#__PURE__*/React.createElement('svg', {
			xmlns: 'http://www.w3.org/2000/svg',
			viewBox: '0 0 24 24'
		}, /*#__PURE__*/React.createElement('path', {
			d: 'm16.5 13.5-3.7 3.7V4h-1.5v13.2l-3.8-3.7-1 1 5.5 5.6 5.5-5.6z'
		})),
		'aria-label': 'Vertical',
		showTooltip: true,
		value: 'vertical'
	}));
};

export { LayoutOrientation };
//# sourceMappingURL=LayoutOrientation.dist.js.map

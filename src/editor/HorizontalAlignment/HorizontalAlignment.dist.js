/* global wp */
const {
  __experimentalToggleGroupControl,
  __experimentalToggleGroupControlOption
} = wp.components;
const HorizontalAlignment = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.hAlign) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption;
  return /*#__PURE__*/React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Horizontal alignment",
    onChange: value => setAttributes({
      hAlign: value
    }),
    value: attributes.hAlign
  }, /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 9v6h11V9H9zM4 20h1.5V4H4v16z"
    })),
    "aria-label": "Start",
    showTooltip: true,
    value: "start"
  }), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z"
    })),
    "aria-label": "Middle",
    showTooltip: true,
    value: "center"
  }), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z"
    })),
    "aria-label": "End",
    showTooltip: true,
    value: "end"
  }));
};

export { HorizontalAlignment };
//# sourceMappingURL=HorizontalAlignment.dist.js.map

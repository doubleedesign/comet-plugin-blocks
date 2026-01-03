/* global wp */
const {
  __experimentalToggleGroupControl,
  __experimentalToggleGroupControlOption
} = wp.components;
const VerticalAlignment = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.vAlign) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption;
  return /*#__PURE__*/React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Vertical alignment",
    onChange: value => setAttributes({
      vAlign: value
    }),
    value: attributes.vAlign
  }, /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 20h6V9H9v11zM4 4v1.5h16V4H4z"
    })),
    "aria-label": "Start",
    showTooltip: true,
    value: "start"
  }), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z"
    })),
    "aria-label": "Middle",
    showTooltip: true,
    value: "center"
  }), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z"
    })),
    "aria-label": "End",
    showTooltip: true,
    value: "end"
  }));
};

export { VerticalAlignment };
//# sourceMappingURL=VerticalAlignment.dist.js.map

/* global wp */
const {
  __experimentalToggleGroupControl,
  __experimentalToggleGroupControlOption
} = wp.components;
const LayoutOrder = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.order) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption;
  return /*#__PURE__*/React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Order",
    onChange: value => setAttributes({
      order: value
    }),
    value: attributes.order
  }, /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"
    })),
    "aria-label": "L-R",
    showTooltip: true,
    value: "row"
  }), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 11.2H6.8l3.7-3.7-1-1L3.9 12l5.6 5.5 1-1-3.7-3.7H20z"
    })),
    "aria-label": "R-L",
    showTooltip: true,
    value: "row-reverse"
  }));
};

export { LayoutOrder };
//# sourceMappingURL=LayoutOrder.dist.js.map

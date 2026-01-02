/* global wp */
const {
  __experimentalToggleGroupControl,
  __experimentalToggleGroupControlOption
} = wp.components;
const GroupLayout = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.layout) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption;
  return /*#__PURE__*/React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Group layout",
    help: "Note: Items may stack on small viewports regardless of the layout selection.",
    onChange: value => setAttributes({
      layout: value
    }),
    value: attributes.layout
  }, /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 5.5H6a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5ZM6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 5h1.5v1.5H7V9Zm1.5 4.5H7V15h1.5v-1.5ZM10 9h7v1.5h-7V9Zm7 4.5h-7V15h7v-1.5Z"
    })),
    "aria-label": "List",
    showTooltip: true,
    value: "list"
  }), /*#__PURE__*/React.createElement(ToggleGroupControlOption, {
    label: /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "m3 5c0-1.10457.89543-2 2-2h13.5c1.1046 0 2 .89543 2 2v13.5c0 1.1046-.8954 2-2 2h-13.5c-1.10457 0-2-.8954-2-2zm2-.5h6v6.5h-6.5v-6c0-.27614.22386-.5.5-.5zm-.5 8v6c0 .2761.22386.5.5.5h6v-6.5zm8 0v6.5h6c.2761 0 .5-.2239.5-.5v-6zm0-8v6.5h6.5v-6c0-.27614-.2239-.5-.5-.5z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })),
    "aria-label": "Grid",
    showTooltip: true,
    value: "grid"
  }));
};

export { GroupLayout };
//# sourceMappingURL=GroupLayout.dist.js.map

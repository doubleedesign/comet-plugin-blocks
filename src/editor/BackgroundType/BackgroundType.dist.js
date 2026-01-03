const {
  SelectControl
} = wp.components;
const BackgroundType = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.backgroundType) {
    return null;
  }
  const options = [{
    label: 'Content',
    value: 'content'
  }, {
    label: 'Overlay',
    value: 'overlay'
  }];
  return /*#__PURE__*/React.createElement(SelectControl, {
    label: "Background type",
    size: '__unstable-large',
    value: attributes.backgroundType,
    options: options,
    onChange: newType => setAttributes({
      backgroundType: newType
    })
  });
};

export { BackgroundType };
//# sourceMappingURL=BackgroundType.dist.js.map

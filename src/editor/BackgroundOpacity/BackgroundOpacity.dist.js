/* global wp */
const {
  RangeControl
} = wp.components;
const BackgroundOpacity = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.backgroundOpacity) {
    return null;
  }
  const defaultValue = comet?.defaults?.[name.replace('comet/', '')]?.backgroundOpacity ?? wp.data.select('core/blocks').getBlockType(name)?.attributes?.backgroundOpacity?.default ?? 0;
  return /*#__PURE__*/React.createElement(RangeControl, {
    __next40pxDefaultSize: true,
    initialPosition: attributes.backgroundOpacity ?? defaultValue,
    onChange: value => setAttributes({
      backgroundOpacity: value
    }),
    label: "Background opacity",
    max: 100,
    min: 50,
    allowReset: true,
    resetFallbackValue: defaultValue
  });
};

export { BackgroundOpacity };
//# sourceMappingURL=BackgroundOpacity.dist.js.map

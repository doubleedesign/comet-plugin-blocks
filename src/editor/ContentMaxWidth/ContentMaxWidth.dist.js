import { FieldTooltip } from '../FieldTooltip/FieldTooltip.dist.js';

/* global wp */
/* eslint-disable max-len */
const {
  RangeControl
} = wp.components;
const ContentMaxWidth = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.contentMaxWidth) {
    return null;
  }
  const defaultValue = comet?.defaults?.[name.replace('comet/', '')]?.contentMaxWidth ?? wp.data.select('core/blocks').getBlockType(name)?.attributes?.contentMaxWidth?.default ?? 50;
  return /*#__PURE__*/React.createElement(RangeControl, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "Content max width", /*#__PURE__*/React.createElement(FieldTooltip, {
      tooltip: 'The preferred width of the inner content relative to the container on viewports large enough to accommodate it; may be wider on smaller viewports'
    })),
    __next40pxDefaultSize: true,
    initialPosition: attributes.contentMaxWidth,
    onChange: value => setAttributes({
      contentMaxWidth: value
    }),
    max: 100,
    min: 30,
    allowReset: true,
    resetFallbackValue: defaultValue
  });
};

export { ContentMaxWidth };
//# sourceMappingURL=ContentMaxWidth.dist.js.map

import { FieldTooltip } from '../FieldTooltip/FieldTooltip.dist.js';

/* eslint-disable max-len */
/* global comet, wp */
const {
  __experimentalNumberControl
} = wp.components;
const MaxPerRow = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.maxPerRow) {
    return null;
  }
  const NumberControl = __experimentalNumberControl;
  return /*#__PURE__*/React.createElement(NumberControl, {
    __next40pxDefaultSize: true,
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "Max items per row", /*#__PURE__*/React.createElement(FieldTooltip, {
      tooltip: 'The preferred number of items per row in containers wide enough to accommodate them; items may be stacked to a smaller number on smaller viewports'
    })),
    value: attributes.maxPerRow,
    min: 2,
    max: 6,
    onChange: newMax => {
      try {
        newMax = parseInt(newMax);
      } catch {
        newMax = attributes.maxPerRow;
      }
      return setAttributes({
        maxPerRow: newMax
      });
    }
  });
};

export { MaxPerRow };
//# sourceMappingURL=MaxPerRow.dist.js.map

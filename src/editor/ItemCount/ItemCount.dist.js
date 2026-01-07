import { FieldTooltip } from '../FieldTooltip/FieldTooltip.dist.js';

const {
  __experimentalNumberControl
} = wp.components;
const ItemCount = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.itemCount) {
    return null;
  }
  const NumberControl = __experimentalNumberControl;
  return /*#__PURE__*/React.createElement(NumberControl, {
    __next40pxDefaultSize: true,
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "Item count", /*#__PURE__*/React.createElement(FieldTooltip, {
      tooltip: 'How many items to display in total, if available'
    })),
    value: attributes.itemCount,
    min: 2,
    max: 12,
    onChange: newCount => setAttributes({
      itemCount: newCount
    })
  });
};

export { ItemCount };
//# sourceMappingURL=ItemCount.dist.js.map

import { FieldTooltip } from '../FieldTooltip/FieldTooltip.dist.js';

const {
  PanelRow,
  BaseControl,
  __experimentalUnitControl
} = wp.components;
const NegativeMargins = ({
  name,
  attributes,
  setAttributes
}) => {
  // Checking against potentially empty attribute values causes problems here so we have to check actual block types :(
  if (name !== 'comet/image') {
    return null;
  }
  const UnitControl = __experimentalUnitControl;
  return /*#__PURE__*/React.createElement(BaseControl, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "Negative margins ", /*#__PURE__*/React.createElement(FieldTooltip, {
      tooltip: 'Bring the elements above or below this block closer to sit on top of the image by the given amount; note that on smaller viewports this may be overridden to ensure the image remains visible'
    }))
  }, /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement(UnitControl, {
    label: "Top",
    __next40pxDefaultSize: true,
    max: 0,
    value: attributes.negativeTopMargin,
    onChange: value => setAttributes({
      negativeTopMargin: value
    }),
    onUnitChange: unit => setAttributes({
      negativeTopMargin: `${parseFloat(attributes.negativeTopMargin)}${unit}`
    })
  }), /*#__PURE__*/React.createElement(UnitControl, {
    label: "Bottom",
    __next40pxDefaultSize: true,
    max: 0,
    value: attributes.negativeBottomMargin,
    onChange: value => {
      console.log(value);
      return setAttributes({
        negativeBottomMargin: value
      });
    },
    onUnitChange: unit => {
      console.log(unit);
      return setAttributes({
        negativeBottomMargin: `${parseFloat(attributes.negativeBottomMargin)}${unit}`
      });
    }
  })));
};

export { NegativeMargins };
//# sourceMappingURL=NegativeMargins.dist.js.map

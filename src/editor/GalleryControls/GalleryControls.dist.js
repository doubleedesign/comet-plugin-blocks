import { FieldTooltip } from '../FieldTooltip/FieldTooltip.dist.js';

const {
  ToggleControl
} = wp.components;
const GalleryControls = ({
  name,
  attributes,
  setAttributes
}) => {
  if (name !== 'comet/gallery') {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl, {
    checked: attributes.lightbox,
    label: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Enable lightbox"), /*#__PURE__*/React.createElement(FieldTooltip, {
      tooltip: 'When a visitor clicks on an image, open a larger version in an overlay'
    })),
    onChange: value => setAttributes({
      lightbox: value
    })
  }), /*#__PURE__*/React.createElement(ToggleControl, {
    checked: attributes.captions,
    label: "Show image captions if available",
    onChange: value => setAttributes({
      captions: value
    })
  }));
};

export { GalleryControls };
//# sourceMappingURL=GalleryControls.dist.js.map

import { ContainerSize } from '../ContainerSize/ContainerSize.dist.js';
import { GroupLayout } from '../GroupLayout/GroupLayout.dist.js';
import { VerticalAlignment } from '../VerticalAlignment/VerticalAlignment.dist.js';
import { HorizontalAlignment } from '../HorizontalAlignment/HorizontalAlignment.dist.js';
import { LayoutOrientation } from '../LayoutOrientation/LayoutOrientation.dist.js';
import { ContentMaxWidth } from '../ContentMaxWidth/ContentMaxWidth.dist.js';
import { MaxPerRow } from '../MaxPerRow/MaxPerRow.dist.js';
import { ItemCount } from '../ItemCount/ItemCount.dist.js';
import { NegativeMargins } from '../NegativeMargins/NegativeMargins.dist.js';

/* global wp */
const {
  PanelBody,
  PanelRow
} = wp.components;
const LayoutControls = props => {
  // If the block does not have any layout attributes, do not render the controls
  const componentDefault = Object.keys(comet?.defaults[props.name.replace('comet/', '')] ?? {}) ?? [];
  const currentAttributes = Object.keys(props.attributes) ?? [];
  if (componentDefault.length === 0 && currentAttributes.length === 0) {
    return null;
  }
  const layoutAttributes = ['size', 'groupLayout', 'orientation', 'hAlign', 'vAlign', 'backgroundType'];
  const hasLayoutAttributes = [...componentDefault, ...currentAttributes].some(attr => layoutAttributes.includes(attr));
  if (!hasLayoutAttributes) {
    return null;
  }
  return /*#__PURE__*/React.createElement(PanelBody, {
    title: "Layout",
    initialOpen: true
  }, /*#__PURE__*/React.createElement(ContainerSize, props), /*#__PURE__*/React.createElement(ContentMaxWidth, props), /*#__PURE__*/React.createElement(NegativeMargins, props), /*#__PURE__*/React.createElement(GroupLayout, props), /*#__PURE__*/React.createElement(ItemCount, props), /*#__PURE__*/React.createElement(MaxPerRow, props), /*#__PURE__*/React.createElement(LayoutOrientation, props), /*#__PURE__*/React.createElement(HorizontalAlignment, props), /*#__PURE__*/React.createElement(VerticalAlignment, props));
};

export { LayoutControls };
//# sourceMappingURL=LayoutControls.dist.js.map

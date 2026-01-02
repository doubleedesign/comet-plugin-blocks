import { ContainerSize } from '../ContainerSize/ContainerSize.dist.js';
import { GroupLayout } from '../GroupLayout/GroupLayout.dist.js';
import { VerticalAlignment } from '../VerticalAlignment/VerticalAlignment.dist.js';
import { HorizontalAlignment } from '../HorizontalAlignment/HorizontalAlignment.dist.js';
import { LayoutOrientation } from '../LayoutOrientation/LayoutOrientation.dist.js';

/* global wp */
const {
  PanelBody
} = wp.components;
const LayoutControls = props => {
  return /*#__PURE__*/React.createElement(PanelBody, {
    title: "Layout",
    initialOpen: true
  }, /*#__PURE__*/React.createElement(ContainerSize, props), /*#__PURE__*/React.createElement(GroupLayout, props), /*#__PURE__*/React.createElement(LayoutOrientation, props), /*#__PURE__*/React.createElement(HorizontalAlignment, props), /*#__PURE__*/React.createElement(VerticalAlignment, props));
};

export { LayoutControls };
//# sourceMappingURL=LayoutControls.dist.js.map

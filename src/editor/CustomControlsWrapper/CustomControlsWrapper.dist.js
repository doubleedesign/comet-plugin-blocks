import { extends as _extends } from '../_virtual/_rollupPluginBabelHelpers.dist.js';
import { LayoutControls } from '../LayoutControls/LayoutControls.dist.js';
import { ColorControls } from '../ColorControls/ColorControls.dist.js';
import { BackgroundType } from '../BackgroundType/BackgroundType.dist.js';
import { BackgroundOpacity } from '../BackgroundOpacity/BackgroundOpacity.dist.js';
import { HtmlTag } from '../HtmlTag/HtmlTag.dist.js';

/* global wp */
const {
  addFilter
} = wp.hooks;
const {
  InspectorControls,
  InspectorAdvancedControls
} = wp.blockEditor;
const ServerSideRender = wp.serverSideRender;
const {
  PanelBody,
  SelectControl
} = wp.components;
const {
  useMemo
} = wp.element;

/**
 * Note: This file needs to be compiled (Rollup is configured for this)
 * and loaded into the editor via the enqueue_block_editor_assets PHP hook
 */
wp.domReady(() => {
  addFilter('editor.BlockEdit', 'comet-plugin-blocks/custom-controls', BlockEdit => props => {
    const BlockEditComponent = useMemo(() => {
      if (props?.name === 'ninja-forms/form') {
        return NinjaFormsControls;
      }
      return CometBlockEdit;
    }, [props?.name]);
    return /*#__PURE__*/React.createElement("div", {
      className: "comet-block-edit-wrapper",
      "data-block": props.name
    }, /*#__PURE__*/React.createElement(BlockEditComponent, _extends({
      BlockEdit: BlockEdit
    }, props)));
  });
});

/**
 * Render BlockEdit component with controls for custom attributes
 * @param BlockEdit The original BlockEdit component
 * @param {Object} props The block edit props
 * @returns {JSX.Element}
 * @constructor
 */
function CometBlockEdit({
  BlockEdit,
  ...props
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "comet-plugin-blocks-custom-controls"
  }, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(LayoutControls, props), Object.keys(props?.attributes).some(attr => ['colorTheme', 'backgroundColor', 'backgroundOpacity', 'backgroundType'].includes(attr)) && /*#__PURE__*/React.createElement(PanelBody, {
    title: "Colours",
    initialOpen: true,
    className: `comet-color-controls comet-color-controls--${props.name.split('/')[1]}`
  }, /*#__PURE__*/React.createElement(ColorControls, props), /*#__PURE__*/React.createElement(BackgroundOpacity, props), /*#__PURE__*/React.createElement(BackgroundType, props))), /*#__PURE__*/React.createElement(InspectorAdvancedControls, null, /*#__PURE__*/React.createElement(HtmlTag, props))), /*#__PURE__*/React.createElement(BlockEdit, props));
}

/**
 * Recreate the Ninja Form selector dropdown control so that it is wrapped in the same components as our custom controls,
 * and also enables us to use server-side rendering for the block preview instead of BlockEdit
 * (which would render both the default preview + the default form selector)
 * @param {Object} props The block edit props
 *
 * FIXME: This currently gets stuck on the loading spinner when rendering the form.
 */
function NinjaFormsControls(props) {
  const {
    name,
    attributes,
    setAttributes
  } = props;
  if (name !== 'ninja-forms/form') {
    return null;
  }
  const options = Object.values(window?.nfFormsBlock?.forms)?.map(({
    formID,
    formTitle
  }) => ({
    label: `${formTitle} (ID: ${formID})`,
    value: formID
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "comet-plugin-blocks-custom-controls"
  }, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(LayoutControls, props), /*#__PURE__*/React.createElement(ColorControls, props), /*#__PURE__*/React.createElement(PanelBody, {
    title: "Content",
    initialOpen: true
  }, /*#__PURE__*/React.createElement(SelectControl, {
    label: "Form",
    size: '__unstable-large',
    value: attributes.formID,
    options: options ?? [],
    onChange: value => {
      setAttributes({
        formID: parseInt(value),
        formTitle: options.find(option => option.value === parseInt(value))?.label || ''
      });
    }
  })))), /*#__PURE__*/React.createElement(ServerSideRender, {
    block: "ninja-forms/form",
    attributes: props.attributes
  }));
}
//# sourceMappingURL=CustomControlsWrapper.dist.js.map

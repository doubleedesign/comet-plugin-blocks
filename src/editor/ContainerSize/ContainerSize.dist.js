import { FieldTooltip } from '../FieldTooltip/FieldTooltip.dist.js';

const {
  useMemo,
  useEffect,
  useState
} = wp.element;
const {
  PanelBody,
  SelectControl
} = wp.components;

// TODO: Handle supporting backgroundSize where appropriate (it's not really built into the Core components unless we nest a container)
const ContainerSize = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.size && !attributes?.backgroundSize) {
    return null;
  }
  const options = [{
    label: 'Narrow',
    value: 'narrow'
  }, {
    label: 'Contained',
    value: 'contained'
  }, {
    label: 'Wide',
    value: 'wide'
  }, {
    label: 'Full-width',
    value: 'fullwidth'
  }];

  // Account for blocks that support container size but not backgroundSize
  if (!attributes?.backgroundSize) {
    return /*#__PURE__*/React.createElement(SelectControl, {
      label: /*#__PURE__*/React.createElement(React.Fragment, null, "Container size", /*#__PURE__*/React.createElement(FieldTooltip, {
        tooltip: 'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'
      })),
      size: '__unstable-large',
      value: attributes.size ?? 'contained',
      options: options,
      onChange: newSize => setAttributes({
        size: newSize
      })
    });
  }
  const [containerSizeIndex, setContainerSizeIndex] = useState(1);
  const [backgroundSizeIndex, setBackgroundSizeIndex] = useState(3);
  const updateContainerSize = newSize => {
    setAttributes({
      size: newSize
    });
    setContainerSizeIndex(options.findIndex(option => option.value === newSize));
  };
  const updateBackgroundSize = newSize => {
    setAttributes({
      backgroundSize: newSize
    });
    setBackgroundSizeIndex(options.findIndex(option => option.value === newSize));
  };

  // Filter background size options to only those larger than or equal to the selected container size
  const filteredBackgroundOptions = useMemo(() => {
    return options.slice(containerSizeIndex);
  }, [attributes.size]);

  // React to the other selection changing to ensure valid state
  useEffect(() => {
    // If the current background size is smaller than the container size, make it the same as the container
    if (backgroundSizeIndex < containerSizeIndex) {
      setAttributes({
        backgroundSize: attributes.size
      });
    }

    // If the container size is larger than the background size, set it to the background size
    if (containerSizeIndex > backgroundSizeIndex) {
      setAttributes({
        size: attributes.backgroundSize
      });
    }
  }, [containerSizeIndex, backgroundSizeIndex]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SelectControl, {
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "Container size", /*#__PURE__*/React.createElement(FieldTooltip, {
      tooltip: 'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes?.size ?? 'contained',
    options: options,
    onChange: updateContainerSize
  }), /*#__PURE__*/React.createElement(SelectControl, {
    label: "Background size",
    size: '__unstable-large',
    value: attributes?.backgroundSize ?? 'fullwidth',
    options: filteredBackgroundOptions,
    onChange: updateBackgroundSize
  }));
};

export { ContainerSize };
//# sourceMappingURL=ContainerSize.dist.js.map

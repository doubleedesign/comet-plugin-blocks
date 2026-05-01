function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

const {
  Tooltip,
  Button: Button$1
} = wp.components;
const FieldTooltip = ({
  tooltip
}) => {
  if (!tooltip) {
    return null;
  }
  return React.createElement(Tooltip, {
    text: React.createElement("span", {
      style: {
        display: 'block',
        maxWidth: '200px'
      }
    }, tooltip)
  }, React.createElement(Button$1, {
    size: "small",
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, React.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z"
    }))
  }));
};

const {
  useMemo: useMemo$2
} = wp.element;
const {
  SelectControl: SelectControl$4
} = wp.components;

// TODO: Handle supporting innerSize where appropriate (it's not really built into the Core components unless we nest a container)
const ContainerSize = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.size && !attributes?.innerSize) {
    return null;
  }
  if (!attributes?.innerSize) {
    return React.createElement(ContainerOnly, {
      attributes: attributes,
      setAttributes: setAttributes
    });
  }
  return React.createElement(ContainerAndInner, {
    attributes: attributes,
    setAttributes: setAttributes
  });
};
const ContainerOnly = ({
  attributes,
  setAttributes
}) => {
  const options = [{
    label: 'Full-width',
    value: 'fullwidth'
  }, {
    label: 'Wide',
    value: 'wide'
  }, {
    label: 'Contained',
    value: 'contained'
  }, {
    label: 'Narrow',
    value: 'narrow'
  }];
  return React.createElement(SelectControl$4, {
    label: React.createElement(React.Fragment, null, "Container size", React.createElement(FieldTooltip, {
      tooltip: 'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes.size,
    options: options,
    onChange: newSize => setAttributes({
      size: newSize
    })
  });
};
const ContainerAndInner = ({
  attributes,
  setAttributes
}) => {
  const options = [{
    label: 'Full-width',
    value: 'fullwidth'
  }, {
    label: 'Wide',
    value: 'wide'
  }, {
    label: 'Contained',
    value: 'contained'
  }, {
    label: 'Narrow',
    value: 'narrow'
  }];
  const innerOptions = [{
    label: 'Auto (do not override)',
    value: 'fullwidth'
  },
  // needs to have the same values or we have a bad time with the compatibility logic
  {
    label: 'Wide',
    value: 'wide'
  }, {
    label: 'Contained',
    value: 'contained'
  }, {
    label: 'Narrow',
    value: 'narrow'
  }];
  const updateContainerSize = newSize => {
    setAttributes({
      size: newSize
    });
    // If the inner size was larger than the new container size, update it to be the same
    const innerSizeIndex = options.findIndex(option => option.value === attributes.innerSize);
    if (innerSizeIndex > options.findIndex(option => option.value === newSize)) {
      setAttributes({
        innerSize: newSize
      });
    }
  };
  const updateinnerSize = newSize => {
    setAttributes({
      innerSize: newSize
    });
    // If the inner size is being set larger than the current container size, update the container to match
    const containerSizeIndex = options.findIndex(option => option.value === attributes.size);
    if (options.findIndex(option => option.value === newSize) < containerSizeIndex) {
      setAttributes({
        size: newSize
      });
    }
  };
  // Filter inner options to only those smaller than or equal to the container size
  const filteredInnerOptions = useMemo$2(() => {
    const containerSizeIndex = options.findIndex(option => option.value === attributes.size);
    return innerOptions.slice(containerSizeIndex);
  }, [attributes.size]);
  return React.createElement(React.Fragment, null, React.createElement(SelectControl$4, {
    label: React.createElement(React.Fragment, null, "Container size", React.createElement(FieldTooltip, {
      tooltip: 'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes.size,
    options: options,
    onChange: updateContainerSize
  }), React.createElement(SelectControl$4, {
    label: React.createElement(React.Fragment, null, "Inner content size", React.createElement(FieldTooltip, {
      tooltip: 'Optionally override the inner content\'s overall max width; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes.innerSize,
    options: filteredInnerOptions,
    onChange: updateinnerSize
  }));
};

const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$4,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$4
} = wp.components;

/* global wp */
const GroupLayout = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.layout) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$4;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$4;
  return React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Group layout",
    help: "Note: Items may stack on small viewports regardless of the layout selection.",
    onChange: value => setAttributes({
      layout: value
    }),
    value: attributes.layout
  }, React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, React.createElement("path", {
      d: "M18 5.5H6a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5ZM6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 5h1.5v1.5H7V9Zm1.5 4.5H7V15h1.5v-1.5ZM10 9h7v1.5h-7V9Zm7 4.5h-7V15h7v-1.5Z"
    })),
    "aria-label": "List",
    showTooltip: true,
    value: "list"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "m3 5c0-1.10457.89543-2 2-2h13.5c1.1046 0 2 .89543 2 2v13.5c0 1.1046-.8954 2-2 2h-13.5c-1.10457 0-2-.8954-2-2zm2-.5h6v6.5h-6.5v-6c0-.27614.22386-.5.5-.5zm-.5 8v6c0 .2761.22386.5.5.5h6v-6.5zm8 0v6.5h6c.2761 0 .5-.2239.5-.5v-6zm0-8v6.5h6.5v-6c0-.27614-.2239-.5-.5-.5z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })),
    "aria-label": "Grid",
    showTooltip: true,
    value: "grid"
  }));
};

const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$3,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$3
} = wp.components;

/* global wp */
const VerticalAlignment = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.vAlign) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$3;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$3;
  return React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Vertical alignment",
    onChange: value => setAttributes({
      vAlign: value
    }),
    value: attributes.vAlign
  }, React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M9 20h6V9H9v11zM4 4v1.5h16V4H4z"
    })),
    "aria-label": "Start",
    showTooltip: true,
    value: "start"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z"
    })),
    "aria-label": "Middle",
    showTooltip: true,
    value: "center"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z"
    })),
    "aria-label": "End",
    showTooltip: true,
    value: "end"
  }));
};

const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$2,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$2
} = wp.components;

/* global wp */
const HorizontalAlignment = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.hAlign) {
    return null;
  }
  if (attributes.layout && attributes.layout === 'list') {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$2;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$2;
  return React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: React.createElement(React.Fragment, null, "Horizontal Alignment", React.createElement(FieldTooltip, {
      tooltip: 'How to align the content if it does not take up the full width of the container'
    })),
    onChange: value => setAttributes({
      hAlign: value
    }),
    value: attributes.hAlign
  }, React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M9 9v6h11V9H9zM4 20h1.5V4H4v16z"
    })),
    "aria-label": "Start",
    showTooltip: true,
    value: "start"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z"
    })),
    "aria-label": "Middle",
    showTooltip: true,
    value: "center"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z"
    })),
    "aria-label": "End",
    showTooltip: true,
    value: "end"
  }));
};

const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$1,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$1
} = wp.components;

/* global wp */
const LayoutOrientation = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.orientation) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$1;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$1;
  return React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Orientation",
    onChange: value => setAttributes({
      orientation: value
    }),
    value: attributes.orientation
  }, React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"
    })),
    "aria-label": "Horizontal",
    showTooltip: true,
    value: "horizontal"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "m16.5 13.5-3.7 3.7V4h-1.5v13.2l-3.8-3.7-1 1 5.5 5.6 5.5-5.6z"
    })),
    "aria-label": "Vertical",
    showTooltip: true,
    value: "vertical"
  }));
};

const {
  RangeControl: RangeControl$1
} = wp.components;

/* global wp */
 
const ContentMaxWidth = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.contentMaxWidth) {
    return null;
  }
  const defaultValue = comet?.defaults?.[name.replace('comet/', '')]?.contentMaxWidth ?? wp.data.select('core/blocks').getBlockType(name)?.attributes?.contentMaxWidth?.default ?? 50;
  return React.createElement(RangeControl$1, {
    label: React.createElement(React.Fragment, null, "Content max width", React.createElement(FieldTooltip, {
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

const {
  __experimentalNumberControl: __experimentalNumberControl$1
} = wp.components;

 
/* global comet, wp */
const MaxPerRow = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.maxPerRow) {
    return null;
  }
  const NumberControl = __experimentalNumberControl$1;
  return React.createElement(NumberControl, {
    __next40pxDefaultSize: true,
    label: React.createElement(React.Fragment, null, "Max items per row", React.createElement(FieldTooltip, {
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
  return React.createElement(NumberControl, {
    __next40pxDefaultSize: true,
    label: React.createElement(React.Fragment, null, "Item count", React.createElement(FieldTooltip, {
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

const {
  BaseControl,
  PanelRow,
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
  return React.createElement(BaseControl, {
    label: React.createElement(React.Fragment, null, "Negative margins ", React.createElement(FieldTooltip, {
      tooltip: 'Bring the elements above or below this block closer to sit on top of the image by the given amount; note that on smaller viewports this may be overridden to ensure the image remains visible'
    }))
  }, React.createElement(PanelRow, null, React.createElement(UnitControl, {
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
  }), React.createElement(UnitControl, {
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

const {
  SelectControl: SelectControl$3
} = wp.components;
const AspectRatio = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.aspectRatio || !comet.aspectRatios) {
    return null;
  }
  const options = comet.aspectRatios.map(ratio => ({
    label: `${sentence_case(ratio.name)} (${ratio.value})`,
    value: ratio.value
  }));
  const label = name === 'comet/gallery' ? React.createElement(React.Fragment, null, "Aspect ratio", React.createElement(FieldTooltip, {
    tooltip: 'The preferred aspect ratio for the image previews'
  })) : 'Aspect ratio';
  return React.createElement(SelectControl$3, {
    label: label,
    size: '__unstable-large',
    value: attributes.aspectRatio,
    options: options,
    onChange: newRatio => setAttributes({
      aspectRatio: newRatio
    })
  });
};
function sentence_case(text) {
  return text.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replaceAll('_', ' ');
}

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
  return React.createElement(React.Fragment, null, React.createElement(ToggleControl, {
    checked: attributes.lightbox,
    label: React.createElement(React.Fragment, null, React.createElement("span", null, "Enable lightbox"), React.createElement(FieldTooltip, {
      tooltip: 'When a visitor clicks on an image, open a larger version in an overlay'
    })),
    onChange: value => setAttributes({
      lightbox: value
    })
  }), React.createElement(ToggleControl, {
    checked: attributes.captions,
    label: "Show image captions if available",
    onChange: value => setAttributes({
      captions: value
    })
  }));
};

const {
  __experimentalToggleGroupControl,
  __experimentalToggleGroupControlOption
} = wp.components;

/* global wp */
const LayoutOrder = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.order) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption;
  return React.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Order",
    onChange: value => setAttributes({
      order: value
    }),
    value: attributes.order
  }, React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"
    })),
    "aria-label": "L-R",
    showTooltip: true,
    value: "row"
  }), React.createElement(ToggleGroupControlOption, {
    label: React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, React.createElement("path", {
      d: "M20 11.2H6.8l3.7-3.7-1-1L3.9 12l5.6 5.5 1-1-3.7-3.7H20z"
    })),
    "aria-label": "R-L",
    showTooltip: true,
    value: "row-reverse"
  }));
};

const {
  PanelBody: PanelBody$2
} = wp.components;

/* global wp */
const LayoutControls$1 = props => {
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
  return React.createElement(PanelBody$2, {
    title: "Layout",
    initialOpen: true
  }, React.createElement(ContainerSize, {
    ...props
  }), React.createElement(AspectRatio, {
    ...props
  }), React.createElement(ContentMaxWidth, {
    ...props
  }), React.createElement(NegativeMargins, {
    ...props
  }), React.createElement(GroupLayout, {
    ...props
  }), React.createElement(ItemCount, {
    ...props
  }), React.createElement(MaxPerRow, {
    ...props
  }), React.createElement(LayoutOrientation, {
    ...props
  }), React.createElement(LayoutOrder, {
    ...props
  }), React.createElement(HorizontalAlignment, {
    ...props
  }), React.createElement(VerticalAlignment, {
    ...props
  }), React.createElement(GalleryControls, {
    ...props
  }));
};

const {
  Dropdown,
  ColorPalette,
  Button,
  ColorIndicator,
  GradientPicker
} = wp.components;
const {
  useRef,
  useState,
  useMemo: useMemo$1
} = wp.element;

/* global wp */
const ColorControls$1 = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!Object.keys(attributes).some(attr => ['colorTheme', 'backgroundColor', 'sectionBackground'].includes(attr))) {
    return null;
  }
  let palette = Object.entries(comet?.palette)?.filter(([key, value]) => !['black', 'white'].includes(key))?.map(([key, value]) => ({
    slug: key,
    name: key,
    color: value
  })) ?? wp.data.select('core/block-editor').getSettings().colors;
  // Most blocks shouldn't have access to the status/message type colours, only brand colours, whereas others are the opposite
  if (['comet/callout'].includes(name)) {
    palette = palette.filter(color => ['error', 'success', 'info', 'warning'].includes(color.slug));
  } else if (['comet/separator'].includes(name)) {
    palette = palette.filter(color => !['error', 'success', 'info', 'warning', 'light'].includes(color.slug));
  } else if (['comet/copy', 'comet/copy-image'].includes(name)) {
    palette = palette.filter(color => !['error', 'success', 'info', 'warning', 'light', 'accent'].includes(color.slug));
  } else {
    palette = palette.filter(color => !['error', 'success', 'info', 'warning'].includes(color.slug));
  }
  if (!palette || palette.length === 0) {
     
    console.error('No colour palette found in component library configuration. You can use theme.json or the comet_canvas_theme_colours filter to add colours. Developers: See set_colours() in ThemeStyle.php in the plugin source for more implementation details.');
    return null;
  }
  const componentDefault = comet?.defaults[name.replace('comet/', '')] ?? {};
  const startValues = {
    colorTheme: attributes?.colorTheme ?? componentDefault?.colorTheme ?? null,
    backgroundColor: attributes?.backgroundColor ?? componentDefault?.backgroundColor ?? null,
    sectionBackground: attributes?.sectionBackground ?? componentDefault?.sectionBackground ?? null
  };
  // Use refs to keep track of the presence of attribute support without the fields disappearing when the colour field is cleared
  const hasColorThemeSupport = useRef(!!startValues.colorTheme);
  const hasBackgroundColorSupport = useRef(!!startValues.backgroundColor);
  const hasSectionBackgroundSupport = useRef(!!startValues?.sectionBackground);
  if (!hasColorThemeSupport.current && !hasBackgroundColorSupport.current && !hasSectionBackgroundSupport.current) {
    return null;
  }
  const [foregroundColor, setForegroundColor] = useState(startValues.colorTheme);
  const [backgroundColors, setBackgroundColors] = useState(startValues.sectionBackground && startValues.sectionBackground !== 'inherit' ? [startValues.sectionBackground, startValues.backgroundColor] : [startValues.backgroundColor]);
  const getValueByColorName = colorName => {
    const color = palette.find(c => c.slug === colorName);
    return color ? color.color : colorName;
  };
  const handleThemeChange = name => {
    setForegroundColor(name);
    setAttributes({
      colorTheme: name ?? ''
    });
  };
  const handleBackgroundChange = value => {
    setBackgroundColors(value);
    setAttributes({
      backgroundColors: value ?? []
    });
  };
  // If background colour is not supported, provide single colour theme option
  // Note: sectionBackground should not be available without backgroundColor being available as well, but that isn't enforced/validated anywhere
  if (!hasBackgroundColorSupport.current) {
    return React.createElement("div", {
      className: "comet-color-controls__item"
    }, React.createElement(ColorPaletteDropdown, {
      label: "Theme",
      hexValue: getValueByColorName(attributes?.colorTheme) ?? '',
      palette: palette,
      onChange: handleThemeChange
    }));
  }
  // If section background is supported
  if (hasSectionBackgroundSupport.current) {
    return React.createElement(ColorTripletSelector, {
      value: {
        foreground: foregroundColor,
        backgrounds: backgroundColors
      },
      blockName: name.split('/')[1],
      onChange: newValues => {
        handleThemeChange(newValues.foreground);
        handleBackgroundChange(newValues.backgrounds);
      }
    });
  }
  // If both colour theme and background colour are available but not section background, provide colour pair selection
  return React.createElement("div", {
    className: "comet-color-controls__item"
  }, React.createElement(ColorPairPaletteDropdown, {
    value: {
      foreground: foregroundColor,
      background: backgroundColors[0]
    },
    blockName: name.split('/')[1],
    onChange: newValue => {
      handleThemeChange(newValue.foreground);
      handleBackgroundChange(newValue.background);
    }
  }));
};
function ColorPaletteDropdown({
  label,
  hexValue,
  palette,
  onChange
}) {
  const [hex, setHex] = useState(hexValue);
  const triggerRef = useRef();
  const getNameByColorValue = colorValue => {
    const color = palette.find(c => c.color === colorValue);
    return color ? color.slug : colorValue;
  };
  return React.createElement(Dropdown, {
    renderToggle: ({
      onToggle,
      isOpen
    }) => React.createElement(Button, {
      onClick: onToggle,
      "aria-expanded": isOpen,
      ref: triggerRef,
      __next40pxDefaultSize: true
    }, React.createElement(ColorIndicator, {
      colorValue: hex
    }), label),
    renderContent: ({
      onToggle
    }) => React.createElement(ColorPalette, {
      label: label,
      value: hex,
      colors: palette,
      onChange: color => {
        setHex(color ?? '');
        onChange(getNameByColorValue(color));
        onToggle(); // close dropdown after selection
      }
    })
  });
}
function ColorPairPaletteDropdown({
  blockName,
  label = 'Theme',
  value,
  onChange
}) {
  const [foreground, setForeground] = useState(value?.foreground ?? '');
  const [background, setBackground] = useState(value?.background !== 'transparent' ? value?.background : comet?.globalBackground ?? 'white');
  const triggerRef = useRef();
  const pairs = comet?.colourPairOverrides[blockName] ?? comet?.colourPairs ?? [];
  const palette = pairs.map(pair => ({
    name: `${pair.foreground} on ${pair.background}`,
    slug: `${pair.foreground}-${pair.background}`,
    gradient: `linear-gradient(135deg, var(--color-${pair.foreground}) 0%, var(--color-${pair.foreground}) 50%, var(--color-${pair.background}) 50%, var(--color-${pair.background}) 100%)`
  }));
  const gradientPreview = useMemo$1(() => {
    return `linear-gradient(135deg, var(--color-${foreground}) 0%, var(--color-${foreground}) 50%, var(--color-${background}) 50%, var(--color-${background}) 100%)`;
  }, [foreground, background]);
  const handleChange = newValue => {
    // New value is the gradient string; find the matching palette object
    const matchedPair = palette.find(pair => pair.gradient === newValue);
    if (matchedPair) {
      const [newForeground, newBackground] = matchedPair.slug.split('-');
      setForeground(newForeground);
      setBackground(newBackground);
      onChange({
        foreground: newForeground,
        background: newBackground
      });
    }
  };
  return React.createElement(Dropdown, {
    renderToggle: ({
      onToggle,
      isOpen
    }) => React.createElement(Button, {
      onClick: onToggle,
      "aria-expanded": isOpen,
      ref: triggerRef,
      __next40pxDefaultSize: true
    }, React.createElement(ColorIndicator, {
      colorValue: gradientPreview
    }), label),
    renderContent: ({
      isOpen,
      onToggle
    }) => React.createElement(GradientPicker, {
      label: label,
      value: gradientPreview,
      gradients: palette,
      disableCustomGradients: true,
      className: `comet-color-controls comet-color-controls--${blockName}`,
      onChange: value => {
        handleChange(value);
        onToggle(); // close dropdown after selection
      }
    })
  });
}
function ColorTripletSelector({
  blockName,
  value,
  onChange
}) {
  const triggerRef = useRef();
  const sectionBackground = value.backgrounds[0] !== 'transparent' ? value.backgrounds[0] : '';
  const sectionPalette = Object.keys(comet?.sectionBackgrounds ?? []).map(option => ({
    name: option,
    slug: option,
    gradient: option
  }));
  sectionPalette.unshift({
    name: 'From theme',
    slug: '',
    gradient: ''
  });
  sectionPalette.unshift({
    name: 'Transparent',
    slug: '',
    gradient: ''
  });
  const handleChange = values => {
    onChange(values);
  };
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "comet-color-controls__item"
  }, React.createElement(ColorPairPaletteDropdown, {
    blockName: blockName,
    value: value,
    onChange: ({
      foreground,
      background
    }) => {
      handleChange({
        foreground,
        backgrounds: [sectionBackground, background]
      });
    }
  })), React.createElement("div", {
    className: "comet-color-controls__item"
  }, React.createElement(Dropdown, {
    renderToggle: ({
      onToggle,
      isOpen
    }) => React.createElement(Button, {
      onClick: onToggle,
      "aria-expanded": isOpen,
      ref: triggerRef,
      __next40pxDefaultSize: true
    }, React.createElement(ColorIndicator, {
      colorValue: ""
    }), "Section background"),
    renderContent: ({
      isOpen,
      onToggle
    }) => React.createElement(GradientPicker, {
      label: "Section background",
      value: sectionBackground,
      gradients: sectionPalette,
      disableCustomGradients: true,
      className: `comet-color-controls comet-color-controls--${blockName}`,
      onChange: value => {
        handleChange({
          backgrounds: [value]
        });
        onToggle(); // close dropdown after selection
      },
      clearable: true
    })
  })));
}

const {
  RangeControl
} = wp.components;

/* global wp */
const BackgroundOpacity = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.backgroundOpacity) {
    return null;
  }
  const defaultValue = comet?.defaults?.[name.replace('comet/', '')]?.backgroundOpacity ?? wp.data.select('core/blocks').getBlockType(name)?.attributes?.backgroundOpacity?.default ?? 0;
  return React.createElement(RangeControl, {
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

const {
  SelectControl: SelectControl$2
} = wp.components;
const BackgroundType = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.backgroundType) {
    return null;
  }
  const options = [{
    label: 'Content',
    value: 'content'
  }, {
    label: 'Overlay',
    value: 'overlay'
  }];
  return React.createElement(SelectControl$2, {
    label: "Background type",
    size: '__unstable-large',
    value: attributes.backgroundType,
    options: options,
    onChange: newType => setAttributes({
      backgroundType: newType
    })
  });
};

const {
  SelectControl: SelectControl$1,
  ExternalLink
} = wp.components;
const HtmlTag = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.tagName) {
    return null;
  }
  const options = [{
    label: 'div',
    value: 'div'
  }, {
    label: 'section',
    value: 'section'
  }];
  // TODO: Find a way to set the available tags per-block based on what the underlying PHP component supports
  if (name === 'comet/gallery') {
    options.push({
      label: 'figure',
      value: 'figure'
    });
  }
  return React.createElement(SelectControl$1, {
    label: React.createElement(React.Fragment, null, "HTML Element", React.createElement(FieldTooltip, {
      tooltip: 'The HTML tag to use for the block container, or in some cases the main content within'
    })),
    help: React.createElement(React.Fragment, null, "HTML tags are used to structure content and are important for machine-readability, such as by assistive technologies and search engines.\u00A0", React.createElement(ExternalLink, {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
    }, "Learn more about HTML")),
    size: '__unstable-large',
    value: attributes.tagName,
    options: options,
    onChange: value => setAttributes({
      tagName: value
    })
  });
};

const {
  InspectorControls: InspectorControls$1,
  InspectorAdvancedControls
} = wp.blockEditor;
const {
  PanelBody: PanelBody$1
} = wp.components;

/**
 * Render BlockEdit component with controls for custom attributes
 * @param BlockEdit The original BlockEdit component
 * @param {Object} props The block edit props
 */
function CometBlockControls({
  BlockEdit,
  ...props
}) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "comet-plugin-blocks-custom-controls"
  }, React.createElement(InspectorControls$1, null, React.createElement(LayoutControls$1, {
    ...props
  }), Object.keys(props?.attributes).some(attr => ['colorTheme', 'backgroundColor', 'backgroundOpacity', 'backgroundType'].includes(attr)) && React.createElement(PanelBody$1, {
    title: "Colours",
    initialOpen: true,
    className: `comet-color-controls comet-color-controls--${props.name.split('/')[1]}`
  }, React.createElement(ColorControls$1, {
    ...props
  }), React.createElement(BackgroundOpacity, {
    ...props
  }), React.createElement(BackgroundType, {
    ...props
  }))), React.createElement(InspectorAdvancedControls, null, React.createElement(HtmlTag, {
    ...props
  }))), React.createElement(BlockEdit, {
    ...props
  }));
}

/* global wp */
const {
  addFilter
} = wp.hooks;
const {
  InspectorControls
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
 * and the compiled *dist.js loaded into the editor via the enqueue_block_editor_assets PHP hook
 */
wp.domReady(() => {
  addFilter('editor.BlockEdit', 'comet-plugin-blocks/custom-controls', BlockEdit => props => {
    const BlockEditComponent = useMemo(() => {
      if (props?.name === 'ninja-forms/form') {
        return NinjaFormsControls;
      }
      return CometBlockControls;
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
//# sourceMappingURL=CustomControls.dist.js.map

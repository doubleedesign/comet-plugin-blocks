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
  Button: Button$1,
  Tooltip
} = wp.components;
const FieldTooltip = ({
  tooltip
}) => {
  if (!tooltip) {
    return null;
  }
  return wp.element.createElement("span", {
    className: "comet-field-tooltip"
  }, wp.element.createElement(Tooltip, {
    text: wp.element.createElement("span", {
      style: {
        display: 'block',
        maxWidth: '200px'
      }
    }, tooltip)
  }, wp.element.createElement(Button$1, {
    size: "small",
    icon: wp.element.createElement("svg", {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, wp.element.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z"
    }))
  })));
};

const CONTAINER_SIZES = [{
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

const {
  useMemo: useMemo$7
} = wp.element;
const {
  SelectControl: SelectControl$4
} = wp.components;
const ContainerSize = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.size && !attributes?.innerSize) {
    return null;
  }
  if (!attributes?.innerSize) {
    return wp.element.createElement(ContainerOnly, {
      attributes: attributes,
      setAttributes: setAttributes
    });
  }
  return wp.element.createElement(ContainerAndInner, {
    attributes: attributes,
    setAttributes: setAttributes
  });
};
const ContainerOnly = ({
  attributes,
  setAttributes
}) => {
  return wp.element.createElement(SelectControl$4, {
    label: wp.element.createElement(wp.element.Fragment, null, "Container size", wp.element.createElement(FieldTooltip, {
      tooltip: 'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes.size,
    options: CONTAINER_SIZES,
    onChange: newSize => setAttributes({
      size: newSize
    })
  });
};
const ContainerAndInner = ({
  attributes,
  setAttributes
}) => {
  const options = CONTAINER_SIZES;
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
  const filteredInnerOptions = useMemo$7(() => {
    const containerSizeIndex = options.findIndex(option => option.value === attributes.size);
    return innerOptions.slice(containerSizeIndex);
  }, [attributes.size]);
  return wp.element.createElement(wp.element.Fragment, null, wp.element.createElement(SelectControl$4, {
    label: wp.element.createElement(wp.element.Fragment, null, "Container size", wp.element.createElement(FieldTooltip, {
      tooltip: 'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes.size,
    options: options,
    onChange: updateContainerSize
  }), wp.element.createElement(SelectControl$4, {
    label: wp.element.createElement(wp.element.Fragment, null, "Inner content size", wp.element.createElement(FieldTooltip, {
      tooltip: 'Optionally override the inner content\'s overall max width; may appear to have no effect on smaller viewports'
    })),
    size: '__unstable-large',
    value: attributes.innerSize,
    options: filteredInnerOptions,
    onChange: updateinnerSize
  }));
};

/* global wp */
const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$5,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$5
} = wp.components;
const GroupLayout = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.layout) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$5;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$5;
   
  return wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Group layout",
    help: "Note: Items may stack on small viewports regardless of the layout selection.",
    onChange: value => setAttributes({
      layout: value
    }),
    value: attributes.layout
  }, wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, wp.element.createElement("path", {
      d: "M18 5.5H6a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5ZM6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 5h1.5v1.5H7V9Zm1.5 4.5H7V15h1.5v-1.5ZM10 9h7v1.5h-7V9Zm7 4.5h-7V15h7v-1.5Z"
    })),
    "aria-label": "List",
    showTooltip: true,
    value: "list"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "m3 5c0-1.10457.89543-2 2-2h13.5c1.1046 0 2 .89543 2 2v13.5c0 1.1046-.8954 2-2 2h-13.5c-1.10457 0-2-.8954-2-2zm2-.5h6v6.5h-6.5v-6c0-.27614.22386-.5.5-.5zm-.5 8v6c0 .2761.22386.5.5.5h6v-6.5zm8 0v6.5h6c.2761 0 .5-.2239.5-.5v-6zm0-8v6.5h6.5v-6c0-.27614-.2239-.5-.5-.5z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })),
    "aria-label": "Grid",
    showTooltip: true,
    value: "grid"
  }));
};

/* global wp */
const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$4,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$4
} = wp.components;
const VerticalAlignment = ({
  attributes,
  setAttributes
}) => {
  // TODO: Use component defaults from comet JS object (which are set using the PHP global Config object). They should take precedence over block.json
  if (!attributes?.vAlign) {
    return null;
  }
  // We generally do not expect a component to support both "group layout" (grid or list) and vertical alignment
  if (attributes?.layout) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$4;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$4;
  return wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Vertical alignment",
    onChange: value => setAttributes({
      vAlign: value
    }),
    value: attributes.vAlign
  }, wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M9 20h6V9H9v11zM4 4v1.5h16V4H4z"
    })),
    "aria-label": "Start",
    showTooltip: true,
    value: "start"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z"
    })),
    "aria-label": "Middle",
    showTooltip: true,
    value: "center"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z"
    })),
    "aria-label": "End",
    showTooltip: true,
    value: "end"
  }));
};

/* global wp */
const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$3,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$3
} = wp.components;
const HorizontalAlignment = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.hAlign) {
    return null;
  }
  if (attributes.layout && attributes.layout === 'list') {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$3;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$3;
  return wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement(wp.element.Fragment, null, "Horizontal Alignment", wp.element.createElement(FieldTooltip, {
      tooltip: 'How to align the content if it does not take up the full width of the container'
    })),
    "aria-label": "Horizontal alignment",
    onChange: value => setAttributes({
      hAlign: value
    }),
    value: attributes.hAlign
  }, wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M9 9v6h11V9H9zM4 20h1.5V4H4v16z"
    })),
    "aria-label": "Start",
    showTooltip: true,
    value: "start"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z"
    })),
    "aria-label": "Middle",
    showTooltip: true,
    value: "center"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z"
    })),
    "aria-label": "End",
    showTooltip: true,
    value: "end"
  }));
};

/* global wp */
const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$2,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$2
} = wp.components;
const LayoutOrientation = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.orientation) {
    return null;
  }
  // We generally do not expect a component to support both "group layout" (grid or list) and orientation
  if (attributes?.layout) {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$2;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$2;
  return wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Orientation",
    onChange: value => setAttributes({
      orientation: value
    }),
    value: attributes.orientation
  }, wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"
    })),
    "aria-label": "Horizontal",
    showTooltip: true,
    value: "horizontal"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "m16.5 13.5-3.7 3.7V4h-1.5v13.2l-3.8-3.7-1 1 5.5 5.6 5.5-5.6z"
    })),
    "aria-label": "Vertical",
    showTooltip: true,
    value: "vertical"
  }));
};

/* global wp */
 
const {
  RangeControl: RangeControl$1
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
  return wp.element.createElement(RangeControl$1
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement(wp.element.Fragment, null, "Content max width", wp.element.createElement(FieldTooltip, {
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

 
/* global comet, wp */
const {
  __experimentalNumberControl: __experimentalNumberControl$1
} = wp.components;
const MaxPerRow = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.maxPerRow) {
    return null;
  }
  if (name !== 'comet/gallery' && attributes?.layout !== 'grid') {
    return null;
  }
  const NumberControl = __experimentalNumberControl$1;
  return wp.element.createElement(NumberControl, {
    __next40pxDefaultSize: true,
    label: wp.element.createElement(wp.element.Fragment, null, "Max per row", wp.element.createElement(FieldTooltip, {
      tooltip: 'The preferred number of items per row in containers wide enough to accommodate them; items may be stacked to a smaller number on smaller viewports'
    })),
    value: attributes.maxPerRow,
    min: 2,
    max: 6,
    onChange: newMax => {
      try {
        newMax = newMax ? parseInt(newMax) : attributes.maxPerRow;
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
  if (!attributes?.layout) {
    return null;
  }
  const NumberControl = __experimentalNumberControl;
  return wp.element.createElement(NumberControl, {
    __next40pxDefaultSize: true,
    label: wp.element.createElement(wp.element.Fragment, null, "Item count", wp.element.createElement(FieldTooltip, {
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
  return wp.element.createElement(BaseControl, {
    label: wp.element.createElement(wp.element.Fragment, null, "Negative margins ", wp.element.createElement(FieldTooltip, {
      tooltip: 'Bring the elements above or below this block closer to sit on top of the image by the given amount; note that on smaller viewports this may be overridden to ensure the image remains visible'
    }))
  }, wp.element.createElement(PanelRow, null, wp.element.createElement(UnitControl, {
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
  }), wp.element.createElement(UnitControl, {
    label: "Bottom",
    __next40pxDefaultSize: true,
    max: 0,
    value: attributes.negativeBottomMargin,
    onChange: value => {
      return setAttributes({
        negativeBottomMargin: value
      });
    },
    onUnitChange: unit => {
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
  const label = name === 'comet/gallery' ? wp.element.createElement(wp.element.Fragment, null, "Aspect ratio", wp.element.createElement(FieldTooltip, {
    tooltip: 'The preferred aspect ratio for the image previews'
  })) : 'Aspect ratio';
  return wp.element.createElement(SelectControl$3, {
    label: label,
    size: '__unstable-large',
    value: attributes.aspectRatio?.value,
    options: options,
    onChange: newRatio => setAttributes({
      aspectRatio: newRatio
    })
  });
};
function sentence_case(text) {
  return text.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replaceAll('_', ' ');
}

/* global wp */
const {
  __experimentalToggleGroupControl: __experimentalToggleGroupControl$1,
  __experimentalToggleGroupControlOption: __experimentalToggleGroupControlOption$1
} = wp.components;
const LayoutOrder = ({
  attributes,
  setAttributes
}) => {
  if (!attributes?.order) {
    return null;
  }
  // We generally do not expect a component to support both "group layout" (grid or list) and order.
  // Order is for pretty specific use cases like "Copy + image"
  if (attributes?.layout) {
    return null;
  }
  // Similarly it doesn't make sense to offer L-R and R-L options of the layout is not horizontal
  if (attributes?.orientation && attributes.orientation !== 'horizontal') {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl$1;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption$1;
  return wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    label: "Order",
    onChange: value => setAttributes({
      order: value
    }),
    value: attributes.order
  }, wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "m14.5 6.5-1 1 3.7 3.7H4v1.6h13.2l-3.7 3.7 1 1 5.6-5.5z"
    })),
    "aria-label": "L-R",
    showTooltip: true,
    value: "row"
  }), wp.element.createElement(ToggleGroupControlOption
  // @ts-expect-error TS2322: Type Element is not assignable to type string
  , {
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M20 11.2H6.8l3.7-3.7-1-1L3.9 12l5.6 5.5 1-1-3.7-3.7H20z"
    })),
    "aria-label": "R-L",
    showTooltip: true,
    value: "row-reverse"
  }));
};

/* global wp */
const {
  PanelBody: PanelBody$5
} = wp.components;
const LayoutControls = props => {
  // Columns has its own layout control group
  if (props.name === 'comet/columns') return null;
  // If the block does not have any layout attributes, do not render the controls
  const componentDefault = Object.keys(comet?.defaults?.[props?.name?.replace('comet/', '')] ?? {}) ?? [];
  const currentAttributes = Object.keys(props.attributes) ?? [];
  if (componentDefault.length === 0 && currentAttributes.length === 0) {
    return null;
  }
  const layoutAttributes = ['size', 'layout', 'orientation', 'hAlign', 'vAlign', 'backgroundType', 'maxPerRow'];
  const isNested = props?.context?.isNested;
  const hasLayoutAttributes = [...componentDefault, ...currentAttributes].filter(attr => {
    if (isNested) {
      return !['size'].includes(attr);
    }
    return true;
  }).some(attr => {
    return layoutAttributes.includes(attr);
  });
  if (!hasLayoutAttributes) {
    return null;
  }
  return wp.element.createElement(PanelBody$5, {
    title: "Layout",
    initialOpen: true
  }, !isNested && wp.element.createElement(ContainerSize, {
    ...props
  }), wp.element.createElement(AspectRatio, {
    ...props
  }), wp.element.createElement(ContentMaxWidth, {
    ...props
  }), wp.element.createElement(NegativeMargins, {
    ...props
  }), wp.element.createElement(GroupLayout, {
    ...props
  }), wp.element.createElement("div", {
    className: "components-base-control comet-control-pair"
  }, wp.element.createElement(ItemCount, {
    ...props
  }), wp.element.createElement(MaxPerRow, {
    ...props
  })), wp.element.createElement(LayoutOrientation, {
    ...props
  }), wp.element.createElement(LayoutOrder, {
    ...props
  }), wp.element.createElement(HorizontalAlignment, {
    ...props
  }), wp.element.createElement(VerticalAlignment, {
    ...props
  }));
};

function ColorSwatch({
  colorTheme,
  backgroundColor
}) {
  const defaultBackground = comet?.globalBackground ?? 'white';
  if (!colorTheme && !backgroundColor) {
    return wp.element.createElement(ColorSwatchInner, {
      caption: "No colour selected",
      backgroundColor: undefined
    });
  }
  if (!backgroundColor && colorTheme) {
    return wp.element.createElement(ColorSwatchInner, {
      colorTheme: colorTheme,
      caption: colorTheme,
      backgroundColor: defaultBackground
    });
  }
  if (!colorTheme && backgroundColor) {
    return wp.element.createElement(ColorSwatchInner, {
      backgroundColor: backgroundColor,
      caption: backgroundColor
    });
  }
  return wp.element.createElement(ColorSwatchInner, {
    caption: `${colorTheme} on ${backgroundColor}`,
    colorTheme: colorTheme,
    backgroundColor: backgroundColor
  });
}
function ColorSwatchInner({
  colorTheme,
  backgroundColor,
  caption
}) {
  const backgroundIsGradientOrUndefined = backgroundColor?.includes('-') || backgroundColor === undefined;
  return wp.element.createElement("figure", {
    className: "comet-color-swatch",
    "data-testid": "comet-color-swatch",
    "aria-label": `Colour preview: ${caption}`
  }, wp.element.createElement("div", {
    className: "comet-color-swatch__preview",
    "data-background": backgroundColor,
    "data-color-theme": colorTheme
  }, !backgroundIsGradientOrUndefined ? 'The quick brown fox jumps over the lazy dog' : null), wp.element.createElement("figcaption", {
    className: "comet-color-swatch__caption"
  }, caption));
}

function transformColorValueToKey(value) {
  if (!value || typeof value !== 'string') {
    return undefined;
  }
  if (value.startsWith('var(--color-')) {
    return value.replace('var(--color-', '').replace(')', '');
  }
  if (value.startsWith('var(--gradient-')) {
    return value.replace('var(--gradient-', '').replace(')', '');
  }
  if (value.startsWith('linear-gradient')) {
    const regex = /var\(--color-([a-zA-Z0-9]+)\)/g;
    const matches = [...value.matchAll(regex)]?.map(match => match[1]);
    const uniqueMatches = [...new Set(matches)];
    if (uniqueMatches.length == 2) {
      return `${uniqueMatches[0]}-${uniqueMatches[1]}`;
    }
  }
  console.log('unmatched value', value);
  return value;
}
function transformColorKeyToValue(key) {
  if (!key || typeof key !== 'string') {
    return undefined;
  }
  if (key.includes('-')) {
    return `var(--gradient-${key})`;
  }
  return `var(--color-${key})`;
}
function transformValueKeyToPair(key) {
  if (!key || typeof key !== 'string' || !key.includes('')) {
    return undefined;
  }
  if (key.includes(' on ')) {
    const [foreground, background] = key.split(' on ');
    return {
      foreground: foreground.trim(),
      background: background.trim()
    };
  }
  return {
    foreground: key.split('-')[0],
    background: key.split('-')[1]
  };
}
function transformColorPairsToPalette(pairs) {
  return pairs.map(pair => ({
    name: `${pair.foreground} on ${pair.background}`,
    slug: `${pair.foreground}-${pair.background}`,
     
    gradient: `linear-gradient(135deg, var(--color-${pair.foreground}) 0%, var(--color-${pair.foreground}) 50%, var(--color-${pair.background}) 50%, var(--color-${pair.background}) 100%)`
  }));
}
function difference(array1, array2) {
  return array1.filter(item => !array2.some(otherItem => otherItem.slug === item.slug));
}

const {
  useMemo: useMemo$6
} = wp.element;
const useHoverAndFocus = ({
  element,
  onEnterButton,
  onLeaveButton
}) => {
  const buttons = useMemo$6(() => {
    if (!element) {
      return [];
    }
    return Array.from(element.querySelectorAll('button, [role="button"]'));
  }, [element]);
  const handleOn = event => {
    onEnterButton((event.target.ariaLabel || event.target.innerText).toLowerCase());
  };
  const handleOff = () => {
    onLeaveButton();
  };
  buttons.forEach(button => {
    button.addEventListener('mouseenter', handleOn);
    button.addEventListener('mouseleave', handleOff);
    button.addEventListener('focus', handleOn);
    button.addEventListener('blur', handleOff);
    return () => {
      button.removeEventListener('mouseenter', handleOn);
      button.removeEventListener('mouseleave', handleOff);
      button.removeEventListener('focus', handleOn);
      button.removeEventListener('blur', handleOff);
    };
  });
};

const {
  useState: useState$1,
  useMemo: useMemo$5,
  useCallback: useCallback$3,
  useRef: useRef$1,
  useEffect: useEffect$3
} = wp.element;
const {
  ColorPalette
} = wp.components;
function ColorPalettePicker({
  previewType,
  value,
  onChange,
  ...props
}) {
  const elementRef = useRef$1(null);
  const [activeValue, setActiveValue] = useState$1(value);
  const [mounted, setMounted] = useState$1(false);
  // Trigger a re-render when the ref has mounted so the useHoverAndFocus hook gets the resolved element, not null
  useEffect$3(() => {
    if (elementRef?.current) {
      setMounted(true);
    }
  }, [elementRef]);
  // Because the individual colour palette swatches are buried deep in the imported components,
  // which don't have callback props for the events we want to use,
  // this is a somewhat hacky way of finding them to temporarily swap our preview swatch on hover/focus.
  useHoverAndFocus({
    element: elementRef?.current,
    onEnterButton: slug => setActiveValue(slug),
    onLeaveButton: () => setActiveValue(value)
  });
  // Handle an actual selection change (click/Enter)
  const handleChange = useCallback$3(newValue => {
    const valueKey = transformColorValueToKey(newValue);
    setActiveValue(valueKey);
    onChange(valueKey);
  }, []);
  const gradientAsColorPair = transformValueKeyToPair(activeValue);
  const swatchValues = useMemo$5(() => {
    if (previewType === 'content') {
      return gradientAsColorPair ? {
        colorTheme: gradientAsColorPair.foreground,
        backgroundColor: gradientAsColorPair.background
      } : {
        colorTheme: activeValue,
        backgroundColor: undefined
      };
    }
    return {
      colorTheme: undefined,
      backgroundColor: activeValue
    };
  }, [activeValue, previewType, gradientAsColorPair]);
  return wp.element.createElement("div", {
    ref: elementRef,
    className: "comet-color-palette"
  }, wp.element.createElement(ColorSwatch, {
    ...swatchValues
  }), wp.element.createElement(ColorPalettePickerInner, {
    ...props,
    value: value,
    onChange: handleChange
  }));
}
function ColorPalettePickerInner({
  colors = [],
  gradients = [],
  value,
  onChange,
  ...props
}) {
  const statusColors = useMemo$5(() => colors.filter(color => ['success', 'info', 'warning', 'error'].includes(color.slug)), [colors]);
  const brandColors = useMemo$5(() => difference(colors, statusColors), [colors, statusColors]);
  // Because we are working with a limited palette and CSS variables instead of raw colour values,
  // with some CSS adjustments we don't actually need to use the gradient-specific palette component
  // - we can treat them all as colours
  const combinedBrandPalette = useMemo$5(() => {
    return [...brandColors, ...gradients].reduce((acc, item) => {
      if ('color' in item) {
        acc.push(item);
        return acc;
      }
      if (['success', 'info', 'warning', 'error'].some(status => item.slug.includes(status))) {
        return acc;
      }
      acc.push({
        name: item.name,
        slug: item.slug,
        color: item.gradient
      });
      return acc;
    }, []);
  }, [colors, gradients]);
  const combinedStatusPalette = useMemo$5(() => {
    return [...statusColors, ...gradients].reduce((acc, item) => {
      if ('color' in item) {
        acc.push(item);
        return acc;
      }
      if (!['success', 'info', 'warning', 'error'].some(status => item.slug.includes(status))) {
        return acc;
      }
      acc.push({
        name: item.name,
        slug: item.slug,
        color: item.gradient
      });
      return acc;
    }, []);
  }, [colors, gradients]);
  const multiPalette = useMemo$5(() => {
    return [{
      name: 'Brand colours',
      slug: 'brand',
      colors: combinedBrandPalette
    }, {
      name: 'Status colours',
      slug: 'status',
      colors: combinedStatusPalette
    }];
  }, [brandColors, statusColors]);
  return wp.element.createElement(ColorPalette, {
    ...props,
    className: "comet-color-palette__picker",
    asButtons: true,
    headingLevel: "3",
    colors: statusColors.length > 0 ? multiPalette : combinedBrandPalette,
    disableCustomColors: true,
    value: transformColorKeyToValue(value),
    onChange: (newValue, index, slug) => {
      if (slug) {
        onChange(slug);
      } else {
        // Sometimes the underlying component doesn't pass the slug back up even when we've definitely provided it,
        // so we need a fallback to handle that scenario
        onChange(transformColorValueToKey(newValue));
      }
    }
  });
}

const {
  createContext: createContext$1,
  useContext: useContext$1,
  useCallback: useCallback$2
} = wp.element;
const ColourContext = createContext$1({
  values: {},
  onChange: () => {}
});
const ColourContextProvider = ({
  values,
  onChange,
  children
}) => {
  const handleChange = useCallback$2(newValue => {
    const transformedNewValue = Object.keys(newValue).reduce((acc, key, index) => {
      const value = newValue[key];
      acc[key] = value ? transformColorValueToKey(value) : undefined;
      return acc;
    }, {});
    onChange(transformedNewValue);
  }, []);
  return wp.element.createElement(ColourContext.Provider, {
    value: {
      values,
      onChange: handleChange
    }
  }, children);
};
const useColourContext = () => {
  const context = useContext$1(ColourContext);
  if (!context) {
    throw new Error('useColourContext must be called from within the ColourContextProvider');
  }
  return context;
};
const useSingleColourContext = key => {
  const context = useContext$1(ColourContext);
  if (!context) {
    throw new Error('useSingleColourContext must be called from within the ColourContextProvider');
  }
  const {
    values,
    onChange
  } = context;
  const handleSingleValueChange = useCallback$2(value => {
    onChange({
      [key]: value
    });
  }, [onChange]);
  return {
    value: values[key],
    onChange: value => {
      handleSingleValueChange(value);
    }
  };
};

const {
  Dropdown,
  Button
} = wp.components;
const {
  createContext,
  useContext,
  useRef
} = wp.element;
function PopupMenu({
  testId,
  className,
  children,
  onToggle,
  onClose
}) {
  const triggerRef = useRef(null);
  const popoverAnchorRef = useRef(null);
  if (!Array.isArray(children) || children.length !== 2) {
    console.error('PopupMenu must contain PopupMenu.Trigger and PopupMenu.Content as children');
    return null;
  }
  const trigger = children.find(child => child.type === PopupMenu.Trigger);
  const content = children.find(child => child.type === PopupMenu.Content);
  if (!trigger || !content) {
    console.error('PopupMenu must contain PopupMenu.Trigger and PopupMenu.Content as children');
    return null;
  }
  return wp.element.createElement("div", {
    ref: popoverAnchorRef,
    className: `${className} comet-popup`,
    "data-testid": testId
  }, wp.element.createElement(Dropdown, {
    renderToggle: renderProps => wp.element.createElement(RenderPropProvider, {
      ref: triggerRef,
      ...renderProps,
      onToggle: () => {
        renderProps.onToggle();
        onToggle?.({
          isOpen: !renderProps.isOpen
        });
      },
      onClose: () => {
        renderProps.onClose();
        onClose?.();
      }
    }, trigger),
    renderContent: renderProps => wp.element.createElement(RenderPropProvider, {
      ref: popoverAnchorRef,
      ...renderProps,
      onToggle: () => {
        renderProps.onToggle();
        onToggle?.({
          isOpen: !renderProps.isOpen
        });
      },
      onClose: () => {
        renderProps.onClose();
        onClose?.();
      }
    }, content),
    popoverProps: {
      inline: true,
      anchorRef: popoverAnchorRef,
      className: 'comet-popup__content'
    }
  }));
}
const RenderPropContext = createContext(null);
// Wrapping the children inside PopupMenu with RenderPropContext.Provider directly doesn't wrap them properly,
// but doing it this way does ¯\_(ツ)_/¯
function RenderPropProvider({
  children,
  ...renderProps
}) {
  return wp.element.createElement(RenderPropContext.Provider, {
    value: renderProps
  }, children);
}
PopupMenu.Trigger = function Trigger({
  ariaLabel,
  children
}) {
  const renderProps = useContext(RenderPropContext);
  if (!renderProps) throw new Error('PopupMenu.Trigger must be used inside PopupMenu');
  return wp.element.createElement(Button, {
    className: "comet-popup__trigger",
    onClick: () => {
      renderProps?.onToggle();
      renderProps?.isOpen && renderProps?.onClose();
    },
    "aria-expanded": renderProps.isOpen,
    ref: renderProps.ref,
    "aria-label": ariaLabel,
    __next40pxDefaultSize: true
  }, children);
};
PopupMenu.Content = function Content({
  children
}) {
  const renderProps = useContext(RenderPropContext);
  if (!renderProps) throw new Error('PopupMenu.Content must be used inside PopupMenu');
  return wp.element.createElement("div", {
    ref: renderProps.ref
  }, typeof children === 'function' ? children(renderProps) : null);
};

const {
  ColorIndicator: ColorIndicator$1
} = wp.components;
const {
  useEffect: useEffect$2,
  useMemo: useMemo$4
} = wp.element;
function ContextualColorPaletteDropdown({
  colorContextKey,
  ...props
}) {
  const {
    value,
    onChange
  } = useSingleColourContext(colorContextKey ?? 'colorTheme');
  return wp.element.createElement(ColorPaletteDropdown, {
    ...props,
    value: value,
    onChange: onChange,
    previewType: colorContextKey === 'colorTheme' ? 'content' : 'background'
  });
}
function ColorPaletteDropdown({
  value,
  label,
  palette,
  onChange,
  clearable = false,
  previewType = 'background'
}) {
  useEffect$2(() => {
    if (!palette) return;
    if (!value) return; // allows clearing the value
    function validateValue(value) {
      return palette.find(color => color.slug === value) !== undefined;
    }
    // If the current value is not valid, default to the first palette option
    if (!validateValue(value) && palette?.[0]?.slug) {
      onChange(palette[0].slug);
    }
  }, [value, palette]);
  const singleColours = useMemo$4(() => {
    return palette.filter(color => !color.slug.includes('-'));
  }, [palette]);
  const gradients = useMemo$4(() => {
    return palette.filter(color => color.slug.includes('-')).map(item => ({
      name: item.name,
      slug: item.slug,
      gradient: `var(--gradient-${item.slug})`
    }));
  }, [palette]);
  return wp.element.createElement(PopupMenu, {
    className: "comet-color-controls__item",
    "data-testid": "comet-single-color-selector"
  }, wp.element.createElement(PopupMenu.Trigger, {
    ariaLabel: label
  }, label, value && value.includes('-') ? wp.element.createElement(ColorIndicator$1, {
    colorValue: `var(--gradient-${value})`,
    "data-testid": "comet-color-indicator",
    "aria-label": `Selected colours: ${value.replace('-', ' and ')}`
  }) : wp.element.createElement(ColorIndicator$1, {
    colorValue: value ? `var(--color-${value})` : undefined,
    "data-testid": "comet-color-indicator",
    "aria-label": value ? `Selected colour: ${value}` : 'No colour selected'
  })), wp.element.createElement(PopupMenu.Content, null, ({
    onToggle
  }) => wp.element.createElement(ColorPalettePicker, {
    clearable: clearable,
    value: value,
    colors: singleColours,
    gradients: gradients,
    previewType: previewType,
    onChange: newValue => {
      onChange(newValue);
      onToggle(); // close dropdown after selection
    }
  })));
}

var ColourTypeLabel;
(function (ColourTypeLabel) {
  ColourTypeLabel["COLOUR_THEME"] = "Colour theme";
  ColourTypeLabel["BACKGROUND"] = "Background colour";
  ColourTypeLabel["SECTION_BACKGROUND"] = "Section background";
  ColourTypeLabel["PAIR"] = "Colour pair";
})(ColourTypeLabel || (ColourTypeLabel = {}));

const {
  useMemo: useMemo$3,
  useState,
  useEffect: useEffect$1,
  useCallback: useCallback$1
} = wp.element;
const {
  ColorIndicator
} = wp.components;
function ContextualColorPairDropdown({
  blockName,
  ...props
}) {
  const {
    values,
    onChange
  } = useColourContext();
  const pairs = comet?.colourPairOverrides?.[blockName] ?? comet?.colourPairs ?? [];
  const palette = transformColorPairsToPalette(pairs);
  // Neither the foreground/colorTheme nor backgroundColor should be undefined,
  // unlike other ColorState controls, hence sticking with the ColorPair type here.
  const mappedValues = useMemo$3(() => ({
    foreground: values.colorTheme,
    background: values?.backgroundColor
  }), [values.colorTheme, values.backgroundColor]);
  const handleChange = useCallback$1(newValues => {
    onChange({
      colorTheme: newValues.foreground,
      backgroundColor: newValues.background
    });
  }, []);
  return wp.element.createElement(ColorPairPaletteDropdown, {
    ...props,
    value: mappedValues,
    palette: palette,
    onChange: handleChange
  });
}
function ColorPairPaletteDropdown({
  label = ColourTypeLabel.PAIR,
  value,
  palette,
  onChange
}) {
  const [foreground, setForeground] = useState(value?.foreground ?? '');
  const [background, setBackground] = useState(value?.background ?? comet?.globalBackground ?? 'white');
  const doChange = useCallback$1((newForeground, newBackground) => {
    setForeground(newForeground);
    setBackground(newBackground);
    onChange({
      foreground: newForeground,
      background: newBackground
    });
  }, [onChange]);
  useEffect$1(() => {
    if (!palette) return;
    if (Object.values(value).every(val => val === undefined)) return;
    function validatePair(value) {
      return palette.find(pair => pair.slug === `${value.foreground}-${value.background}`);
    }
    if (!validatePair(value) && palette.length > 0) {
      // If the current value is not valid, default to the first palette option
      const defaultForeground = palette[0].slug.split('-')[0];
      const defaultBackground = palette[0].slug.split('-')[1];
      doChange(defaultForeground, defaultBackground);
    }
  }, [value, palette]);
  const handleChange = newValue => {
    // New value is the gradient string; find the matching palette object
    const matchedPair = palette.find(pair => pair.slug === newValue);
    if (matchedPair) {
      const [newForeground, newBackground] = matchedPair.slug.split('-');
      doChange(newForeground, newBackground);
    }
  };
  const previewIndicator = useMemo$3(() => {
     
    return `linear-gradient(135deg, var(--color-${foreground}) 0%, var(--color-${foreground}) 50%, var(--color-${background}) 50%, var(--color-${background}) 100%)`;
  }, [foreground, background]);
  return wp.element.createElement(PopupMenu, {
    className: "comet-color-controls__item",
    "data-testid": "comet-color-pair-selector"
  }, wp.element.createElement(PopupMenu.Trigger, {
    ariaLabel: label
  }, label, wp.element.createElement(ColorIndicator, {
    colorValue: previewIndicator,
    "data-testid": "comet-color-pair-indicator",
    "aria-label": `Selected colours: ${foreground} on ${background}`
  })), wp.element.createElement(PopupMenu.Content, null, ({
    onToggle
  }) => wp.element.createElement(ColorPalettePicker, {
    value: `${foreground}-${background}`,
    gradients: palette,
    previewType: "content",
    onChange: newValue => {
      handleChange(newValue);
      onToggle(); // close dropdown after selection
    }
  })));
}

function useValidatedPalette({
  blockName,
  palette,
  isNested = false
}) {
  const paletteToUse = palette || comet?.palette;
  if (!paletteToUse) {
    console.error(`No palette provided or available for useValidatedPalette for block ${blockName}`);
    return null;
  }
  let result = Object.entries(paletteToUse || {})?.filter(([key, value]) => {
    if (isNested || blockName === 'comet/group') {
      return !['black'].includes(key);
    }
    return !['black', 'white'].includes(key);
  })?.map(([key, value]) => ({
    slug: key,
    name: key,
    color: value
  }))?.sort((a, b) => {
    const order = ['white', 'dark', 'light', 'primary', 'secondary', 'accent'];
    const aIndex = order.indexOf(a.slug);
    const bIndex = order.indexOf(b.slug);
    if (aIndex === -1 && bIndex === -1) {
      return 0;
    }
    if (aIndex === -1) {
      return 1;
    }
    if (bIndex === -1) {
      return -1;
    }
    return aIndex - bIndex;
  });
  // Most blocks shouldn't have access to the status/message type colours, only brand colours, whereas others are the opposite
  if (['comet/callout'].includes(blockName)) {
    result = result.filter(color => ['error', 'success', 'info', 'warning'].includes(color.slug));
  } else if (['comet/separator'].includes(blockName)) {
    result = result.filter(color => !['error', 'success', 'info', 'warning', 'light'].includes(color.slug));
  } else if (['comet/copy-image'].includes(blockName)) {
    result = result.filter(color => !['error', 'success', 'info', 'warning', 'light', 'accent'].includes(color.slug));
  } else if (!['comet/copy'].includes(blockName)) {
    result = result.filter(color => !['error', 'success', 'info', 'warning'].includes(color.slug));
  }
  if (!result || result.length === 0) {
    return null;
  }
  return result;
}

function ColorComboPreview({
  colorTheme,
  backgroundColor,
  sectionBackground
}) {
  return wp.element.createElement("div", {
    className: "comet-color-combo-preview",
    "data-testid": "comet-color-combo-preview",
    "data-background": sectionBackground || backgroundColor,
    role: "presentation"
  }, wp.element.createElement("div", {
    className: "comet-color-combo-preview__content",
    "data-background": sectionBackground ? backgroundColor : undefined,
    "data-color-theme": colorTheme
  }, wp.element.createElement("p", {
    style: {
      color: `var(--color-${colorTheme})`
    }
  }, "The quick brown fox jumps over the lazy dog")));
}

/* global wp */
const {
  useMemo: useMemo$2
} = wp.element;
const {
  PanelBody: PanelBody$4
} = wp.components;
const ColorControls = props => {
  if (!Object.keys(props?.attributes).some(attr => ['colorTheme', 'backgroundColor', 'sectionBackground'].includes(attr))) {
    return null;
  }
  return wp.element.createElement(PanelBody$4, {
    title: "Colours",
    initialOpen: true,
    className: `comet-color-controls comet-color-controls--${props?.name?.split('/')[1]}`
  }, wp.element.createElement(ColorControlsInner, {
    ...props
  }));
};
function ColorControlsInner({
  name,
  context,
  attributes,
  setAttributes
}) {
  const singleColourPalette = useValidatedPalette({
    blockName: name,
    palette: comet?.filteredPalette ?? comet?.palette
  });
  const singleBackgroundPalette = useValidatedPalette({
    blockName: name,
    isNested: context?.isNested || attributes.sectionBackground !== undefined || attributes.sectionBackground !== 'none',
    palette: comet?.palette
  });
  const sectionBackgrounds = comet?.sectionBackgrounds ? Object.entries(comet?.sectionBackgrounds).map(([key, value]) => ({
    slug: key,
    name: key,
    color: value
  })) : [];
  if (!singleColourPalette && !singleBackgroundPalette && !sectionBackgrounds) {
    return;
  }
  const hasColorThemeSupport = Object.keys(attributes).includes('colorTheme');
  const hasBackgroundColorSupport = Object.keys(attributes).includes('backgroundColor');
  const hasSectionBackgroundSupport = sectionBackgrounds.length > 0 && Object.keys(attributes).includes('sectionBackground');
  if (!hasColorThemeSupport && !hasBackgroundColorSupport && !hasSectionBackgroundSupport) {
    return null;
  }
  const componentDefault = comet?.defaults?.[name.replace('comet/', '')] ?? {};
  const values = useMemo$2(() => ({
    colorTheme: attributes?.colorTheme ?? componentDefault?.colorTheme ?? null,
    backgroundColor: attributes?.backgroundColor ?? componentDefault?.backgroundColor ?? null,
    sectionBackground: attributes?.sectionBackground ?? componentDefault?.sectionBackground ?? null
  }), [attributes, componentDefault]);
  const showColourPairControl = hasBackgroundColorSupport && hasColorThemeSupport;
  const showSingleColourThemeControl = !showColourPairControl && !hasBackgroundColorSupport && hasColorThemeSupport;
  const showSingleBackgroundColourControl = !showColourPairControl && hasBackgroundColorSupport && !hasColorThemeSupport;
  const showSectionBackgroundControl = useMemo$2(() => hasSectionBackgroundSupport && !context?.isNested, [context?.isNested]);
  return wp.element.createElement(ColourContextProvider, {
    values: values,
    onChange: setAttributes
  }, showSingleColourThemeControl && singleColourPalette && wp.element.createElement(ContextualColorPaletteDropdown, {
    colorContextKey: "colorTheme",
    label: ColourTypeLabel.COLOUR_THEME,
    palette: singleColourPalette
  }), showSingleBackgroundColourControl && singleBackgroundPalette && wp.element.createElement(ContextualColorPaletteDropdown, {
    colorContextKey: "backgroundColor",
    label: ColourTypeLabel.BACKGROUND,
    palette: singleBackgroundPalette,
    clearable: true
  }), showColourPairControl && wp.element.createElement(wp.element.Fragment, null, wp.element.createElement(ColorComboPreview, {
    colorTheme: attributes?.colorTheme,
    backgroundColor: attributes?.backgroundColor,
    sectionBackground: attributes?.sectionBackground !== 'none' ? attributes?.sectionBackground : undefined
  }), wp.element.createElement(ContextualColorPairDropdown, {
    blockName: name.split('/')[1]
  })), showSectionBackgroundControl && wp.element.createElement(ContextualColorPaletteDropdown, {
    colorContextKey: "sectionBackground",
    label: ColourTypeLabel.SECTION_BACKGROUND,
    palette: sectionBackgrounds,
    clearable: true
  }));
}

const {
  ExternalLink,
  SelectControl: SelectControl$2
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
  return wp.element.createElement(SelectControl$2, {
    label: wp.element.createElement(wp.element.Fragment, null, "HTML Element", wp.element.createElement(FieldTooltip, {
      tooltip: 'The HTML tag to use for the block container, or in some cases the main content within'
    })),
    help: wp.element.createElement(wp.element.Fragment, null, "HTML tags are used to structure content and are important for machine-readability, such as by assistive technologies and search engines.\u00A0", wp.element.createElement(ExternalLink, {
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
  PanelBody: PanelBody$3,
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
  return wp.element.createElement(PanelBody$3, {
    title: "Gallery options",
    initialOpen: true
  }, wp.element.createElement(ToggleControl, {
    checked: attributes.lightbox,
    label: wp.element.createElement(wp.element.Fragment, null, wp.element.createElement("span", null, "Enable lightbox"), wp.element.createElement(FieldTooltip, {
      tooltip: 'When a visitor clicks on an image, open a larger version in an overlay'
    })),
    onChange: value => setAttributes({
      lightbox: value
    })
  }), wp.element.createElement(ToggleControl, {
    checked: attributes.captions,
    label: "Show image captions if available",
    onChange: value => setAttributes({
      captions: value
    })
  }));
};

/* global wp */
const {
  RangeControl
} = wp.components;
const BackgroundOpacity = ({
  name,
  attributes,
  setAttributes
}) => {
  if (!attributes?.backgroundOpacity) {
    return null;
  }
  const defaultValue = comet?.defaults?.[name.replace('comet/', '')]?.backgroundOpacity ?? wp?.data?.select('core/blocks')?.getBlockType(name)?.attributes?.backgroundOpacity?.default ?? 0;
  return wp.element.createElement(RangeControl, {
    __next40pxDefaultSize: true,
    initialPosition: attributes.backgroundOpacity ?? defaultValue,
    onChange: value => setAttributes({
      backgroundOpacity: value
    }),
    label: "Background opacity",
    max: 100,
    min: 0,
    allowReset: true,
    resetFallbackValue: defaultValue
  });
};

const {
  SelectControl: SelectControl$1
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
  return wp.element.createElement(SelectControl$1, {
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
  PanelBody: PanelBody$2
} = wp.components;
function BannerControls(props) {
  if (props.name !== 'comet/banner') {
    return null;
  }
  return wp.element.createElement(PanelBody$2, {
    title: "Banner Options",
    initialOpen: true
  }, wp.element.createElement(BackgroundOpacity, {
    ...props
  }), wp.element.createElement(BackgroundType, {
    ...props
  }));
}

const {
  PanelBody: PanelBody$1
} = wp.components;
const {
  __experimentalToggleGroupControl,
  __experimentalToggleGroupControlOption
} = wp.components;
const {
  useCallback,
  useEffect,
  useMemo: useMemo$1
} = wp.element;
function ColumnLayoutControls(props) {
  if (props.name !== 'comet/columns') {
    return null;
  }
  const ToggleGroupControl = __experimentalToggleGroupControl;
  const ToggleGroupControlOption = __experimentalToggleGroupControlOption;
  const {
    attributes,
    setAttributes
  } = props;
  const columnCount = wp.data.select('core/block-editor').getBlockCount(props.clientId);
  const showLayoutOptions = useMemo$1(() => {
    return attributes.qty > 1 && columnCount < attributes.qty;
  }, [attributes?.qty, columnCount]);
  const handleQtyChange = useCallback(newQty => {
    setAttributes({
      qty: newQty
    });
  }, [setAttributes]);
  const handleLayoutChange = useCallback(newLayout => {
    setAttributes({
      columnLayout: newLayout
    });
  }, [setAttributes]);
  useEffect(() => {
    // Automatically increase the column count if more columns (inner blocks) are added than currently selected
    if (columnCount > attributes.qty) {
      setAttributes({
        qty: columnCount
      });
    }
    // If the columns fill the available slots, there is no need for these attributes so set them to fallback values
    // (undefined can cause them to disappear because of the controls' display logic)
    if (columnCount === attributes.qty) {
      setAttributes({
        hAlign: 'center',
        columnLayout: 'even'
      });
    }
  }, [columnCount, attributes.qty, setAttributes]);
   
  return wp.element.createElement(PanelBody$1, {
    title: "Layout",
    initialOpen: true
  }, wp.element.createElement(ContainerSize, {
    ...props
  }), wp.element.createElement("div", {
    className: "comet-column-layout-controls"
  }, wp.element.createElement("div", {
    className: "comet-column-layout-controls__qty"
  }, wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement(wp.element.Fragment, null, "Number of columns", wp.element.createElement(FieldTooltip, {
      tooltip: 'The maximum number of slots to divide the available space into'
    })),
    "aria-label": "Maximum number of columns",
    __next40pxDefaultSize: true,
    isBlock: true,
    value: attributes?.qty ?? columnCount ?? 2,
    onChange: handleQtyChange
  }, wp.element.createElement(ToggleGroupControlOption, {
    value: 2,
    showTooltip: true,
    "aria-label": "Split in half (2 columns)",
    //@ts-expect-error TS2322: Type Element is not assignable to type string
    label: getIconForEvenLayout(2),
    disabled: columnCount > 2
  }), wp.element.createElement(ToggleGroupControlOption, {
    value: 3,
    showTooltip: true,
    "aria-label": "Split into thirds (3 columns)",
    //@ts-expect-error TS2322: Type Element is not assignable to type string
    label: getIconForEvenLayout(3),
    disabled: columnCount > 3
  }), wp.element.createElement(ToggleGroupControlOption, {
    value: 4,
    showTooltip: true,
    "aria-label": "Split into quarters (4 columns)",
    //@ts-expect-error TS2322: Type Element is not assignable to type string
    label: getIconForEvenLayout(4),
    disabled: columnCount > 4
  }))), showLayoutOptions && wp.element.createElement("div", {
    className: "comet-column-layout-controls__layout"
  }, wp.element.createElement(ToggleGroupControl, {
    className: "comet-toggle-group",
    __next40pxDefaultSize: true,
    isBlock: true,
    onChange: handleLayoutChange,
    value: attributes.columnLayout ?? 'even',
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement(wp.element.Fragment, null, "Layout", wp.element.createElement(FieldTooltip, {
      tooltip: 'How to distribute columns when there are fewer blocks than the number of columns selected'
    })),
    "aria-label": "Column layout",
    help: "Note: Blocks will stack on small viewports regardless of the layout selection."
  }, wp.element.createElement(ToggleGroupControlOption, {
    value: "expand-last",
    showTooltip: true,
    "aria-label": "Expand last column",
    // @ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      className: "bi bi-layout-sidebar",
      viewBox: "0 0 16 16"
    }, wp.element.createElement("path", {
      d: "M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"
    }))
  }), wp.element.createElement(ToggleGroupControlOption, {
    value: "even",
    showTooltip: true,
    "aria-label": "Even columns",
    //@ts-expect-error TS2322: Type Element is not assignable to type string
    label: getIconForEvenLayout(attributes.qty)
  }), wp.element.createElement(ToggleGroupControlOption, {
    value: "expand-first",
    showTooltip: true,
    "aria-label": "Expand first column",
    //@ts-expect-error TS2322: Type Element is not assignable to type string
    label: wp.element.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      className: "bi bi-layout-sidebar-reverse",
      viewBox: "0 0 16 16"
    }, wp.element.createElement("path", {
      d: "M16 3a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5-1v12H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 0h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2z"
    }))
  })))), columnCount !== attributes.qty && wp.element.createElement(HorizontalAlignment, {
    ...props
  }), wp.element.createElement(VerticalAlignment, {
    ...props
  }));
}
function getIconForEvenLayout(qty) {
  switch (qty) {
    case 2:
      return wp.element.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        viewBox: "0 0 16 16"
      }, wp.element.createElement("path", {
        d: "M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5-1v12H14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 0H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5z"
      }));
    case 3:
      return wp.element.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        viewBox: "0 0 16 16"
      }, wp.element.createElement("path", {
        d: "M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5zM1.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5H5V1zM10 15V1H6v14zm1 0h3.5a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5H11z"
      }));
    case 4:
      return wp.element.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1",
        viewBox: "0 0 16 16"
      }, wp.element.createElement("path", {
        d: "M14,1H2C.9,1,0,1.9,0,3v10c0,1.1.9,2,2,2h12c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM1,13V3c0-.55.45-1,1-1h1.75v12h-1.75c-.55,0-1-.45-1-1ZM7.5,14h-2.75V2h2.75v12ZM8.5,2h2.75v12h-2.75V2ZM15,13c0,.55-.45,1-1,1h-1.75V2h1.75c.55,0,1,.45,1,1v10Z"
      }));
    default:
      return null;
  }
}

const {
  InspectorAdvancedControls,
  InspectorControls: InspectorControls$1
} = wp.blockEditor; /**
                    * Render the WordPress BlockEdit component with controls for custom attributes
                    */
function CometBlockControls({
  BlockEdit,
  ...props
}) {
  return wp.element.createElement(wp.element.Fragment, null, wp.element.createElement("div", {
    className: "comet-plugin-blocks-custom-controls"
  }, wp.element.createElement(InspectorControls$1, null, wp.element.createElement(LayoutControls, {
    ...props
  }), wp.element.createElement(ColumnLayoutControls, {
    ...props,
    attributes: {
      ...props.attributes,
      qty: props?.attributes?.qty ?? 2
    }
  }), wp.element.createElement(ColorControls, {
    ...props
  }), wp.element.createElement(BannerControls, {
    ...props
  }), wp.element.createElement(GalleryControls, {
    ...props
  })), wp.element.createElement(InspectorAdvancedControls, null, wp.element.createElement(HtmlTag, {
    ...props
  }))), wp.element.createElement(BlockEdit, {
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
    const className = getInnerblockClassname(props);
    return /*#__PURE__*/React.createElement("div", {
      className: `comet-block-edit-wrapper ${className}`,
      "data-block": props.name
    }, /*#__PURE__*/React.createElement(BlockEditComponent, _extends({
      BlockEdit: BlockEdit
    }, props)));
  });
});

/**
 * If this is an inner block, its parent *should* have its class name and block attributes added around its <InnerBlocks> in BlockRenderer.php.
 * This allows us to add the assumed class name for the children here to mimic the HTML structure of the front-end as closely as possible.
 * There's still some extra wrappers related to editor functionality, so a small amount of CSS is sometimes needed, but this approach keeps that to a minimum.
 *
 * Note: This is only relevant to block -> innerblock structures, because the outer block does not use render.php on the back-end.
 * All other blocks use the same PHP to render the block in the editor preview and on the front-end, so there's no extra steps required.
 *
 * Another note: The parent block needs providesContext:name and inner block needs usesContext:parent
 * in their respective block.jsons for this to work.
 *
 * @param props
 * @returns {string}
 */
function getInnerblockClassname(props) {
  if (!props?.context?.parent) {
    return '';
  }
  if (props.context.parent === 'comet/columns') {
    return 'columns__column';
  }
  const parentShortName = props.context.parent.replace('comet/', '');
  const thisBlockShortName = props.name.replace('comet/', '');
  return `${parentShortName}__${thisBlockShortName}`;
}

/**
 * Recreate the Ninja Form selector dropdown control so that it is wrapped in the same components as our custom controls,
 * and also enables us to use server-side rendering for the block preview instead of BlockEdit
 * (which would render both the default preview + the default form selector)
 * @param {Object} props The block edit props
 *
 * FIXME: This currently gets stuck on the loading spinner when rendering the form.
 * FIXME: This needs colour and size (container width) controls.
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
  }, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
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

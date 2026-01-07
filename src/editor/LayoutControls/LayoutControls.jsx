/* global wp */
import { PanelBody, PanelRow } from '@wordpress/components';
import { ContainerSize } from '../ContainerSize/ContainerSize.jsx';
import { GroupLayout } from '../GroupLayout/GroupLayout.jsx';
import { VerticalAlignment } from '../VerticalAlignment/VerticalAlignment.jsx';
import { HorizontalAlignment } from '../HorizontalAlignment/HorizontalAlignment.jsx';
import { LayoutOrientation } from '../LayoutOrientation/LayoutOrientation.jsx';
import { ContentMaxWidth } from '../ContentMaxWidth/ContentMaxWidth';
import { MaxPerRow } from '../MaxPerRow/MaxPerRow';
import { ItemCount } from '../ItemCount/ItemCount.jsx';
import { NegativeMargins } from '../NegativeMargins/NegativeMargins.jsx';

export const LayoutControls = (props) => {
	// If the block does not have any layout attributes, do not render the controls
	const componentDefault = Object.keys(comet?.defaults[props.name.replace('comet/', '')] ?? {}) ?? [];
	const currentAttributes = Object.keys(props.attributes) ?? [];
	if (componentDefault.length === 0 && currentAttributes.length === 0) {
		return null;
	}
	const layoutAttributes = [
		'size',
		'groupLayout',
		'orientation',
		'hAlign',
		'vAlign',
		'backgroundType'
	];
	const hasLayoutAttributes = [...componentDefault, ...currentAttributes].some((attr) => layoutAttributes.includes(attr));
	if (!hasLayoutAttributes) {
		return null;
	}

	return (
		<PanelBody title="Layout" initialOpen={true}>
			<ContainerSize {...props} />
			<ContentMaxWidth {...props}/>
			<NegativeMargins {...props} />
			<GroupLayout {...props} />
			<ItemCount {...props} />
			<MaxPerRow {...props} />
			<LayoutOrientation {...props} />
			<HorizontalAlignment {...props} />
			<VerticalAlignment {...props} />
		</PanelBody>
	);
};

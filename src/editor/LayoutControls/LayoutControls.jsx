/* global wp */
import { PanelBody } from '@wordpress/components';
import { ContainerSize } from '../ContainerSize/ContainerSize.jsx';
import { GroupLayout } from '../GroupLayout/GroupLayout.jsx';
import { VerticalAlignment } from '../VerticalAlignment/VerticalAlignment.jsx';
import { HorizontalAlignment } from '../HorizontalAlignment/HorizontalAlignment.jsx';
import { LayoutOrientation } from '../LayoutOrientation/LayoutOrientation.jsx';

export const LayoutControls = (props) => {
	return (
		<PanelBody title="Layout" initialOpen={true}>
			<ContainerSize {...props} />
			<GroupLayout {...props} />
			<LayoutOrientation {...props} />
			<HorizontalAlignment {...props} />
			<VerticalAlignment {...props} />
		</PanelBody>
	);
};

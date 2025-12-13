/* global wp */
import { PanelBody } from '@wordpress/components';
import { ContainerSize } from '../ContainerSize/ContainerSize.jsx';
import { VerticalAlignment } from '../VerticalAlignment/VerticalAlignment.jsx';

export const LayoutControls = (props) => {
	return (
		<PanelBody title="Layout" initialOpen={true}>
			<ContainerSize {...props} />
			<VerticalAlignment {...props} />
		</PanelBody>
	);
};

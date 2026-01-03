import { SelectControl } from '@wordpress/components';

export const BackgroundType = ({ attributes, setAttributes }) => {
	if (!attributes?.backgroundType) {
		return null;
	}

	const options = [
		{ label: 'Content', value: 'content' },
		{ label: 'Overlay', value: 'overlay' },
	];

	return (
		<SelectControl
			label="Background type"
			size={'__unstable-large'}
			value={attributes.backgroundType}
			options={options}
			onChange={(newType) => setAttributes({ backgroundType: newType })}/>
	);
};

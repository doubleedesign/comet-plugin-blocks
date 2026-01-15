import { useMemo, useEffect, useState } from '@wordpress/element';
import { PanelBody, SelectControl } from '@wordpress/components';
import { FieldTooltip } from '../FieldTooltip/FieldTooltip.jsx';

// TODO: Handle supporting innerSize where appropriate (it's not really built into the Core components unless we nest a container)
export const ContainerSize = ({ attributes, setAttributes }) => {
	if (!attributes?.size && !attributes?.innerSize) {
		return null;
	}

	if (!attributes?.innerSize) {
		return <ContainerOnly attributes={attributes} setAttributes={setAttributes}/>;
	}

	return <ContainerAndInner attributes={attributes} setAttributes={setAttributes}/>;
};

const ContainerOnly = ({ attributes, setAttributes }) => {

	const options = [
		{ label: 'Full-width', value: 'fullwidth' },
		{ label: 'Wide', value: 'wide' },
		{ label: 'Contained', value: 'contained' },
		{ label: 'Narrow', value: 'narrow' },
	];

	return (
		<SelectControl
			label={
				<>
					Container size
					<FieldTooltip
						tooltip={'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'}
					/>
				</>
			}
			size={'__unstable-large'}
			value={attributes.size}
			options={options}
			onChange={(newSize) => setAttributes({ size: newSize })}
		/>
	);
};

const ContainerAndInner = ({ attributes, setAttributes }) => {

	const options = [
		{ label: 'Full-width', value: 'fullwidth' },
		{ label: 'Wide', value: 'wide' },
		{ label: 'Contained', value: 'contained' },
		{ label: 'Narrow', value: 'narrow' },
	];

	const innerOptions = [
		{ label: 'Auto (do not override)', value: 'fullwidth' }, // needs to have the same values or we have a bad time with the compatibility logic
		{ label: 'Wide', value: 'wide' },
		{ label: 'Contained', value: 'contained' },
		{ label: 'Narrow', value: 'narrow' },
	];


	const updateContainerSize = (newSize) => {
		setAttributes({ size: newSize });

		// If the inner size was larger than the new container size, update it to be the same
		const innerSizeIndex = options.findIndex(option => option.value === attributes.innerSize);
		if (innerSizeIndex > options.findIndex(option => option.value === newSize)) {
			setAttributes({ innerSize: newSize });
		}
	};

	const updateinnerSize = (newSize) => {
		setAttributes({ innerSize: newSize });

		// If the inner size is being set larger than the current container size, update the container to match
		const containerSizeIndex = options.findIndex(option => option.value === attributes.size);
		if (options.findIndex(option => option.value === newSize) < containerSizeIndex) {
			setAttributes({ size: newSize });
		}
	};

	// Filter inner options to only those smaller than or equal to the container size
	const filteredInnerOptions = useMemo(() => {
		const containerSizeIndex = options.findIndex(option => option.value === attributes.size);

		return innerOptions.slice(containerSizeIndex);
	}, [attributes.size]);

	return (
		<>
			<SelectControl
				label={
					<>
						Container size
						<FieldTooltip
							tooltip={'Represents the maximum width of the content area inside the block; may appear to have no effect on smaller viewports'}
						/>
					</>
				}
				size={'__unstable-large'}
				value={attributes.size}
				options={options}
				onChange={updateContainerSize}
			/>
			<SelectControl
				label={
					<>
						Inner content size
						<FieldTooltip
							tooltip={'Optionally override the inner content\'s overall max width; may appear to have no effect on smaller viewports'}
						/>
					</>
				}
				size={'__unstable-large'}
				value={attributes.innerSize}
				options={filteredInnerOptions}
				onChange={updateinnerSize}
			/>
		</>
	);
};


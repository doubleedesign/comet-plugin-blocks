export class MiniblockPlugin {
	constructor() {
		if (this.constructor === MiniblockPlugin) {
			throw new Error('Cannot instantiate abstract class MiniblockPlugin directly');
		}
	}

	createColorThemeSelector(selectedValue) {
		return {
			type: 'listbox',
			name: 'colorTheme',
			label: 'Colour theme',
			value: selectedValue || '',
			classes: 'color-theme-field',
			values: [
				{ text: 'Inherit', value: '', classes: 'color-theme-field__swatch color-theme-field__swatch--inherit' },
				...Object.keys(comet.palette).map(colorName => ({
					text: colorName,
					value: colorName,
					classes: `color-theme-field__swatch color-theme-field__swatch--${colorName}`
				}))
			]
		};
	}
}

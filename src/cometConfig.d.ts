/**
 * Comet global config from the Config class which is made available to JavaScript
 * using wp_localize_script
 */
interface Config {
	defaults?: Record<string, any>;
	globalBackground?: ThemeColor;
	palette?: Record<ThemeColor, string>;
	colourPairs?: ColourPair[];
	colourPairOverrides?: Record<string, ColourPair[]>;
	gradients?: ThemeGradient[];
	sectionBackgrounds?: Record<string, ThemeColor|ThemeGradient>;
	aspectRatios?: { name: string; value: string }[];
	ajaxUrl?: string;
	nonce?: string;
	context?: {
		object_type: string;
		id: number;
	}
}

declare global {
	const comet: Config;

	interface Window {
		comet: Config;
	}
}

type ThemeColor =
	'primary' |
	'secondary' |
	'accent' |
	'error' |
	'success' |
	'warning' |
	'info' |
	'light' |
	'dark' |
	'white';

type ColourPair = {
	foreground: ThemeColor;
	background: ThemeColor;
};

// Note: If you're looking for where colours and gradients are set, it's theme.json.
// Another note: Only the slugs are passed through to the PHP render functions,
// the values in theme.json are used for the editor but not for rendering
type ThemeGradient = string;

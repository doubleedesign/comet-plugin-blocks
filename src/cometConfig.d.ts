/**
 * Comet global config from the Config class which is made available to JavaScript
 * using wp_localize_script
 */
interface Config {
	defaults?: Record<string, any>;
	globalBackground?: ThemeColor;
	palette?: Record<ThemeColor, string>;
	colourPairs?: { foreground: string; background: string }[];
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

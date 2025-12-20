import { PullquotePlugin } from './_miniblock-pullquote.js';

/** @type {{ PluginManager: import('tinymce').AddOnManager }} */
const tinymce = window.tinymce;

/**
 * Note: compile this into one dist file using rollup with `npm run build` from the plugin root
 * Otherwise imports don't work because TinyMCE doesn't support ES modules for plugins
 */
tinymce.PluginManager.add('comet_miniblocks', function (editor, url) {
	new PullquotePlugin(editor);
});

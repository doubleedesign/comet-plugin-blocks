import { PullquotePlugin } from './_miniblock-pullquote.js';
import { CalloutPlugin } from './_miniblock-callout.js';

/** @type {{ PluginManager: import('tinymce').AddOnManager }} */
const tinymce = window.tinymce;

/**
 * Note: compile this into one dist file using rollup with `npm run build` from the plugin root
 * Otherwise imports don't work because TinyMCE doesn't support ES modules for plugins.
 *
 * Plugin buttons also need to be specified in TinyMceConfig.php to be available in the editor.
 */
tinymce.PluginManager.add('comet_miniblocks', function (editor, url) {
	new PullquotePlugin(editor);
	new CalloutPlugin(editor);
});

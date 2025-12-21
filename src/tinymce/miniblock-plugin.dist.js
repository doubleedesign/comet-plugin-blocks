(function () {
	'use strict';

	class MiniblockPlugin {
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

	class PullquotePlugin extends MiniblockPlugin {
		/** @param {import('tinymce').Editor} editor */
		constructor(editor) {
			super();
			const plugin = this;
			editor.addButton('comet_miniblocks_pullquote', {
				title: 'Pullquote',
				icon: 'blockquote',
				onclick: function () {
					plugin.openModal(editor);
				}
			});
			editor.on('click', function (e) {
				// Handle clicks on existing pullquotes
				/** @var {HTMLElement} */
				const pullquote = editor.dom.getParent(e.target, 'blockquote.pullquote');
				if (pullquote) {
					const data = {
						quote: decodeURIComponent(pullquote.getAttribute('data-quote') || ''),
						citation: decodeURIComponent(pullquote.getAttribute('data-citation') || ''),
						colorTheme: pullquote.getAttribute('data-color-theme') || ''
					};
					plugin.openModal(editor, data, pullquote);
				}
			});
			editor.on('BeforeSetContent', function (e) {
				// Prevent cursor from entering the blockquote and ensure they stay non-editable when content is loaded
				e.content = e.content.replace(
					/<blockquote class="pullquote"/g,
					'<blockquote class="pullquote" contenteditable="false"'
				);
			});
		}

		openModal(editor, existingData, existingNode) {
			const data = existingData || { quote: '', citation: '', colorTheme: '' };

			editor.windowManager.open({
				title: existingNode ? 'Edit pullquote' : 'Insert pullquote',
				body: [
					{
						type: 'textbox',
						name: 'quote',
						label: 'Quote',
						value: data.quote,
						multiline: true,
						minHeight: 100,
					},
					{
						type: 'textbox',
						name: 'citation',
						label: 'Citation',
						value: data.citation,
						multiline: false,
					},
					this.createColorThemeSelector(data.colorTheme)
				],
				onsubmit: function (e) {
					const citation = e.data.citation ? e.data.citation.trim() : '';

					const html = `
					<blockquote class="pullquote" 
								contenteditable="false" 
								${e.data.colorTheme ? `data-color-theme="${e.data.colorTheme}"` : ''}
								data-quote="${encodeURIComponent(e.data.quote)}"
								${citation ? `data-citation="${encodeURIComponent(citation)}"` : ''}
						>
	                    <p>${e.data.quote}</p>
	                    ${citation ? `<cite>${citation}</cite>` : ''}
               		</blockquote>
				`;

					if (existingNode) {
						editor.dom.setOuterHTML(existingNode, html);
					}
					else {
						editor.insertContent(html + '<p></p>');
					}
				}
			}, {});
		}
	}

	class CalloutPlugin extends MiniblockPlugin {
		/** @param {import('tinymce').Editor} editor */
		constructor(editor) {
			super();
			const plugin = this;
			editor.addButton('comet_miniblocks_callout', {
				title: 'Callout',
				icon: 'notice',
				onclick: function () {
					plugin.openModal(editor);
				}
			});
			editor.on('click', function (e) {
				// Handle clicks on existing callouts
				/** @var {HTMLElement} */
				const callout = editor.dom.getParent(e.target, 'div.callout');
				if (callout) {
					const data = {
						content: decodeURIComponent(callout.getAttribute('data-content') || ''),
						colorTheme: callout.getAttribute('data-color-theme') || ''
					};
					plugin.openModal(editor, data, callout);
				}
			});
			editor.on('BeforeSetContent', function (e) {
				// Ensure callouts stay non-editable when content is loaded
				e.content = e.content.replace(
					/<div class="callout"/g,
					'<div class="callout" contenteditable="false"'
				);
			});
		}

		openModal(editor, existingData, existingNode) {
			const data = existingData || { content: '', colorTheme: '' };

			editor.windowManager.open({
				title: existingNode ? 'Edit callout' : 'Insert callout',
				body: [
					{
						type: 'textbox',
						name: 'content',
						label: 'Content',
						value: data.content,
						multiline: true,
						minHeight: 100,
					},
					this.createColorThemeSelector(data.colorTheme)
				],
				onsubmit: function (e) {
					const content = e.data.content.trim();
					if (content === '') {
						return;
					}
					const encodedContent = encodeURIComponent(content);
					const colorTheme = e.data.colorTheme || '';
					const calloutHtml = `
					<div class="callout" 
						data-content="${encodedContent}" 
						data-color-theme="${colorTheme}" 
						contenteditable="false">
						<p>${content}</p>
					</div>
				`;
					if (existingNode) {
						existingNode.outerHTML = calloutHtml;
					}
					else {
						editor.insertContent(calloutHtml);
					}
				}
			});
		}
	}

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

})();
//# sourceMappingURL=miniblock-plugin.dist.js.map

import { MiniblockPlugin } from './_miniblock.js';

export class PullquotePlugin extends MiniblockPlugin {
	/** @param {import('tinymce').Editor} editor */
	constructor(editor) {
		super();
		const plugin = this;

		editor.addButton('comet_miniblocks_pullquote', {
			title: 'Insert pullquote',
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

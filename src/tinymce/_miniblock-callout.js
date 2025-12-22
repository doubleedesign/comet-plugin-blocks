import { MiniblockPlugin } from './_miniblock.js';

export class CalloutPlugin extends MiniblockPlugin {
	/** @param {import('tinymce').Editor} editor */
	constructor(editor, url) {
		super();
		const plugin = this;

		editor.addButton('comet_miniblocks_callout', {
			title: 'Insert callout or alert message',
			image: url + '/icons/callout.svg',
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

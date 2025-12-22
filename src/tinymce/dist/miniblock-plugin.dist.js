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

	class CalloutPlugin extends MiniblockPlugin {
		/** @param {import('tinymce').Editor} editor */
		constructor(editor) {
			super();
			const plugin = this;

			editor.addButton('comet_miniblocks_callout', {
				title: 'Insert callout or alert message',
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

	/* global acf */


	class ButtonGroupPlugin extends MiniblockPlugin {
		/**
		 * @param {import('tinymce').Editor} editor
		 * @param {string} url
		 */
		constructor(editor, url) {
			super();
			const plugin = this;

			editor.addButton('comet_miniblocks_buttongroup', {
				title: 'Insert button group',
				image: url + '/icons/button-group.svg',
				onclick: function () {
					plugin.openModal(editor);
				}
			});

			editor.on('click', function (e) {
				// Handle clicks on existing button groups
				const buttonGroupNode = editor.dom.getParent(e.target, 'div.button-group');
				if (buttonGroupNode) {
					const links = Array.from(buttonGroupNode.getElementsByTagName('a')).map(link => ({
						url: link.getAttribute('href') || '',
						label: link.textContent || '',
						target: link.getAttribute('target') || '',
						style: link.getAttribute('data-style') || ''
					}));
					const data = {
						links: links,
						colorTheme: buttonGroupNode.getAttribute('data-color-theme') || ''
					};
					plugin.openModal(editor, data, buttonGroupNode);
				}
			});

			editor.on('BeforeSetContent', function (e) {
				// Ensure button groups stay non-editable
				e.content = e.content.replace(
					/<div class="button-group" role="group" /g,
					'<div class="button-group" role="group" contenteditable="false"'
				);
			});
		}

		openModal(editor, existingData = {}, existingNode = null) {

			const plugin = this;
			const data = existingData || { links: [], colorTheme: '' };

			this.getRepeaterFieldHtml().then((response) => {
				if (!response.success || !response?.data?.form_html || !response?.data?.acf_button_group_repeater_key) {
					throw new Error('Invalid or incomplete response from server when fetching button group form');
				}

				editor.windowManager.open({
					title: existingNode ? 'Edit Button Group' : 'Insert Button Group',
					body: [
						{
							type: 'container',
							label: 'Links',
							html: '<div id="button-group-form-container"></div>'
						},
						this.createColorThemeSelector(data.colorTheme)
					],
					onsubmit: function (e) {
						const links = plugin.processRepeaterRows(response.data.acf_button_group_repeater_key);
						const colorTheme = e.data.colorTheme || '';
						const htmlString = plugin.generateHtmlToInsert(links, colorTheme);

						if (existingNode) {
							editor.dom.setOuterHTML(existingNode, htmlString);
						}
						else {
							editor.insertContent(htmlString + '<p></p>');
						}
					},
					onClose: function () {

					}
				}, {});

				// Initialise ACF fields that were added to the modal as plain HTML
				// Note: This needs to be done after the modal opens so that the element is in the DOM
				const container = editor.$.find('#button-group-form-container')[0];
				if (container) {
					container.innerHTML = response.data.form_html;
					acf.doAction('ready', jQuery(container));
				}
				else {
					throw new Error('Failed to find container for button group form fields in modal');
				}

				// Pre-fill existing data into the ACF fields
				if (existingNode) {
					plugin.prepopulateRepeaterRows(response.data.acf_button_group_repeater_key, data);
				}
			}).catch((error) => {
				console.error(error);
				editor.windowManager.close();
				editor.windowManager.alert('There was an error when loading the form for a button group.', null);
			});
		}

		getRepeaterFieldHtml() {
			return jQuery.ajax({
				url: comet.ajaxUrl,
				type: 'POST',
				data: {
					headers: {
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					// This action name must match the PHP action hook, without the wp_ajax_ prefix
					action: 'get_button_group_modal_content',
					nonce: comet.nonce,
					body: JSON.stringify(comet.context)
				},
				success: function (response) {
					if (response.data.html) {
						return response.data.html;
					}
					else {
						return '<div>Failed to load form fields.</div>';
					}
				},
				error: function (error) {
					console.error(error);

					return '<div>Failed to load form fields.</div>';
				}
			});
		}

		prepopulateRepeaterRows(field_key, data) {
			if (!data.links || data.links.length === 0) {
				return;
			}

			const repeaterField = acf.getField(field_key);
			if (!repeaterField) {
				console.error(`Repeater field with key ${field_key} not found.`);

				return;
			}

			// Remove existing empty rows first (caused by the min rows setting)
			repeaterField.$rows().each(function () {
				repeaterField.remove(jQuery(this));
			});

			let index = 0;

			const populateRow = function ($row) {
				const item = data.links[index];
				const linkField = acf.getField($row.find('[data-name="link"]'));
				const styleField = acf.getField($row.find('[data-name="style"]'));

				if (linkField) {
					linkField.val({
						url: item.url || '',
						title: item.label || '',
						target: item.target || ''
					});
				}
				if (styleField) {
					styleField.val(item.style ? (item.style === 'default' ? '' : `is${item.style.charAt(0).toUpperCase() + item.style.slice(1)}`) : '');
				}

				index++;
			};

			// Listen for rows being appended
			acf.addAction('append', populateRow);

			// Now add all the rows to trigger the listener and hence the populate function
			data.links.forEach(function () {
				repeaterField.add();
			});

			// Remove the listener when done
			acf.removeAction('append', populateRow);
		}

		processRepeaterRows(field_key) {
			const repeaterField = acf.getField(field_key);
			if (!repeaterField) {
				console.error(`Repeater field with key ${field_key} not found.`);

				return [];
			}

			return repeaterField.$rows().map(function () {
				const $row = jQuery(this);
				const rowFields = acf.getFields({ parent: $row });

				const linkField = rowFields.find(field => field.get('name') === 'link');
				const styleField = rowFields.find(field => field.get('name') === 'style');

				return {
					url: linkField ? linkField.val().url : '',
					label: linkField ? linkField.val().title : '',
					target: linkField ? linkField.val().target : '',
					style: styleField ? (styleField.val().startsWith('is') ? styleField.val().slice(2).toLowerCase() : styleField.val().toLowerCase()) : ''
				};
			}).get();
		}

		generateHtmlToInsert(links, colorTheme) {
			let html = document.createElement('div');
			html.className = 'button-group';
			html.setAttribute('contenteditable', 'false');
			html.setAttribute('role', 'group');
			if (colorTheme) {
				html.setAttribute('data-color-theme', colorTheme);
			}
			links.forEach(item => {
				const link = document.createElement('a');
				link.className = 'button';
				link.setAttribute('href', item.url);
				link.textContent = item.label;
				if (link.target) {
					link.setAttribute('target', item.target);
				}
				if (item.style && item.style !== 'default') {
					link.setAttribute('data-style', item.style);
				}
				html.appendChild(link);
			});

			return html.outerHTML;
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
		new ButtonGroupPlugin(editor, url);
	});

})();
//# sourceMappingURL=miniblock-plugin.dist.js.map

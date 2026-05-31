/* global wp */
/* global tinymce */

document.addEventListener('DOMContentLoaded', async function () {
	await applyDefaultColourThemeToTinyMce();
});

async function applyDefaultColourThemeToTinyMce() {
	const editors = await getEditors();
	editors.forEach((editor) => {
		editor.getBody()?.setAttribute('data-color-theme', 'primary');
		editor.getBody()?.setAttribute('data-background', comet.globalBackground ?? 'white');
	});
}

async function getEditors() {
	const MAX_ATTEMPTS = 10;

	for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
		if (tinymce.editors.length > 0) {
			return tinymce.editors;
		}
		await delay(100);
	}

	return [];
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

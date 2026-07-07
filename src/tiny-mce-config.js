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

function getEditors() {
	return new Promise((resolve) => {
		let timer;

		if (tinymce.editors.length > 0) {
			// Delay to allow additional editors to finish being added before resolving
			timer = setTimeout(() => resolve([...tinymce.editors]), 500);
			return;
		}

		tinymce.on('AddEditor', () => {
			clearTimeout(timer);
			timer = setTimeout(() => resolve([...tinymce.editors]), 500);
		});
	});
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

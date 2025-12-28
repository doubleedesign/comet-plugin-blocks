/* global wp */

wp.domReady(() => {
	hackPreferencesModal();
});

function hackPreferencesModal() {
	const modalObserver = new MutationObserver(function (mutations, obs) {
		const modal = document.querySelector('.preferences-modal');
		if (modal) {
			watchPreferencesModalContent(modal);
			obs.disconnect();
		}
	});

	modalObserver.observe(document.body, { childList: true, subtree: true });

	function watchPreferencesModalContent(modal) {
		const contentObserver = new MutationObserver(function (mutations, obs) {
			const tabs = modal.querySelector('.preferences__tabs');
			if (tabs) {
				removePreferenceByLabelText(tabs, 'Show starter patterns');
			}
		});

		contentObserver.observe(modal, { childList: true, subtree: true });
	}
}

function removePreferenceByLabelText(parent, labelText) {
	setTimeout(() => {
		const preferences = parent.querySelectorAll('.preference-base-option');
		preferences.forEach(function (preference) {
			const label = preference.querySelector('label');
			if (label.textContent.trim() === labelText) {
				preference.remove();
			}
		});
	}, 100);
}

import { getIsEnabled, setIsEnabled } from '../src/storage.js';

/**
 * Updates status text and class indicators in the popup.
 * @param {HTMLElement} statusElement
 * @param {boolean} isEnabled
 */
function updateStatusBadge(statusElement, isEnabled) {
  statusElement.textContent = isEnabled ? 'On' : 'Off';
  statusElement.className = `status-text ${isEnabled ? 'on' : 'off'}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = /** @type {HTMLInputElement | null} */ (document.getElementById('toggleSwitch'));
  const statusText = document.getElementById('statusText');

  if (!toggleSwitch || !statusText) return;

  // Initialize UI state
  const isEnabled = await getIsEnabled();
  toggleSwitch.checked = isEnabled;
  updateStatusBadge(statusText, isEnabled);

  // Bind change handler
  toggleSwitch.addEventListener('change', async () => {
    const nextState = toggleSwitch.checked;
    await setIsEnabled(nextState);
    updateStatusBadge(statusText, nextState);
  });
});

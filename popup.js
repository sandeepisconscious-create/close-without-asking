/**
 * Popup controller for toggling extension protection on and off.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = /** @type {HTMLInputElement} */ (document.getElementById('toggleSwitch'));
  const statusText = document.getElementById('statusText');

  if (!toggleSwitch || !statusText) return;

  const updateStatusUI = (isEnabled) => {
    statusText.textContent = isEnabled ? 'On' : 'Off';
    statusText.className = `status-text ${isEnabled ? 'on' : 'off'}`;
  };

  // Default to enabled (true)
  const { enabled = true } = await chrome.storage.local.get('enabled');
  toggleSwitch.checked = Boolean(enabled);
  updateStatusUI(toggleSwitch.checked);

  toggleSwitch.addEventListener('change', async () => {
    const isEnabled = toggleSwitch.checked;
    await chrome.storage.local.set({ enabled: isEnabled });
    updateStatusUI(isEnabled);
  });
});

/**
 * bridge.js: Runs in the ISOLATED world.
 * Bridges chrome.storage configuration directly to the page's MAIN world via window.postMessage.
 */
(async () => {
  'use strict';

  const SYNC_TYPE = '__CLOSE_TAB_SYNC__';
  const DATASET_ATTR = 'closeTabEnabled';

  /**
   * Broadcasts the current enabled state to the MAIN world.
   * @param {boolean} enabled
   */
  const broadcastState = (enabled) => {
    window.postMessage({ type: SYNC_TYPE, enabled: Boolean(enabled) }, '*');
    if (document.documentElement) {
      document.documentElement.dataset[DATASET_ATTR] = enabled ? 'true' : 'false';
    }
  };

  // Initial synchronization
  const { enabled = true } = await chrome.storage.local.get('enabled');
  broadcastState(enabled);

  // Real-time synchronization
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
      broadcastState(changes.enabled.newValue);
    }
  });
})();

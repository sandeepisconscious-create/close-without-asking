/**
 * bridge.js: Runs in the ISOLATED world at document_start.
 * Bridges chrome.storage configuration directly to the page's MAIN world via window.postMessage and DOM dataset.
 */
(() => {
  'use strict';

  const SYNC_TYPE = '__CLOSE_TAB_SYNC__';
  const DATASET_ATTR = 'closeTabEnabled';
  const STORAGE_KEY = 'enabled';

  /**
   * Broadcasts the current enabled state to the page MAIN world.
   * @param {boolean} enabled
   */
  const broadcastState = (enabled) => {
    const isEnabled = Boolean(enabled);
    window.postMessage({ type: SYNC_TYPE, enabled: isEnabled }, '*');
    if (document.documentElement) {
      document.documentElement.dataset[DATASET_ATTR] = isEnabled ? 'true' : 'false';
    }
  };

  // Initial synchronization with storage
  chrome.storage.local.get(STORAGE_KEY, (result) => {
    broadcastState(result[STORAGE_KEY] ?? true);
  });

  // Real-time synchronization on setting change
  chrome.storage.onChanged.addListener((changes) => {
    if (changes[STORAGE_KEY]) {
      broadcastState(changes[STORAGE_KEY].newValue);
    }
  });
})();

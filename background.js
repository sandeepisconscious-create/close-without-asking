/**
 * Background Service Worker:
 * 1. Automatically injects content and bridge scripts into all open tabs upon install/update.
 * 2. Updates toolbar badge indicator reflecting On/Off state.
 */
import { EXTENSION_CONFIG } from './src/constants.js';
import { getIsEnabled } from './src/storage.js';

/**
 * Updates the action badge according to current enabled state.
 */
async function syncBadge() {
  const isEnabled = await getIsEnabled();
  if (!isEnabled) {
    chrome.action.setBadgeText({ text: EXTENSION_CONFIG.BADGE.OFF_TEXT });
    chrome.action.setBadgeBackgroundColor({ color: EXTENSION_CONFIG.BADGE.OFF_COLOR });
  } else {
    chrome.action.setBadgeText({ text: EXTENSION_CONFIG.BADGE.ON_TEXT });
  }
}

/**
 * Auto-injects content.js and bridge.js into existing web tabs.
 */
async function injectIntoExistingTabs() {
  try {
    const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
    const injectionPromises = tabs
      .filter((tab) => typeof tab.id === 'number')
      .flatMap((tab) => [
        chrome.scripting.executeScript({
          target: { tabId: /** @type {number} */ (tab.id), allFrames: true },
          files: ['content.js'],
          world: 'MAIN',
        }).catch(() => {}),
        chrome.scripting.executeScript({
          target: { tabId: /** @type {number} */ (tab.id), allFrames: true },
          files: ['bridge.js'],
          world: 'ISOLATED',
        }).catch(() => {}),
      ]);

    await Promise.all(injectionPromises);
  } catch (error) {
    console.error('[CloseTab] Existing tabs injection error:', error);
  }
}

// Lifecycle listeners
chrome.runtime.onInstalled.addListener(() => {
  syncBadge();
  injectIntoExistingTabs();
});

chrome.runtime.onStartup.addListener(() => {
  syncBadge();
  injectIntoExistingTabs();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes[EXTENSION_CONFIG.STORAGE_KEYS.ENABLED]) {
    syncBadge();
  }
});

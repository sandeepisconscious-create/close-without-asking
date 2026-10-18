/**
 * Background Service Worker:
 * 1. Automatically injects content and bridge scripts into all open tabs upon install/update.
 * 2. Updates toolbar badge indicator reflecting On/Off state.
 */

const BADGE_COLOR_OFF = '#717580';

/**
 * Updates the action badge according to current enabled state.
 */
async function updateBadge() {
  const { enabled = true } = await chrome.storage.local.get('enabled');
  if (!enabled) {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR_OFF });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Auto-injects content.js and bridge.js into existing web tabs.
 */
async function injectIntoExistingTabs() {
  try {
    const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
    const injectionPromises = tabs
      .filter((tab) => Boolean(tab.id))
      .flatMap((tab) => [
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ['content.js'],
          world: 'MAIN',
        }).catch(() => {}),
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ['bridge.js'],
          world: 'ISOLATED',
        }).catch(() => {}),
      ]);

    await Promise.all(injectionPromises);
  } catch (error) {
    console.error('[CloseTab] Tab injection failed:', error);
  }
}

// Lifecycle listeners
chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
  injectIntoExistingTabs();
});

chrome.runtime.onStartup.addListener(() => {
  updateBadge();
  injectIntoExistingTabs();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateBadge();
  }
});

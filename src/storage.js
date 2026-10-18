/**
 * Storage utility helpers for reading and writing extension settings.
 */
import { EXTENSION_CONFIG } from './constants.js';

/**
 * Retrieves whether the extension is currently enabled.
 * Defaults to true.
 * @returns {Promise<boolean>}
 */
export async function getIsEnabled() {
  const result = await chrome.storage.local.get(EXTENSION_CONFIG.STORAGE_KEYS.ENABLED);
  return result[EXTENSION_CONFIG.STORAGE_KEYS.ENABLED] ?? true;
}

/**
 * Sets the extension enabled state.
 * @param {boolean} enabled
 * @returns {Promise<void>}
 */
export async function setIsEnabled(enabled) {
  await chrome.storage.local.set({
    [EXTENSION_CONFIG.STORAGE_KEYS.ENABLED]: Boolean(enabled),
  });
}

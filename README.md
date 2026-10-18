# Close Tab (No Confirm) - Chrome Extension

A minimal, high-performance Chrome extension that eliminates annoying *"Leave site? Changes that you made may not be saved"* confirmation dialogs, allowing tabs to close instantly.

## Architecture

- **`content.js` (MAIN world)**: Neutralizes `EventTarget.prototype.addEventListener` and `window.onbeforeunload` before websites (like YouTube Music) can hook into Chrome's C++ unload pipeline.
- **`bridge.js` (ISOLATED world)**: Bridges Chrome's `storage` state to the active web page in real-time.
- **`background.js` (Service Worker)**: Automatically injects protection into all open tabs upon install/update and updates the toolbar badge.
- **`popup.html` / `popup.js` / `styles/popup.css`**: Minimalistic On/Off toggle interface.

## Installation

1. Open Google Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this directory:
   ```
   /Users/sandeeprao/Documents/Code/Close Tab
   ```
4. Click the extension icon in the Chrome toolbar to toggle protection **On** or **Off**.

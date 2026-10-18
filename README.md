<div align="center">
  <img src="icons/icon128.png" alt="Close Without Asking Logo" width="96" height="96" />
  <h1>Close Without Asking</h1>
  <p>
    <a href="https://github.com/sandeepisconscious-create/close-without-asking/archive/refs/heads/main.zip">
      <img src="https://img.shields.io/badge/Download-Extension%20ZIP%20(Latest)-007AFF?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Download Extension ZIP" />
    </a>
  </p>

  <p><strong>Never get trapped by "Leave site? Changes you made may not be saved" popups again.</strong></p>
  <p><em>Close tabs instantly the moment you hit <code>⌘ + W</code> or click <code>✕</code>.</em></p>
</div>

---

## ⚡ The Problem

Ever had someone suddenly walk into your room while you were streaming music or browsing, and you quickly pressed `⌘ + W` (or clicked `✕`), only to be blocked by this?

<div align="center">
  <br />
  <strong>🛑 "Leave site? Changes that you made may not be saved." [Cancel] [Leave]</strong>
  <br /><br />
</div>

- **It halts tab closure:** Chrome freezes tab dismissal until you manually aim your mouse and click "Leave".
- **The "Cancel" trap:** If you mistakenly hit `Cancel` or `Esc`, you remain stuck on the page, and closing it again triggers the exact same modal.
- **Background players hijack your browser:** Websites like YouTube Music, rich text editors, and complex SPAs aggressively bind unload events even when you haven't typed or changed anything.

---

## 🚀 The Solution: Close Without Asking

**Close Without Asking** is a lightweight, zero-latency Chrome extension (Manifest V3) that stops websites from taking your browser hostage.

- ⚡ **Instant Tab Dismissal:** Hit `⌘ + W` / `Ctrl + W` or click `✕` — tabs vanish immediately with zero confirmation modals.
- 🎯 **Universal Protection:** Works across all domains, SPAs, and embedded players (YouTube Music, form builders, web apps).
- 🎛️ **Minimal 1-Click Toggle:** A distraction-free popup switch lets you toggle protection **On** or **Off** in seconds whenever you want form warnings back.
- 🛡️ **Zero Resource Footprint:** Runs directly at `document_start` in the DOM layer without heavy polling or background battery drain.

---

## 📥 Quick Installation (Takes 30 seconds)

1. **[Download the Extension ZIP](https://github.com/sandeepisconscious-create/close-without-asking/archive/refs/heads/main.zip)** and unzip the folder on your computer.
2. Open Google Chrome and go to:
   ```text
   chrome://extensions
   ```
3. Turn on **Developer mode** using the toggle switch in the top-right corner.
4. Click **Load unpacked** (top-left) and select the unzipped `close-without-asking` folder.
5. Done! You can now close tabs without interruptions.

---

## 💡 How It Works Under the Hood

Modern web apps listen for `beforeunload` events to display exit warnings. **Close Without Asking** neutralizes this at the root:

1. **`content.js` (MAIN world)**: Neutralizes `EventTarget.prototype.addEventListener` and `window.onbeforeunload` before external scripts register unload listeners into Chrome's C++ browser pipeline.
2. **`bridge.js` (ISOLATED world)**: Bridges Chrome's local storage state to the DOM in real-time so your On/Off preference takes effect without needing to refresh existing tabs.
3. **`background.js` (Service Worker)**: Automatically activates protection on all currently open tabs upon installation or update.

---

## 📄 License & Credits

Created with ❤️ by **[Sandheep Rao](https://github.com/sandeepisconscious-create)**.

Licensed under the [MIT License](LICENSE).

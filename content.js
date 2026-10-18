/**
 * content.js: Runs in the page's MAIN world at document_start.
 * Universally blocks 'beforeunload' confirmation prompts across ALL websites
 * and DOM contexts (Window, Document, HTMLBodyElement, EventTarget).
 */
(() => {
  'use strict';

  // Prevent multiple initializations in the same context
  if (window.__CLOSE_TAB_INITIALIZED__) return;
  window.__CLOSE_TAB_INITIALIZED__ = true;

  const SYNC_TYPE = '__CLOSE_TAB_SYNC__';
  const DATASET_ATTR = 'closeTabEnabled';

  let isEnabled = true;

  // Sync state from bridge.js via postMessage
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === SYNC_TYPE) {
      isEnabled = Boolean(event.data.enabled);
    }
  });

  // Check DOM dataset attribute if bridge initialized earlier
  if (document.documentElement?.dataset?.[DATASET_ATTR]) {
    isEnabled = document.documentElement.dataset[DATASET_ATTR] === 'true';
  }

  const isUnloadType = (type) => {
    if (typeof type !== 'string') return false;
    const lower = type.toLowerCase();
    return lower === 'beforeunload' || lower === 'unload';
  };

  /**
   * Universal wrapper for addEventListener across any prototype.
   */
  const wrapAddEventListener = (proto) => {
    if (!proto || !proto.addEventListener) return;
    const original = proto.addEventListener;
    proto.addEventListener = function (type, listener, options) {
      if (typeof type === 'string') {
        const lower = type.toLowerCase();
        // Drop deprecated 'unload' to avoid browser permissions policy warnings
        if (lower === 'unload') return;
        // Drop 'beforeunload' when extension is active to prevent modal prompts
        if (isEnabled && lower === 'beforeunload') return;
      }
      try {
        return original.call(this, type, listener, options);
      } catch (e) {}
    };
  };

  // 1. Intercept across all potential event targets (Window, Document, Body, Frames)
  wrapAddEventListener(EventTarget.prototype);
  wrapAddEventListener(Window.prototype);
  if (typeof Document !== 'undefined') wrapAddEventListener(Document.prototype);

  /**
   * Neutralizes onbeforeunload property on a target object.
   */
  const trapProperty = (target, prop) => {
    try {
      Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: true,
        get: () => null,
        set: function (fn) {
          if (!isEnabled) {
            try {
              delete target[prop];
              target[prop] = fn;
            } catch (e) {}
          }
        },
      });
    } catch (e) {
      try {
        target[prop] = null;
      } catch (err) {}
    }
  };

  // 2. Universal property traps (covers sites attaching to window, document, or body)
  trapProperty(window, 'onbeforeunload');
  trapProperty(window, 'onunload');
  if (typeof document !== 'undefined') {
    trapProperty(document, 'onbeforeunload');
    trapProperty(document, 'onunload');
  }
  if (typeof HTMLBodyElement !== 'undefined') {
    trapProperty(HTMLBodyElement.prototype, 'onbeforeunload');
    trapProperty(HTMLBodyElement.prototype, 'onunload');
  }

  // 3. Intercept BeforeUnloadEvent.prototype.returnValue & preventDefault
  // Some sites rely on `e.returnValue = "msg"` or `e.preventDefault()` inside beforeunload
  if (typeof BeforeUnloadEvent !== 'undefined') {
    try {
      Object.defineProperty(BeforeUnloadEvent.prototype, 'returnValue', {
        configurable: true,
        enumerable: true,
        get: () => '',
        set: function () {
          // Block assignment when enabled
        },
      });
    } catch (e) {}
  }

  if (typeof Event !== 'undefined') {
    const origPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function () {
      if (isEnabled && (this instanceof BeforeUnloadEvent || this.type === 'beforeunload')) {
        return; // Suppress dialog trigger
      }
      return origPreventDefault.call(this);
    };
  }

  /**
   * 4. Aggressively clean dynamic onbeforeunload handlers on any interactive event
   */
  const clearHandlers = () => {
    if (isEnabled) {
      if (window.onbeforeunload) window.onbeforeunload = null;
      if (window.onunload) window.onunload = null;
      if (document.onbeforeunload) document.onbeforeunload = null;
      if (document.body && document.body.onbeforeunload) document.body.onbeforeunload = null;
    }
  };

  // Listen across page interaction points (clicks, keypresses, forms, touch)
  window.addEventListener('click', clearHandlers, true);
  window.addEventListener('keydown', clearHandlers, true);
  window.addEventListener('input', clearHandlers, true);
  window.addEventListener('submit', clearHandlers, true);
  setInterval(clearHandlers, 500);

  clearHandlers();
})();

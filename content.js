(function () {
  'use strict';

  const STYLE_TAG_ID = 'custom-cursor-style';

  function buildCSS(defaultCursor, pointerCursor) {
    return [
      '*, *::before, *::after {',
      '  cursor: ' + defaultCursor + ' !important;',
      '}',
      'a[href],',
      'button,',
      '[role="button"],',
      '[tabindex],',
      'label,',
      'select,',
      'summary,',
      'input[type="submit"],',
      'input[type="button"],',
      'input[type="reset"],',
      'input[type="file"] {',
      '  cursor: ' + pointerCursor + ' !important;',
      '}'
    ].join('\n');
  }

  function ensureStyleTag() {
    let tag = document.getElementById(STYLE_TAG_ID);
    if (!tag) {
      tag = document.createElement('style');
      tag.id = STYLE_TAG_ID;
      const parent = document.head || document.documentElement;
      if (parent) {
        parent.appendChild(tag);
      }
    }
    return tag;
  }

  function applyCursor(defaultCursor, pointerCursor) {
    if (!document.head && !document.documentElement) {
      document.addEventListener('DOMContentLoaded', function () {
        applyCursor(defaultCursor, pointerCursor);
      }, { once: true });
      return;
    }
    const tag = ensureStyleTag();
    if (tag) {
      tag.textContent = buildCSS(defaultCursor, pointerCursor);
    }
  }

  function removeCursor() {
    const tag = document.getElementById(STYLE_TAG_ID);
    if (tag && tag.parentNode) {
      tag.parentNode.removeChild(tag);
    }
  }

  function handleCursorUpdate(data) {
    if (!data || typeof data !== 'object') return;

    if (data.cursorId === 'default') {
      removeCursor();
      return;
    }

    if (
      typeof data.defaultCursor === 'string' && data.defaultCursor.length > 0 &&
      typeof data.pointerCursor === 'string' && data.pointerCursor.length > 0
    ) {
      applyCursor(data.defaultCursor, data.pointerCursor);
    }
  }

  if (!window.__customCursorListenerAttached) {
    window.__customCursorListenerAttached = true;

    chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
      if (message && message.type === 'APPLY_CURSOR') {
        handleCursorUpdate(message.data);
        sendResponse({ success: true });
      }
      return false;
    });

    document.addEventListener('__customCursorApply', function (e) {
      if (e && e.detail) {
        handleCursorUpdate(e.detail);
      }
    });
  }

  if (window.__customCursorInitialData) {
    handleCursorUpdate(window.__customCursorInitialData);
    window.__customCursorInitialData = null;
  }

})();

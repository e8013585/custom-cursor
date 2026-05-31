(function () {
  'use strict';

  const STORAGE_KEY       = 'selectedCursorId';
  const DEFAULT_CURSOR_ID = 'default';
  const GRID_ID           = 'cursorGrid';
  const TOAST_ID          = 'ccToast';
  const ACTIVE_CLASS      = 'cc-card--active';

  let toastTimer = null;

  function t(key, substitutions) {
    return chrome.i18n.getMessage(key, substitutions) || key;
  }

  function applyRTL() {
    const lang = chrome.i18n.getUILanguage() || 'en';
    const rtlLangs = ['ar', 'he', 'fa', 'ur'];
    const base = lang.split('-')[0].split('_')[0];
    if (rtlLangs.includes(base)) {
      document.body.dir = 'rtl';
      document.documentElement.lang = lang;
    } else {
      document.body.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  }

  function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const msg = t(key);
      if (msg) el.textContent = msg;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria');
      const msg = t(key);
      if (msg) el.setAttribute('aria-label', msg);
    });

    document.title = t('popupTitle');
  }

  function showToast(message) {
    const toast = document.getElementById(TOAST_ID);
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('cc-toast--visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('cc-toast--visible');
      toastTimer = null;
    }, 3000);
  }

  function buildCard(cursorId, cursorDef, isActive) {
    const cursorName = t(cursorDef.nameKey);

    const card = document.createElement('div');
    card.className = 'cc-card' + (isActive ? ' ' + ACTIVE_CLASS : '');
    card.setAttribute('role', 'option');
    card.setAttribute('aria-selected', isActive ? 'true' : 'false');
    card.setAttribute('tabindex', isActive ? '0' : '-1');
    card.setAttribute('data-cursor-id', cursorId);

    if (isActive) {
      card.setAttribute('aria-label', t('activeAriaLabel', [cursorName]));
    } else {
      card.setAttribute('aria-label', t('cardAriaLabel', [cursorName]));
    }

    const badge = document.createElement('span');
    badge.className = 'cc-card__badge';
    badge.textContent = t('activeLabel');
    badge.setAttribute('aria-hidden', 'true');
    card.appendChild(badge);

    const preview = document.createElement('div');
    preview.className = 'cc-preview';
    preview.setAttribute('aria-hidden', 'true');

    if (cursorId === DEFAULT_CURSOR_ID) {
      preview.style.cursor = 'default';
    } else {
      preview.style.cursor = cursorDef.defaultCursor;
    }

    card.appendChild(preview);

    const nameEl = document.createElement('span');
    nameEl.className = 'cc-card__name';
    nameEl.textContent = cursorName;
    nameEl.setAttribute('aria-hidden', 'true');
    card.appendChild(nameEl);

    return card;
  }

  function renderGrid(activeCursorId) {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    const cursorIds = Object.keys(window.CURSORS);

    cursorIds.forEach(function (cursorId) {
      const cursorDef = window.CURSORS[cursorId];
      const isActive  = cursorId === activeCursorId;
      const card      = buildCard(cursorId, cursorDef, isActive);

      card.addEventListener('click', function () {
        handleCursorSelect(cursorId);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCursorSelect(cursorId);
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          focusAdjacentCard(card, 1);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          focusAdjacentCard(card, -1);
        }
      });

      grid.appendChild(card);
    });
  }

  function focusAdjacentCard(currentCard, direction) {
    const grid  = document.getElementById(GRID_ID);
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.cc-card'));
    const idx   = cards.indexOf(currentCard);
    const next  = cards[idx + direction];
    if (next) {
      next.setAttribute('tabindex', '0');
      next.focus();
      currentCard.setAttribute('tabindex', '-1');
    }
  }

  function updateActiveCard(newCursorId) {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    grid.querySelectorAll('.cc-card').forEach(function (card) {
      const cardId   = card.getAttribute('data-cursor-id');
      const isActive = cardId === newCursorId;
      const cursorName = t(window.CURSORS[cardId].nameKey);

      card.classList.toggle(ACTIVE_CLASS, isActive);
      card.setAttribute('aria-selected', isActive ? 'true' : 'false');
      card.setAttribute('tabindex', isActive ? '0' : '-1');

      if (isActive) {
        card.setAttribute('aria-label', t('activeAriaLabel', [cursorName]));
      } else {
        card.setAttribute('aria-label', t('cardAriaLabel', [cursorName]));
      }
    });
  }

  function applyCursorToPopup(cursorDef, cursorId) {
    let styleTag = document.getElementById('popup-cursor-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'popup-cursor-style';
      document.head.appendChild(styleTag);
    }

    if (cursorId === DEFAULT_CURSOR_ID) {
      styleTag.textContent = '';
      return;
    }

    const css = [
      '*, *::before, *::after { cursor: ' + cursorDef.defaultCursor + ' !important; }',
      '.cc-card, .cc-preview { cursor: ' + cursorDef.defaultCursor + ' !important; }'
    ].join('\n');

    styleTag.textContent = css;
  }

  async function sendCursorToActiveTab(cursorId, cursorDef) {
    let tabs;
    try {
      tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    } catch (e) {
      console.warn('[CustomCursor] tabs.query failed:', e.message);
      return;
    }

    if (!tabs || tabs.length === 0) return;

    const tab = tabs[0];
    if (!tab.id) return;

    const url = tab.url || '';
    if (
      url.startsWith('chrome://') ||
      url.startsWith('chrome-extension://') ||
      url.startsWith('devtools://') ||
      url.startsWith('about:') ||
      url.startsWith('edge://')
    ) {
      return;
    }

    const messageData = {
      cursorId:      cursorId,
      defaultCursor: cursorDef.defaultCursor,
      pointerCursor: cursorDef.pointerCursor
    };

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: false },
        files: ['cursors.js']
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: false },
        files: ['content.js']
      });
    } catch (injectErr) {
      console.warn('[CustomCursor] Script inject error:', injectErr.message);
    }

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'APPLY_CURSOR',
        data: messageData
      });
    } catch (msgErr) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: false },
          func: function (data) {
            var styleId = 'custom-cursor-style';
            if (data.cursorId === 'default') {
              var existing = document.getElementById(styleId);
              if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
              return;
            }
            var tag = document.getElementById(styleId);
            if (!tag) {
              tag = document.createElement('style');
              tag.id = styleId;
              (document.head || document.documentElement).appendChild(tag);
            }
            tag.textContent = [
              '*, *::before, *::after { cursor: ' + data.defaultCursor + ' !important; }',
              'a[href], button, [role="button"], [tabindex], label, select, input[type="submit"], input[type="button"], input[type="reset"], input[type="file"], summary { cursor: ' + data.pointerCursor + ' !important; }'
            ].join('\n');
          },
          args: [messageData]
        });
      } catch (fallbackErr) {
        showToast(t('injectErrorMsg'));
        console.warn('[CustomCursor] Fallback inject failed:', fallbackErr.message);
      }
    }
  }

  async function handleCursorSelect(cursorId) {
    const cursorDef = window.CURSORS[cursorId];
    if (!cursorDef) return;

    updateActiveCard(cursorId);

    applyCursorToPopup(cursorDef, cursorId);

    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: cursorId });
    } catch (storageErr) {
      showToast(t('storageErrorMsg'));
      console.error('[CustomCursor] Storage write failed:', storageErr.message);
      return;
    }

    await sendCursorToActiveTab(cursorId, cursorDef);
  }

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== 'local') return;
    if (!changes[STORAGE_KEY]) return;
    const newId = changes[STORAGE_KEY].newValue || DEFAULT_CURSOR_ID;
    updateActiveCard(newId);
    const def = window.CURSORS[newId];
    if (def) applyCursorToPopup(def, newId);
  });

  async function init() {
    applyRTL();
    applyStaticI18n();

    let savedCursorId = DEFAULT_CURSOR_ID;
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      if (result[STORAGE_KEY] && window.CURSORS[result[STORAGE_KEY]]) {
        savedCursorId = result[STORAGE_KEY];
      }
    } catch (e) {
      console.warn('[CustomCursor] Could not read storage:', e.message);
    }

    renderGrid(savedCursorId);

    const activeDef = window.CURSORS[savedCursorId];
    if (activeDef) applyCursorToPopup(activeDef, savedCursorId);

    const grid = document.getElementById(GRID_ID);
    if (grid) {
      const activeCard = grid.querySelector('.' + ACTIVE_CLASS);
      if (activeCard) {
        setTimeout(function () { activeCard.focus(); }, 50);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

'use strict';

const STORAGE_KEY = 'selectedCursorId';
const DEFAULT_CURSOR_ID = 'default';

async function getInjectableTabs() {
  const tabs = await chrome.tabs.query({});
  return tabs.filter(function (tab) {
    if (!tab.url) return false;
    if (tab.url.startsWith('chrome://')) return false;
    if (tab.url.startsWith('chrome-extension://')) return false;
    if (tab.url.startsWith('devtools://')) return false;
    if (tab.url.startsWith('about:')) return false;
    if (tab.url.startsWith('edge://')) return false;
    return true;
  });
}

async function injectCursorScriptsIntoTab(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId, allFrames: false },
    files: ['cursors.js']
  });
  await chrome.scripting.executeScript({
    target: { tabId: tabId, allFrames: false },
    files: ['content.js']
  });
}

async function sendCursorMessageToTab(tabId, cursorId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: false },
      func: function (cid) {
        var cursors = window.CURSORS;
        if (!cursors) return;
        var def = cursors[cid] || cursors['default'];
        document.dispatchEvent(new CustomEvent('__customCursorApply', {
          detail: {
            cursorId: cid,
            defaultCursor: def.defaultCursor,
            pointerCursor: def.pointerCursor
          }
        }));
      },
      args: [cursorId]
    });
  } catch (err) {
    console.warn('[CustomCursor] sendCursorMessageToTab failed for tab', tabId, err.message);
  }
}

async function applySavedCursorToTab(tabId) {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const cursorId = result[STORAGE_KEY] || DEFAULT_CURSOR_ID;

    await injectCursorScriptsIntoTab(tabId);
    await sendCursorMessageToTab(tabId, cursorId);
  } catch (err) {
    console.warn('[CustomCursor] Could not apply cursor to tab', tabId, err.message);
  }
}

async function applyToAllTabs() {
  const tabs = await getInjectableTabs();
  for (const tab of tabs) {
    if (tab.id != null) {
      applySavedCursorToTab(tab.id).catch(function (e) {
        console.warn('[CustomCursor] Tab', tab.id, e.message);
      });
    }
  }
}

chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.local.get(STORAGE_KEY, function (result) {
    if (!result[STORAGE_KEY]) {
      chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_CURSOR_ID });
    }
  });

  if (details.reason === 'install' || details.reason === 'update') {
    setTimeout(applyToAllTabs, 1500);
  }
});

chrome.runtime.onStartup.addListener(function () {
  setTimeout(applyToAllTabs, 2000);
});

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area !== 'local') return;
  if (!changes[STORAGE_KEY]) return;

  const newCursorId = changes[STORAGE_KEY].newValue || DEFAULT_CURSOR_ID;

  getInjectableTabs().then(function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.id == null) return;
      injectCursorScriptsIntoTab(tab.id)
        .then(function () {
          return chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: false },
            func: function (cid) {
              var cursors = window.CURSORS;
              if (!cursors) return;
              var def = cursors[cid] || cursors['default'];
              document.dispatchEvent(new CustomEvent('__customCursorApply', {
                detail: {
                  cursorId: cid,
                  defaultCursor: def.defaultCursor,
                  pointerCursor: def.pointerCursor
                }
              }));
            },
            args: [newCursorId]
          });
        })
        .catch(function (e) {
          console.warn('[CustomCursor] storage change inject failed, tab', tab.id, e.message);
        });
    });
  });
});

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message && message.type === 'INJECT_ACTIVE_TAB') {
    const tabId = message.tabId;
    if (tabId == null) {
      sendResponse({ success: false, error: 'No tabId' });
      return false;
    }
    injectCursorScriptsIntoTab(tabId)
      .then(function () {
        sendResponse({ success: true });
      })
      .catch(function (e) {
        sendResponse({ success: false, error: e.message });
      });
    return true;
  }
  return false;
});

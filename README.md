# Custom Cursor

Apply beautiful custom cursors to every webpage you visit. Choose from 12 handcrafted styles — including crosshair, neon ring, star, heart, paw print, and more — all rendered as crisp inline SVG data URIs.

---

## Store Description

**Make your cursor uniquely yours.** Custom Cursor replaces your system cursor with a stylish alternative across every site you browse.

- **12 unique cursor styles** — Crosshair, Pointer Dot, Neon Ring, Arrow Classic, Retro Pixel, Feather, Paw Print, Star, Heart, Diamond, Leaf, and the system Default
- **Live preview** — Hover any card to see the cursor in action before applying
- **Persistent** — Your choice is remembered across tabs and browser restarts
- **Dark theme popup** — Easy on the eyes, fits modern browser UI
- **Lightweight** — All cursors are inline SVGs; zero external requests
- **Localized** — Supports 55 languages
- **Privacy-first** — No data collected. No analytics. No network calls.

---

## Permission Justifications

### `storage`

**Why it's needed:** Saves your selected cursor preference (e.g. `"heart"`) to `chrome.storage.local` so the extension remembers your choice across browser sessions and applies it automatically on new tabs.

**What is stored:** A single string — the cursor ID. That's it. No user data, no page data, no timestamps.

**Privacy:** Data never leaves your device.

---

### `activeTab`

**Why it's needed:** Allows the extension to inject the cursor style into the currently active tab. This permission is scoped to the moment you click the extension icon and is automatically revoked when the popup closes.

**What it accesses:** The active tab's DOM — only to insert a `<style>` element overriding the `cursor` CSS property. No content is read, logged, or transmitted.

**Privacy:** Temporary, user-initiated access only. The extension has zero persistent tab permissions.

---

### `scripting`

**Why it's needed:** Required by Manifest V3 to programmatically inject a CSS style tag into the active tab. The injection happens via `chrome.scripting.executeScript` and only when you select a cursor in the popup or when the service worker applies your saved preference to new tabs.

**Privacy:** Injects only a CSS `cursor` rule. Never reads page content.

---

### `host_permissions` (`<all_urls>`)

**Why it's needed:** Your cursor should appear on every website, not just a pre-approved list. Since we can't predict which URLs you'll visit, Chrome requires `<all_urls>` for cross-origin script injection via `chrome.scripting.executeScript`. This is the standard pattern for MV3 extensions that customize page appearance.

**Privacy:** This grants the *ability* to run on any page, but the extension uses it solely to inject CSS cursor styles. No page data is read or transmitted. The extension has no content scripts — injection only happens on-demand.

---

### `web_accessible_resources` (`cursors.js`)

**Why it's needed:** `cursors.js` defines the `window.CURSORS` registry and must be available to pages when injected via `chrome.scripting.executeScript`. Declaring it as web-accessible satisfies Chrome's security requirements for scripts injected into page context.

**Privacy:** Contains only SVG cursor definitions. No dynamic or user-specific code.

---

## Icons

The Extension icons (`icons/icon16.png`, `icon48.png`, `icon128.png`) are simple colored squares. Replace them with your own artwork before publishing to the Chrome Web Store.

## License

MIT

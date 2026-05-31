(function () {
  'use strict';

  function svgToDataURI(svgString) {
    return 'data:image/svg+xml,' + encodeURIComponent(svgString.trim());
  }

  const crosshairDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="13" fill="none" stroke="#222" stroke-width="2"/>
  <line x1="16" y1="1" x2="16" y2="31" stroke="#222" stroke-width="2"/>
  <line x1="1" y1="16" x2="31" y2="16" stroke="#222" stroke-width="2"/>
  <circle cx="16" cy="16" r="2" fill="#e00"/>
</svg>`;

  const crosshairPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="13" fill="none" stroke="#0055cc" stroke-width="2"/>
  <line x1="16" y1="1" x2="16" y2="31" stroke="#0055cc" stroke-width="2"/>
  <line x1="1" y1="16" x2="31" y2="16" stroke="#0055cc" stroke-width="2"/>
  <circle cx="16" cy="16" r="3" fill="#0055cc"/>
</svg>`;

  const pointerDotDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="6" fill="#222" stroke="#fff" stroke-width="2"/>
</svg>`;

  const pointerDotPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="8" fill="#0055cc" stroke="#fff" stroke-width="2"/>
  <circle cx="16" cy="16" r="3" fill="#fff"/>
</svg>`;

  const neonRingDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <filter id="glow-d" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="16" cy="16" r="12" fill="none" stroke="#00ffcc" stroke-width="3" filter="url(#glow-d)"/>
  <circle cx="16" cy="16" r="2" fill="#00ffcc" filter="url(#glow-d)"/>
</svg>`;

  const neonRingPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <filter id="glow-p" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="16" cy="16" r="12" fill="none" stroke="#ff00cc" stroke-width="3" filter="url(#glow-p)"/>
  <circle cx="16" cy="16" r="3" fill="#ff00cc" filter="url(#glow-p)"/>
</svg>`;

  const arrowClassicDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <polygon points="4,2 4,26 10,20 14,30 18,28 14,18 22,18" fill="#222" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

  const arrowClassicPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <polygon points="4,2 4,26 10,20 14,30 18,28 14,18 22,18" fill="#0055cc" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="22" cy="10" r="3" fill="#ff9900" stroke="#fff" stroke-width="1"/>
</svg>`;

  const retroPixelDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="4" height="4" fill="#111"/>
  <rect x="2" y="6" width="4" height="4" fill="#111"/>
  <rect x="2" y="10" width="4" height="4" fill="#111"/>
  <rect x="2" y="14" width="4" height="4" fill="#111"/>
  <rect x="2" y="18" width="4" height="4" fill="#111"/>
  <rect x="2" y="22" width="4" height="4" fill="#111"/>
  <rect x="6" y="6" width="4" height="4" fill="#111"/>
  <rect x="10" y="10" width="4" height="4" fill="#111"/>
  <rect x="14" y="14" width="4" height="4" fill="#111"/>
  <rect x="6" y="14" width="4" height="4" fill="#111"/>
  <rect x="6" y="18" width="4" height="4" fill="#111"/>
  <rect x="10" y="22" width="4" height="4" fill="#111"/>
  <rect x="14" y="22" width="4" height="4" fill="#111"/>
  <rect x="6" y="2" width="2" height="2" fill="#fff"/>
  <rect x="2" y="2" width="2" height="2" fill="#fff"/>
</svg>`;

  const retroPixelPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="4" height="4" fill="#0055cc"/>
  <rect x="2" y="6" width="4" height="4" fill="#0055cc"/>
  <rect x="2" y="10" width="4" height="4" fill="#0055cc"/>
  <rect x="2" y="14" width="4" height="4" fill="#0055cc"/>
  <rect x="2" y="18" width="4" height="4" fill="#0055cc"/>
  <rect x="2" y="22" width="4" height="4" fill="#0055cc"/>
  <rect x="6" y="6" width="4" height="4" fill="#0055cc"/>
  <rect x="10" y="10" width="4" height="4" fill="#0055cc"/>
  <rect x="14" y="14" width="4" height="4" fill="#0055cc"/>
  <rect x="6" y="14" width="4" height="4" fill="#0055cc"/>
  <rect x="6" y="18" width="4" height="4" fill="#0055cc"/>
  <rect x="10" y="22" width="4" height="4" fill="#0055cc"/>
  <rect x="14" y="22" width="4" height="4" fill="#0055cc"/>
  <rect x="6" y="2" width="2" height="2" fill="#aaccff"/>
  <rect x="2" y="2" width="2" height="2" fill="#aaccff"/>
</svg>`;

  const featherDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M6 28 Q8 18 16 8 Q22 2 28 4 Q26 10 20 14 Q14 18 10 28 Z" fill="#c8a96e" stroke="#7a5c2e" stroke-width="1.2"/>
  <path d="M6 28 Q12 20 20 14" fill="none" stroke="#7a5c2e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="6" y1="28" x2="4" y2="30" stroke="#7a5c2e" stroke-width="1.5"/>
</svg>`;

  const featherPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M6 28 Q8 18 16 8 Q22 2 28 4 Q26 10 20 14 Q14 18 10 28 Z" fill="#5ecbc8" stroke="#1a7a78" stroke-width="1.2"/>
  <path d="M6 28 Q12 20 20 14" fill="none" stroke="#1a7a78" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="6" y1="28" x2="4" y2="30" stroke="#1a7a78" stroke-width="1.5"/>
</svg>`;

  const pawPrintDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <ellipse cx="16" cy="20" rx="7" ry="6" fill="#8B5E3C"/>
  <ellipse cx="9"  cy="13" rx="3" ry="2.5" fill="#8B5E3C"/>
  <ellipse cx="16" cy="11" rx="3" ry="2.5" fill="#8B5E3C"/>
  <ellipse cx="23" cy="13" rx="3" ry="2.5" fill="#8B5E3C"/>
  <ellipse cx="6"  cy="19" rx="2.5" ry="2"  fill="#8B5E3C"/>
  <ellipse cx="26" cy="19" rx="2.5" ry="2"  fill="#8B5E3C"/>
</svg>`;

  const pawPrintPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <ellipse cx="16" cy="20" rx="7" ry="6" fill="#7b2fbe"/>
  <ellipse cx="9"  cy="13" rx="3" ry="2.5" fill="#7b2fbe"/>
  <ellipse cx="16" cy="11" rx="3" ry="2.5" fill="#7b2fbe"/>
  <ellipse cx="23" cy="13" rx="3" ry="2.5" fill="#7b2fbe"/>
  <ellipse cx="6"  cy="19" rx="2.5" ry="2"  fill="#7b2fbe"/>
  <ellipse cx="26" cy="19" rx="2.5" ry="2"  fill="#7b2fbe"/>
</svg>`;

  const starDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <polygon points="16,3 19.5,12.5 30,12.5 21.5,18.5 24.5,28 16,22 7.5,28 10.5,18.5 2,12.5 12.5,12.5" fill="#f5c518" stroke="#c8960c" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;

  const starPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <filter id="star-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <polygon points="16,3 19.5,12.5 30,12.5 21.5,18.5 24.5,28 16,22 7.5,28 10.5,18.5 2,12.5 12.5,12.5" fill="#ff9900" stroke="#cc6600" stroke-width="1.2" stroke-linejoin="round" filter="url(#star-glow)"/>
</svg>`;

  const heartDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M16 28 C16 28 4 20 4 12 C4 7 8 4 12 4 C14 4 16 6 16 6 C16 6 18 4 20 4 C24 4 28 7 28 12 C28 20 16 28 16 28 Z" fill="#e8304a" stroke="#a01030" stroke-width="1.2"/>
  <path d="M11 10 Q10 14 13 15" fill="none" stroke="#ff8090" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

  const heartPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M16 28 C16 28 4 20 4 12 C4 7 8 4 12 4 C14 4 16 6 16 6 C16 6 18 4 20 4 C24 4 28 7 28 12 C28 20 16 28 16 28 Z" fill="#ff4d79" stroke="#cc0044" stroke-width="1.2"/>
  <path d="M11 10 Q10 14 13 15" fill="none" stroke="#ffaacc" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="24" cy="7" r="1.5" fill="#fff"/>
</svg>`;

  const diamondDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <polygon points="16,3 29,14 16,29 3,14" fill="#55aaff" stroke="#0044cc" stroke-width="1.5" stroke-linejoin="round"/>
  <polygon points="16,3 29,14 16,16 3,14" fill="#aaddff" stroke="none"/>
  <line x1="3" y1="14" x2="29" y2="14" stroke="#0044cc" stroke-width="1"/>
</svg>`;

  const diamondPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <polygon points="16,3 29,14 16,29 3,14" fill="#00cccc" stroke="#007777" stroke-width="1.5" stroke-linejoin="round"/>
  <polygon points="16,3 29,14 16,16 3,14" fill="#aaffff" stroke="none"/>
  <line x1="3" y1="14" x2="29" y2="14" stroke="#007777" stroke-width="1"/>
</svg>`;

  const leafDefaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M6 26 Q6 6 26 4 Q24 18 14 22 Q10 24 6 26 Z" fill="#4caf50" stroke="#2e7d32" stroke-width="1.2"/>
  <path d="M6 26 Q14 18 26 4" fill="none" stroke="#2e7d32" stroke-width="1" stroke-linecap="round"/>
  <path d="M10 22 Q11 15 18 10" fill="none" stroke="#81c784" stroke-width="0.8"/>
  <path d="M13 24 Q15 17 22 11" fill="none" stroke="#81c784" stroke-width="0.8"/>
</svg>`;

  const leafPointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M6 26 Q6 6 26 4 Q24 18 14 22 Q10 24 6 26 Z" fill="#8bc34a" stroke="#558b2f" stroke-width="1.2"/>
  <path d="M6 26 Q14 18 26 4" fill="none" stroke="#558b2f" stroke-width="1" stroke-linecap="round"/>
  <path d="M10 22 Q11 15 18 10" fill="none" stroke="#c5e1a5" stroke-width="0.8"/>
  <path d="M13 24 Q15 17 22 11" fill="none" stroke="#c5e1a5" stroke-width="0.8"/>
</svg>`;

  function makeCursor(svgString, hotspotX, hotspotY, fallback) {
    const uri = svgToDataURI(svgString);
    return 'url("' + uri + '") ' + hotspotX + ' ' + hotspotY + ', ' + fallback;
  }

  window.CURSORS = {

    default: {
      nameKey: 'cursorDefault',
      defaultCursor: 'default',
      pointerCursor: 'pointer'
    },

    crosshair: {
      nameKey: 'cursorCrosshair',
      defaultCursor: makeCursor(crosshairDefaultSVG, 16, 16, 'crosshair'),
      pointerCursor: makeCursor(crosshairPointerSVG, 16, 16, 'crosshair')
    },

    pointerDot: {
      nameKey: 'cursorPointerDot',
      defaultCursor: makeCursor(pointerDotDefaultSVG, 16, 16, 'default'),
      pointerCursor: makeCursor(pointerDotPointerSVG, 16, 16, 'pointer')
    },

    neonRing: {
      nameKey: 'cursorNeonRing',
      defaultCursor: makeCursor(neonRingDefaultSVG, 16, 16, 'default'),
      pointerCursor: makeCursor(neonRingPointerSVG, 16, 16, 'pointer')
    },

    arrowClassic: {
      nameKey: 'cursorArrowClassic',
      defaultCursor: makeCursor(arrowClassicDefaultSVG, 4, 2, 'default'),
      pointerCursor: makeCursor(arrowClassicPointerSVG, 4, 2, 'pointer')
    },

    retroPixel: {
      nameKey: 'cursorRetroPixel',
      defaultCursor: makeCursor(retroPixelDefaultSVG, 2, 2, 'default'),
      pointerCursor: makeCursor(retroPixelPointerSVG, 2, 2, 'pointer')
    },

    feather: {
      nameKey: 'cursorFeather',
      defaultCursor: makeCursor(featherDefaultSVG, 4, 28, 'default'),
      pointerCursor: makeCursor(featherPointerSVG, 4, 28, 'pointer')
    },

    pawPrint: {
      nameKey: 'cursorPawPrint',
      defaultCursor: makeCursor(pawPrintDefaultSVG, 14, 14, 'default'),
      pointerCursor: makeCursor(pawPrintPointerSVG, 14, 14, 'pointer')
    },

    star: {
      nameKey: 'cursorStar',
      defaultCursor: makeCursor(starDefaultSVG, 16, 15, 'default'),
      pointerCursor: makeCursor(starPointerSVG, 16, 15, 'pointer')
    },

    heart: {
      nameKey: 'cursorHeart',
      defaultCursor: makeCursor(heartDefaultSVG, 16, 14, 'default'),
      pointerCursor: makeCursor(heartPointerSVG, 16, 14, 'pointer')
    },

    diamond: {
      nameKey: 'cursorDiamond',
      defaultCursor: makeCursor(diamondDefaultSVG, 16, 5, 'default'),
      pointerCursor: makeCursor(diamondPointerSVG, 16, 5, 'pointer')
    },

    leaf: {
      nameKey: 'cursorLeaf',
      defaultCursor: makeCursor(leafDefaultSVG, 6, 26, 'default'),
      pointerCursor: makeCursor(leafPointerSVG, 6, 26, 'pointer')
    }

  };

})();

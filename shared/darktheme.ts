export const STYLE_ID = 'core-dark-override';

export const DARK_THEME_CSS = `
/* Core Akıllı Tersine Çevirme (Filter Mode) */
html.core-invert {
  background-color: #ffffff !important;
  filter: invert(1) hue-rotate(180deg) saturate(1.2) !important;
  color-scheme: dark !important;
}

/* Tersine çevrilince beyaz parlayan gölgeleri tamamen kapat (Hover beyazlamasını çözer) */
html.core-invert * {
  box-shadow: none !important;
}

/* Medya elementlerini eski haline döndür (Yoksa negatif röntgen gibi görünürler) */
html.core-invert img,
html.core-invert video,
html.core-invert iframe,
html.core-invert canvas,
html.core-invert picture,
html.core-invert embed,
html.core-invert object {
  filter: saturate(0.8333) hue-rotate(180deg) invert(1) !important;
}

/* Koyu arka planlı medya elementlerinin içindeki SVG'ler bozulmasın */
html.core-invert svg {
  color-scheme: light !important;
}

/* ── YOUTUBE ÖZEL DÜZELTMELERİ ── */
/* Logonun filtresini tersine çevirerek kırmızıyı %100 orijinal yaparız. */
html.core-invert ytd-topbar-logo-renderer {
  filter: saturate(0.8333) hue-rotate(180deg) invert(1) !important;
}
/* Sadece "YouTube" yazısının harflerini beyaz yap. (Kırmızı butonu ellemek yok) */
html.core-invert ytd-topbar-logo-renderer #youtube-paths path,
html.core-invert ytd-topbar-logo-renderer svg path:not([fill]) {
  fill: #ffffff !important;
}

/* Fareyle üzerine gelince çıkan siyah bilgi kutucuklarının beyaz parlamasını engelle */
html.core-invert tp-yt-paper-tooltip {
  filter: saturate(0.8333) hue-rotate(180deg) invert(1) !important;
}
`;

function parseRGB(color: string): [number, number, number, number] | null {
  const m = color.match(/rgba?\(\s*([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:(?:\s*,\s*|\s*\/\s*)([\d.]+))?\s*\)/);
  if (m) {
    return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] == null ? 1 : Number(m[4])];
  }
  return null;
}

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function isSiteAlreadyDark(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (document.body) {
    const cs = getComputedStyle(document.body);
    const bg = parseRGB(cs.backgroundColor);
    if (bg && bg[3] > 0.1) {
      if (luminance(bg[0], bg[1], bg[2]) < 0.4) {
        return true;
      }
    }
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }

  return false;
}

let checkInterval: number | null = null;

export function startDarkObserver(doc: Document): void {
  if (typeof window === 'undefined') return;

  injectDarkCSS(doc);

  if (isSiteAlreadyDark()) {
    doc.documentElement.classList.remove('core-invert');
  } else {
    doc.documentElement.classList.add('core-invert');
  }

  if (!checkInterval) {
    checkInterval = window.setInterval(() => {
      if (isSiteAlreadyDark()) {
        doc.documentElement.classList.remove('core-invert');
      } else {
        doc.documentElement.classList.add('core-invert');
      }
    }, 2000);
  }
}

export function stopDarkObserver(): void {
  if (typeof window === 'undefined') return;
  if (checkInterval) {
    window.clearInterval(checkInterval);
    checkInterval = null;
  }
}

export function revertAll(doc: Document): void {
  if (typeof window === 'undefined') return;
  doc.documentElement.classList.remove('core-invert');
}

export function injectDarkCSS(doc: Document): void {
  if (typeof window === 'undefined') return;
  if (doc.getElementById(STYLE_ID)) return;
  
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = DARK_THEME_CSS;
  (doc.head || doc.documentElement).appendChild(style);
}

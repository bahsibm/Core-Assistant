import { browser } from 'wxt/browser';
import { Readability } from '@mozilla/readability';
import type { ContentMessage } from '../shared/messages';
import type { GestureAction, ReadingTheme } from '../shared/types';
import { summarize } from '../shared/textrank';

const THEMES: Record<ReadingTheme, { bg: string; fg: string; link: string }> = {
  sepia: { bg: '#f4ecd8', fg: '#3b3226', link: '#8b5a2b' },
  dark: { bg: '#121212', fg: '#d6d6d6', link: '#7aa2f7' },
  light: { bg: '#ffffff', fg: '#1f2328', link: '#2563eb' },
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );
}

function buildReaderHTML(title: string, content: string, theme: ReadingTheme): string {
  const t = THEMES[theme];
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { margin: 0; background: ${t.bg}; }
  #reader {
    max-width: 42em; margin: 0 auto; padding: 2em 1.25em;
    line-height: 1.75; font-size: 18px;
    font-family: Georgia, 'Times New Roman', serif; color: ${t.fg};
  }
  #reader h1 { font-size: 1.7em; line-height: 1.3; margin: 0 0 0.6em; }
  #reader h2, #reader h3, #reader h4 { line-height: 1.3; margin: 1.2em 0 0.5em; }
  #reader p { margin: 1em 0; }
  #reader a { color: ${t.link}; }
  #reader img, #reader video, #reader picture { max-width: 100%; height: auto; display: block; margin: 1em auto; }
  #reader ul, #reader ol { margin: 1em 0; padding-left: 1.5em; }
  #reader li { margin: 0.3em 0; }
  #reader blockquote { border-left: 3px solid ${t.link}; margin: 1em 0; padding: 0.5em 1em; font-style: italic; }
  #reader pre { background: rgba(128,128,128,0.12); padding: 0.75em 1em; overflow-x: auto; white-space: pre-wrap; }
  #reader code, #reader pre { font-family: ui-monospace, SFMono-Regular, monospace; }
  #reader figure { margin: 0 0 1.5em; }
  #reader figcaption { font-size: 0.85em; opacity: 0.75; margin-top: 0.4em; }
  #reader table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
</style>
</head>
<body>
<div id="reader">
${title ? `<h1>${escapeHtml(title)}</h1>` : ''}
${content}
</div>
</body>
</html>`;
}

// Bazı siteler görselleri `data-src` ile lazy-load eder; Readability bunları görmez.
function resolveLazyImages(doc: Document): void {
  doc.querySelectorAll('img[data-src]').forEach((img) => {
    const src = img.getAttribute('data-src');
    if (src) img.setAttribute('src', src);
  });
  doc.querySelectorAll('img[data-srcset]').forEach((img) => {
    const s = img.getAttribute('data-srcset');
    if (s) img.setAttribute('srcset', s);
  });
}

function getTitle(doc: Document, fallback: string): string {
  const h1 = doc.querySelector('h1');
  const h1Text = h1?.textContent?.trim();
  if (h1Text) return h1Text;
  const og = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim();
  if (og) return og;
  return fallback || doc.title || '';
}

function getLeadImage(doc: Document): string | null {
  return doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null;
}

let frame: HTMLIFrameElement | null = null;
let closeBtn: HTMLButtonElement | null = null;
let lastArticle: { title: string; content: string } | null = null;

function renderFrame(theme: ReadingTheme): void {
  if (!lastArticle) return;

  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'reading-frame';
    frame.setAttribute('sandbox', 'allow-same-origin');
    frame.style.cssText =
      'position: fixed; inset: 0; width: 100%; height: 100%; border: 0; z-index: 2147483647; background: #fff;';
    document.documentElement.appendChild(frame);

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '✕';
    closeBtn.title = 'Okuma modunu kapat';
    closeBtn.style.cssText =
      'position: fixed; top: 14px; right: 14px; z-index: 2147483647; width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(0,0,0,0.55) !important; color: #fff !important; font-size: 18px !important; line-height: 1; cursor: pointer;';
    closeBtn.addEventListener('click', disableReading);
    document.documentElement.appendChild(closeBtn);
  }

  frame.srcdoc = buildReaderHTML(lastArticle.title, lastArticle.content, theme);
}

function enableReading(theme: ReadingTheme): boolean {
  if (frame) {
    renderFrame(theme);
    return true;
  }

  const clone = document.cloneNode(true) as Document;
  resolveLazyImages(clone);
  const article = new Readability(clone).parse();
  const content = article?.content;
  if (!content) return false;

  // Başlığı ve ana görseli sayfadan kendimiz çıkarıyoruz (Readability bazı
  // sitelerde yanlış başlık seçebiliyor, görselleri de göremeyebiliyor).
  const title = getTitle(document, article.title ?? '');
  const leadImage = getLeadImage(document);
  const html = leadImage
    ? `<figure><img src="${escapeHtml(leadImage)}" alt=""></figure>` + content
    : content;

  lastArticle = { title, content: html };
  renderFrame(theme);
  return true;
}

function disableReading(): void {
  frame?.remove();
  frame = null;
  closeBtn?.remove();
  closeBtn = null;
  lastArticle = null;
}

/* ------------------------------ Fare hareketleri ------------------------------ */

let gesturesEnabled = false;
let trailEl: HTMLDivElement | null = null;

let gTracking = false;
let gStartX = 0;
let gStartY = 0;
let gMoved = false;
let gSuppressMenu = false;

async function refreshGesturesFlag(): Promise<void> {
  const data = (await browser.storage.local.get('settings')) as {
    settings?: { gesturesEnabled?: boolean };
  };
  gesturesEnabled = data.settings?.gesturesEnabled ?? false;
}

/**
 * Hangi eksende daha çok hareket varsa o yön kazanır.
 * En az 40 px hareket gerekir.
 */
function detectDirection(
  dx: number,
  dy: number,
): GestureAction | 'scrollTop' | 'scrollBottom' | null {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  
  // Hareketin toplam uzunluğunu hesapla (mousemove ile aynı mantık)
  if (Math.hypot(dx, dy) < 30) return null;

  // Kullanıcı "Geri" veya "İleri" (yatay) yapmak isterken elini hafif yukarı/aşağı kaydırabilir.
  // Yatay hareketlere %50 tolerans tanıyoruz:
  if (ax > ay * 0.5) return dx < 0 ? 'back' : 'forward';
  return dy < 0 ? 'scrollTop' : 'closeTab';
}

function showTrail(x: number, y: number): void {
  if (!trailEl) {
    trailEl = document.createElement('div');
    trailEl.style.cssText =
      'position:fixed;z-index:2147483647;pointer-events:none;' +
      'width:24px;height:24px;border-radius:50%;' +
      'border:3px solid #2563eb;background:rgba(37,99,235,.18);' +
      'box-shadow:0 0 6px rgba(0,0,0,.25);transform:translate(-50%,-50%);';
    document.documentElement.appendChild(trailEl);
  }
  trailEl.style.left = x + 'px';
  trailEl.style.top = y + 'px';
}

function hideTrail(): void {
  trailEl?.remove();
  trailEl = null;
}

function runAction(action: GestureAction | 'scrollTop' | 'scrollBottom'): void {
  switch (action) {
    case 'scrollTop':
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'scrollBottom':
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      break;
    case 'back':
      history.back();
      break;
    case 'forward':
      history.forward();
      break;
    case 'reload':
      location.reload();
      break;
    case 'closeTab':
    case 'newTab':
      try {
        browser.runtime.sendMessage({ type: 'GESTURE', action }).catch(() => {});
      } catch {
        location.reload();
      }
      break;
  }
}

function resetGesture(): void {
  gTracking = false;
  gMoved = false;
  hideTrail();
}

/* ------------------------------ Özet paneli ------------------------------ */

let summaryOverlay: HTMLDivElement | null = null;

function showSummaryOverlay(summary: string): void {
  closeSummaryOverlay();

  summaryOverlay = document.createElement('div');
  summaryOverlay.id = 'sa-summary-overlay';
  summaryOverlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);font-family:system-ui,-apple-system,sans-serif;';

  const card = document.createElement('div');
  card.style.cssText =
    'background:#fff;color:#1f2328;border-radius:12px;padding:24px 28px;max-width:520px;width:90%;' +
    'box-shadow:0 8px 32px rgba(0,0,0,.25);position:relative;max-height:70vh;overflow-y:auto;' +
    'line-height:1.65;font-size:15px;';

  const titleBar = document.createElement('div');
  titleBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';

  const title = document.createElement('strong');
  title.style.cssText = 'font-size:17px;color:#0f172a;';
  title.textContent = '📋 Özet';

  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:8px;';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.textContent = 'Kopyala';
  copyBtn.style.cssText =
    'border:1px solid #d1d5db;background:#f9fafb;color:#374151;border-radius:6px;' +
    'padding:4px 12px;font-size:13px;cursor:pointer;';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(summary).then(() => {
      copyBtn.textContent = 'Kopyalandı ✓';
      setTimeout(() => { copyBtn.textContent = 'Kopyala'; }, 1500);
    });
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '✕';
  closeBtn.style.cssText =
    'border:none;background:none;color:#6b7280;font-size:20px;cursor:pointer;padding:0 4px;line-height:1;';
  closeBtn.addEventListener('click', closeSummaryOverlay);

  btnGroup.append(copyBtn, closeBtn);
  titleBar.append(title, btnGroup);

  const body = document.createElement('p');
  body.style.cssText = 'margin:0;white-space:pre-wrap;';
  body.textContent = summary;

  card.append(titleBar, body);
  summaryOverlay.appendChild(card);

  // Dışarı tıklayınca kapat.
  summaryOverlay.addEventListener('click', (e) => {
    if (e.target === summaryOverlay) closeSummaryOverlay();
  });

  document.documentElement.appendChild(summaryOverlay);

  // Escape ile kapat.
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSummaryOverlay();
      window.removeEventListener('keydown', onKey, true);
    }
  };
  window.addEventListener('keydown', onKey, true);
}

function closeSummaryOverlay(): void {
  summaryOverlay?.remove();
  summaryOverlay = null;
}

/* ------------------------------ Content Script ------------------------------ */

export default defineContentScript({
  matches: ['<all_urls>'],
  main(ctx) {
    console.log('Sekme Asistanı: İçerik betiği başlatıldı.');
    ctx.onInvalidated(() => location.reload());

    // ── Mesaj dinleyicisi ──
    browser.runtime.onMessage.addListener(
      (message: ContentMessage, _sender, sendResponse) => {
        if (message.type === 'SET_READING_MODE') {
          try {
            const ok = message.enabled ? enableReading(message.theme) : (disableReading(), true);
            sendResponse({ ok });
          } catch (err) {
            console.error('Okuma modu hatası:', err);
            sendResponse({
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        } else if (message.type === 'SHOW_SUMMARY') {
          console.log('Sekme Asistanı: SHOW_SUMMARY mesajı alındı.', message.summary);
          showSummaryOverlay(message.summary);
          sendResponse({ ok: true });
        } else if (message.type === 'SUMMARIZE_PAGE') {
          console.log('Sekme Asistanı: SUMMARIZE_PAGE mesajı alındı.');
          try {
            const clone = document.cloneNode(true) as Document;
            resolveLazyImages(clone);
            const article = new Readability(clone).parse();
            if (article && article.textContent) {
              const summary = summarize(article.textContent, 8); // Tüm sayfada daha kapsamlı (8 cümle)
              showSummaryOverlay(summary || 'Bu sayfadan özetlenecek yeterli metin bulunamadı.');
            } else {
              showSummaryOverlay('Bu sayfadan içerik çıkarılamadı (belki makale değil veya çok kısa).');
            }
            sendResponse({ ok: true });
          } catch (err) {
            console.error('Sayfa özetleme hatası:', err);
            sendResponse({ ok: false });
          }
        }
      },
    );

    void refreshGesturesFlag();

    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.settings) {
        const newVal = changes.settings.newValue as { gesturesEnabled?: boolean } | undefined;
        gesturesEnabled = newVal?.gesturesEnabled ?? false;
      }
    });

    // ── Olay dinleyicileri ──
    //
    // `window` üzerinde capture fazında dinliyoruz.
    // Capture akışı: window → document → … → hedef
    // YouTube gibi siteler document üzerinde stopImmediatePropagation()
    // çağırsa bile bizim dinleyicimiz daha önce tetiklenir.
    //
    // Akış: mousedown(2) → mousemove… → mouseup(2) → contextmenu

    // ① Sağ tuşa bas → izlemeyi başlat.
    window.addEventListener(
      'mousedown',
      (e: MouseEvent) => {
        if (e.button !== 2 || !gesturesEnabled) return;
        gTracking = true;
        gMoved = false;
        gSuppressMenu = false;
        gStartX = e.clientX;
        gStartY = e.clientY;
      },
      true,
    );

    // ② Fare hareket ettikçe iz göster.
    window.addEventListener(
      'mousemove',
      (e: MouseEvent) => {
        if (!gTracking) return;
        if (!gMoved && Math.hypot(e.clientX - gStartX, e.clientY - gStartY) > 30) {
          gMoved = true;
        }
        if (gMoved) showTrail(e.clientX, e.clientY);
      },
      true,
    );

    // ③ Sağ tuşu bırak → yönü algıla, eylemi yürüt.
    window.addEventListener(
      'mouseup',
      (e: MouseEvent) => {
        if (e.button !== 2 || !gTracking) return;

        if (gMoved) {
          gSuppressMenu = true;
          const dir = detectDirection(e.clientX - gStartX, e.clientY - gStartY);
          if (dir) runAction(dir);
        }

        resetGesture();
      },
      true,
    );

    // ④ contextmenu — hareket yapıldıysa engelle, yapılmadıysa açılsın.
    window.addEventListener(
      'contextmenu',
      (e: Event) => {
        if (gSuppressMenu) {
          e.preventDefault();
          e.stopImmediatePropagation();
          gSuppressMenu = false;
          return;
        }
        if (gesturesEnabled && gTracking) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      true,
    );
  },
});

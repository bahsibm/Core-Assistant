// ─────────────────────────────────────────────────────────────────────────────
// dark-inject.content.ts — document_start'ta çalışan karanlık tema enjektörü.
//
// Neden ayrı bir content script?
//  - `document_start` ile sayfa RENDER EDİLMEDEN ÖNCE CSS enjekte eder
//  - Beyaz flash olmaz
//  - Meta tag'ler erken enjekte edilir → tarayıcı sekme çubuğu rengi hemen değişir
//  - Ana content.ts (document_idle) karmaşık DOM işlemleri için kalır
// ─────────────────────────────────────────────────────────────────────────────

import { browser } from 'wxt/browser';
import {
  startDarkObserver,
  stopDarkObserver,
  revertAll,
} from '../shared/darktheme';

let isActive = false;

function enable(): void {
  if (isActive) return;
  isActive = true;
  console.log('[dark-inject] enable() — karanlık mod açılıyor (Dark Reader)');

  // Saniyesinde başlat ki beyaz parlama olmasın
  startDarkObserver(document);
}

function disable(): void {
  if (!isActive) return;
  isActive = false;
  console.log('[dark-inject] disable() — karanlık mod kapatılıyor (Dark Reader)');
  stopDarkObserver();
  revertAll(document);
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  main() {
    console.log('[dark-inject] content script başlatıldı (document_start).');
    // ── 1. Başlangıçta ayarları kontrol et ──
    browser.storage.local.get('settings').then((data) => {
      const s = data.settings as { darkModeEnabled?: boolean } | undefined;
      console.log('[dark-inject] settings.darkModeEnabled =', s?.darkModeEnabled);
      if (s?.darkModeEnabled) {
        enable();
      }
    }).catch((err) => {
      console.error('[dark-inject] storage okunamadı:', err);
    });

    // ── 2. Ayar değişikliklerini izle (popup'tan veya options'tan) ──
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.settings) {
        const newVal = changes.settings.newValue as { darkModeEnabled?: boolean } | undefined;
        if (newVal?.darkModeEnabled) {
          enable();
        } else {
          disable();
        }
      }
    });

    // ── 3. Doğrudan mesaj dinle (popup'tan anlık yanıt için) ──
    browser.runtime.onMessage.addListener(
      (message: { type?: string; enabled?: boolean }, _sender, sendResponse) => {
        if (message?.type === 'TOGGLE_SITE_THEME') {
          console.log('[dark-inject] TOGGLE_SITE_THEME mesajı alındı:', message.enabled);
          if (message.enabled) {
            enable();
          } else {
            disable();
          }
          sendResponse({ ok: true });
          return true; // asenkron yanıt
        }
        // Bu mesaj bize ait değilse yanıt verme
        return false;
      },
    );
  },
});

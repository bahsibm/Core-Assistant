import { browser } from 'wxt/browser';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  async main() {
    // YouTube'da çalıştırma, YouTube'un kendi scripti ilgileniyor
    if (location.hostname.includes('youtube.com')) {
      return;
    }

    // Reklam engelleme ayarını kontrol et
    const data = await browser.storage.local.get('settings') as { settings?: { adblockEnabled?: boolean } };
    let enabled = data.settings?.adblockEnabled ?? false;
    
    // Adblock durumunu ana sayfaya (MAIN world) ilet
    window.postMessage({ type: 'JARVIS_ADBLOCK_STATE', enabled }, '*');

    let styleElement: HTMLStyleElement | null = null;
    let observer: MutationObserver | null = null;
    let cleanupIntervals: number[] = [];

    // Seçicileri birleştir
    const adSelectors = [
      /* Google Ads */
      'ins.adsbygoogle', '[id^="google_ads"]', '[id^="div-gpt-ad"]', '.google-auto-placed',
      
      /* Jenerik reklam kapsayıcıları */
      '[class*="ad-container"]', '[class*="ad-wrapper"]', '[class*="ad-banner"]',
      '[class*="ad-slot"]', '[class*="ad-unit"]', '[class*="ad-leaderboard"]',
      '[class*="ad-sidebar"]', '[class*="adbox"]', '[class*="ad-block"]',
      '[id*="ad-container"]', '[id*="ad-wrapper"]', '[id*="ad_banner"]',
      
      /* Sponsorlu içerikler */
      '[class*="sponsored"]', '[class*="Sponsored"]',
      '[data-ad]', '[data-ad-slot]', '[data-ad-client]', '[data-google-query-id]',
      
      /* iFrame reklamları */
      'iframe[src*="ads"]', 'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]',
      'iframe[id*="google_ads"]', 'iframe[src*="ad."]',
      
      /* Yaygın reklam sınıf isimleri */
      '.ad-300x250', '.ad-728x90', '.ad-160x600', '.ad-970x250', '.ad-300x600', '.textAd', '.text-ad',
      
      /* Çerez/GDPR bildirimleri */
      '[class*="cookie-banner"]', '[class*="cookie-notice"]', '[class*="cookie-consent"]', '[class*="cookie-popup"]',
      '[id*="cookie-banner"]', '[id*="cookie-notice"]', '[id*="cookie-consent"]',
      '[class*="gdpr-banner"]', '[class*="gdpr-notice"]', '[id*="gdpr-banner"]',
      '[class*="consent-banner"]', '[id*="consent-banner"]',
      '.cc-banner', '.cc-window', '#onetrust-consent-sdk', '#onetrust-banner-sdk', '.evidon-banner', '#truste-consent-track',
      
      /* Popup/overlay reklamları */
      '[class*="popup-ad"]', '[class*="interstitial"]', '[id*="popup-ad"]',
      
      /* Reklam benzeri sosyal widget'lar */
      '[class*="outbrain"]', '[class*="taboola"]', '[id*="taboola"]', '[id*="outbrain"]',
      '.OUTBRAIN', '.taboola-widget'
    ];
    
    const adSelectorsString = adSelectors.join(',\n');

    const cssString = `
${adSelectorsString} {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
`;

    // Aktif öğeleri temizleme fonksiyonu
    const activeCleanup = () => {
      document.querySelectorAll('iframe').forEach(iframe => {
        // İlgili boyutlarda ve reklama benzeyen iframe'leri kaldır
        const rect = iframe.getBoundingClientRect();
        const adSizes = [
          [300, 250], [728, 90], [160, 600], [970, 250], [300, 600], [320, 50], [320, 100], [970, 90]
        ];
        
        let isAdSize = false;
        for (const [w, h] of adSizes) {
          if (Math.abs(rect.width - w) < 5 && Math.abs(rect.height - h) < 5) {
            isAdSize = true;
            break;
          }
        }

        if (isAdSize || !iframe.src || iframe.src === 'about:blank' || iframe.title?.toLowerCase().includes('ad')) {
          iframe.style.display = 'none';
        }
      });
    };

    // Dinamik olarak eklenen öğeler için MutationObserver işleyicisi
    const handleMutations = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              
              if (el.matches && adSelectors.some(selector => el.matches(selector))) {
                el.style.display = 'none';
              } else if (el.querySelectorAll) {
                // Eklenen öğenin içindeki reklamları bul
                try {
                  const ads = el.querySelectorAll(adSelectorsString);
                  if (ads.length > 0) {
                    ads.forEach(ad => (ad as HTMLElement).style.display = 'none');
                  }
                } catch (e) {
                  // Seçici hatalarını yoksay
                }
              }
            }
          });
        }
      }
    };

    // Performans için MutationObserver'ı debounce et
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedMutations = (mutations: MutationRecord[]) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => handleMutations(mutations), 100);
    };

    const startFiltering = () => {
      // CSS stil öğesini ekle
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'jarvis-cosmetic-filter';
        styleElement.textContent = cssString;
        
        if (document.head) {
          document.head.appendChild(styleElement);
        } else {
          document.documentElement.appendChild(styleElement);
        }
      }

      // MutationObserver başlat
      if (!observer) {
        observer = new MutationObserver(debouncedMutations);
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }

      // Aktif temizleme döngüsü (İlk 30 saniye boyunca her 3 saniyede bir)
      activeCleanup();
      let count = 0;
      const intervalId = window.setInterval(() => {
        activeCleanup();
        count++;
        if (count >= 10) { // 30 saniye sonra (10 x 3sn) durdur
          clearInterval(intervalId);
        }
      }, 3000) as unknown as number;
      
      cleanupIntervals.push(intervalId);
    };

    const stopFiltering = () => {
      // Stili kaldır
      if (styleElement) {
        styleElement.remove();
        styleElement = null;
      }
      
      // Observer'ı durdur
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      
      // Temizleme döngülerini durdur
      cleanupIntervals.forEach(id => clearInterval(id));
      cleanupIntervals = [];
    };

    // Ayarlardaki değişiklikleri dinle
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.settings) {
        const newVal = changes.settings.newValue as { adblockEnabled?: boolean } | undefined;
        const wasEnabled = enabled;
        enabled = newVal?.adblockEnabled ?? false;
        
        // Yeni durumu bildir
        window.postMessage({ type: 'JARVIS_ADBLOCK_STATE', enabled }, '*');

        if (enabled && !wasEnabled) {
          startFiltering();
        } else if (!enabled && wasEnabled) {
          stopFiltering();
        }
      }
    });

    if (enabled) {
      startFiltering();
    }
  }
});

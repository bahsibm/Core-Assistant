export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    try {
      const w = window as any;

      // 1. Existing Mocker Logic
      // Google AdSense ve diğer popüler reklam ağlarını taklit et
      w.google_ad_client = 'ca-pub-' + Math.floor(Math.random() * 10000000000000000);
      w.google_ad_slot = Math.floor(Math.random() * 10000000000);
      w.google_ad_width = 300;
      w.google_ad_height = 250;
      w.canRunAds = true;
      w.isAdBlockActive = false;
      w.adSense = true;

      // 2. BlockAdBlock / FuckAdBlock Bypass
      // BlockAdBlock ve FuckAdBlock kütüphanelerini etkisizleştir
      const fakeAdBlocker = {
        onDetected: function() { return this; },
        onNotDetected: function(cb: Function) { try { cb(); } catch(e) {} return this; },
        on: function(detected: boolean, fn: Function) { if (!detected) { try { fn(); } catch(e) {} } return this; },
        check: function() { return false; },
        emitEvent: function() { return this; },
        setOption: function() { return this; },
        _options: { checkOnLoad: false, resetOnEnd: false, loopCheckTime: 0 },
        _detected: false,
      };

      w.BlockAdBlock = function() { return Object.create(fakeAdBlocker); };
      w.FuckAdBlock = function() { return Object.create(fakeAdBlocker); };
      w.fuckAdBlock = Object.create(fakeAdBlocker);
      w.blockAdBlock = Object.create(fakeAdBlocker);
      w.sniffAdBlock = Object.create(fakeAdBlocker);
      w.capolygon = Object.create(fakeAdBlocker); // bazı siteler bu ismi kullanır

      // 6. Additional window properties
      w.google_jobrunner = true;
      w.__ads = true;
      w._ads_loaded = true;
      w.ads_loaded = true;
      w.adBlockDetected = false;
      w.adblockDetected = false;
      w.adBlockEnabled = false;
      w.abd = false;
      w.AdBlockEnabled = false;
      w.isAdsDisplayed = true;
      w.adsEnabled = true;
      w.adBlocker = false;
      w.isAdBlockerEnabled = false;

      // 3. Bait element protection
      // Bait elementler: anti-adblock scriptleri bunların görünürlüğünü kontrol eder
      const baitClasses = [
        'ad-container', 'ad-wrapper', 'ad-banner', 'ad_banner',
        'ads', 'adsbox', 'ad-placeholder', 'adbanner', 'ad-text',
        'adUnit', 'ad-unit', 'ad-zone', 'ad-space', 'sponsor-ad',
        'pub_300x250', 'pub_300x250m', 'pub_728x90', 'text-ad',
        'textAd', 'text_ad', 'text_ads', 'text-ads', 'text-ad-links',
        'banner_ad', 'bannerAd', 'banner-ad'
      ];

      // Element boyutlarını 'görünür' olarak raporla
      const protectElement = (el: HTMLElement) => {
        Object.defineProperty(el, 'offsetHeight', { get: () => 1, configurable: true });
        Object.defineProperty(el, 'offsetWidth', { get: () => 1, configurable: true });
        Object.defineProperty(el, 'offsetParent', { get: () => document.body, configurable: true });
        Object.defineProperty(el, 'clientHeight', { get: () => 1, configurable: true });
        Object.defineProperty(el, 'clientWidth', { get: () => 1, configurable: true });
      };

      const isBaitElement = (el: HTMLElement) => {
        if (!el.className || typeof el.className !== 'string') return false;
        return baitClasses.some(c => el.className.includes(c));
      };

      // 4. getComputedStyle proxy
      const origGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function(el: Element, pseudo?: string | null) {
        const style = origGetComputedStyle.call(window, el, pseudo);
        // Bait elementlerin display:none olarak görünmesini engelle
        if (el instanceof HTMLElement && isBaitElement(el)) {
          return new Proxy(style, {
            get(target, prop) {
              if (prop === 'display') return 'block';
              if (prop === 'visibility') return 'visible';
              if (prop === 'opacity') return '1';
              if (prop === 'height') return '1px';
              const val = Reflect.get(target, prop);
              return typeof val === 'function' ? val.bind(target) : val;
            }
          });
        }
        return style;
      };

      // Create bait elements on DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => {
        try {
          const container = document.createElement('div');
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.top = '-9999px';
          container.style.width = '1px';
          container.style.height = '1px';
          
          baitClasses.forEach(className => {
            const bait = document.createElement('div');
            bait.className = className;
            protectElement(bait);
            container.appendChild(bait);
          });
          
          document.body.appendChild(container);
        } catch(e) {}

        // 5. Anti-adblock overlay/modal removal
        try {
          const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              for (const node of Array.from(mutation.addedNodes)) {
                if (!(node instanceof HTMLElement)) continue;
                
                // Elementin kendisi
                const text = (node.className || '') + ' ' + (node.id || '');
                const lower = typeof text === 'string' ? text.toLowerCase() : '';
                
                if (
                  lower.includes('adblock') || lower.includes('ad-block') ||
                  lower.includes('adb-') || lower.includes('adb_') ||
                  lower.includes('blocker-detected') || lower.includes('ad_blocker') ||
                  lower.includes('adb-detected') || lower.includes('adblock-notice') ||
                  lower.includes('adblock-overlay') || lower.includes('adb-overlay') ||
                  lower.includes('adblock-modal') || lower.includes('ab-detected')
                ) {
                  node.remove();
                  // Scroll kilidini aç
                  document.body.style.overflow = '';
                  document.documentElement.style.overflow = '';
                  document.body.style.position = '';
                }
              }
            }
          });
          
          observer.observe(document.body, { childList: true, subtree: true });
        } catch(e) {}
      });

    } catch (err) {
      // Ignore errors in main world
    }
  },
});

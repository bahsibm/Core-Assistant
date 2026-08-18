export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  world: 'MAIN',
  runAt: 'document_start',
  main() {
    try {
      // MAIN world'de eklenti API'lerine erişim yoktur.
      // Background script storage değişikliklerinde window'a mesaj gönderir.
      // Başlangıçta aktif kabul et, storage'dan gelen mesajla güncelle.
      let adblockActive = true;
      window.addEventListener('message', (e) => {
        if (e.data?.type === 'JARVIS_ADBLOCK_STATE') {
          adblockActive = e.data.enabled;
        }
      });

      // JSON.parse müdahalesi - YouTube reklam verilerini temizle
      const origParse = JSON.parse;
      JSON.parse = function(...args) {
        const result = origParse.apply(this, args);
        if (result && adblockActive) {
          try {
            if (result.adPlacements) result.adPlacements = [];
            if (result.playerAds) result.playerAds = [];
            if (result.adSlots) result.adSlots = [];
            if (result.adBreakHeartbeatParams) result.adBreakHeartbeatParams = undefined;
            
            // Player response içinde derinlemesine temizlik
            if (result.playerResponse) {
              if (result.playerResponse.adPlacements) result.playerResponse.adPlacements = [];
              if (result.playerResponse.playerAds) result.playerResponse.playerAds = [];
              if (result.playerResponse.adSlots) result.playerResponse.adSlots = [];
            }
          } catch (err) {
            // Hata durumunda yoksay
          }
        }
        return result;
      };

      // CSS enjeksiyonu - Reklam alanlarını gizle
      const injectCSS = () => {
        if (!document.head) {
          setTimeout(injectCSS, 10);
          return;
        }
        
        // Zaten eklendiyse tekrar ekleme
        if (document.getElementById('jarvis-yt-adblock-style')) return;
        
        const style = document.createElement('style');
        style.id = 'jarvis-yt-adblock-style';
        style.textContent = `
          .ytp-ad-module,
          .ytp-ad-overlay-slot,
          .ytp-ad-progress,
          .ytp-ad-progress-list,
          .video-ads,
          #masthead-ad,
          #player-ads,
          ytd-ad-slot-renderer,
          ytd-in-feed-ad-layout-renderer,
          ytd-banner-promo-renderer,
          ytd-promoted-sparkles-web-renderer,
          ytd-display-ad-renderer,
          ytd-promoted-video-renderer,
          ytd-compact-promoted-video-renderer,
          .ytd-mealbar-promo-renderer,
          ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
          tp-yt-paper-dialog:has(.ytd-enforcement-message-view-model),
          .ytp-ad-skip-button-slot {
            display: none !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `;
        document.head.appendChild(style);
      };
      injectCSS();

      // Video reklamlarını geçme
      const skipAd = () => {
        if (!adblockActive) return;
        
        try {
          const video = document.querySelector('video') as HTMLVideoElement;
          const player = document.querySelector('#movie_player, .html5-video-player');
          
          if (video && player && player.classList.contains('ad-showing')) {
            // Reklamı hızlıca geç
            if (video.duration) {
              video.currentTime = video.duration || 9999;
            }
            video.playbackRate = 16;
            video.muted = true;

            // Atla butonuna tıkla
            const skipButtons = document.querySelectorAll(
              '.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button'
            );
            skipButtons.forEach(btn => {
              (btn as HTMLElement).click();
            });
          }
        } catch (err) {
          // Yoksay
        }
      };

      // Reklam elementlerini temizleme
      const removeAdElements = () => {
        if (!adblockActive) return;

        try {
          // Kaldırılacak elementler
          const selectorsToRemove = [
            '.ytp-ad-text-overlay',
            'ytd-ad-slot-renderer',
            'ytd-banner-promo-renderer',
            'ytd-promoted-sparkles-web-renderer',
            'ytd-display-ad-renderer',
            'ytd-in-feed-ad-layout-renderer',
            '#masthead-ad',
            'ytd-promoted-video-renderer',
            'ytd-compact-promoted-video-renderer',
            '.ytd-mealbar-promo-renderer',
            'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
            'tp-yt-paper-dialog:has(.ytd-enforcement-message-view-model)', // anti-adblock dialog
            'ytd-popup-container:has(.ytd-enforcement-message-view-model)'
          ];
          
          selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
          });

          // Gizlenecek elementler (Tamamen silmek bazen player'ı bozabilir)
          const selectorsToHide = [
            '.ytp-ad-overlay-container',
            '#player-ads'
          ];

          selectorsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
          });
        } catch (err) {
          // Yoksay
        }
      };

      // Anti-adblock için fetch müdahalesi
      const origFetch = window.fetch;
      window.fetch = async function(...args) {
        if (!adblockActive) return origFetch.apply(this, args);
        
        try {
          const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url;
          // Reklam loglama isteklerini vs. engelleyebiliriz (şuanlık varsayılan pas geçiyor)
        } catch (e) {}
        
        return origFetch.apply(this, args);
      };

      // Mutation Observer - Sürekli DOM değişimlerini izle
      const observer = new MutationObserver(() => {
        if (adblockActive) {
          skipAd();
          removeAdElements();
        }
      });

      const startObserver = () => {
        if (document.documentElement) {
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true, // attribute changes (örn: class)
            attributeFilter: ['class']
          });
        } else {
          setTimeout(startObserver, 10);
        }
      };
      startObserver();

      // Ekstra periyodik temizlik için interval (Observer kaçırırsa diye)
      setInterval(() => {
        if (adblockActive) {
          skipAd();
          removeAdElements();
        }
      }, 1500);

    } catch (error) {
      console.error('YouTube Adblock Error:', error);
    }
  }
});

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    // Sadece adblock aktifse çalışması için storage'dan okuma yapmalıyız, ancak
    // MAIN world'de eklenti API'lerine erişim sınırlıdır (sadece window.postMessage).
    // Başlangıç MVP'sinde bunu genel bir defuser (etkisizleştirici) olarak kullanacağız.
    // Çünkü "window.google_ad_client = true" yapmak siteleri bozmaz, sadece "reklam yüklendi" zannettirir.
    
    try {
      // 1. Google Ads / AdSense Mocker
      const w = window as any;
      w.google_ad_client = true;
      w.adSense = true;
      w.google_ad_status = 1;
      
      // 2. Generic ads.js mocker
      w.canRunAds = true;
      w.isAdBlockActive = false;
      
      // 3. Fake 'ads' element if scripts check for it
      // HTML yapısını bozmamak için body oluştuktan sonra eklemeliyiz.
      document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('ads') && document.body) {
          const fakeAd = document.createElement('div');
          fakeAd.id = 'ads';
          fakeAd.className = 'ad-container ad-wrapper pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
          fakeAd.style.display = 'none';
          document.body.appendChild(fakeAd);
        }
      });
      
      // console.log('[Jarvis] Anti-Adblock Defeater active.');
    } catch (err) {
      // Ignore errors in main world
    }
  },
});

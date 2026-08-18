const fs = require('fs');

const popupTs = 'entrypoints/popup/main.ts';
let pt = fs.readFileSync(popupTs, 'utf8');

const ptMap = {
  'Sekmeler': 'Tabs',
  'Gruplanıyor…': 'Grouping…',
  'grup oluşturuldu ✓': 'groups created ✓',
  'Gruplanacak sekme yok (her sitede en az 2 sekme gerekir).': 'No tabs to group (at least 2 per site required).',
  'Hata:': 'Error:',
  'bilinmiyor': 'unknown',
  'Gruplanabilir sekme yok.': 'No tabs available to group.',
  'Grup için en az 2 sekme seç.': 'Select at least 2 tabs for a group.',
  'Grup oluşturuldu ✓': 'Group created ✓',
  'Kaydedilecek sekme yok.': 'No tabs available to save.',
  'Lütfen bir ad gir.': 'Please enter a name.',
  'Lütfen kaydedilecek en az bir sekme seç.': 'Please select at least one tab to save.',
  'Kaydediliyor…': 'Saving…',
  'Oturum kaydedildi ✓': 'Session saved ✓',
  'Açılıyor…': 'Opening…',
  'Oturum açıldı ✓': 'Session opened ✓',
  'Oturum silindi.': 'Session deleted.',
  'Henüz kayıtlı oturum yok.': 'No saved sessions yet.',
  'sekme · ': 'tabs · ',
  "'Aç'": "'Open'",
  "'Sekmeleri bu pencerede aç'": "'Open tabs in this window'",
  "'Sil'": "'Delete'",
  "'Oturumu sil'": "'Delete session'",
  'Dondurulabilir arka plan sekmesi yok.': 'No background tabs available to freeze.',
  'Lütfen dondurulacak en az bir sekme seç.': 'Please select at least one tab to freeze.',
  'Donduruluyor…': 'Freezing…',
  'sekme donduruldu ✓': 'tabs frozen ✓',
  'Temizleniyor…': 'Cleaning…',
  'Son 1 saatin çerezleri ve önbelleği temizlendi ✓': 'Cookies and cache for the last hour cleared ✓',
  'Geçmiş temizleniyor…': 'Clearing history…',
  'geçmişi silindi ✓': 'history cleared ✓',
  'Çalışma modunu bitir': 'Stop work mode',
  'Aktif · ~${mins} dk kaldı': 'Active · ~${mins} min left',
  'Çalışma modunu başlat': 'Start work mode',
  'Durduruluyor…': 'Stopping…',
  'Çalışma modu durduruldu.': 'Work mode stopped.',
  'Lütfen geçerli bir süre gir (en az 1 dk).': 'Please enter a valid duration (min 1 min).',
  'Başlatılıyor…': 'Starting…',
  'Çalışma modu başladı ✓': 'Work mode started ✓',
  'Okuma modunu kapat': 'Turn off reading mode',
  'Okuma modunu aç': 'Turn on reading mode',
  'Aktif sekme bulunamadı.': 'No active tab found.',
  'Bu sayfada okunabilir makale içeriği bulunamadı.': 'No readable article content found on this page.',
  'Okuma modu açık ✓': 'Reading mode on ✓',
  'Okuma modu kapalı': 'Reading mode off',
  'Okuma modu yüklenemedi — sayfayı yenileyip (F5) tekrar deneyin.': 'Could not load reading mode — refresh (F5) and try again.',
  'Tarayıcı teması: bu tarayıcıda algılanamıyor.': 'Browser theme: cannot be detected in this browser.',
  'Tarayıcı teması: yüklü değil — .output\\\\browser-theme klasörünü de yükleyin.': 'Browser theme: not installed — please install .output\\\\browser-theme.',
  'Tarayıcı teması: Açık ✓ (adres çubuğu koyu)': 'Browser theme: On ✓ (dark address bar)',
  'Tarayıcı teması: Kapalı (adres çubuğu açık)': 'Browser theme: Off (light address bar)',
  ' Tarayıcı teması açıldı ✓': ' Browser theme turned on ✓',
  ' Tarayıcı teması kapatıldı ✓': ' Browser theme turned off ✓',
  ' Tarayıcı teması yüklü değil (adres çubuğu için).': ' Browser theme not installed.',
  ' Tarayıcı teması bu tarayıcıda elle yönetilmeli ("Temayı yönet").': ' Browser theme must be managed manually.',
  ' Bu sekme için sayfayı yenileyin (F5).': ' Refresh this tab (F5).',
  'Karanlık mod tüm sitelerde aktif.': 'Dark mode active on all sites.',
  'Karanlık mod kapatıldı.': 'Dark mode turned off.',
  'Fare hareketlerini kapat': 'Disable mouse gestures',
  'Fare hareketlerini aç': 'Enable mouse gestures',
  'Fare hareketleri açık ✓': 'Mouse gestures on ✓',
  'Fare hareketleri kapalı': 'Mouse gestures off',
  'Otomatik uykuyu kapat': 'Disable auto-sleep',
  'Otomatik uykuyu aç': 'Enable auto-sleep',
  'Otomatik uyku açık ✓': 'Auto-sleep on ✓',
  'Otomatik uyku kapalı': 'Auto-sleep off',
  'Reklam Engelleyiciyi Kapat': 'Turn off Ad Blocker',
  'Reklam Engelleyiciyi Aç': 'Turn on Ad Blocker',
  'Reklam engelleyici açık ✓ (Etki için sayfayı yenileyin)': 'Ad blocker on ✓ (Refresh to see effect)',
  'Reklam engelleyici kapalı': 'Ad blocker off',
  "'Tema aç/kapat hatası:'": "'Theme toggle error:'",
  'Tarayıcı teması: değişiklik ENGELLENDİ — "Temayı yönet" ile elle değiştirin.': 'Browser theme: change BLOCKED — manage manually.',
  "'Son 15 dk'": "'Last 15 min'",
  "'Son 1 saat'": "'Last 1 hour'",
  "'Son 1 gün'": "'Last 1 day'"
};

for (const [k, v] of Object.entries(ptMap)) {
  pt = pt.split(k).join(v);
}
fs.writeFileSync(popupTs, pt, 'utf8');

const optsTs = 'entrypoints/options/main.ts';
let ot = fs.readFileSync(optsTs, 'utf8');
ot = ot.replace("'Kaydedildi ✓'", "'Saved ✓'");
fs.writeFileSync(optsTs, ot, 'utf8');

const domTs = 'shared/domains.ts';
let dt = fs.readFileSync(domTs, 'utf8');
dt = dt.replace('Eğlence: [', 'Entertainment: [');
dt = dt.replace('Sosyal: [', 'Social: [');
dt = dt.replace('Geliştirme: [', 'Development: [');
dt = dt.replace('Haber: [', 'News: [');
dt = dt.replace('Alışveriş: [', 'Shopping: [');
dt = dt.replace('İş: [', 'Work: [');
fs.writeFileSync(domTs, dt, 'utf8');

console.log("TS translations completed.");

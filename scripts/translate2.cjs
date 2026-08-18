const fs = require('fs');

// background.ts
const bgTs = 'entrypoints/background.ts';
let bg = fs.readFileSync(bgTs, 'utf8');
const bgMap = {
  "'Bunu Çevir'": "'Translate This'",
  "'Özetle'": "'Summarize'",
  "'Bu Sayfayı Özetle'": "'Summarize This Page'",
  "'Görseli Kaydet'": "'Save Image'",
  "'SHOW_SUMMARY mesajı başarısız:'": "'SHOW_SUMMARY message failed:'",
  "'SUMMARIZE_PAGE mesajı başarısız:'": "'SUMMARIZE_PAGE message failed:'",
  "'Görsel indirilemedi:'": "'Failed to download image:'",
  "'Atıl sekme kontrolü:'": "'Idle tab check:'",
  "'Çalışma modu bitişi:'": "'Work mode end:'",
  "'[Core] AdBlock aktif edildi.'": "'[Core] AdBlock enabled.'",
  "'[Core] AdBlock kapatıldı.'": "'[Core] AdBlock disabled.'",
  "'AdBlock senkronizasyonu başarısız:'": "'AdBlock sync failed:'",
  "'Bilinmeyen mesaj türü.'": "'Unknown message type.'",
  "Bu tarayıcıda sekme gruplama API\\'si (tabGroups) desteklenmiyor.": "Tab grouping API is not supported in this browser.",
  "'Gruplama başarısız": "'Grouping failed",
  "'Özel Grup'": "'Custom Group'",
  "'Adsız Oturum'": "'Untitled Session'",
  "'Oturum bulunamadı.'": "'Session not found.'",
  "'Bu oturumda açılabilir sekme yok.'": "'No openable tabs in this session.'",
  "'Sekme dondurulamadı ": "'Failed to freeze tab ",
  "'Fare hareketi uygulanamadı:'": "'Mouse gesture failed:'",
  "'Engelleme yönlendirmesi başarısız:'": "'Block redirection failed:'",
  "'Grup için en az 2 sekme seç.'": "'Select at least 2 tabs for a group.'",
  "'Kaydedilecek sekme yok.'": "'No tabs to save.'"
};
for (const [k, v] of Object.entries(bgMap)) bg = bg.split(k).join(v);
fs.writeFileSync(bgTs, bg, 'utf8');

// content.ts
const ctTs = 'entrypoints/content.ts';
let ct = fs.readFileSync(ctTs, 'utf8');
const ctMap = {
  "'Sekme Asistanı: İçerik betiği başlatıldı.'": "'Core Assistant: Content script started.'",
  "'Okuma modunu kapat'": "'Close reading mode'",
  "'📋 Özet'": "'📋 Summary'",
  "'Kopyala'": "'Copy'",
  "'Kopyalandı ✓'": "'Copied ✓'",
  "'Sekme Asistanı: SHOW_SUMMARY mesajı alındı.'": "'Core Assistant: SHOW_SUMMARY message received.'",
  "'Sekme Asistanı: SUMMARIZE_PAGE mesajı alındı.'": "'Core Assistant: SUMMARIZE_PAGE message received.'",
  "'Bu sayfadan özetlenecek yeterli metin bulunamadı.'": "'Not enough text found to summarize on this page.'",
  "'Bu sayfadan içerik çıkarılamadı (belki makale değil veya çok kısa).'": "'Could not extract content from this page (maybe not an article or too short).'",
  "'Sayfa özetleme hatası:'": "'Page summarization error:'",
  "'Okuma modu hatası:'": "'Reading mode error:'"
};
for (const [k, v] of Object.entries(ctMap)) ct = ct.split(k).join(v);
fs.writeFileSync(ctTs, ct, 'utf8');

// wxt.config.ts
const wxTs = 'wxt.config.ts';
let wx = fs.readFileSync(wxTs, 'utf8');
wx = wx.replace(
  "'Sekme gruplama, oturum yönetimi, okuma modu, odaklanma kalkanı ve daha fazlası.'",
  "'Tab grouping, session management, reading mode, focus shield, and more.'"
);
fs.writeFileSync(wxTs, wx, 'utf8');

console.log("Backend translations completed.");

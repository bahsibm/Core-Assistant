# 🤖 Jarvis Assistant

Çok amaçlı bir Chromium tarayıcı eklentisi. Sekmeleri yönetmek, odaklanmak ve okumayı kolaylaştırmak için 8 özelliği tek eklentide toplar.

## Özellikler

| Özellik | Açıklama |
|---|---|
| 🗂️ Akıllı Sekme Gruplama | Aynı siteye veya konuya ait sekmeleri otomatik gruplar (siteye göre / konuya göre / seçime göre). |
| 💾 Oturum Yöneticisi | "İş / Eğlence / Araştırma" gibi çalışma alanlarına sekmeleri kaydet ve tek tıkla geri çağır. |
| 📖 Okuma Modu | Reklamları ve dağıtan öğeleri kaldırıp metni sepya/koyu/açık temayla rahat okunur hâle getirir. |
| ⏳ Dikkat Kalkanı | Belirlenen süre boyunca sosyal medya ve haber sitelerini engeller (Pomodoro tarzı). |
| 🖱️ Fare Hareketleri | Sağ tıkla çiz: ← geri, → ileri, ↑ yukarı kaydır, ↓ sekmeyi kapat. |
| 📋 Bağlamsal Sağ Tık Menüsü | Seçili metni çevir/özetle; görseli kaydet. |
| 😴 Uyuyan Sekmeler | Dokunulmayan sekmeleri otomatik dondurarak RAM'i rahatlatır. |
| 🧹 Tek Tık Temizlik | Son 1 saatin çerezlerini ve önbelleğini tek tıkla temizler. |

## Teknoloji

- **TypeScript + WXT** (Manifest V3)
- Metin özetleme: yerleşik TextRank + IDF + MMR (çevrimdışı, ücretsiz — API anahtarı gerekmez)
- Okuma modu: Mozilla Readability

## Kurulum (Geliştirici modu)

1. Bağımlılıkları kur:
   ```bash
   npm install
   ```

2. Derle:
   ```bash
   npm run build
   ```

3. Tarayıcıda `chrome://extensions` (veya `edge://extensions`) aç.
4. Sağ üstte **Geliştirici modu**'nu aç.
5. **"Paketlenmemiş öğe yükle"** → `.output/chrome-mv3` klasörünü seç.

## Geliştirme

Sıcak yenileme (hot reload) için:
```bash
npm run dev
```

Dağıtım için zip:
```bash
npm run zip
```

## Klasör yapısı

```
entrypoints/
├── background.ts      # Servis worker (tüm arka plan mantığı)
├── content.ts         # İçerik betiği (okuma modu, fare hareketleri, özet paneli)
├── popup/             # Eklenti açılır paneli
├── options/           # Ayarlar sayfası
└── blocked/           # Çalışma modu engelleme sayfası
shared/
├── storage.ts         # Ayarlar/oturum depolama
├── messages.ts        # Mesaj tipleri
├── domains.ts         # Alan adı/konu sezgiseli
├── types.ts           # Ortak tipler
└── textrank.ts        # Özetleme algoritması
```

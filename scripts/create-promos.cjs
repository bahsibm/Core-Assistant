const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:/Users/bayra/.gemini/antigravity/brain/2971a6c6-4a8b-4301-af4d-eb3facf262f3/core_assistant_logo_corporate_1787068663544.jpg';
const destSmall = 'C:\\Users\\bayra\\OneDrive\\Desktop\\CoreAssistant_Kucuk_Promo_440x280.png';
const destLarge = 'C:\\Users\\bayra\\OneDrive\\Desktop\\CoreAssistant_Buyuk_Promo_1400x560.png';

(async () => {
  try {
    // Kucuk Promo (440x280)
    await sharp(inputPath)
      .resize(440, 280, { fit: 'cover' })
      .png()
      .toFile(destSmall);

    // Buyuk Promo (1400x560)
    await sharp(inputPath)
      .resize(1400, 560, { fit: 'cover' })
      .png()
      .toFile(destLarge);

    console.log('Promo images generated and placed on Desktop!');
  } catch (err) {
    console.error(err);
  }
})();

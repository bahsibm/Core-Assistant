const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:\\Users\\bayra\\.gemini\\antigravity\\brain\\2971a6c6-4a8b-4301-af4d-eb3facf262f3\\.user_uploaded\\media_1787071506723.png';
const outputPath = 'C:\\Users\\bayra\\OneDrive\\Desktop\\CoreAssistant_Magaza_EkranGoruntusu_1280x800.png';

(async () => {
  try {
    // 1. Prepare the background (1280x800, sky blue / dark blue mix)
    // We'll use a solid color that fits the brand, maybe a deep rich blue #0ea5e9 (Tailwind Sky 500)
    // or a subtle dark slate #0f172a if we want it to look sleek.
    // Let's go with a nice blue #38bdf8 (Sky 400).
    const bg = sharp({
      create: {
        width: 1280,
        height: 800,
        channels: 4,
        background: { r: 56, g: 189, b: 248, alpha: 1 } // Sky 400
      }
    });

    // 2. Load the screenshot, resize to height 700px, apply sharpening to fix low quality
    const popup = await sharp(inputPath)
      .resize({ height: 700, fit: 'inside' })
      // Unsharp mask parameters to make text crispy
      .sharpen({ sigma: 1, m1: 1, m2: 2, x1: 2, y2: 10, y3: 20 })
      .toBuffer();

    const popupInfo = await sharp(popup).metadata();
    const w = popupInfo.width;
    const h = popupInfo.height;
    const r = 16; // border radius

    // 3. Create rounded corners for the popup
    const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white" /></svg>`);
    const roundedPopup = await sharp(popup)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    // 4. Create a shadow effect behind the popup
    const shadowW = w + 40;
    const shadowH = h + 40;
    const shadowMask = Buffer.from(`<svg width="${shadowW}" height="${shadowH}"><rect x="20" y="20" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="rgba(0,0,0,0.35)" filter="blur(10px)"/></svg>`);

    // 5. Composite everything
    await bg
      .composite([
        { input: shadowMask, left: Math.floor((1280 - shadowW)/2), top: Math.floor((800 - shadowH)/2) },
        { input: roundedPopup, left: Math.floor((1280 - w)/2), top: Math.floor((800 - h)/2) }
      ])
      .png()
      .toFile(outputPath);

    console.log('Screenshot perfectly optimized and created!');
  } catch (err) {
    console.error(err);
  }
})();

const sharp = require('sharp');

const inputPath = 'C:\\Users\\bayra\\.gemini\\antigravity\\brain\\2971a6c6-4a8b-4301-af4d-eb3facf262f3\\.user_uploaded\\media_1787071506723.png';
const outputPath = 'C:\\Users\\bayra\\OneDrive\\Desktop\\CoreAssistant_Magaza_EkranGoruntusu_1280x800.png';

(async () => {
  try {
    // 1. Censor the original image
    const popupInfo = await sharp(inputPath).metadata();
    const origW = popupInfo.width;
    const origH = popupInfo.height;

    // X=40 starts exactly after the checkboxes, covering the favicons (logos) and the text.
    const censorMask = Buffer.from(
      `<svg width="${origW}" height="${origH}">
        <rect x="40" y="415" width="${origW - 60}" height="95" fill="#111111" rx="4" />
      </svg>`
    );

    const censoredPopup = await sharp(inputPath)
      .composite([{ input: censorMask, blend: 'over' }])
      .png()
      .toBuffer();

    // 2. Prepare the background
    const bg = sharp({
      create: {
        width: 1280,
        height: 800,
        channels: 4,
        background: { r: 56, g: 189, b: 248, alpha: 1 } // Sky 400
      }
    });

    // 3. Resize and sharpen the censored popup
    const popup = await sharp(censoredPopup)
      .resize({ height: 700, fit: 'inside' })
      .sharpen({ sigma: 1, m1: 1, m2: 2, x1: 2, y2: 10, y3: 20 })
      .toBuffer();

    const pInfo = await sharp(popup).metadata();
    const w = pInfo.width;
    const h = pInfo.height;
    const r = 16;

    // 4. Rounded corners
    const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white" /></svg>`);
    const roundedPopup = await sharp(popup)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    // 5. Shadow
    const shadowW = w + 40;
    const shadowH = h + 40;
    const shadowMask = Buffer.from(`<svg width="${shadowW}" height="${shadowH}"><rect x="20" y="20" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="rgba(0,0,0,0.35)" filter="blur(10px)"/></svg>`);

    // 6. Composite onto background
    await bg
      .composite([
        { input: shadowMask, left: Math.floor((1280 - shadowW)/2), top: Math.floor((800 - shadowH)/2) },
        { input: roundedPopup, left: Math.floor((1280 - w)/2), top: Math.floor((800 - h)/2) }
      ])
      .png()
      .toFile(outputPath);

    console.log('Censored screenshot perfectly recreated!');
  } catch (err) {
    console.error(err);
  }
})();

const sharp = require('sharp');
const fs = require('fs');

const size = 512;
const r = 110;
const svgMask = `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" /></svg>`;

(async () => {
  try {
    await sharp('public/icon.jpg')
      .resize(size, size)
      .composite([{ input: Buffer.from(svgMask), blend: 'dest-in' }])
      .png()
      .toFile('public/icon_transparent.png');
      
    const sizes = [16, 32, 48, 128];
    for (const s of sizes) {
      await sharp('public/icon_transparent.png')
        .resize(s, s)
        .toFile(`public/icon-${s}.png`);
      console.log(`Updated icon-${s}.png`);
    }
  } catch (err) {
    console.error(err);
  }
})();

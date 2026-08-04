// scripts/compress-service-images.mjs
import sharp from 'sharp';
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('public/assets/images/services');
const TARGET_BYTES = 400 * 1024;
const SKIP = new Set(['yateClear.png', 'yateError.png']);

async function compressOne(filePath) {
  try {
    const before = (await stat(filePath)).size;
    let buffer;
    let qualityUsed = 82;

    // Iterate from quality 82 down to 5 (step 5) to find the lowest quality that hits target
    for (let quality = 82; quality >= 5; quality -= 5) {
      buffer = await sharp(filePath).webp({ quality }).toBuffer();
      if (buffer.length <= TARGET_BYTES) {
        qualityUsed = quality;
        break;
      }
      qualityUsed = quality; // track last attempted quality in case we don't hit target
    }

    // Write the compressed buffer directly (no unnecessary temp-file round-trip)
    await writeFile(filePath, buffer);

    const after = (await stat(filePath)).size;
    const suffix = after > TARGET_BYTES ? ' (⚠ exceeds target)' : '';
    console.log(
      `${path.basename(filePath)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (q=${qualityUsed})${suffix}`
    );
  } catch (error) {
    console.error(`Error compressing ${path.basename(filePath)}: ${error.message}`);
  }
}

const files = (await readdir(DIR)).filter(
  (f) => f.endsWith('.webp') && !SKIP.has(f)
);

for (const f of files) {
  await compressOne(path.join(DIR, f));
}

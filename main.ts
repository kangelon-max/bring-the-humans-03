// bring-the-humans-03 entry program (Node 22, standard library only).
// The entry is the TikTok video itself; this program's only job is to hand the
// gate its address: it copies VIDEO.json from the repository root (MAKEFUN_BOT_DIR
// outside the grader) into the output directory (MAKEFUN_OUTPUT_DIR), byte for byte.
// Revision: VIDEO.json is parsed and checked first, so a malformed file fails
// here with a clear message instead of confusing the gate downstream.

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const src = join(botDir, 'VIDEO.json');
const dst = join(outDir, 'VIDEO.json');

let data;
try {
  data = JSON.parse(readFileSync(src, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json at ${src} is not readable JSON: ${err.message}`);
  process.exit(1);
}
if (typeof data?.url !== 'string' || !data.url.includes('/video/')) {
  console.error('VIDEO.json must be an object whose "url" names a TikTok video');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
try {
  copyFileSync(src, dst);
} catch (err) {
  console.error(`could not copy ${src} -> ${dst}: ${err.message}`);
  process.exit(1);
}
console.log(`VIDEO.json copied: ${src} -> ${dst} (${statSync(dst).size} bytes)`);

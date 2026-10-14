import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1f2738" />
      <stop offset="60%" stop-color="#0d111a" />
      <stop offset="100%" stop-color="#05070a" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff3b0" />
      <stop offset="35%" stop-color="#e5b839" />
      <stop offset="70%" stop-color="#b8860b" />
      <stop offset="100%" stop-color="#7a5500" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgGlow)" />
  <rect width="496" height="496" x="8" y="8" rx="92" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.4" />
  
  <!-- Magic Rune Circle -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="12 8" opacity="0.5" />
  <circle cx="256" cy="256" r="165" fill="none" stroke="url(#accentGrad)" stroke-width="1.5" opacity="0.4" />

  <!-- Chess Board Ground Tiles Illusion -->
  <polygon points="256,380 370,430 256,460 142,430" fill="#141a24" stroke="url(#goldGrad)" stroke-width="2" opacity="0.8" />
  <polygon points="256,380 256,460 142,430" fill="#0e131b" opacity="0.9" />

  <!-- Central Wizard Chess Knight & Crown -->
  <!-- Knight Silhouette -->
  <path d="M 230 140 
           C 250 120, 290 125, 305 145 
           C 318 162, 320 185, 310 205 
           C 328 208, 345 220, 350 240
           C 355 260, 340 278, 325 285
           C 315 290, 305 285, 295 282
           C 310 310, 318 345, 322 385
           L 190 385
           C 194 350, 202 315, 218 285
           C 205 275, 195 255, 192 235
           C 188 200, 205 160, 230 140 Z" 
        fill="url(#goldGrad)" 
        filter="url(#glow)" />

  <!-- Glowing Knight Eye -->
  <circle cx="295" cy="175" r="7" fill="#38bdf8" filter="url(#glow)" />
  <circle cx="295" cy="175" r="3" fill="#ffffff" />

  <!-- Mane Carvings -->
  <path d="M 235 165 C 248 185, 240 215, 222 230" fill="none" stroke="#523900" stroke-width="4" stroke-linecap="round" />
  <path d="M 252 185 C 262 205, 258 235, 242 250" fill="none" stroke="#523900" stroke-width="4" stroke-linecap="round" />
  <path d="M 270 205 C 278 225, 274 250, 260 268" fill="none" stroke="#523900" stroke-width="4" stroke-linecap="round" />

  <!-- Magic Sparkles -->
  <polygon points="170,140 174,152 186,156 174,160 170,172 166,160 154,156 166,152" fill="url(#goldGrad)" />
  <polygon points="360,130 363,139 372,142 363,145 360,154 357,145 348,142 357,139" fill="url(#accentGrad)" />
  <polygon points="370,320 373,327 380,330 373,333 370,340 367,333 360,330 367,327" fill="url(#goldGrad)" />

  <!-- Bottom Arch Text or Pedestal -->
  <rect x="180" y="385" width="152" height="18" rx="4" fill="url(#goldGrad)" opacity="0.9" />
  <rect x="165" y="403" width="182" height="14" rx="4" fill="url(#goldGrad)" opacity="0.75" />
</svg>`;

const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlowM" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1f2738" />
      <stop offset="60%" stop-color="#0d111a" />
      <stop offset="100%" stop-color="#05070a" />
    </radialGradient>
    <linearGradient id="goldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff3b0" />
      <stop offset="35%" stop-color="#e5b839" />
      <stop offset="70%" stop-color="#b8860b" />
      <stop offset="100%" stop-color="#7a5500" />
    </linearGradient>
    <linearGradient id="accentGradM" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <filter id="glowM" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Full-bleed background for maskable (safe zone is center 80%) -->
  <rect width="512" height="512" fill="url(#bgGlowM)" />

  <!-- Center Group scaled to fit inside safe zone (approx 75% scale) -->
  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)">
    <!-- Magic Rune Circle -->
    <circle cx="256" cy="256" r="190" fill="none" stroke="url(#goldGradM)" stroke-width="3" stroke-dasharray="14 10" opacity="0.5" />
    <circle cx="256" cy="256" r="165" fill="none" stroke="url(#accentGradM)" stroke-width="2" opacity="0.45" />

    <!-- Chess Board Base -->
    <polygon points="256,380 370,430 256,460 142,430" fill="#141a24" stroke="url(#goldGradM)" stroke-width="2" opacity="0.8" />
    <polygon points="256,380 256,460 142,430" fill="#0e131b" opacity="0.9" />

    <!-- Knight Silhouette -->
    <path d="M 230 140 
             C 250 120, 290 125, 305 145 
             C 318 162, 320 185, 310 205 
             C 328 208, 345 220, 350 240
             C 355 260, 340 278, 325 285
             C 315 290, 305 285, 295 282
             C 310 310, 318 345, 322 385
             L 190 385
             C 194 350, 202 315, 218 285
             C 205 275, 195 255, 192 235
             C 188 200, 205 160, 230 140 Z" 
          fill="url(#goldGradM)" 
          filter="url(#glowM)" />

    <circle cx="295" cy="175" r="7" fill="#38bdf8" filter="url(#glowM)" />
    <circle cx="295" cy="175" r="3" fill="#ffffff" />

    <path d="M 235 165 C 248 185, 240 215, 222 230" fill="none" stroke="#523900" stroke-width="4" stroke-linecap="round" />
    <path d="M 252 185 C 262 205, 258 235, 242 250" fill="none" stroke="#523900" stroke-width="4" stroke-linecap="round" />
    <path d="M 270 205 C 278 225, 274 250, 260 268" fill="none" stroke="#523900" stroke-width="4" stroke-linecap="round" />

    <polygon points="170,140 174,152 186,156 174,160 170,172 166,160 154,156 166,152" fill="url(#goldGradM)" />
    <polygon points="360,130 363,139 372,142 363,145 360,154 357,145 348,142 357,139" fill="url(#accentGradM)" />
    <polygon points="370,320 373,327 380,330 373,333 370,340 367,333 360,330 367,327" fill="url(#goldGradM)" />

    <rect x="180" y="385" width="152" height="18" rx="4" fill="url(#goldGradM)" opacity="0.9" />
    <rect x="165" y="403" width="182" height="14" rx="4" fill="url(#goldGradM)" opacity="0.75" />
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard, 'utf-8');
  console.log('Saved public/icon.svg');

  // 2. 512x512 standard PNG
  await sharp(Buffer.from(svgStandard))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Saved public/pwa-512x512.png');

  // 3. 192x192 standard PNG
  await sharp(Buffer.from(svgStandard))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Saved public/pwa-192x192.png');

  // 4. 512x512 maskable PNG
  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Saved public/pwa-maskable-512x512.png');

  // 5. 180x180 apple-touch-icon
  await sharp(Buffer.from(svgStandard))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved public/apple-touch-icon.png');

  // 6. 32x32 favicon
  await sharp(Buffer.from(svgStandard))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Saved public/favicon.png');

  console.log('All icons generated successfully!');
}

main().catch(console.error);

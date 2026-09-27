const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Full TANTRAX Logo SVG (Square 1024x1024 - Emblem + Text + Tagline)
const fullLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Blue Gradients for Letter T -->
    <linearGradient id="tCrossbarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="40%" stop-color="#0088ff" />
      <stop offset="100%" stop-color="#0055dd" />
    </linearGradient>

    <linearGradient id="tCrossbarBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#70f3ff" />
      <stop offset="60%" stop-color="#00aaff" />
      <stop offset="100%" stop-color="#0055cc" />
    </linearGradient>

    <linearGradient id="tStemUpperLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0066ee" />
      <stop offset="100%" stop-color="#0099ff" />
    </linearGradient>

    <linearGradient id="tStemLower" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0077ff" />
      <stop offset="70%" stop-color="#0044cc" />
      <stop offset="100%" stop-color="#002b88" />
    </linearGradient>

    <linearGradient id="tStemRightBevel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0044bb" />
      <stop offset="100%" stop-color="#002277" />
    </linearGradient>

    <!-- Flame Gradients -->
    <linearGradient id="fireOuterGrad" x1="20%" y1="100%" x2="70%" y2="0%">
      <stop offset="0%" stop-color="#d92400" />
      <stop offset="35%" stop-color="#ff5500" />
      <stop offset="70%" stop-color="#ff9900" />
      <stop offset="100%" stop-color="#ffcc00" />
    </linearGradient>

    <linearGradient id="fireMidGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff3300" />
      <stop offset="50%" stop-color="#ff7700" />
      <stop offset="85%" stop-color="#ffbb00" />
      <stop offset="100%" stop-color="#fff066" />
    </linearGradient>

    <linearGradient id="fireInnerGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6600" />
      <stop offset="60%" stop-color="#ffcc00" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>

    <!-- Chrome Metallic Text Gradients -->
    <linearGradient id="chromeTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#f8fafc" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="75%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <linearGradient id="chromeBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#e2e8f0" />
      <stop offset="70%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>

    <linearGradient id="blueXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="40%" stop-color="#0084ff" />
      <stop offset="100%" stop-color="#004cd4" />
    </linearGradient>

    <linearGradient id="blueXBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <!-- Glow & Shadow Filters -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="subtleDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- ==================== LOGO EMBLEM (T + FIRE) ==================== -->
  <g id="emblem-group" transform="translate(16, 20)">
    <!-- BACK FIRE TONGUES (Behind T crossbar & stem) -->
    <path d="M 500 230 C 530 180 570 140 660 128 C 650 170 635 195 615 225 C 640 180 690 190 735 220 C 700 240 680 260 670 280 C 710 245 745 270 760 300 C 730 330 680 345 640 345 C 590 345 560 310 500 230 Z"
          fill="url(#fireOuterGrad)" />

    <path d="M 520 220 C 550 180 580 150 645 140 C 635 180 610 200 600 230 C 630 195 670 205 710 230 C 670 250 655 275 640 300 C 600 300 570 270 520 220 Z"
          fill="url(#fireMidGrad)" />

    <path d="M 535 210 C 560 180 585 160 625 155 C 610 190 590 210 580 230 C 610 205 640 215 670 235 C 635 255 615 270 590 280 C 565 265 545 240 535 210 Z"
          fill="url(#fireInnerGrad)" opacity="0.9" />

    <!-- 3D LETTER T - TOP CROSSBAR -->
    <!-- Top Face / Chamfer Highlight -->
    <path d="M 260 280 L 305 220 L 735 220 L 675 280 Z"
          fill="url(#tCrossbarBevel)" filter="url(#subtleDrop)" />
    <!-- Front Face -->
    <path d="M 260 280 L 675 280 L 640 340 L 295 340 Z"
          fill="url(#tCrossbarGrad)" />

    <!-- Sharp 3D Wing Tips of the Crossbar -->
    <path d="M 260 280 L 295 340 L 260 340 Z" fill="#0077dd" />
    <path d="M 675 280 L 735 220 L 700 280 Z" fill="#38bdf8" />
    <path d="M 675 280 L 700 280 L 640 340 Z" fill="#0044aa" />

    <!-- 3D LETTER T - VERTICAL STEM (Upper Segment above Slash) -->
    <path d="M 465 340 L 575 340 L 575 425 L 490 510 L 465 510 Z"
          fill="url(#tStemUpperLeft)" />
    <!-- Upper Stem Right 3D Shadow Facet -->
    <path d="M 545 340 L 575 340 L 575 425 L 545 455 Z"
          fill="url(#tStemRightBevel)" />

    <!-- 3D LETTER T - VERTICAL STEM (Lower Segment below Slash) -->
    <path d="M 465 570 L 575 460 L 575 560 L 465 670 Z"
          fill="url(#tStemLower)" filter="url(#subtleDrop)" />
    <!-- Lower Stem Right 3D Shadow Facet -->
    <path d="M 545 490 L 575 460 L 575 560 L 545 590 Z"
          fill="url(#tStemRightBevel)" />
    <path d="M 465 570 L 545 490 L 545 590 L 465 670 Z"
          fill="#0066ee" />

    <!-- DYNAMIC WHITE LIGHT SLASH CUT -->
    <polygon points="415,550 595,370 605,380 425,560"
             fill="#ffffff" opacity="0.95" filter="url(#softGlow)" />
    <polygon points="435,530 580,385 585,392 440,537"
             fill="#e0f7ff" />

    <!-- FOREGROUND FLAME WRAPPING AROUND STEM & SLASH (Left and Front) -->
    <!-- Large sweeping tongue coming from lower-left up across the slash -->
    <path d="M 445 580 C 410 570 380 540 375 480 C 370 420 405 370 455 340 C 430 380 435 430 455 460 C 475 490 515 500 560 480 C 520 515 480 535 460 550 C 445 580 425 615 440 645 C 415 625 400 580 415 530 C 430 550 445 570 445 580 Z"
          fill="url(#fireOuterGrad)" filter="url(#subtleDrop)" />

    <path d="M 440 560 C 420 540 400 510 400 465 C 400 420 425 380 460 360 C 445 395 445 435 465 465 C 485 495 520 500 555 490 C 515 520 475 540 450 555 C 440 570 425 600 435 625 C 420 605 410 575 420 535 C 430 545 440 555 440 560 Z"
          fill="url(#fireMidGrad)" />

    <!-- Golden core inside the wrapping flame -->
    <path d="M 435 520 C 420 480 430 430 460 395 C 455 425 460 455 475 475 C 495 495 525 495 545 485 C 515 510 480 520 460 535 C 445 525 435 520 435 520 Z"
          fill="url(#fireInnerGrad)" opacity="0.95" />

    <!-- Lower Right Licking Flame Tongue -->
    <path d="M 575 430 C 610 390 635 340 630 310 C 650 340 645 390 615 430 C 640 400 660 410 655 445 C 645 490 595 520 565 535 C 585 500 600 470 595 440 C 590 420 580 425 575 430 Z"
          fill="url(#fireOuterGrad)" />
    <path d="M 580 435 C 610 400 625 360 620 335 C 635 365 630 405 605 435 C 625 410 640 420 635 445 C 625 480 585 505 565 520 C 580 490 595 465 590 440 Z"
          fill="url(#fireMidGrad)" />
  </g>

  <!-- ==================== WORDMARK: TANTRAX ==================== -->
  <g id="wordmark-group" transform="translate(85, 745)">
    <!-- T -->
    <path d="M 0 0 L 80 0 L 80 18 L 48 18 L 48 100 L 32 100 L 32 18 L 0 18 Z"
          fill="url(#chromeTextGrad)" />

    <!-- A -->
    <path d="M 95 100 L 140 0 L 160 0 L 205 100 L 186 100 L 174 74 L 126 74 L 114 100 Z M 134 56 L 166 56 L 150 20 Z"
          fill="url(#chromeTextGrad)" />

    <!-- N -->
    <path d="M 225 0 L 243 0 L 297 76 L 297 0 L 314 0 L 314 100 L 296 100 L 242 24 L 242 100 L 225 100 Z"
          fill="url(#chromeTextGrad)" />

    <!-- T -->
    <path d="M 334 0 L 414 0 L 414 18 L 382 18 L 382 100 L 366 100 L 366 18 L 334 18 Z"
          fill="url(#chromeTextGrad)" />

    <!-- R -->
    <path d="M 434 0 L 490 0 C 516 0 532 12 532 35 C 532 52 520 63 504 67 L 535 100 L 513 100 L 485 70 L 452 70 L 452 100 L 434 100 Z M 452 17 L 486 17 C 504 17 514 23 514 35 C 514 47 504 53 486 53 L 452 53 Z"
          fill="url(#chromeTextGrad)" />

    <!-- A -->
    <path d="M 552 100 L 597 0 L 617 0 L 662 100 L 643 100 L 631 74 L 583 74 L 571 100 Z M 591 56 L 623 56 L 607 20 Z"
          fill="url(#chromeTextGrad)" />

    <!-- X (ELECTRIC BLUE 3D) -->
    <g transform="translate(685, 0)">
      <!-- Main Blue X Shape -->
      <path d="M 0 0 L 35 0 L 80 50 L 125 0 L 160 0 L 100 62 L 165 130 L 130 130 L 80 75 L 30 130 L -5 130 L 60 62 Z"
            fill="url(#blueXGrad)" filter="url(#softGlow)" />
      <!-- Top highlight facet on X -->
      <path d="M 0 0 L 35 0 L 80 50 L 60 62 Z" fill="url(#blueXBevel)" />
      <path d="M 125 0 L 160 0 L 100 62 L 80 50 Z" fill="#0284c7" />
      <!-- Shadow on bottom leg of X -->
      <path d="M 80 75 L 130 130 L 100 130 Z" fill="#003399" />
    </g>
  </g>

  <!-- ==================== TAGLINE: — IDEAS TO IMPACT — ==================== -->
  <g id="tagline-group" transform="translate(512, 925)" text-anchor="middle">
    <!-- Left Thin Rule -->
    <line x1="-360" y1="-5" x2="-220" y2="-5" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" opacity="0.6" />

    <!-- Tagline Text -->
    <text x="0" y="0"
          font-family="'Inter', 'Montserrat', 'Segoe UI', Arial, sans-serif"
          font-size="28"
          font-weight="700"
          letter-spacing="14"
          fill="#cbd5e1"
          opacity="0.9">IDEAS TO IMPACT</text>

    <!-- Right Thin Rule -->
    <line x1="220" y1="-5" x2="360" y2="-5" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" opacity="0.6" />
  </g>
</svg>
`;

// 2. Horizontal Header Logo SVG (Wide: 520x110 - Perfect for Navbar)
const headerLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 110" width="520" height="110">
  <defs>
    <linearGradient id="hTGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="50%" stop-color="#0088ff" />
      <stop offset="100%" stop-color="#0044cc" />
    </linearGradient>
    <linearGradient id="hFireGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e62e00" />
      <stop offset="50%" stop-color="#ff6a00" />
      <stop offset="100%" stop-color="#ffcc00" />
    </linearGradient>
    <linearGradient id="hFireCore" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff7700" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="hChromeText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="hBlueX" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0077ff" />
      <stop offset="100%" stop-color="#0044cc" />
    </linearGradient>
    <filter id="hGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="b" />
      <feComposite in="SourceGraphic" in2="b" operator="over" />
    </filter>
  </defs>

  <!-- MINI EMBLEM ON LEFT (Height ~84px) -->
  <g transform="translate(10, 8) scale(0.165)">
    <!-- Back flame -->
    <path d="M 500 230 C 530 180 570 140 660 128 C 650 170 635 195 615 225 C 640 180 690 190 735 220 C 700 240 680 260 670 280 C 710 245 745 270 760 300 C 730 330 680 345 640 345 C 590 345 560 310 500 230 Z"
          fill="url(#hFireGrad)" />

    <!-- T crossbar -->
    <path d="M 260 280 L 305 220 L 735 220 L 675 280 Z" fill="#38bdf8" />
    <path d="M 260 280 L 675 280 L 640 340 L 295 340 Z" fill="url(#hTGrad)" />
    <path d="M 675 280 L 735 220 L 700 280 Z" fill="#7dd3fc" />
    <path d="M 675 280 L 700 280 L 640 340 Z" fill="#003399" />

    <!-- Stem upper & lower with slash -->
    <path d="M 465 340 L 575 340 L 575 425 L 490 510 L 465 510 Z" fill="#0077ff" />
    <path d="M 545 340 L 575 340 L 575 425 L 545 455 Z" fill="#003399" />
    <path d="M 465 570 L 575 460 L 575 560 L 465 670 Z" fill="#0055dd" />
    <path d="M 545 490 L 575 460 L 575 560 L 545 590 Z" fill="#002288" />

    <!-- Slash light -->
    <polygon points="415,550 595,370 605,380 425,560" fill="#ffffff" opacity="0.95" />

    <!-- Wrapping flame -->
    <path d="M 445 580 C 410 570 380 540 375 480 C 370 420 405 370 455 340 C 430 380 435 430 455 460 C 475 490 515 500 560 480 C 520 515 480 535 460 550 C 445 580 425 615 440 645 C 415 625 400 580 415 530 Z"
          fill="url(#hFireGrad)" />
    <path d="M 435 520 C 420 480 430 430 460 395 C 455 425 460 455 475 475 C 495 495 525 495 545 485 C 515 510 480 520 460 535 Z"
          fill="url(#hFireCore)" opacity="0.9" />

    <!-- Right flame tongue -->
    <path d="M 575 430 C 610 390 635 340 630 310 C 650 340 645 390 615 430 C 640 400 660 410 655 445 C 645 490 595 520 565 535 Z"
          fill="url(#hFireGrad)" />
  </g>

  <!-- WORDMARK: TANTRAX (Right side of emblem) -->
  <g transform="translate(130, 20)">
    <!-- TANTRA text -->
    <text x="0" y="44"
          font-family="'Inter', 'Montserrat', 'Segoe UI', Arial, sans-serif"
          font-size="44"
          font-weight="900"
          letter-spacing="5"
          fill="url(#hChromeText)">TANTRA</text>

    <!-- X in Electric Blue -->
    <text x="240" y="44"
          font-family="'Inter', 'Montserrat', 'Segoe UI', Arial, sans-serif"
          font-size="46"
          font-weight="900"
          letter-spacing="2"
          fill="url(#hBlueX)"
          filter="url(#hGlow)">X</text>

    <!-- Subtitle: IDEAS TO IMPACT -->
    <text x="3" y="70"
          font-family="'Inter', 'Montserrat', 'Segoe UI', Arial, sans-serif"
          font-size="12"
          font-weight="700"
          letter-spacing="6.5"
          fill="#94a3b8">IDEAS TO IMPACT</text>
  </g>
</svg>
`;

// 3. Square Emblem Only SVG (512x512)
const emblemOnlySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="700" height="700">
  <defs>
    <linearGradient id="eTGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="40%" stop-color="#0088ff" />
      <stop offset="100%" stop-color="#0055dd" />
    </linearGradient>
    <linearGradient id="eTBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#70f3ff" />
      <stop offset="60%" stop-color="#00aaff" />
      <stop offset="100%" stop-color="#0055cc" />
    </linearGradient>
    <linearGradient id="eStemUpper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0066ee" />
      <stop offset="100%" stop-color="#0099ff" />
    </linearGradient>
    <linearGradient id="eStemLower" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0077ff" />
      <stop offset="70%" stop-color="#0044cc" />
      <stop offset="100%" stop-color="#002b88" />
    </linearGradient>
    <linearGradient id="eFireOuter" x1="20%" y1="100%" x2="70%" y2="0%">
      <stop offset="0%" stop-color="#d92400" />
      <stop offset="35%" stop-color="#ff5500" />
      <stop offset="70%" stop-color="#ff9900" />
      <stop offset="100%" stop-color="#ffcc00" />
    </linearGradient>
    <linearGradient id="eFireMid" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff3300" />
      <stop offset="50%" stop-color="#ff7700" />
      <stop offset="85%" stop-color="#ffbb00" />
      <stop offset="100%" stop-color="#fff066" />
    </linearGradient>
    <linearGradient id="eFireInner" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6600" />
      <stop offset="60%" stop-color="#ffcc00" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <filter id="eGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="eShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <g transform="translate(-150, -60)">
    <!-- BACK FLAMES -->
    <path d="M 500 230 C 530 180 570 140 660 128 C 650 170 635 195 615 225 C 640 180 690 190 735 220 C 700 240 680 260 670 280 C 710 245 745 270 760 300 C 730 330 680 345 640 345 C 590 345 560 310 500 230 Z"
          fill="url(#eFireOuter)" />
    <path d="M 520 220 C 550 180 580 150 645 140 C 635 180 610 200 600 230 C 630 195 670 205 710 230 C 670 250 655 275 640 300 C 600 300 570 270 520 220 Z"
          fill="url(#eFireMid)" />
    <path d="M 535 210 C 560 180 585 160 625 155 C 610 190 590 210 580 230 C 610 205 640 215 670 235 C 635 255 615 270 590 280 C 565 265 545 240 535 210 Z"
          fill="url(#eFireInner)" opacity="0.9" />

    <!-- T CROSSBAR -->
    <path d="M 260 280 L 305 220 L 735 220 L 675 280 Z" fill="url(#eTBevel)" filter="url(#eShadow)" />
    <path d="M 260 280 L 675 280 L 640 340 L 295 340 Z" fill="url(#eTGrad)" />
    <path d="M 260 280 L 295 340 L 260 340 Z" fill="#0077dd" />
    <path d="M 675 280 L 735 220 L 700 280 Z" fill="#38bdf8" />
    <path d="M 675 280 L 700 280 L 640 340 Z" fill="#0044aa" />

    <!-- STEM UPPER & LOWER -->
    <path d="M 465 340 L 575 340 L 575 425 L 490 510 L 465 510 Z" fill="url(#eStemUpper)" />
    <path d="M 545 340 L 575 340 L 575 425 L 545 455 Z" fill="#002277" />
    <path d="M 465 570 L 575 460 L 575 560 L 465 670 Z" fill="url(#eStemLower)" filter="url(#eShadow)" />
    <path d="M 545 490 L 575 460 L 575 560 L 545 590 Z" fill="#002288" />
    <path d="M 465 570 L 545 490 L 545 590 L 465 670 Z" fill="#0066ee" />

    <!-- SLASH -->
    <polygon points="415,550 595,370 605,380 425,560" fill="#ffffff" opacity="0.95" filter="url(#eGlow)" />
    <polygon points="435,530 580,385 585,392 440,537" fill="#e0f7ff" />

    <!-- WRAPPING FLAMES -->
    <path d="M 445 580 C 410 570 380 540 375 480 C 370 420 405 370 455 340 C 430 380 435 430 455 460 C 475 490 515 500 560 480 C 520 515 480 535 460 550 C 445 580 425 615 440 645 C 415 625 400 580 415 530 Z"
          fill="url(#eFireOuter)" filter="url(#eShadow)" />
    <path d="M 440 560 C 420 540 400 510 400 465 C 400 420 425 380 460 360 C 445 395 445 435 465 465 C 485 495 520 500 555 490 C 515 520 475 540 450 555 C 440 570 425 600 435 625 C 420 605 410 575 420 535 Z"
          fill="url(#eFireMid)" />
    <path d="M 435 520 C 420 480 430 430 460 395 C 455 425 460 455 475 475 C 495 495 525 495 545 485 C 515 510 480 520 460 535 Z"
          fill="url(#eFireInner)" opacity="0.95" />

    <path d="M 575 430 C 610 390 635 340 630 310 C 650 340 645 390 615 430 C 640 400 660 410 655 445 C 645 490 595 520 565 535 Z"
          fill="url(#eFireOuter)" />
  </g>
</svg>
`;

async function main() {
  console.log('Generating high-resolution transparent PNG logos...');

  // 1. Full square logo (1024x1024)
  await sharp(Buffer.from(fullLogoSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'tantrax-logo.png'));
  console.log('Saved tantrax-logo.png (1024x1024)');

  // 2. Full square logo 512x512
  await sharp(Buffer.from(fullLogoSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'tantrax-logo-512.png'));
  console.log('Saved tantrax-logo-512.png');

  // 3. Wide Header Logo for Navigation Bar (520x110)
  await sharp(Buffer.from(headerLogoSvg))
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'tantrax-header-logo.png'));
  console.log('Saved tantrax-header-logo.png (520x110)');

  // 4. Double resolution header logo (1040x220 for Retina displays)
  await sharp(Buffer.from(headerLogoSvg))
    .resize(1040, 220)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'tantrax-header-logo@2x.png'));
  console.log('Saved tantrax-header-logo@2x.png');

  // 5. Square Emblem Only (512x512)
  await sharp(Buffer.from(emblemOnlySvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'tantrax-emblem.png'));
  console.log('Saved tantrax-emblem.png (512x512)');

  // 6. Favicon / Small App Icon (128x128)
  await sharp(Buffer.from(emblemOnlySvg))
    .resize(128, 128)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Saved favicon.png (128x128)');

  // 7. PWA 192x192
  await sharp(Buffer.from(emblemOnlySvg))
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Saved pwa-192x192.png');

  // 8. PWA 512x512
  await sharp(Buffer.from(emblemOnlySvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Saved pwa-512x512.png');

  // 9. PWA Maskable 512x512 (with 15% safe zone padding and background)
  const emblemResized = await sharp(Buffer.from(emblemOnlySvg))
    .resize(384, 384) // 75% of 512 for 12.5% safe zone margin
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 2, g: 5, b: 12, alpha: 1 }
    }
  })
    .composite([{ input: emblemResized, gravity: 'centre' }])
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Saved pwa-maskable-512x512.png');

  // 10. Apple Touch Icon (180x180)
  const appleEmblem = await sharp(Buffer.from(emblemOnlySvg))
    .resize(144, 144)
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 2, g: 5, b: 12, alpha: 1 }
    }
  })
    .composite([{ input: appleEmblem, gravity: 'centre' }])
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved apple-touch-icon.png (180x180)');

  // Also save SVG versions for crisp vector fidelity
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), emblemOnlySvg.trim());
  fs.writeFileSync(path.join(publicDir, 'tantrax-logo.svg'), fullLogoSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'tantrax-header-logo.svg'), headerLogoSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'tantrax-emblem.svg'), emblemOnlySvg.trim());
  console.log('Saved vector SVG sources in public/');

  console.log('All logo assets successfully generated!');
}

main().catch((err) => {
  console.error('Error generating logos:', err);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';

const FRAME_COUNT = 120;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sequence');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Generating ${FRAME_COUNT} placeholder frames in ${OUTPUT_DIR}...`);

const colors = {
    bg: '#dfcba6',
    accent: '#f06449',
    secondary: '#36382e'
};

for (let i = 0; i < FRAME_COUNT; i++) {
    const progress = i / FRAME_COUNT;

    // Calculate some simple animation values
    const size = 100 + (progress * 300); // Grow
    const rotation = progress * 360; // Rotate
    const x = 960 + Math.sin(progress * Math.PI * 2) * 200;
    const opacity = Math.min(1, progress * 2);

    const svgContent = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="${colors.bg}"/>
  <g transform="translate(${x}, 540) rotate(${rotation})">
    <rect x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" fill="${colors.secondary}" opacity="0.8" />
    <circle r="${size / 4}" fill="${colors.accent}" />
  </g>
  <text x="50" y="100" font-family="Arial" font-size="40" fill="${colors.secondary}">Frame ${i}</text>
  <text x="50" y="150" font-family="Arial" font-size="24" fill="${colors.secondary}">Placeholder Animation</text>
</svg>
  `;

    fs.writeFileSync(path.join(OUTPUT_DIR, `frame_${i}.svg`), svgContent.trim());
}

console.log('Done! Run "npm run dev" to see the animation.');

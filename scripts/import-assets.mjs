import fs from 'fs';
import path from 'path';

const SOURCE_DIR = 'C:\\Users\\user\\Downloads\\ffffff-ezgif-1aad562625ca80dd-webp-jpg';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sequence');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
}

console.log(`Importing assets from ${SOURCE_DIR}...`);

const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.endsWith('.jpg'))
    .sort(); // Ensure alphanumeric sort

console.log(`Found ${files.length} JPG files.`);

files.forEach((file, index) => {
    // Extract the frame number from the filename if possible, otherwise rely on sort order
    // Format: frame_000_delay-0.042s.jpg
    const match = file.match(/frame_(\d+)_/);
    let frameNum = index;
    if (match) {
        frameNum = parseInt(match[1], 10);
    }

    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(OUTPUT_DIR, `frame_${frameNum}.jpg`);

    fs.copyFileSync(srcPath, destPath);
});

console.log(`Successfully imported ${files.length} frames to ${OUTPUT_DIR}`);

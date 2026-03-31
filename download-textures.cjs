const fs = require('fs');
const path = require('path');

// List of texture files to download
const textures = [
  'stone.png',
  'cobblestone.png', 
  'diorite.png',
  'polished_diorite.png',
  'andesite.png',
  'polished_andesite.png',
  'granite.png',
  'polished_granite.png',
  'oak_log.png',
  'oak_planks.png',
  'quartz.png'
];

const baseUrl = 'https://raw.githubusercontent.com/KygekDev/default-textures/master/textures/blocks/';
const texturesDir = path.join(__dirname, 'client/public/textures');

// Ensure textures directory exists
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Download each texture
async function downloadTextures() {
  for (const texture of textures) {
    try {
      const response = await fetch(baseUrl + texture);
      if (!response.ok) {
        console.error(`Failed to download ${texture}: ${response.status}`);
        continue;
      }
      
      const buffer = await response.arrayBuffer();
      const filePath = path.join(texturesDir, texture);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`Downloaded ${texture}`);
    } catch (error) {
      console.error(`Error downloading ${texture}:`, error.message);
    }
  }
}

downloadTextures().then(() => {
  console.log('Texture download complete!');
}).catch(console.error);

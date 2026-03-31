const fs = require('fs');
const path = require('path');

// Load all block names
const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

// GitHub API base URL
const baseUrl = 'https://raw.githubusercontent.com/KygekDev/default-textures/master/textures/blocks/';
const texturesDir = path.join(__dirname, 'client/public/textures');

// Ensure textures directory exists
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Download each texture
async function downloadAllTextures() {
  console.log(`Downloading textures for ${allBlocks.length} blocks...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const blockName of allBlocks) {
    try {
      const response = await fetch(baseUrl + blockName + '.png');
      if (!response.ok) {
        console.log(`✗ Failed to download ${blockName}: ${response.status}`);
        failCount++;
        continue;
      }
      
      const buffer = await response.arrayBuffer();
      const filePath = path.join(texturesDir, blockName + '.png');
      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`✓ Downloaded ${blockName}`);
      successCount++;
    } catch (error) {
      console.log(`✗ Error downloading ${blockName}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`\nDownload complete!`);
  console.log(`✓ Success: ${successCount} textures`);
  console.log(`✗ Failed: ${failCount} textures`);
  console.log(`📁 Saved to: ${texturesDir}`);
}

downloadAllTextures().catch(console.error);

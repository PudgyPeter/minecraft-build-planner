const fs = require('fs');
const path = require('path');

// Read the current blockImages.js file
const blockImagesPath = path.join(__dirname, 'client/src/data/blockImages.js');
let content = fs.readFileSync(blockImagesPath, 'utf8');

// Get all downloaded textures
const texturesDir = path.join(__dirname, 'client/public/textures');
const downloadedTextures = fs.readdirSync(texturesDir)
  .filter(file => file.endsWith('.png'))
  .map(file => file.replace('.png', ''));

console.log(`Found ${downloadedTextures.length} downloaded textures`);

// Read all blocks to ensure we have entries for everything
const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

// Create a comprehensive blockImages object
const updatedBlockImages = {};

// First, add all existing Wiki URLs (these should be primary)
const existingMatches = content.match(/'([^']+)':\s*'([^']+)'/g);
if (existingMatches) {
  existingMatches.forEach(match => {
    const [blockName, url] = match.match(/'([^']+)':\s*'([^']+)'/).slice(1);
    if (!url.startsWith('/textures/')) {
      // Keep Wiki URLs as they are
      updatedBlockImages[blockName] = url;
    }
  });
}

// Now add local textures for blocks that don't have Wiki URLs
// or as fallbacks for missing ones
downloadedTextures.forEach(textureName => {
  if (!updatedBlockImages[textureName]) {
    // This block doesn't have a Wiki URL, use local texture
    updatedBlockImages[textureName] = `/textures/${textureName}.png`;
  }
});

// Add entries for any blocks that are missing
allBlocks.forEach(blockName => {
  if (!updatedBlockImages[blockName]) {
    // Try to create a Wiki URL
    const wikiName = blockName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('_');
    
    // Common patterns for Wiki URLs
    const wikiUrl = `https://minecraft.wiki/images/${wikiName}_JE3_BE2.png`;
    updatedBlockImages[blockName] = wikiUrl;
  }
});

// Generate the new blockImages.js content
let newContent = `// Minecraft block image URLs using official Minecraft wiki images
// These are high-quality PNG images from the Minecraft Wiki
// Wiki URLs are prioritized, with local textures as fallbacks

export const blockImages = {\n`;

// Sort blocks alphabetically
const sortedBlocks = Object.keys(updatedBlockImages).sort();

sortedBlocks.forEach(blockName => {
  const url = updatedBlockImages[blockName];
  newContent += `  '${blockName}': '${url}',\n`;
});

newContent += `};\n`;

// Write the updated file
fs.writeFileSync(blockImagesPath, newContent);

console.log(`✅ Updated blockImages.js with ${sortedBlocks.length} block entries`);
console.log(`📊 Wiki URLs: ${Object.values(updatedBlockImages).filter(url => url.includes('minecraft.wiki')).length}`);
console.log(`📁 Local textures: ${Object.values(updatedBlockImages).filter(url => url.startsWith('/textures/')).length}`);

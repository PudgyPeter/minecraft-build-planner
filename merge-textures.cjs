const fs = require('fs');
const path = require('path');

// Read the generated Wiki URLs
const wikiUrls = JSON.parse(fs.readFileSync(path.join(__dirname, 'wiki-urls.json'), 'utf8'));

// Read existing blockImages to preserve any manual entries
const blockImagesPath = path.join(__dirname, 'client/src/data/blockImages.js');
const existingContent = fs.readFileSync(blockImagesPath, 'utf8');

// Get local textures
const texturesDir = path.join(__dirname, 'client/public/textures');
const localTextures = fs.readdirSync(texturesDir)
  .filter(file => file.endsWith('.png'))
  .map(file => file.replace('.png', ''));

console.log(`Merging ${Object.keys(wikiUrls).length} Wiki URLs with ${localTextures.length} local textures...`);

// Create merged blockImages object
// Priority: Local textures > Wiki URLs
const mergedImages = {};

Object.keys(wikiUrls).sort().forEach(blockName => {
  if (localTextures.includes(blockName)) {
    // Use local texture
    mergedImages[blockName] = `/textures/${blockName}.png`;
  } else {
    // Use Wiki URL
    mergedImages[blockName] = wikiUrls[blockName];
  }
});

// Generate the new blockImages.js content
let newContent = `// Minecraft block image URLs using official Minecraft wiki images
// These are high-quality PNG images from the Minecraft Wiki
// Local textures are prioritized over Wiki URLs when available

export const blockImages = {\n`;

Object.entries(mergedImages).forEach(([blockName, url]) => {
  newContent += `  '${blockName}': '${url}',\n`;
});

newContent += `};\n\n`;

// Add the getBlockDisplay function
newContent += `// Function to get display information for a block
export function getBlockDisplay(blockName) {
  const imageUrl = blockImages[blockName];
  
  // Try exact match first
  if (imageUrl && imageUrl.startsWith('http')) {
    return { type: 'image', url: imageUrl };
  } else if (imageUrl && imageUrl.startsWith('/textures/')) {
    return { type: 'image', url: imageUrl };
  } else if (imageUrl && (imageUrl.startsWith('🔴') || imageUrl.startsWith('🟢') || imageUrl.startsWith('🔵') || imageUrl.startsWith('🟡') || imageUrl.startsWith('⚪'))) {
    return { type: 'emoji', emoji: imageUrl };
  }
  
  // Try local texture as fallback
  const localTexturePath = \`/textures/\${blockName}.png\`;
  
  // Try to find a similar block texture
  const baseBlockName = blockName
    .replace(/_stairs$/, '')
    .replace(/_slab$/, '')
    .replace(/_wall$/, '')
    .replace(/_fence$/, '')
    .replace(/_fence_gate$/, '')
    .replace(/_door$/, '')
    .replace(/_trapdoor$/, '')
    .replace(/_button$/, '')
    .replace(/_pressure_plate$/, '')
    .replace(/_sign$/, '')
    .replace(/_hanging_sign$/, '');
  
  // If we removed a suffix, try the base block
  if (baseBlockName !== blockName && blockImages[baseBlockName]) {
    const baseUrl = blockImages[baseBlockName];
    if (baseUrl && (baseUrl.startsWith('http') || baseUrl.startsWith('/textures/'))) {
      return { type: 'image', url: baseUrl };
    }
  }
  
  // Try local texture for base block
  if (baseBlockName !== blockName) {
    return { type: 'image', url: \`/textures/\${baseBlockName}.png\`, fallback: true };
  }
  
  // Try local texture for original block
  return { type: 'image', url: localTexturePath, fallback: true };
}
`;

// Write the updated file
fs.writeFileSync(blockImagesPath, newContent);

console.log(`✅ Updated blockImages.js with ${Object.keys(mergedImages).length} block entries`);
console.log(`📊 Wiki URLs: ${Object.values(mergedImages).filter(url => url.includes('minecraft.wiki')).length}`);
console.log(`📁 Local textures: ${Object.values(mergedImages).filter(url => url.startsWith('/textures/')).length}`);

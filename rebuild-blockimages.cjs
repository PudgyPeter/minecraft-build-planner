const fs = require('fs');
const path = require('path');

const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));
const texturesDir = path.join(__dirname, 'client/public/textures');
const localTextures = fs.readdirSync(texturesDir)
  .filter(f => f.endsWith('.png'))
  .map(f => f.replace('.png', ''));

const blockImagesPath = path.join(__dirname, 'client/src/data/blockImages.js');

console.log(`${allBlocks.length} blocks total`);
console.log(`${localTextures.length} local textures available`);

// Build the mapping: use local texture if available, otherwise leave empty
const mapping = {};
let localCount = 0;
let missingCount = 0;

allBlocks.forEach(blockName => {
  if (localTextures.includes(blockName)) {
    mapping[blockName] = `/textures/${blockName}.png`;
    localCount++;
  }
  // Don't add Wiki URLs - they're unreliable. The fallback system in getBlockDisplay handles missing ones.
});

// Also add local textures that aren't in allBlocks (e.g. extra downloaded textures)
localTextures.forEach(texName => {
  if (!mapping[texName]) {
    mapping[texName] = `/textures/${texName}.png`;
    localCount++;
  }
});

console.log(`\n${localCount} blocks with local textures`);
console.log(`${allBlocks.length - Object.keys(mapping).filter(k => allBlocks.includes(k)).length} blocks without textures (will use fallback)`);

// Generate the file
let content = `// Minecraft block textures - local files from minecraft-assets repo
// All textures served locally from /textures/ directory for reliability

export const blockImages = {\n`;

Object.keys(mapping).sort().forEach(blockName => {
  content += `  '${blockName}': '${mapping[blockName]}',\n`;
});

content += `};

// Function to get display information for a block
export function getBlockDisplay(blockName) {
  const imageUrl = blockImages[blockName];
  
  // Direct match - local texture
  if (imageUrl) {
    return { type: 'image', url: imageUrl };
  }
  
  // Try stripping variant suffixes to find a base block texture
  const suffixes = [
    '_stairs', '_slab', '_wall', '_fence_gate', '_fence',
    '_hanging_sign', '_sign', '_pressure_plate', '_button',
    '_door', '_trapdoor', '_boat'
  ];
  
  for (const suffix of suffixes) {
    if (blockName.endsWith(suffix)) {
      const base = blockName.slice(0, -suffix.length);
      
      // For wood variants, try _planks version
      if (blockImages[base + '_planks']) {
        return { type: 'image', url: blockImages[base + '_planks'] };
      }
      // Try the base block directly
      if (blockImages[base]) {
        return { type: 'image', url: blockImages[base] };
      }
      // For _log variants
      if (blockImages[base + '_log']) {
        return { type: 'image', url: blockImages[base + '_log'] };
      }
      break;
    }
  }
  
  // Try color prefix matching (e.g. "red_concrete_slab" -> "red_concrete")
  const parts = blockName.split('_');
  for (let i = parts.length - 1; i >= 1; i--) {
    const partial = parts.slice(0, i).join('_');
    if (blockImages[partial]) {
      return { type: 'image', url: blockImages[partial] };
    }
  }
  
  // Default fallback emoji
  return { type: 'emoji', emoji: '📦' };
}
`;

fs.writeFileSync(blockImagesPath, content);
console.log(`\n✅ Written ${Object.keys(mapping).length} entries to blockImages.js`);

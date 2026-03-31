const fs = require('fs');
const path = require('path');

const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

const iconsDir = path.join(__dirname, 'client/public/icons');
const texturesDir = path.join(__dirname, 'client/public/textures');
const blockImagesPath = path.join(__dirname, 'client/src/data/blockImages.js');

const icons = fs.readdirSync(iconsDir).filter(f => f.endsWith('.png')).map(f => f.replace('.png', ''));
const textures = fs.readdirSync(texturesDir).filter(f => f.endsWith('.png')).map(f => f.replace('.png', ''));

console.log(`${icons.length} 3D icons available`);
console.log(`${textures.length} flat textures available`);

const mapping = {};
let iconCount = 0;
let textureCount = 0;

// For all blocks, prefer 3D icon, fall back to flat texture
allBlocks.forEach(blockName => {
  if (icons.includes(blockName)) {
    mapping[blockName] = `/icons/${blockName}.png`;
    iconCount++;
  } else if (textures.includes(blockName)) {
    mapping[blockName] = `/textures/${blockName}.png`;
    textureCount++;
  }
});

// Also add any icons/textures not in allBlocks
icons.forEach(name => {
  if (!mapping[name]) {
    mapping[name] = `/icons/${name}.png`;
    iconCount++;
  }
});
textures.forEach(name => {
  if (!mapping[name]) {
    mapping[name] = `/textures/${name}.png`;
    textureCount++;
  }
});

console.log(`\n${iconCount} using 3D icons`);
console.log(`${textureCount} using flat textures`);
console.log(`${allBlocks.length - Object.keys(mapping).filter(k => allBlocks.includes(k)).length} blocks with no image (will use fallback)`);

let content = `// Minecraft block images
// 3D inventory icons from Minecraft Wiki (/icons/) with flat texture fallbacks (/textures/)

export const blockImages = {\n`;

Object.keys(mapping).sort().forEach(blockName => {
  content += `  '${blockName}': '${mapping[blockName]}',\n`;
});

content += `};

// Function to get display information for a block
export function getBlockDisplay(blockName) {
  const imageUrl = blockImages[blockName];
  
  // Direct match
  if (imageUrl) {
    return { type: 'image', url: imageUrl };
  }
  
  // Try stripping variant suffixes to find a base block image
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
      if (blockImages[base]) {
        return { type: 'image', url: blockImages[base] };
      }
      if (blockImages[base + '_log']) {
        return { type: 'image', url: blockImages[base + '_log'] };
      }
      break;
    }
  }
  
  // Try partial name matching (e.g. "red_concrete_slab" -> "red_concrete")
  const parts = blockName.split('_');
  for (let i = parts.length - 1; i >= 1; i--) {
    const partial = parts.slice(0, i).join('_');
    if (blockImages[partial]) {
      return { type: 'image', url: blockImages[partial] };
    }
  }
  
  // Default fallback
  return { type: 'emoji', emoji: '📦' };
}
`;

fs.writeFileSync(blockImagesPath, content);
console.log(`\n✅ Written ${Object.keys(mapping).length} entries to blockImages.js`);

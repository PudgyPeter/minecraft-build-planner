const fs = require('fs');
const path = require('path');

// Read all blocks
const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

// Function to convert block name to Wiki URL format
function toWikiName(blockName) {
  return blockName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');
}

// Function to determine the correct version suffix for Wiki URLs
function getVersionSuffix(blockName) {
  // Most common blocks use JE3_BE2
  // Newer blocks might use JE2_BE1 or JE1_BE1
  
  // Newer blocks (1.19+)
  const newerBlocks = ['mangrove', 'cherry', 'pale_oak', 'mud', 'frog', 'sculk', 'reinforced_deepslate', 'bamboo_mosaic'];
  if (newerBlocks.some(prefix => blockName.includes(prefix))) {
    return 'JE2_BE1';
  }
  
  // Very new blocks (1.20+)
  const newestBlocks = ['pale_oak', 'resin', 'creaking'];
  if (newestBlocks.some(prefix => blockName.includes(prefix))) {
    return 'JE1_BE1';
  }
  
  // Default for most blocks
  return 'JE3_BE2';
}

// Generate Wiki URLs for all blocks
const wikiUrls = {};
allBlocks.forEach(blockName => {
  const wikiName = toWikiName(blockName);
  const suffix = getVersionSuffix(blockName);
  
  // Special cases for specific block types
  if (blockName.includes('_log') && !blockName.includes('stripped')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE2_BE1.png`;
  } else if (blockName.includes('stripped_') && blockName.includes('_log')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE2_BE1.png`;
  } else if (blockName.includes('_planks')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_${suffix}.png`;
  } else if (blockName.includes('_stairs')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_${suffix}.png`;
  } else if (blockName.includes('_slab')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_${suffix}.png`;
  } else if (blockName.includes('_wall')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE2_BE1.png`;
  } else if (blockName.includes('_fence') && !blockName.includes('_gate')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE2_BE1.png`;
  } else if (blockName.includes('_fence_gate')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE3_BE1.png`;
  } else if (blockName.includes('_door')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE3_BE1.png`;
  } else if (blockName.includes('_trapdoor')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_JE3_BE3.png`;
  } else if (blockName.includes('_button')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_${suffix}.png`;
  } else if (blockName.includes('_pressure_plate')) {
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_${suffix}.png`;
  } else if (blockName === 'polished_diorite') {
    wikiUrls[blockName] = `https://minecraft.wiki/images/Polished_Diorite_JE2_BE1.png`;
  } else if (blockName === 'polished_andesite') {
    wikiUrls[blockName] = `https://minecraft.wiki/images/Polished_Andesite_JE2_BE1.png`;
  } else if (blockName === 'polished_granite') {
    wikiUrls[blockName] = `https://minecraft.wiki/images/Polished_Granite_JE2_BE1.png`;
  } else if (blockName === 'diorite') {
    wikiUrls[blockName] = `https://minecraft.wiki/images/Diorite_JE2_BE1.png`;
  } else if (blockName === 'andesite') {
    wikiUrls[blockName] = `https://minecraft.wiki/images/Andesite_JE2_BE1.png`;
  } else if (blockName === 'granite') {
    wikiUrls[blockName] = `https://minecraft.wiki/images/Granite_JE2_BE1.png`;
  } else {
    // Default pattern
    wikiUrls[blockName] = `https://minecraft.wiki/images/${wikiName}_${suffix}.png`;
  }
});

// Check which ones we have local textures for
const texturesDir = path.join(__dirname, 'client/public/textures');
const localTextures = fs.existsSync(texturesDir) 
  ? fs.readdirSync(texturesDir).filter(f => f.endsWith('.png')).map(f => f.replace('.png', ''))
  : [];

console.log(`Generated Wiki URLs for ${Object.keys(wikiUrls).length} blocks`);
console.log(`Have local textures for ${localTextures.length} blocks`);
console.log(`\nSample Wiki URLs:`);
console.log(`- diorite: ${wikiUrls['diorite']}`);
console.log(`- polished_diorite: ${wikiUrls['polished_diorite']}`);
console.log(`- diorite_wall: ${wikiUrls['diorite_wall']}`);
console.log(`- polished_diorite_stairs: ${wikiUrls['polished_diorite_stairs']}`);

// Save to file
fs.writeFileSync(
  path.join(__dirname, 'wiki-urls.json'),
  JSON.stringify(wikiUrls, null, 2)
);

console.log('\n✅ Saved to wiki-urls.json');

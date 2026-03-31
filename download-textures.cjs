const fs = require('fs');
const path = require('path');

// All available textures from the GitHub API
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
  'spruce_log.png',
  'spruce_planks.png',
  'birch_log.png',
  'birch_planks.png',
  'jungle_log.png',
  'jungle_planks.png',
  'acacia_log.png',
  'acacia_planks.png',
  'dark_oak_log.png',
  'dark_oak_planks.png',
  'mangrove_log.png',
  'mangrove_planks.png',
  'cherry_log.png',
  'cherry_planks.png',
  'pale_oak_log.png',
  'pale_oak_planks.png',
  'bamboo_block.png',
  'bamboo_planks.png',
  'stripped_oak_log.png',
  'stripped_spruce_log.png',
  'stripped_birch_log.png',
  'stripped_jungle_log.png',
  'stripped_acacia_log.png',
  'stripped_dark_oak_log.png',
  'stripped_mangrove_log.png',
  'stripped_cherry_log.png',
  'stripped_pale_oak_log.png',
  'stripped_bamboo_block.png',
  'quartz.png',
  'sand.png',
  'dirt.png',
  'grass_block.png',
  'oak_stairs.png',
  'oak_slab.png',
  'oak_fence.png',
  'oak_door.png',
  'oak_trapdoor.png',
  'oak_sign.png',
  'oak_pressure_plate.png',
  'oak_button.png',
  'crafting_table.png',
  'chest.png',
  'furnace.png',
  'anvil.png',
  'bedrock.png',
  'sandstone.png',
  'red_sandstone.png',
  'iron_block.png',
  'gold_block.png',
  'diamond_block.png',
  'emerald_block.png',
  'coal_block.png',
  'lapis_block.png',
  'redstone_block.png',
  'stick.png',
  'coal.png',
  'charcoal.png',
  'iron_ingot.png',
  'gold_ingot.png',
  'diamond.png',
  'emerald.png',
  'redstone.png',
  'lapis_lazuli.png',
  'amethyst_shard.png',
  'copper_ingot.png',
  'netherite_ingot.png'
];

const baseUrl = 'https://raw.githubusercontent.com/KygekDev/default-textures/master/textures/blocks/';
const texturesDir = path.join(__dirname, 'client/public/textures');

// Ensure textures directory exists
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Download each texture
async function downloadTextures() {
  console.log(`Downloading ${textures.length} textures...`);
  
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
      console.log(`✓ Downloaded ${texture}`);
    } catch (error) {
      console.error(`✗ Error downloading ${texture}:`, error.message);
    }
  }
}

downloadTextures().then(() => {
  console.log('Texture download complete!');
}).catch(console.error);

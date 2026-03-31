const fs = require('fs');
const path = require('path');

const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

// InventivetalentDev/minecraft-assets has exact game textures with consistent naming
const baseUrl = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/';
const texturesDir = path.join(__dirname, 'client/public/textures');

if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Map block names to their texture file paths in the assets repo
// Most blocks are in textures/block/, items are in textures/item/
function getTexturePaths(blockName) {
  const paths = [];
  
  // Block textures - try multiple naming patterns
  paths.push(`block/${blockName}.png`);
  
  // Logs have _top and side variants - we want the side
  if (blockName.includes('_log')) {
    paths.push(`block/${blockName}.png`);
  }
  
  // Planks
  if (blockName.includes('_planks')) {
    paths.push(`block/${blockName}.png`);
  }
  
  // Items (tools, ingots, etc.)
  paths.push(`item/${blockName}.png`);
  
  // Some blocks have different texture names
  // Doors show as item textures
  if (blockName.includes('_door')) {
    paths.push(`item/${blockName}.png`);
  }
  
  // Signs show as item textures  
  if (blockName.includes('_sign')) {
    paths.push(`item/${blockName}.png`);
  }
  
  return paths;
}

async function downloadTexture(blockName) {
  const paths = getTexturePaths(blockName);
  
  for (const texPath of paths) {
    try {
      const url = baseUrl + texPath;
      const response = await fetch(url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        // Verify it's actually a PNG (check magic bytes)
        const bytes = new Uint8Array(buffer);
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
          const filePath = path.join(texturesDir, `${blockName}.png`);
          fs.writeFileSync(filePath, Buffer.from(buffer));
          return true;
        }
      }
    } catch (e) {
      // continue to next path
    }
  }
  return false;
}

async function downloadAll() {
  let success = 0;
  let fail = 0;
  const failed = [];
  
  console.log(`Downloading textures for ${allBlocks.length} blocks from minecraft-assets...`);
  
  // Process in batches of 15
  const batchSize = 15;
  for (let i = 0; i < allBlocks.length; i += batchSize) {
    const batch = allBlocks.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (blockName) => {
      // Skip if already downloaded
      const filePath = path.join(texturesDir, `${blockName}.png`);
      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100) {
        return { blockName, ok: true, skipped: true };
      }
      const ok = await downloadTexture(blockName);
      return { blockName, ok };
    }));
    
    results.forEach(r => {
      if (r.ok) success++;
      else { fail++; failed.push(r.blockName); }
    });
    
    const done = Math.min(i + batchSize, allBlocks.length);
    process.stdout.write(`\r${done}/${allBlocks.length} checked (${success} ok, ${fail} failed)`);
  }
  
  console.log(`\n\nDone!`);
  console.log(`✓ ${success} textures available`);
  console.log(`✗ ${fail} textures not found`);
  
  if (failed.length > 0) {
    console.log(`\nFailed blocks (${failed.length}):`);
    failed.forEach(b => console.log(`  - ${b}`));
  }
  
  // Save failed list
  fs.writeFileSync(path.join(__dirname, 'failed-textures.json'), JSON.stringify(failed, null, 2));
}

downloadAll().catch(console.error);

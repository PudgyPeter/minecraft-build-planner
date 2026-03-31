const fs = require('fs');
const path = require('path');

const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

function toWikiName(blockName) {
  return blockName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');
}

// Try multiple URL patterns for each block
function getUrlCandidates(blockName) {
  const wikiName = toWikiName(blockName);
  return [
    `https://minecraft.wiki/images/${wikiName}_JE2_BE2.png`,
    `https://minecraft.wiki/images/${wikiName}_JE3_BE2.png`,
    `https://minecraft.wiki/images/${wikiName}_JE2_BE1.png`,
    `https://minecraft.wiki/images/${wikiName}_JE1_BE1.png`,
    `https://minecraft.wiki/images/${wikiName}_JE3_BE3.png`,
    `https://minecraft.wiki/images/${wikiName}_JE3_BE1.png`,
    `https://minecraft.wiki/images/${wikiName}_JE1_BE2.png`,
    `https://minecraft.wiki/images/${wikiName}_JE4_BE2.png`,
    `https://minecraft.wiki/images/${wikiName}_JE1.png`,
    `https://minecraft.wiki/images/${wikiName}.png`,
  ];
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

async function verifyAllTextures() {
  const verified = {};
  const failed = [];
  
  // Get local textures
  const texturesDir = path.join(__dirname, 'client/public/textures');
  const localTextures = fs.readdirSync(texturesDir)
    .filter(f => f.endsWith('.png'))
    .map(f => f.replace('.png', ''));

  console.log(`Verifying textures for ${allBlocks.length} blocks...`);
  console.log(`Have ${localTextures.length} local textures as fallback\n`);
  
  // Process in batches of 10 to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < allBlocks.length; i += batchSize) {
    const batch = allBlocks.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (blockName) => {
      // First check if we have a local texture
      if (localTextures.includes(blockName)) {
        verified[blockName] = `/textures/${blockName}.png`;
        return;
      }
      
      // Try each URL candidate
      const candidates = getUrlCandidates(blockName);
      for (const url of candidates) {
        const ok = await checkUrl(url);
        if (ok) {
          verified[blockName] = url;
          return;
        }
      }
      
      // No URL worked
      failed.push(blockName);
    }));
    
    // Progress
    const done = Math.min(i + batchSize, allBlocks.length);
    process.stdout.write(`\rChecked ${done}/${allBlocks.length} blocks... (${Object.keys(verified).length} verified, ${failed.length} failed)`);
  }
  
  console.log(`\n\nResults:`);
  console.log(`✓ Verified: ${Object.keys(verified).length}`);
  console.log(`✗ Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log(`\nFailed blocks:`);
    failed.forEach(b => console.log(`  - ${b}`));
  }
  
  // Save verified URLs
  fs.writeFileSync(
    path.join(__dirname, 'verified-urls.json'),
    JSON.stringify(verified, null, 2)
  );
  
  console.log(`\n✅ Saved verified URLs to verified-urls.json`);
}

verifyAllTextures().catch(console.error);

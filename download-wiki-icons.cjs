const fs = require('fs');
const path = require('path');

const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

// Wiki inventory icon URL pattern: Invicon_Block_Name.png
// The block name uses Title_Case with underscores
function toWikiInviconName(blockName) {
  return blockName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');
}

const wikiIconsDir = path.join(__dirname, 'client/public/icons');
if (!fs.existsSync(wikiIconsDir)) {
  fs.mkdirSync(wikiIconsDir, { recursive: true });
}

async function downloadIcon(blockName) {
  const wikiName = toWikiInviconName(blockName);
  const url = `https://minecraft.wiki/images/Invicon_${wikiName}.png`;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      // Verify PNG
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        const filePath = path.join(wikiIconsDir, `${blockName}.png`);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        return true;
      }
    }
  } catch (e) {
    // ignore
  }
  return false;
}

async function downloadAll() {
  let success = 0;
  let fail = 0;
  const failed = [];
  
  console.log(`Downloading 3D inventory icons for ${allBlocks.length} blocks from Minecraft Wiki...`);
  
  const batchSize = 10;
  for (let i = 0; i < allBlocks.length; i += batchSize) {
    const batch = allBlocks.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (blockName) => {
      // Skip if already downloaded
      const filePath = path.join(wikiIconsDir, `${blockName}.png`);
      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 50) {
        return { blockName, ok: true, skipped: true };
      }
      const ok = await downloadIcon(blockName);
      return { blockName, ok };
    }));
    
    results.forEach(r => {
      if (r.ok) success++;
      else { fail++; failed.push(r.blockName); }
    });
    
    const done = Math.min(i + batchSize, allBlocks.length);
    process.stdout.write(`\r${done}/${allBlocks.length} (${success} ok, ${fail} failed)`);
  }
  
  console.log(`\n\nDone!`);
  console.log(`✓ ${success} icons downloaded`);
  console.log(`✗ ${fail} icons not found`);
  
  if (failed.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'failed-icons.json'), JSON.stringify(failed, null, 2));
    console.log(`\nFailed (${failed.length}): saved to failed-icons.json`);
  }
}

downloadAll().catch(console.error);

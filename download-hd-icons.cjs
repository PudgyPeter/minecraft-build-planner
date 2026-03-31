const fs = require('fs');
const path = require('path');

const allBlocks = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-blocks.json'), 'utf8'));

function toWikiName(blockName) {
  return blockName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');
}

const iconsDir = path.join(__dirname, 'client/public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Use the thumb endpoint to get 150px versions
async function downloadIcon(blockName) {
  const wikiName = toWikiName(blockName);
  const url = `https://minecraft.wiki/images/thumb/Invicon_${wikiName}.png/150px-Invicon_${wikiName}.png`;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        const filePath = path.join(iconsDir, `${blockName}.png`);
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
  
  console.log(`Downloading 150px HD icons for ${allBlocks.length} blocks...`);
  
  const batchSize = 10;
  for (let i = 0; i < allBlocks.length; i += batchSize) {
    const batch = allBlocks.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (blockName) => {
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
  console.log(`✓ ${success} HD icons downloaded`);
  console.log(`✗ ${fail} not found`);
  
  if (failed.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'failed-hd-icons.json'), JSON.stringify(failed, null, 2));
    console.log(`Failed list saved to failed-hd-icons.json`);
  }
}

downloadAll().catch(console.error);

const fs = require('fs');
const path = require('path');

// Read the minecraftBlocks.js file and extract all block names
const minecraftBlocksPath = path.join(__dirname, 'client/src/data/minecraftBlocks.js');
const content = fs.readFileSync(minecraftBlocksPath, 'utf8');

// Extract all block names using regex
const blockNames = [];
const matches = content.match(/name:\s*'([^']+)'/g);
if (matches) {
  matches.forEach(match => {
    const blockName = match.match(/name:\s*'([^']+)'/)[1];
    blockNames.push(blockName);
  });
}

// Remove duplicates and sort
const uniqueBlocks = [...new Set(blockNames)].sort();

console.log(`Found ${uniqueBlocks.length} unique blocks:`);
uniqueBlocks.forEach((block, index) => {
  console.log(`${index + 1}. ${block}`);
});

// Save to file for the download script
fs.writeFileSync(
  path.join(__dirname, 'all-blocks.json'),
  JSON.stringify(uniqueBlocks, null, 2)
);

console.log('\nSaved to all-blocks.json');

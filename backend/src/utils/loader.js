const fs = require('fs').promises;

let cachedCount = null;

async function loadDatasetIfExists(jsonPath) {
  try {
    const content = await fs.readFile(jsonPath, 'utf8');
    const arr = JSON.parse(content);
    cachedCount = arr.length;
    return cachedCount;
  } catch (err) {
    throw new Error('Dataset JSON not found. Run the CSV loader script to generate it.');
  }
}

module.exports = { loadDatasetIfExists };

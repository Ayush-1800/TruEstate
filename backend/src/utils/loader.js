const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

let DATASET = [];

/**
 * Loads dataset.json if present. If not, extracts data.zip safely.
 */
async function loadDatasetIfExists(zipPath, jsonPath) {
  return new Promise((resolve, reject) => {
    // JSON exists → load immediately
    if (fs.existsSync(jsonPath)) {
      console.log("📄 Found existing JSON dataset. Loading...");
      const raw = fs.readFileSync(jsonPath, "utf8");
      DATASET = JSON.parse(raw);
      return resolve(DATASET.length);
    }

    // ZIP missing
    if (!fs.existsSync(zipPath)) {
      return reject(new Error("ZIP not found at " + zipPath));
    }

    console.log("📦 Extracting ZIP (memory-safe)…");

    try {
      const zip = new AdmZip(zipPath);
      const entries = zip.getEntries();

      if (entries.length === 0) {
        return reject(new Error("ZIP is empty"));
      }

      // Find first JSON file inside ZIP
      const jsonEntry = entries.find(e => e.entryName.endsWith(".json"));

      if (!jsonEntry) {
        return reject(new Error("No .json file found inside ZIP"));
      }

      // Extract only specific JSON file
      const extractedPath = path.join(path.dirname(jsonPath), "extracted.json");
      fs.writeFileSync(extractedPath, jsonEntry.getData());
      console.log("📄 Extracted: " + extractedPath);

      // Rename to final dataset name
      fs.renameSync(extractedPath, jsonPath);

      const raw = fs.readFileSync(jsonPath, "utf8");
      DATASET = JSON.parse(raw);

      resolve(DATASET.length);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  loadDatasetIfExists,
  DATASET
};

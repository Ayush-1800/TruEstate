const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

let DATA = [];

/**
 * Load dataset from ZIP → extract → JSON
 */
async function loadDatasetIfExists(zipPath, jsonPath) {
  return new Promise((resolve, reject) => {
    console.log("🔍 Checking dataset paths:");
    console.log("ZIP Path:", zipPath);
    console.log("JSON Path:", jsonPath);

    try {
      // If JSON already exists
      if (fs.existsSync(jsonPath)) {
        console.log("📄 Found existing JSON. Loading...");
        const raw = fs.readFileSync(jsonPath);
        DATA = JSON.parse(raw);
        return resolve(DATA.length);
      }

      // ZIP not found
      if (!fs.existsSync(zipPath)) {
        return reject(new Error("❌ data.zip NOT FOUND on Render instance."));
      }

      console.log("📦 Extracting data.zip...");
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(path.dirname(jsonPath), true);

      // After extract, check JSON again
      if (!fs.existsSync(jsonPath)) {
        console.log("❌ JSON missing even after extraction!");
        console.log("📁 Files present in data folder:", fs.readdirSync(path.dirname(jsonPath)));
        return reject(new Error("sales_dataset.json missing after extraction"));
      }

      // Load extracted JSON
      const raw = fs.readFileSync(jsonPath);
      DATA = JSON.parse(raw);
      console.log("✅ JSON extracted & loaded.");

      resolve(DATA.length);

    } catch (err) {
      reject(err);
    }
  });
}

function getData() {
  return DATA;
}

module.exports = { loadDatasetIfExists, getData };

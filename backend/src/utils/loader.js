const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

async function loadDatasetIfExists(zipPath) {
  try {
    const extractedFolder = path.join(__dirname, "..", "data_unzipped");

    if (!fs.existsSync(extractedFolder)) {
      console.log("Extracting ZIP...");
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractedFolder, true);
    }

    const jsonFile = path.join(extractedFolder, "sales_dataset.json");

    if (!fs.existsSync(jsonFile)) {
      console.log("JSON file not found inside ZIP.");
      return 0;
    }

    const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
    global.salesData = data;

    return data.length;
  } catch (e) {
    console.error("Error loading dataset:", e);
    return 0;
  }
}

module.exports = { loadDatasetIfExists };

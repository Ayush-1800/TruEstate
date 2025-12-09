const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const ZIP_PATH = path.join(__dirname, "..", "src", "data.zip");
const DATA_DIR = path.join(__dirname, "..", "src", "data");
const JSON_PATH = path.join(DATA_DIR, "sales_dataset.json"); // change to your file name

let datasetCache = null;

async function extractZipIfNeeded() {
  // If folder already exists AND JSON file exists → extraction not needed
  if (fs.existsSync(JSON_PATH)) {
    console.log("Dataset already extracted.");
    return;
  }

  console.log("Extracting dataset ZIP...");

  await fs.promises.mkdir(DATA_DIR, { recursive: true });

  return new Promise((resolve, reject) => {
    fs.createReadStream(ZIP_PATH)
      .pipe(unzipper.Extract({ path: DATA_DIR }))
      .on("close", () => {
        console.log("Dataset extracted successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Unzip error:", err);
        reject(err);
      });
  });
}

async function loadDataset() {
  if (datasetCache) return datasetCache;

  await extractZipIfNeeded();

  if (!fs.existsSync(JSON_PATH)) {
    throw new Error(`JSON file missing after extraction: ${JSON_PATH}`);
  }

  const raw = await fs.promises.readFile(JSON_PATH, "utf8");
  datasetCache = JSON.parse(raw);

  console.log("Dataset loaded. Records:", datasetCache.length);

  return datasetCache;
}

module.exports = {
  loadDataset,
};

const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

// NOTE: Render allows writing only in /tmp directory
const EXTRACT_DIR = "/tmp/truestate-data";
const ZIP_PATH = path.join(__dirname, "data.zip");
const DATA_JSON = path.join(EXTRACT_DIR, "sales_dataset.json");

async function ensureDatasetLoaded() {
    try {
        // Check if already extracted
        if (fs.existsSync(DATA_JSON)) {
            console.log("Dataset already extracted.");
            return JSON.parse(fs.readFileSync(DATA_JSON, "utf8"));
        }

        console.log("Extracting dataset ZIP...");

        // Create extract directory if not exists
        if (!fs.existsSync(EXTRACT_DIR)) {
            fs.mkdirSync(EXTRACT_DIR, { recursive: true });
        }

        // Unzip file into /tmp
        await fs.createReadStream(ZIP_PATH)
            .pipe(unzipper.Extract({ path: EXTRACT_DIR }))
            .promise();

        console.log("Extraction completed.");

        if (!fs.existsSync(DATA_JSON)) {
            console.error("❌ ERROR: data.json not found inside ZIP!");
            return null;
        }

        return JSON.parse(fs.readFileSync(DATA_JSON, "utf8"));

    } catch (err) {
        console.error("Error loading dataset:", err);
        return null;
    }
}

module.exports = { ensureDatasetLoaded };

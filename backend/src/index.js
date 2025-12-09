const express = require("express");
const cors = require("cors");
const { ensureDatasetLoaded } = require("./salesService");

const app = express();
app.use(cors());
app.use(express.json());

let dataset = null;

(async () => {
    dataset = await ensureDatasetLoaded();

    if (!dataset) {
        console.warn("⚠ Dataset not loaded. API will return empty results.");
    }
})();

// Example API
app.get("/api/sales", (req, res) => {
    if (!dataset) return res.json([]);
    res.json(dataset.sales || []);
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log("TruEstate backend running on port", port);
});

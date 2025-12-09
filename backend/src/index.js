require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const salesRoutes = require('./routes/salesRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Updated loader – now handles ZIP extraction
const { loadDatasetIfExists } = require('./utils/loader');

const PORT = process.env.PORT || 4000;

const app = express();

/* -----------------------------
      CORS (Simple + Safe)
--------------------------------*/
app.use(
  cors({
    origin: "*",        // Render-compatible
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
  })
);

app.use(express.json());

/* -------------------------------------------------------
   LOAD DATASET FROM ZIP OR JSON (Render compatible)
   Render extracts your ZIP into:
   backend/src/data/data.zip
--------------------------------------------------------*/

const DATASET_ZIP = path.join(__dirname, "data", "data.zip");
const DATASET_JSON = path.join(__dirname, "data", "sales_dataset.json");

loadDatasetIfExists(DATASET_ZIP, DATASET_JSON)
  .then((count) => {
    console.log(`📦 Dataset loaded successfully. Records: ${count}`);
  })
  .catch((err) => {
    console.warn("⚠️ Dataset NOT loaded:", err.message);
  });

/* -----------------------------
            ROUTES
--------------------------------*/
app.use('/api/sales', salesRoutes);
app.use('/api/summary', summaryRoutes);

/* -----------------------------
            HEALTH
--------------------------------*/
app.get('/health', (req, res) => res.json({ status: "ok" }));

/* -----------------------------
      GLOBAL ERROR HANDLER
--------------------------------*/
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(err.status || 500).json({ error: err.message });
});

/* -----------------------------
          START SERVER
--------------------------------*/
app.listen(PORT, () => {
  console.log(`🚀 TruEstate backend running on port ${PORT}`);
});

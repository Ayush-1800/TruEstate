require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const salesRoutes = require("./routes/salesRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

// ZIP + JSON loader
const { loadDatasetIfExists } = require("./utils/loader");

const PORT = process.env.PORT || 4000;
const app = express();

/* ---------------------------------------------------------
   CORS (Simple and Render-Safe)
---------------------------------------------------------- */
app.use(
  cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json());

/* ---------------------------------------------------------
   PATHS FOR ZIP & JSON  (Render-Compatible)
---------------------------------------------------------- */
// __dirname = backend/src/

const DATASET_DIR = path.join(__dirname, "data");
const ZIP_PATH = path.join(DATASET_DIR, "data.zip");
const JSON_PATH = path.join(DATASET_DIR, "sales_dataset.json");

/* ---------------------------------------------------------
   LOAD DATASET (ZIP → extract → JSON)
---------------------------------------------------------- */
loadDatasetIfExists(ZIP_PATH, JSON_PATH)
  .then((count) => {
    console.log(`📦 Dataset loaded successfully. Records: ${count}`);
  })
  .catch((err) => {
    console.warn("⚠️ Dataset NOT loaded:", err.message);
  });

/* ---------------------------------------------------------
   ROUTES
---------------------------------------------------------- */
app.use("/api/sales", salesRoutes);
app.use("/api/summary", summaryRoutes);

/* ---------------------------------------------------------
   HEALTH CHECK
---------------------------------------------------------- */
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* ---------------------------------------------------------
   GLOBAL ERROR HANDLER
---------------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(err.status || 500).json({ error: err.message });
});

/* ---------------------------------------------------------
   START SERVER
---------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 TruEstate backend running on port ${PORT}`);
});

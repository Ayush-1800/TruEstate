require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const salesRoutes = require('./routes/salesRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const { loadDatasetIfExists } = require('./utils/loader');

const PORT = process.env.PORT || 4000;

const app = express();

// Configure CORS via environment variable `CORS_ORIGIN`.
// Provide a comma-separated list of allowed origins. If not set, allow all origins (suitable for local/dev).
const corsOrigins = process.env.CORS_ORIGIN;
let corsOptions = {};
if (corsOrigins) {
  const allowed = corsOrigins.split(',').map((s) => s.trim());
  corsOptions = {
    origin: (origin, callback) => {
      // allow requests with no origin (like curl, mobile clients)
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('CORS not allowed'), false);
    }
  };
}
app.use(cors(corsOptions));
app.use(express.json());

// Load dataset into memory (if dataset exists at backend/data/sales_dataset.json)
loadDatasetIfExists(path.join(__dirname, '..','src', 'data.zip', 'sales_dataset.json'))
  .then((dataCount) => {
    console.log(`Dataset loaded. Records: ${dataCount}`);
  })
  .catch((err) => {
    console.warn('Dataset not loaded yet. Use scripts/load_dataset.js to generate dataset JSON from CSV.', err.message);
  });

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/summary', summaryRoutes);


// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`TruEstate backend listening on port ${PORT}`);
});

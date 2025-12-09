const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const RAW_CSV = path.join(__dirname, "..", "data", "raw_dataset.csv");
const OUTPUT_JSON = path.join(__dirname, "..", "data", "sales_dataset.json");

console.log("🚀 Starting TruEstate CSV → JSON conversion…");

if (!fs.existsSync(RAW_CSV)) {
  console.error(`❌ ERROR: CSV file not found at ${RAW_CSV}`);
  process.exit(1);
}

// Write JSON array opening
const writeStream = fs.createWriteStream(OUTPUT_JSON);
writeStream.write("[");

let isFirst = true;

function cleanNumber(value) {
  if (!value) return 0;

  // Remove commas from currency or formatted numbers
  value = value.toString().replace(/,/g, "").trim();

  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function cleanString(value) {
  if (!value) return "";
  return value.toString().trim();
}

function cleanTags(value) {
  if (!value) return [];
  return value
    .split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

fs.createReadStream(RAW_CSV)
  .pipe(csv())
  .on("data", (row) => {
    const cleanRow = {
      transactionId: cleanString(row["Transaction ID"]),
      date: cleanString(row["Date"]),
      customerId: cleanString(row["Customer ID"]),
      customerName: cleanString(row["Customer Name"]),
      phone: cleanString(row["Phone Number"]),
      gender: cleanString(row["Gender"]),
      age: cleanNumber(row["Age"]),
      productCategory: cleanString(row["Product Category"]),
      quantity: cleanNumber(row["Quantity"]),
      totalAmount: cleanNumber(row["Total Amount"]),
      region: cleanString(row["Customer Region"]),
      productId: cleanString(row["Product ID"]),
      employeeName: cleanString(row["Employee Name"]),
      paymentMethod: cleanString(row["Payment Method"]),
      tags: cleanTags(row["Tags"])
    };

    if (!isFirst) writeStream.write(",");
    writeStream.write(JSON.stringify(cleanRow));
    isFirst = false;
  })
  .on("end", () => {
    writeStream.write("]");
    writeStream.end();

    console.log("✅ CSV successfully converted → sales_dataset.json");
    console.log(`📁 Output File: ${OUTPUT_JSON}`);
  })
  .on("error", (err) => {
    console.error("❌ CSV Parsing Error:", err);
  });

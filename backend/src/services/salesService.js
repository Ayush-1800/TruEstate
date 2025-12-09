const path = require('path');
const fs = require('fs').promises;

const DATA_PATH = path.join(__dirname, '..', 'data', 'sales_dataset.json');

let datasetCache = null;

/**
 * Load dataset JSON into memory (synchronously if already loaded).
 */
async function loadDataset() {
  if (datasetCache) return datasetCache;
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  datasetCache = JSON.parse(raw);
  return datasetCache;
}

/**
 * parseCommaList: "a,b,c" => ['a','b','c'] (trimmed, lowercase if flag)
 */
function parseCommaList(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

/**
 * applySearch: case-insensitive substring match on customerName and phone
 */
function applySearch(data, search) {
  if (!search) return data;
  const q = String(search).toLowerCase();
  return data.filter((row) => {
    const name = (row['Customer Name'] || row.customer_name || '').toString().toLowerCase();
    const phone = (row['Phone Number'] || row.phone || '').toString().toLowerCase();
    return name.includes(q) || phone.includes(q);
  });
}

function applyMultiSelectFilter(data, fieldNames, allowedValues) {
  if (!allowedValues || allowedValues.length === 0) return data;
  const lowerAllowed = allowedValues.map((v) => v.toString().toLowerCase());
  return data.filter((row) => {
    for (const fname of fieldNames) {
      const val = (row[fname] || row[fname.toLowerCase().replace(/\s+/g, '_')] || '').toString().toLowerCase();
      if (lowerAllowed.includes(val)) return true;
    }
    return false;
  });
}

function applyTagFilter(data, tags) {
  if (!tags || tags.length === 0) return data;
  const lowerTags = tags.map((t) => t.toLowerCase());
  return data.filter((row) => {
    const tagField = (row['Tags'] || row.tags || '');
    // tags could be comma-separated string or array
    let rowTags = [];
    if (Array.isArray(tagField)) rowTags = tagField;
    else rowTags = String(tagField).split(',').map(t => t.trim()).filter(Boolean);
    const rowLower = rowTags.map(t => t.toLowerCase());
    // match if any selected tag is present in row tags
    return lowerTags.some(t => rowLower.includes(t));
  });
}

function applyAgeRange(data, ageMin, ageMax) {
  if (ageMin == null && ageMax == null) return data;
  return data.filter((row) => {
    const ageRaw = row['Age'] || row.age;
    if (ageRaw == null || ageRaw === '') return false;
    const age = Number(ageRaw);
    if (Number.isNaN(age)) return false;
    if (ageMin != null && age < ageMin) return false;
    if (ageMax != null && age > ageMax) return false;
    return true;
  });
}

function applyDateRange(data, fromStr, toStr) {
  if (!fromStr && !toStr) return data;

  let from = fromStr ? new Date(fromStr) : null;
  let to = toStr ? new Date(toStr) : null;

  if (from && isNaN(from.valueOf())) from = null;
  if (to && isNaN(to.valueOf())) to = null;

  return data.filter((row) => {
    const dateRaw = row['Date'] || row.date;
    if (!dateRaw) return false;
    const d = new Date(dateRaw);
    if (isNaN(d.valueOf())) return false;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

function applySorting(data, sort) {
  if (!sort) return data;
  const arr = [...data];
  switch (sort) {
    case 'date_desc':
      arr.sort((a, b) => new Date(b['Date'] || b.date) - new Date(a['Date'] || a.date));
      break;
    case 'date_asc':
      arr.sort((a, b) => new Date(a['Date'] || a.date) - new Date(b['Date'] || b.date));
      break;
    case 'quantity_desc':
      arr.sort((a, b) => Number(b['Quantity'] || b.quantity || 0) - Number(a['Quantity'] || a.quantity || 0));
      break;
    case 'quantity_asc':
      arr.sort((a, b) => Number(a['Quantity'] || a.quantity || 0) - Number(b['Quantity'] || b.quantity || 0));
      break;
    case 'customer_asc':
      arr.sort((a, b) => {
        const an = ((a['Customer Name'] || a.customer_name) || '').toString().localeCompare(((b['Customer Name'] || b.customer_name) || '').toString());
        return an;
      });
      break;
    case 'customer_desc':
      arr.sort((a, b) => {
        const an = ((b['Customer Name'] || b.customer_name) || '').toString().localeCompare(((a['Customer Name'] || a.customer_name) || '').toString());
        return an;
      });
      break;
    default:
      // default: date_desc
      arr.sort((a, b) => new Date(b['Date'] || b.date) - new Date(a['Date'] || a.date));
      break;
  }
  return arr;
}

/**
 * Main query function
 * params: {
 *   search, region, gender, categories, tags, payment, age_min, age_max, date_from, date_to, sort, page
 * }
 */
async function querySales(rawParams) {
  const dataset = await loadDataset();

  let data = dataset;

  // 1. search
  if (rawParams.search) {
    data = applySearch(data, rawParams.search);
  }

  // 2. filters
  const regionList = parseCommaList(rawParams.region);
  if (regionList) data = applyMultiSelectFilter(data, [
    'Customer Region',
    'Customer region',
    'region',
    'Region',
    'customer_region'
  ], regionList);

  const genderList = parseCommaList(rawParams.gender);
  if (genderList) data = applyMultiSelectFilter(data, ['Gender', 'gender'], genderList);

  const categoryList = parseCommaList(rawParams.category);
  if (categoryList) data = applyMultiSelectFilter(data, [
    'Product Category',
    'Product category',
    'product_category',
    'productCategory',
    'Category',
    'category',
    'Product Name',
    'product_name'
  ], categoryList);

  const tagsList = parseCommaList(rawParams.tags);
  if (tagsList) data = applyTagFilter(data, tagsList);

  const paymentList = parseCommaList(rawParams.payment);
  if (paymentList) data = applyMultiSelectFilter(data, ['Payment Method', 'payment method', 'payment_method'], paymentList);

  // age range
  const ageMin = rawParams.age_min != null ? Number(rawParams.age_min) : null;
  const ageMax = rawParams.age_max != null ? Number(rawParams.age_max) : null;
  if (!Number.isNaN(ageMin) || !Number.isNaN(ageMax)) {
    data = applyAgeRange(data, ageMin, ageMax);
  }

  // date range
  if (rawParams.date_from || rawParams.date_to) {
    data = applyDateRange(data, rawParams.date_from, rawParams.date_to);
  }

  // sorting
  const sortOpt = rawParams.sort || 'date_desc';
  data = applySorting(data, sortOpt);

  // pagination
  const page = Math.max(1, Number(rawParams.page) || 1);
  const pageSize = 10;
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  // compute summary totals (Total Quantity and Final Amount) for the current filtered set
  const totalQuantity = data.reduce((acc, r) => acc + Number(r['Quantity'] || r.quantity || 0), 0);
  const totalFinalAmount = data.reduce((acc, r) => {
    // final amount field may be 'Final Amount' or 'final_amount'
    const raw = r['Final Amount'] || r.final_amount || r['FinalAmount'] || r.finalAmount || r['Final Amount (INR)'] || 0;
    const num = Number(String(raw).replace(/[^\d.-]+/g, '')) || 0;
    return acc + num;
  }, 0);

  return {
    data: pageData,
    totalItems,
    totalPages,
    currentPage: page,
    summary: {
      totalQuantity,
      totalFinalAmount
    }
  };
}

module.exports = {
  querySales,
  // exported for tests if needed
  _internal: {
    applySearch,
    applyMultiSelectFilter,
    applyTagFilter,
    applyAgeRange,
    applyDateRange,
    applySorting
  }
};

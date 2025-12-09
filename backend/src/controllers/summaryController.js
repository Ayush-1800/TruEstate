const salesService = require('../services/salesService');

exports.getSummary = async (req, res, next) => {
  try {
    // optional date range or filters passed as query params
    const params = req.query || {};
    const summary = await salesService.computeSummary(params);
    res.json(summary);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const list = await salesService.getDistinct('product');
    res.json({ data: list });
  } catch (err) { next(err); }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const list = await salesService.getDistinct('employee');
    res.json({ data: list });
  } catch (err) { next(err); }
};

exports.getStores = async (req, res, next) => {
  try {
    const list = await salesService.getDistinct('store');
    res.json({ data: list });
  } catch (err) { next(err); }
};

exports.getInvoices = async (req, res, next) => {
  try {
    // reuse /api/sales but return unpaginated subset or limited rows
    const params = { ...req.query, page: 1 };
    const q = await salesService.querySales(params);
    // return first 100 rows for invoice listing
    res.json({ data: q.data.slice(0, 100), totalItems: q.totalItems });
  } catch (err) { next(err); }
};

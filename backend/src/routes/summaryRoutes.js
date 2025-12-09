const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

router.get('/', summaryController.getSummary);        // aggregated analytics
router.get('/products', summaryController.getProducts); // distinct products list
router.get('/employees', summaryController.getEmployees);
router.get('/stores', summaryController.getStores);
router.get('/invoices', summaryController.getInvoices); // raw invoice-like entries (from sales)

module.exports = router;

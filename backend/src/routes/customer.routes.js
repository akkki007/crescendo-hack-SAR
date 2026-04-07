const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/:id/profile', customerController.getCustomerProfile);
router.get('/:id/accounts', customerController.getCustomerAccounts);
router.get('/:id/transactions', customerController.getCustomerTransactions);
router.get('/:id/alerts', customerController.getCustomerAlerts);

module.exports = router;

const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// View alerts - all authenticated users
router.get('/', alertController.getAllAlerts);
router.get('/summary', alertController.getAlertSummary);
router.get('/:id', alertController.getAlertById);
router.get('/:id/transactions', alertController.getAlertTransactions);

// Assign alerts - senior analysts, compliance officers, and admins
router.post('/:id/assign', authorize('senior_analyst', 'compliance_officer', 'admin'), alertController.assignAlert);

// Update alert status - role-specific checks handled in controller
router.patch('/:id/status', alertController.updateAlertStatus);

module.exports = router;

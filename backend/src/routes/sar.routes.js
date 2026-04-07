const express = require('express');
const router = express.Router();
const sarController = require('../controllers/sar.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// View SARs - all authenticated users can view
router.get('/', sarController.getAllSars);
router.get('/:id', sarController.getSarById);

// Create SAR - analysts and senior analysts (and admin)
router.post('/', authorize('analyst', 'senior_analyst', 'admin'), sarController.createSar);

// Get alert data formatted for SAR generation
router.get('/alert-data/:alertId', sarController.getAlertDataForSar);

// AI-powered narrative generation - analysts and senior analysts (and admin)
router.post('/:id/generate', authorize('analyst', 'senior_analyst', 'admin'), sarController.generateNarrative);
router.post('/:id/regenerate', authorize('analyst', 'senior_analyst', 'admin'), sarController.regenerateNarrative);

// Update SAR narrative (manual edit) - analysts and senior analysts (and admin)
router.patch('/:id/narrative', authorize('analyst', 'senior_analyst', 'admin'), sarController.updateSarNarrative);

// Workflow actions
router.post('/:id/submit', authorize('analyst', 'senior_analyst', 'admin'), sarController.submitSarForReview);
router.post('/:id/approve', authorize('compliance_officer', 'admin'), sarController.approveSar);
router.post('/:id/reject', authorize('compliance_officer', 'admin', 'senior_analyst'), sarController.rejectSar);

module.exports = router;

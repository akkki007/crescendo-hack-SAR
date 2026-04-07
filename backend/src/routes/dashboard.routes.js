const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/overview', dashboardController.getOverviewStats);
router.get('/alert-trends', dashboardController.getAlertTrends);
router.get('/alerts-by-type', dashboardController.getAlertsByType);
router.get('/sar-workflow', dashboardController.getSarWorkflow);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/my-stats', dashboardController.getMyStats);

module.exports = router;

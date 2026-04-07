const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication + admin/compliance_officer only
router.use(authenticate);
router.use(authorize('admin', 'compliance_officer'));

router.get('/', auditController.getAuditLogs);
router.get('/summary', auditController.getAuditSummary);
router.get('/:id', auditController.getAuditLogById);
router.get('/entity/:entityType/:entityId', auditController.getEntityAuditTrail);
router.get('/user/:userId', auditController.getUserActivity);

module.exports = router;

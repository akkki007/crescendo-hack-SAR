const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Password is required'),
    validate
];

const changePasswordValidation = [
    body('currentPassword')
        .isLength({ min: 1 })
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters'),
    validate
];

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validate
];

const uuidValidation = [
    param('id')
        .isUUID()
        .withMessage('Invalid ID format'),
    validate
];

const createSarValidation = [
    body('alertId')
        .notEmpty()
        .withMessage('Alert ID is required'),
    validate
];

const updateSarNarrativeValidation = [
    body('narrativeDraft')
        .notEmpty()
        .withMessage('Narrative draft is required'),
    validate
];

const updateAlertStatusValidation = [
    body('status')
        .isIn(['Open', 'Under_Review', 'Escalated', 'SAR_Filed', 'Closed_No_Action', 'Closed_False_Positive'])
        .withMessage('Invalid status'),
    validate
];

module.exports = {
    validate,
    loginValidation,
    changePasswordValidation,
    paginationValidation,
    uuidValidation,
    createSarValidation,
    updateSarNarrativeValidation,
    updateAlertStatusValidation
};

const { query } = require('../config/database');
const logger = require('../utils/logger');

exports.getAllCustomers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            customerType,
            kycRiskRating,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const params = [];
        let whereClause = 'WHERE 1=1';
        let paramIndex = 1;

        if (search) {
            whereClause += ` AND (full_name ILIKE $${paramIndex} OR customer_id ILIKE $${paramIndex} OR pan_number ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (customerType) {
            whereClause += ` AND customer_type = $${paramIndex}`;
            params.push(customerType);
            paramIndex++;
        }

        if (kycRiskRating) {
            whereClause += ` AND kyc_risk_rating = $${paramIndex}`;
            params.push(kycRiskRating);
            paramIndex++;
        }

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM customers ${whereClause}`,
            params
        );

        // Get customers
        const allowedSortFields = ['created_at', 'full_name', 'customer_id', 'kyc_risk_rating'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const result = await query(
            `SELECT id, customer_id, customer_type, full_name, email, phone_primary,
                    kyc_status, kyc_risk_rating, relationship_start_date, is_active, created_at
             FROM customers
             ${whereClause}
             ORDER BY ${sortField} ${order}
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        res.json({
            customers: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count),
                totalPages: Math.ceil(countResult.rows[0].count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(id);

        const result = await query(
            isUuid
                ? `SELECT * FROM customers WHERE id = $1 OR customer_id = $1::text`
                : `SELECT * FROM customers WHERE customer_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerAccounts = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(id);

        const result = await query(
            isUuid
                ? `SELECT a.* FROM accounts a
                   JOIN customers c ON a.customer_id = c.id
                   WHERE c.id = $1 OR c.customer_id = $1::text
                   ORDER BY a.open_date DESC`
                : `SELECT a.* FROM accounts a
                   JOIN customers c ON a.customer_id = c.id
                   WHERE c.customer_id = $1
                   ORDER BY a.open_date DESC`,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerTransactions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 50, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;
        const params = [id];
        let whereClause = '';
        let paramIndex = 2;

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(id);
        const customerCondition = isUuid ? '(c.id = $1 OR c.customer_id = $1::text)' : 'c.customer_id = $1';

        if (startDate) {
            whereClause += ` AND t.transaction_date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            whereClause += ` AND t.transaction_date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        const result = await query(
            `SELECT t.* FROM transactions t
             JOIN accounts a ON t.account_id = a.id
             JOIN customers c ON a.customer_id = c.id
             WHERE ${customerCondition} ${whereClause}
             ORDER BY t.transaction_timestamp DESC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerAlerts = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(id);

        const result = await query(
            isUuid
                ? `SELECT al.* FROM alerts al
                   JOIN customers c ON al.customer_id = c.id
                   WHERE c.id = $1 OR c.customer_id = $1::text
                   ORDER BY al.alert_generated_at DESC`
                : `SELECT al.* FROM alerts al
                   JOIN customers c ON al.customer_id = c.id
                   WHERE c.customer_id = $1
                   ORDER BY al.alert_generated_at DESC`,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerProfile = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(id);

        // Get customer details
        const customerResult = await query(
            isUuid
                ? `SELECT * FROM customers WHERE id = $1 OR customer_id = $1::text`
                : `SELECT * FROM customers WHERE customer_id = $1`,
            [id]
        );

        if (customerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customer = customerResult.rows[0];

        // Get accounts
        const accountsResult = await query(
            `SELECT * FROM accounts WHERE customer_id = $1`,
            [customer.id]
        );

        // Get alert count
        const alertsResult = await query(
            `SELECT COUNT(*) as total,
                    COUNT(*) FILTER (WHERE alert_status = 'Open') as open_alerts
             FROM alerts WHERE customer_id = $1`,
            [customer.id]
        );

        // Get SAR count
        const sarResult = await query(
            `SELECT COUNT(*) as total,
                    COUNT(*) FILTER (WHERE sar_status = 'Filed') as filed_sars
             FROM sar_reports WHERE customer_id = $1`,
            [customer.id]
        );

        res.json({
            customer,
            accounts: accountsResult.rows,
            alertsSummary: alertsResult.rows[0],
            sarSummary: sarResult.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

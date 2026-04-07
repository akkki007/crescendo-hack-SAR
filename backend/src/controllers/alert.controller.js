const { query, getClient } = require('../config/database');
const logger = require('../utils/logger');

exports.getAllAlerts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            priority,
            alertType,
            assignedTo,
            sortBy = 'alert_generated_at',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const params = [];
        let whereClause = 'WHERE 1=1';
        let paramIndex = 1;

        if (status) {
            whereClause += ` AND a.alert_status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (priority) {
            whereClause += ` AND a.alert_priority = $${paramIndex}`;
            params.push(priority);
            paramIndex++;
        }

        if (alertType) {
            whereClause += ` AND a.alert_type = $${paramIndex}`;
            params.push(alertType);
            paramIndex++;
        }

        if (assignedTo) {
            if (assignedTo === 'me') {
                whereClause += ` AND a.assigned_to = $${paramIndex}`;
                params.push(req.user.id);
            } else if (assignedTo === 'unassigned') {
                whereClause += ` AND a.assigned_to IS NULL`;
            } else {
                whereClause += ` AND a.assigned_to = $${paramIndex}`;
                params.push(assignedTo);
            }
            paramIndex++;
        }

        // Role-based visibility: analysts only see their assigned alerts or unassigned ones
        if (req.user.role === 'analyst') {
            whereClause += ` AND (a.assigned_to = $${paramIndex} OR a.assigned_to IS NULL)`;
            params.push(req.user.id);
            paramIndex++;
        }

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM alerts a ${whereClause}`,
            params
        );

        // Get alerts with customer info
        const allowedSortFields = ['alert_generated_at', 'alert_priority', 'alert_status', 'risk_score'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'alert_generated_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const result = await query(
            `SELECT a.*, c.full_name as customer_name, c.customer_id as customer_code,
                    c.kyc_risk_rating, u.first_name || ' ' || u.last_name as assigned_analyst
             FROM alerts a
             JOIN customers c ON a.customer_id = c.id
             LEFT JOIN users u ON a.assigned_to = u.id
             ${whereClause}
             ORDER BY a.${sortField} ${order}
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        res.json({
            alerts: result.rows,
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

exports.getAlertById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if id is a valid UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        const result = await query(
            `SELECT a.*, c.*, acc.account_number, acc.account_type,
                    u.first_name || ' ' || u.last_name as assigned_analyst
             FROM alerts a
             JOIN customers c ON a.customer_id = c.id
             LEFT JOIN accounts acc ON a.account_id = acc.id
             LEFT JOIN users u ON a.assigned_to = u.id
             WHERE ${isUUID ? 'a.id = $1' : 'a.alert_id = $1'}`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        // Log view event
        await query(
            `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            ['ALERT_VIEWED', 'Alert', req.user.id, req.user.email, req.user.role, 'Alert', result.rows[0].id,
             JSON.stringify({ alert_id: result.rows[0].alert_id }),
             req.ip]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.getAlertTransactions = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if id is a valid UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        // Get alert to find review period
        const alertResult = await query(
            isUUID
                ? `SELECT account_id, review_period_start, review_period_end FROM alerts WHERE id = $1`
                : `SELECT account_id, review_period_start, review_period_end FROM alerts WHERE alert_id = $1`,
            [id]
        );

        if (alertResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        const alert = alertResult.rows[0];

        // If no account_id, return empty array
        if (!alert.account_id) {
            return res.json([]);
        }

        const result = await query(
            `SELECT * FROM transactions
             WHERE account_id = $1
             AND transaction_date BETWEEN $2 AND $3
             ORDER BY transaction_timestamp ASC`,
            [alert.account_id, alert.review_period_start, alert.review_period_end]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.assignAlert = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { assigneeId } = req.body;

        // Check if id is a valid UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Update alert
            const result = await client.query(
                `UPDATE alerts SET assigned_to = $1, alert_status = 'Under_Review',
                 first_reviewed_at = COALESCE(first_reviewed_at, CURRENT_TIMESTAMP),
                 updated_at = CURRENT_TIMESTAMP
                 WHERE ${isUUID ? 'id = $2' : 'alert_id = $2'}
                 RETURNING *`,
                [assigneeId || req.user.id, id]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Alert not found' });
            }

            // Log audit event
            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['ALERT_ASSIGNED', 'Alert', req.user.id, req.user.email, req.user.role, 'Alert', result.rows[0].id,
                 JSON.stringify({ alert_id: result.rows[0].alert_id, assigned_to: assigneeId || req.user.id }),
                 req.ip]
            );

            await client.query('COMMIT');

            res.json(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

exports.updateAlertStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, comments } = req.body;

        // Check if id is a valid UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        const validStatuses = ['Open', 'Under_Review', 'Escalated', 'SAR_Filed', 'Closed_No_Action', 'Closed_False_Positive'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status', validStatuses });
        }

        // Role-based status transition enforcement
        const userRole = req.user.role;

        // Escalation: only senior_analyst, compliance_officer, admin
        if (status === 'Escalated' && !['senior_analyst', 'compliance_officer', 'admin'].includes(userRole)) {
            return res.status(403).json({ error: 'Only senior analysts, compliance officers, or admins can escalate alerts' });
        }

        // Closing alerts: only compliance_officer, admin
        if (status.startsWith('Closed') && !['compliance_officer', 'admin'].includes(userRole)) {
            return res.status(403).json({ error: 'Only compliance officers or admins can close alerts' });
        }

        // SAR_Filed: only compliance_officer, admin (filed after SAR approval)
        if (status === 'SAR_Filed' && !['compliance_officer', 'admin'].includes(userRole)) {
            return res.status(403).json({ error: 'Only compliance officers or admins can mark alerts as SAR Filed' });
        }

        const client = await getClient();

        try {
            await client.query('BEGIN');

            const updateFields = ['alert_status = $1', 'updated_at = CURRENT_TIMESTAMP'];
            const params = [status, id];
            let paramIndex = 3;

            if (status === 'Escalated') {
                updateFields.push(`escalated_at = CURRENT_TIMESTAMP`);
                updateFields.push(`escalated_to = $${paramIndex}`);
                params.push(req.body.escalateTo);
                paramIndex++;
            }

            if (status.startsWith('Closed')) {
                updateFields.push(`closed_at = CURRENT_TIMESTAMP`);
            }

            const result = await client.query(
                `UPDATE alerts SET ${updateFields.join(', ')}
                 WHERE ${isUUID ? 'id = $2' : 'alert_id = $2'}
                 RETURNING *`,
                params
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Alert not found' });
            }

            // Log audit event
            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['ALERT_STATUS_UPDATED', 'Alert', req.user.id, req.user.email, req.user.role, 'Alert', result.rows[0].id,
                 JSON.stringify({ alert_id: result.rows[0].alert_id, new_status: status, comments }),
                 req.ip]
            );

            await client.query('COMMIT');

            res.json(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

exports.getAlertSummary = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT
                COUNT(*) FILTER (WHERE alert_status = 'Open') as open_alerts,
                COUNT(*) FILTER (WHERE alert_status = 'Under_Review') as under_review,
                COUNT(*) FILTER (WHERE alert_status = 'Escalated') as escalated,
                COUNT(*) FILTER (WHERE alert_priority = 'High' AND alert_status NOT LIKE 'Closed%') as high_priority,
                COUNT(*) FILTER (WHERE alert_priority = 'Critical' AND alert_status NOT LIKE 'Closed%') as critical,
                COUNT(*) as total
            FROM alerts
        `);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const { query } = require('../config/database');
const logger = require('../utils/logger');

exports.getAuditLogs = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 50,
            action,
            actionCategory,
            userId,
            entityType,
            startDate,
            endDate,
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const params = [];
        let whereClause = 'WHERE 1=1';
        let paramIndex = 1;

        if (action) {
            whereClause += ` AND action = $${paramIndex}`;
            params.push(action);
            paramIndex++;
        }

        if (actionCategory) {
            whereClause += ` AND action_category = $${paramIndex}`;
            params.push(actionCategory);
            paramIndex++;
        }

        if (userId) {
            whereClause += ` AND user_id = $${paramIndex}`;
            params.push(userId);
            paramIndex++;
        }

        if (entityType) {
            whereClause += ` AND entity_type = $${paramIndex}`;
            params.push(entityType);
            paramIndex++;
        }

        if (startDate) {
            whereClause += ` AND created_at >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            whereClause += ` AND created_at <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        const countResult = await query(
            `SELECT COUNT(*) FROM audit_logs ${whereClause}`,
            params
        );

        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const result = await query(
            `SELECT * FROM audit_logs
             ${whereClause}
             ORDER BY created_at ${order}
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        res.json({
            logs: result.rows,
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

exports.getAuditLogById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT al.*, u.first_name, u.last_name, u.employee_id
             FROM audit_logs al
             LEFT JOIN users u ON al.user_id = u.id
             WHERE al.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit log not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.getEntityAuditTrail = async (req, res, next) => {
    try {
        const { entityType, entityId } = req.params;

        const result = await query(
            `SELECT al.*, u.first_name || ' ' || u.last_name as user_name
             FROM audit_logs al
             LEFT JOIN users u ON al.user_id = u.id
             WHERE al.entity_type = $1 AND al.entity_id = $2
             ORDER BY al.created_at DESC`,
            [entityType, entityId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getUserActivity = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, limit = 100 } = req.query;

        const params = [userId];
        let whereClause = 'WHERE user_id = $1';
        let paramIndex = 2;

        if (startDate) {
            whereClause += ` AND created_at >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            whereClause += ` AND created_at <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        const result = await query(
            `SELECT * FROM audit_logs
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT $${paramIndex}`,
            [...params, limit]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getAuditSummary = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = '';
        const params = [];

        if (startDate && endDate) {
            dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
            params.push(startDate, endDate);
        }

        const result = await query(`
            SELECT
                action_category,
                action,
                COUNT(*) as count
            FROM audit_logs
            ${dateFilter}
            GROUP BY action_category, action
            ORDER BY action_category, count DESC
        `, params);

        // Group by category
        const summary = {};
        result.rows.forEach(row => {
            if (!summary[row.action_category]) {
                summary[row.action_category] = [];
            }
            summary[row.action_category].push({
                action: row.action,
                count: parseInt(row.count)
            });
        });

        res.json(summary);
    } catch (error) {
        next(error);
    }
};

const { query } = require('../config/database');
const logger = require('../utils/logger');

exports.getOverviewStats = async (req, res, next) => {
    try {
        // Get alert statistics
        const alertStats = await query(`
            SELECT
                COUNT(*) FILTER (WHERE alert_status = 'Open') as open_alerts,
                COUNT(*) FILTER (WHERE alert_status = 'Under_Review') as under_review,
                COUNT(*) FILTER (WHERE alert_status = 'Escalated') as escalated,
                COUNT(*) FILTER (WHERE alert_priority = 'High' AND alert_status NOT LIKE 'Closed%') as high_priority,
                COUNT(*) FILTER (WHERE alert_priority = 'Critical' AND alert_status NOT LIKE 'Closed%') as critical,
                COUNT(*) FILTER (WHERE alert_generated_at >= CURRENT_DATE - INTERVAL '7 days') as last_7_days,
                COUNT(*) as total
            FROM alerts
        `);

        // Get SAR statistics
        const sarStats = await query(`
            SELECT
                COUNT(*) FILTER (WHERE sar_status = 'Draft') as draft,
                COUNT(*) FILTER (WHERE sar_status = 'Pending_Review') as pending_review,
                COUNT(*) FILTER (WHERE sar_status = 'Approved') as approved,
                COUNT(*) FILTER (WHERE sar_status = 'Filed') as filed,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as last_30_days,
                COUNT(*) as total
            FROM sar_reports
        `);

        // Get user workload
        const userWorkload = await query(`
            SELECT
                u.id, u.first_name || ' ' || u.last_name as name,
                COUNT(a.id) FILTER (WHERE a.alert_status NOT LIKE 'Closed%') as open_alerts,
                COUNT(s.id) FILTER (WHERE s.sar_status IN ('Draft', 'Revision_Required')) as pending_sars
            FROM users u
            LEFT JOIN alerts a ON a.assigned_to = u.id
            LEFT JOIN sar_reports s ON s.created_by = u.id
            WHERE u.role IN ('analyst', 'senior_analyst')
            GROUP BY u.id, u.first_name, u.last_name
            ORDER BY open_alerts DESC
        `);

        res.json({
            alerts: alertStats.rows[0],
            sars: sarStats.rows[0],
            workload: userWorkload.rows
        });
    } catch (error) {
        next(error);
    }
};

exports.getAlertTrends = async (req, res, next) => {
    try {
        const { days = 30 } = req.query;

        const result = await query(`
            SELECT
                DATE(alert_generated_at) as date,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE alert_priority = 'High') as high,
                COUNT(*) FILTER (WHERE alert_priority = 'Critical') as critical
            FROM alerts
            WHERE alert_generated_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
            GROUP BY DATE(alert_generated_at)
            ORDER BY date
        `);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getAlertsByType = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT
                alert_type,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE alert_status NOT LIKE 'Closed%') as open
            FROM alerts
            GROUP BY alert_type
            ORDER BY total DESC
        `);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getSarWorkflow = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT
                sar_status,
                COUNT(*) as count,
                AVG(EXTRACT(EPOCH FROM (submitted_at - created_at))/3600) as avg_draft_hours,
                AVG(EXTRACT(EPOCH FROM (approved_at - submitted_at))/3600) as avg_review_hours
            FROM sar_reports
            GROUP BY sar_status
        `);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getRecentActivity = async (req, res, next) => {
    try {
        const { limit = 20 } = req.query;

        // Analysts only see their own activity; others see all
        const isAnalyst = req.user.role === 'analyst';
        const result = await query(`
            SELECT
                al.action,
                al.action_category,
                al.entity_type,
                al.details,
                al.created_at,
                u.first_name || ' ' || u.last_name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ${isAnalyst ? 'WHERE al.user_id = $2' : ''}
            ORDER BY al.created_at DESC
            LIMIT $1
        `, isAnalyst ? [limit, req.user.id] : [limit]);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getMyStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get alerts assigned to user
        const alertsResult = await query(`
            SELECT
                COUNT(*) FILTER (WHERE alert_status = 'Open') as open,
                COUNT(*) FILTER (WHERE alert_status = 'Under_Review') as under_review,
                COUNT(*) FILTER (WHERE alert_status LIKE 'Closed%' AND closed_at >= CURRENT_DATE - INTERVAL '7 days') as closed_this_week
            FROM alerts
            WHERE assigned_to = $1
        `, [userId]);

        // Get SARs created by user
        const sarsResult = await query(`
            SELECT
                COUNT(*) FILTER (WHERE sar_status = 'Draft') as draft,
                COUNT(*) FILTER (WHERE sar_status = 'Pending_Review') as pending,
                COUNT(*) FILTER (WHERE sar_status = 'Approved' AND approved_at >= CURRENT_DATE - INTERVAL '30 days') as approved_this_month
            FROM sar_reports
            WHERE created_by = $1
        `, [userId]);

        res.json({
            alerts: alertsResult.rows[0],
            sars: sarsResult.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

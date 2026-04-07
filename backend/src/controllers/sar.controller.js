const { query, getClient } = require('../config/database');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Helper function to check if a string is a valid UUID
const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

exports.getAllSars = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            createdBy,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const params = [];
        let whereClause = 'WHERE 1=1';
        let paramIndex = 1;

        if (status) {
            whereClause += ` AND s.sar_status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (createdBy === 'me') {
            whereClause += ` AND s.created_by = $${paramIndex}`;
            params.push(req.user.id);
            paramIndex++;
        }

        // Role-based visibility: analysts only see their own SARs
        if (req.user.role === 'analyst') {
            whereClause += ` AND s.created_by = $${paramIndex}`;
            params.push(req.user.id);
            paramIndex++;
        }

        const countResult = await query(
            `SELECT COUNT(*) FROM sar_reports s ${whereClause}`,
            params
        );

        const result = await query(
            `SELECT s.id, s.sar_id, s.sar_status, s.created_at, s.submitted_at, s.approved_at,
                    a.alert_id, a.alert_type,
                    c.customer_id as customer_code, c.full_name as customer_name,
                    creator.first_name || ' ' || creator.last_name as created_by_name,
                    reviewer.first_name || ' ' || reviewer.last_name as reviewed_by_name
             FROM sar_reports s
             JOIN alerts a ON s.alert_id = a.id
             JOIN customers c ON s.customer_id = c.id
             LEFT JOIN users creator ON s.created_by = creator.id
             LEFT JOIN users reviewer ON s.reviewed_by = reviewer.id
             ${whereClause}
             ORDER BY s.${sortBy} ${sortOrder}
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        res.json({
            sars: result.rows,
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

exports.getSarById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const whereClause = isUUID(id) ? 's.id = $1' : 's.sar_id = $1';

        const result = await query(
            `SELECT s.*, a.alert_id, a.alert_type, a.alert_priority,
                    a.alert_reasons, a.matched_typologies, a.customer_interaction,
                    c.*, creator.first_name || ' ' || creator.last_name as created_by_name,
                    reviewer.first_name || ' ' || reviewer.last_name as reviewed_by_name,
                    approver.first_name || ' ' || approver.last_name as approved_by_name
             FROM sar_reports s
             JOIN alerts a ON s.alert_id = a.id
             JOIN customers c ON s.customer_id = c.id
             LEFT JOIN users creator ON s.created_by = creator.id
             LEFT JOIN users reviewer ON s.reviewed_by = reviewer.id
             LEFT JOIN users approver ON s.approved_by = approver.id
             WHERE ${whereClause}`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SAR report not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.createSar = async (req, res, next) => {
    try {
        const { alertId } = req.body;

        // Get alert details
        const alertResult = await query(
            `SELECT a.id, a.customer_id, a.alert_id FROM alerts a
             WHERE a.id = $1 OR a.alert_id = $1`,
            [alertId]
        );

        if (alertResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        const alert = alertResult.rows[0];

        // Check if SAR already exists for this alert
        const existingResult = await query(
            `SELECT id, sar_id FROM sar_reports WHERE alert_id = $1`,
            [alert.id]
        );

        if (existingResult.rows.length > 0) {
            return res.status(409).json({
                error: 'SAR already exists for this alert',
                sarId: existingResult.rows[0].sar_id
            });
        }

        // Generate SAR ID
        const sarId = `SAR-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Create SAR
            const result = await client.query(
                `INSERT INTO sar_reports (sar_id, alert_id, customer_id, sar_status, created_by)
                 VALUES ($1, $2, $3, 'Draft', $4)
                 RETURNING *`,
                [sarId, alert.id, alert.customer_id, req.user.id]
            );

            // Log audit event
            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['SAR_CREATED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', result.rows[0].id,
                 JSON.stringify({ sar_id: sarId, alert_id: alert.alert_id }),
                 req.ip]
            );

            await client.query('COMMIT');

            res.status(201).json(result.rows[0]);
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

exports.updateSarNarrative = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { narrativeDraft, auditTrail, feedback } = req.body;

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Get current SAR
            const sarWhereClause = isUUID(id) ? 'id = $1' : 'sar_id = $1';
            const currentResult = await client.query(
                `SELECT * FROM sar_reports WHERE ${sarWhereClause}`,
                [id]
            );

            if (currentResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'SAR not found' });
            }

            const currentSar = currentResult.rows[0];

            // Ownership check: analysts can only edit their own SARs
            if (req.user.role === 'analyst' && currentSar.created_by !== req.user.id) {
                await client.query('ROLLBACK');
                return res.status(403).json({ error: 'You can only edit SARs you created' });
            }

            // Build new audit trail
            const newAuditEntry = {
                timestamp: new Date().toISOString(),
                user: req.user.email,
                action: 'narrative_updated',
                feedback: feedback || null,
                auditTrail: auditTrail || null
            };

            const updatedAuditTrail = [
                ...(currentSar.audit_trail || []),
                newAuditEntry
            ];

            // Update SAR
            const updateWhereClause = isUUID(id) ? 'id = $4' : 'sar_id = $4';
            const result = await client.query(
                `UPDATE sar_reports
                 SET narrative_draft = $1, audit_trail = $2, analyst_feedback = $3,
                     generation_timestamp = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                 WHERE ${updateWhereClause}
                 RETURNING *`,
                [narrativeDraft, JSON.stringify(updatedAuditTrail), feedback, id]
            );

            // Log audit event
            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['SAR_NARRATIVE_UPDATED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', result.rows[0].id,
                 JSON.stringify({ sar_id: result.rows[0].sar_id, has_feedback: !!feedback }),
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

exports.submitSarForReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const whereClause = isUUID(id) ? 'id = $1' : 'sar_id = $1';

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Check SAR exists and ownership
            const sarCheck = await client.query(
                `SELECT id, created_by, sar_status FROM sar_reports WHERE ${whereClause}`,
                [id]
            );

            if (sarCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'SAR not found' });
            }

            const sarToSubmit = sarCheck.rows[0];

            // Ownership check: analysts can only submit their own SARs
            if (req.user.role === 'analyst' && sarToSubmit.created_by !== req.user.id) {
                await client.query('ROLLBACK');
                return res.status(403).json({ error: 'You can only submit SARs you created' });
            }

            if (!['Draft', 'Revision_Required'].includes(sarToSubmit.sar_status)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'SAR must be in Draft or Revision Required status to submit' });
            }

            const result = await client.query(
                `UPDATE sar_reports
                 SET sar_status = 'Pending_Review', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                 WHERE ${whereClause} AND sar_status IN ('Draft', 'Revision_Required')
                 RETURNING *`,
                [id]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Failed to submit SAR' });
            }

            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['SAR_SUBMITTED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', result.rows[0].id,
                 JSON.stringify({ sar_id: result.rows[0].sar_id }),
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

exports.approveSar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;
        const whereClause = isUUID(id) ? 'id = $1' : 'sar_id = $1';

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Get current SAR and copy draft to final
            const currentResult = await client.query(
                `SELECT * FROM sar_reports WHERE ${whereClause}`,
                [id]
            );

            if (currentResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'SAR not found' });
            }

            const updateWhereClause = isUUID(id) ? 'id = $3' : 'sar_id = $3';
            const result = await client.query(
                `UPDATE sar_reports
                 SET sar_status = 'Approved', narrative_final = narrative_draft,
                     approved_by = $1, approved_at = CURRENT_TIMESTAMP,
                     reviewer_comments = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE ${updateWhereClause} AND sar_status IN ('Pending_Review', 'Under_Review')
                 RETURNING *`,
                [req.user.id, comments, id]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'SAR is not in reviewable status' });
            }

            // Update alert status
            await client.query(
                `UPDATE alerts SET alert_status = 'SAR_Filed' WHERE id = $1`,
                [result.rows[0].alert_id]
            );

            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['SAR_APPROVED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', result.rows[0].id,
                 JSON.stringify({ sar_id: result.rows[0].sar_id, comments }),
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

exports.rejectSar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;
        const whereClause = isUUID(id) ? 'id = $3' : 'sar_id = $3';

        if (!comments) {
            return res.status(400).json({ error: 'Comments are required when rejecting' });
        }

        const client = await getClient();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                `UPDATE sar_reports
                 SET sar_status = 'Revision_Required', reviewed_by = $1,
                     reviewer_comments = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE ${whereClause} AND sar_status IN ('Pending_Review', 'Under_Review')
                 RETURNING *`,
                [req.user.id, comments, id]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'SAR not found or not in reviewable status' });
            }

            await client.query(
                `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                ['SAR_REJECTED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', result.rows[0].id,
                 JSON.stringify({ sar_id: result.rows[0].sar_id, comments }),
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

exports.getAlertDataForSar = async (req, res, next) => {
    try {
        const { alertId } = req.params;

        // Get all data needed for SAR generation
        const alertResult = await query(
            `SELECT a.*, c.*, acc.account_number, acc.account_type, acc.account_id
             FROM alerts a
             JOIN customers c ON a.customer_id = c.id
             LEFT JOIN accounts acc ON a.account_id = acc.id
             WHERE a.id = $1 OR a.alert_id = $1`,
            [alertId]
        );

        if (alertResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        const alert = alertResult.rows[0];

        // Get transactions for the review period
        const transactionsResult = await query(
            `SELECT * FROM transactions
             WHERE account_id = $1 AND transaction_date BETWEEN $2 AND $3
             ORDER BY transaction_timestamp`,
            [alert.account_id, alert.review_period_start, alert.review_period_end]
        );

        // Format data for LLM consumption
        const amlData = {
            alert_metadata: {
                alert_id: alert.alert_id,
                alert_type: alert.alert_type,
                alert_priority: alert.alert_priority,
                alert_status: alert.alert_status,
                alert_generated_timestamp: alert.alert_generated_at,
                monitoring_system: alert.monitoring_system,
                triggering_rules: alert.triggering_rules,
                risk_rating: alert.risk_rating,
                jurisdiction: alert.jurisdiction
            },
            customer_profile: {
                customer_id: alert.customer_id,
                customer_type: alert.customer_type,
                full_name: alert.full_name,
                date_of_birth: alert.date_of_birth,
                nationality: alert.nationality,
                occupation: alert.occupation,
                kyc_risk_rating: alert.kyc_risk_rating,
                relationship_start_date: alert.relationship_start_date,
                expected_monthly_turnover: {
                    min: alert.expected_monthly_turnover_min,
                    max: alert.expected_monthly_turnover_max,
                    currency: 'INR'
                }
            },
            accounts: [{
                account_id: alert.account_id,
                account_type: alert.account_type,
                account_status: 'Active',
                primary_holder: alert.full_name
            }],
            transaction_summary: {
                review_period: {
                    from: alert.review_period_start,
                    to: alert.review_period_end
                },
                total_inbound_amount: parseFloat(alert.total_inbound_amount),
                total_outbound_amount: parseFloat(alert.total_outbound_amount),
                currency: 'INR',
                inbound_transaction_count: alert.inbound_transaction_count,
                outbound_transaction_count: alert.outbound_transaction_count,
                unique_inbound_counterparties: alert.unique_counterparties
            },
            counterparty_indicators: alert.counterparty_indicators,
            alert_reasons: alert.alert_reasons,
            matched_typologies: alert.matched_typologies,
            customer_interaction: alert.customer_interaction
        };

        res.json({
            amlData,
            transactions: transactionsResult.rows
        });
    } catch (error) {
        next(error);
    }
};

exports.generateNarrative = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        const whereClause = isUUID(id) ? 's.id = $1' : 's.sar_id = $1';

        // Get SAR and associated alert data
        const sarResult = await query(
            `SELECT s.*, a.alert_id as alert_code FROM sar_reports s
             JOIN alerts a ON s.alert_id = a.id
             WHERE ${whereClause}`,
            [id]
        );

        if (sarResult.rows.length === 0) {
            return res.status(404).json({ error: 'SAR not found' });
        }

        const sar = sarResult.rows[0];

        // Ownership check: analysts can only generate for their own SARs
        if (req.user.role === 'analyst' && sar.created_by !== req.user.id) {
            return res.status(403).json({ error: 'You can only generate narratives for SARs you created' });
        }

        // Get alert data formatted for AI service
        const alertResult = await query(
            `SELECT a.*, c.*, acc.account_number, acc.account_type, acc.account_id as acc_id
             FROM alerts a
             JOIN customers c ON a.customer_id = c.id
             LEFT JOIN accounts acc ON a.account_id = acc.id
             WHERE a.id = $1`,
            [sar.alert_id]
        );

        if (alertResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        const alert = alertResult.rows[0];

        // Format AML data for AI service
        const amlData = {
            alert_metadata: {
                alert_id: alert.alert_id,
                alert_type: alert.alert_type,
                alert_priority: alert.alert_priority,
                alert_status: alert.alert_status,
                alert_generated_timestamp: alert.alert_generated_at,
                monitoring_system: alert.monitoring_system,
                triggering_rules: alert.triggering_rules,
                risk_rating: alert.risk_rating,
                jurisdiction: alert.jurisdiction
            },
            customer_profile: {
                customer_id: alert.customer_id,
                customer_type: alert.customer_type,
                full_name: alert.full_name,
                date_of_birth: alert.date_of_birth,
                nationality: alert.nationality,
                occupation: alert.occupation,
                kyc_risk_rating: alert.kyc_risk_rating,
                relationship_start_date: alert.relationship_start_date,
                expected_monthly_turnover: {
                    min: parseFloat(alert.expected_monthly_turnover_min) || 0,
                    max: parseFloat(alert.expected_monthly_turnover_max) || 0,
                    currency: 'INR'
                }
            },
            accounts: [{
                account_id: alert.acc_id,
                account_type: alert.account_type,
                account_status: 'Active',
                primary_holder: alert.full_name
            }],
            transaction_summary: {
                review_period: {
                    from: alert.review_period_start,
                    to: alert.review_period_end
                },
                total_inbound_amount: parseFloat(alert.total_inbound_amount) || 0,
                total_outbound_amount: parseFloat(alert.total_outbound_amount) || 0,
                currency: 'INR',
                inbound_transaction_count: alert.inbound_transaction_count || 0,
                outbound_transaction_count: alert.outbound_transaction_count || 0,
                unique_inbound_counterparties: alert.unique_counterparties || 0
            },
            counterparty_indicators: alert.counterparty_indicators || {},
            alert_reasons: alert.alert_reasons || [],
            matched_typologies: alert.matched_typologies || [],
            customer_interaction: alert.customer_interaction || null
        };

        // Call AI service
        const llmService = require('../services/llm.service');
        const result = await llmService.generateSarNarrative(
            amlData,
            feedback || '',
            sar.sar_id,
            req.user.id
        );

        // Update SAR with generated narrative
        const updateSarWhereClause = isUUID(id) ? 'id = $5' : 'sar_id = $5';
        await query(
            `UPDATE sar_reports
             SET narrative_draft = $1, audit_trail = $2, analyst_feedback = $3,
                 generation_timestamp = CURRENT_TIMESTAMP, generated_by_model = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE ${updateSarWhereClause}`,
            [result.narrative, JSON.stringify(result.auditTrail), feedback, result.modelUsed, id]
        );

        // Log audit event
        await query(
            `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            ['SAR_NARRATIVE_GENERATED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', sar.id,
             JSON.stringify({ sar_id: sar.sar_id, model: result.modelUsed, has_feedback: !!feedback }),
             req.ip]
        );

        res.json({
            narrative: result.narrative,
            auditTrail: result.auditTrail,
            generatedAt: result.generatedAt,
            modelUsed: result.modelUsed
        });
    } catch (error) {
        next(error);
    }
};

exports.regenerateNarrative = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        const whereClause = isUUID(id) ? 's.id = $1' : 's.sar_id = $1';

        if (!feedback) {
            return res.status(400).json({ error: 'Feedback is required for regeneration' });
        }

        // Get SAR with current narrative
        const sarResult = await query(
            `SELECT s.*, a.alert_id as alert_code FROM sar_reports s
             JOIN alerts a ON s.alert_id = a.id
             WHERE ${whereClause}`,
            [id]
        );

        if (sarResult.rows.length === 0) {
            return res.status(404).json({ error: 'SAR not found' });
        }

        const sar = sarResult.rows[0];

        // Ownership check: analysts can only regenerate for their own SARs
        if (req.user.role === 'analyst' && sar.created_by !== req.user.id) {
            return res.status(403).json({ error: 'You can only regenerate narratives for SARs you created' });
        }

        if (!sar.narrative_draft) {
            return res.status(400).json({ error: 'No existing narrative to regenerate. Use generate first.' });
        }

        // Get alert data
        const alertResult = await query(
            `SELECT a.*, c.*, acc.account_number, acc.account_type, acc.account_id as acc_id
             FROM alerts a
             JOIN customers c ON a.customer_id = c.id
             LEFT JOIN accounts acc ON a.account_id = acc.id
             WHERE a.id = $1`,
            [sar.alert_id]
        );

        const alert = alertResult.rows[0];

        // Format AML data
        const amlData = {
            alert_metadata: {
                alert_id: alert.alert_id,
                alert_type: alert.alert_type,
                alert_priority: alert.alert_priority,
                alert_status: alert.alert_status,
                alert_generated_timestamp: alert.alert_generated_at,
                monitoring_system: alert.monitoring_system,
                triggering_rules: alert.triggering_rules,
                risk_rating: alert.risk_rating,
                jurisdiction: alert.jurisdiction
            },
            customer_profile: {
                customer_id: alert.customer_id,
                customer_type: alert.customer_type,
                full_name: alert.full_name,
                date_of_birth: alert.date_of_birth,
                nationality: alert.nationality,
                occupation: alert.occupation,
                kyc_risk_rating: alert.kyc_risk_rating,
                relationship_start_date: alert.relationship_start_date,
                expected_monthly_turnover: {
                    min: parseFloat(alert.expected_monthly_turnover_min) || 0,
                    max: parseFloat(alert.expected_monthly_turnover_max) || 0,
                    currency: 'INR'
                }
            },
            accounts: [{
                account_id: alert.acc_id,
                account_type: alert.account_type,
                account_status: 'Active',
                primary_holder: alert.full_name
            }],
            transaction_summary: {
                review_period: {
                    from: alert.review_period_start,
                    to: alert.review_period_end
                },
                total_inbound_amount: parseFloat(alert.total_inbound_amount) || 0,
                total_outbound_amount: parseFloat(alert.total_outbound_amount) || 0,
                currency: 'INR',
                inbound_transaction_count: alert.inbound_transaction_count || 0,
                outbound_transaction_count: alert.outbound_transaction_count || 0,
                unique_inbound_counterparties: alert.unique_counterparties || 0
            },
            counterparty_indicators: alert.counterparty_indicators || {},
            alert_reasons: alert.alert_reasons || [],
            matched_typologies: alert.matched_typologies || [],
            customer_interaction: alert.customer_interaction || null
        };

        // Call AI service for regeneration
        const llmService = require('../services/llm.service');
        const result = await llmService.regenerateSarNarrative(
            amlData,
            sar.narrative_draft,
            feedback,
            sar.sar_id,
            req.user.id
        );

        // Update SAR
        const updateWhereClause = isUUID(id) ? 'id = $4' : 'sar_id = $4';
        await query(
            `UPDATE sar_reports
             SET narrative_draft = $1, audit_trail = $2, analyst_feedback = $3,
                 generation_timestamp = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE ${updateWhereClause}`,
            [result.narrative, JSON.stringify(result.auditTrail), feedback, id]
        );

        // Log audit event
        await query(
            `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            ['SAR_NARRATIVE_REGENERATED', 'SAR', req.user.id, req.user.email, req.user.role, 'SAR', sar.id,
             JSON.stringify({ sar_id: sar.sar_id, feedback }),
             req.ip]
        );

        res.json({
            narrative: result.narrative,
            auditTrail: result.auditTrail,
            generatedAt: result.generatedAt,
            modelUsed: result.modelUsed
        });
    } catch (error) {
        next(error);
    }
};

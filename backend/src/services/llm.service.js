const logger = require('../utils/logger');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Service for interacting with the FastAPI AI backend for SAR generation
 */
class LLMService {
    /**
     * Generate SAR narrative using the AI workflow
     * @param {Object} alertData - The structured AML alert data
     * @param {string} feedback - Optional analyst feedback
     * @param {string} sarId - Optional SAR ID for logging
     * @param {string} userId - Optional user ID for audit
     * @returns {Promise<{narrative: string, auditTrail: Array, generatedAt: string}>}
     */
    async generateSarNarrative(alertData, feedback = '', sarId = null, userId = null) {
        try {
            logger.info(`Calling AI service at ${AI_SERVICE_URL}/generate`);

            const response = await fetch(`${AI_SERVICE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    alert_data: alertData,
                    analyst_feedback: feedback,
                    sar_id: sarId,
                    user_id: userId
                })
            });

            logger.info(`AI service response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`AI service error response: ${errorText}`);
                let error;
                try {
                    error = JSON.parse(errorText);
                } catch {
                    error = { detail: errorText };
                }
                throw new Error(error.detail || `AI service error: ${response.status}`);
            }

            const result = await response.json();
            logger.info('AI service response received successfully');

            return {
                narrative: result.narrative,
                auditTrail: result.audit_trail,
                generatedAt: result.generated_at,
                modelUsed: result.model_used
            };
        } catch (error) {
            logger.error('AI service error:', error.message);
            throw new Error(`Failed to generate SAR narrative: ${error.message}`);
        }
    }

    /**
     * Regenerate SAR narrative with analyst feedback
     * @param {Object} alertData - The structured AML alert data
     * @param {string} currentNarrative - Current narrative text
     * @param {string} feedback - Analyst feedback for regeneration
     * @param {string} sarId - Optional SAR ID for logging
     * @param {string} userId - Optional user ID for audit
     * @returns {Promise<{narrative: string, auditTrail: Array, generatedAt: string}>}
     */
    async regenerateSarNarrative(alertData, currentNarrative, feedback, sarId = null, userId = null) {
        try {
            const response = await fetch(`${AI_SERVICE_URL}/regenerate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    alert_data: alertData,
                    current_narrative: currentNarrative,
                    analyst_feedback: feedback,
                    sar_id: sarId,
                    user_id: userId
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `AI service error: ${response.status}`);
            }

            const result = await response.json();

            return {
                narrative: result.narrative,
                auditTrail: result.audit_trail,
                generatedAt: result.generated_at,
                modelUsed: result.model_used
            };
        } catch (error) {
            logger.error('AI service regeneration error:', error);
            throw new Error(`Failed to regenerate SAR narrative: ${error.message}`);
        }
    }

    /**
     * Check AI service health
     * @returns {Promise<{healthy: boolean, databaseConnected: boolean}>}
     */
    async checkHealth() {
        try {
            const response = await fetch(`${AI_SERVICE_URL}/health`);

            if (!response.ok) {
                return { healthy: false, databaseConnected: false };
            }

            const result = await response.json();

            return {
                healthy: result.status === 'healthy',
                databaseConnected: result.database_connected
            };
        } catch (error) {
            logger.error('AI service health check failed:', error);
            return { healthy: false, databaseConnected: false };
        }
    }
}

module.exports = new LLMService();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const logger = require('../utils/logger');

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const result = await query(
            'SELECT id, employee_id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if (!user.is_active) {
            return res.status(401).json({ error: 'Account is disabled' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const tokens = generateTokens(user.id);

        // Update last login
        await query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Log audit event
        await query(
            `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, details, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            ['USER_LOGIN', 'Authentication', user.id, user.email, user.role, 'User',
             JSON.stringify({ login_method: 'password', success: true }),
             req.ip]
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                employeeId: user.employee_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            },
            ...tokens
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Verify user still exists and is active
        const result = await query(
            'SELECT id, is_active FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0 || !result.rows[0].is_active) {
            return res.status(401).json({ error: 'User not found or disabled' });
        }

        const tokens = generateTokens(decoded.userId);

        res.json(tokens);
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // Log audit event
        await query(
            `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, details, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            ['USER_LOGOUT', 'Authentication', req.user.id, req.user.email, req.user.role, 'User',
             JSON.stringify({ success: true }),
             req.ip]
        );

        res.json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, employee_id, email, first_name, last_name, role, department, last_login, created_at
             FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Get current password hash
        const result = await query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.user.id]
        );

        const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newPasswordHash, req.user.id]
        );

        // Log audit event
        await query(
            `INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, details, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            ['PASSWORD_CHANGED', 'Authentication', req.user.id, req.user.email, req.user.role, 'User',
             JSON.stringify({ success: true }),
             req.ip]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'sar_generator',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug(`Executed query: ${text.substring(0, 100)}... Duration: ${duration}ms`);
        return result;
    } catch (error) {
        logger.error(`Query error: ${error.message}`);
        throw error;
    }
};

const getClient = async () => {
    const client = await pool.connect();
    const originalQuery = client.query.bind(client);
    const originalRelease = client.release.bind(client);

    client.query = async (...args) => {
        return originalQuery(...args);
    };

    client.release = () => {
        return originalRelease();
    };

    return client;
};

const testConnection = async () => {
    try {
        const result = await query('SELECT NOW()');
        logger.info(`Database connected: ${result.rows[0].now}`);
        return true;
    } catch (error) {
        logger.error('Database connection failed:', error.message);
        throw error;
    }
};

module.exports = {
    query,
    getClient,
    pool,
    testConnection
};

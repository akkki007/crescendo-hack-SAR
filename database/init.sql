-- SAR Narrative Generator - Database Initialization Script
-- Run this script to create and initialize the PostgreSQL database

-- Create database (run as superuser)
-- CREATE DATABASE sar_generator;

-- Connect to the database and run schema and seed
-- \c sar_generator

-- Run schema first
\i schema.sql

-- Run seed data
\i seed.sql

-- Verify installation
SELECT 'Database initialized successfully!' as status;
SELECT 'Tables created:' as info, count(*) as count FROM information_schema.tables WHERE table_schema = 'public';
SELECT 'Users:' as entity, count(*) as count FROM users
UNION ALL
SELECT 'Customers:', count(*) FROM customers
UNION ALL
SELECT 'Accounts:', count(*) FROM accounts
UNION ALL
SELECT 'Transactions:', count(*) FROM transactions
UNION ALL
SELECT 'Alerts:', count(*) FROM alerts;

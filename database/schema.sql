-- SAR Narrative Generator Database Schema
-- PostgreSQL Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- USERS & AUTHENTICATION
-- =========================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('analyst', 'senior_analyst', 'compliance_officer', 'admin')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =========================================================
-- CUSTOMERS
-- =========================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(20) UNIQUE NOT NULL,
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('Individual', 'Corporate', 'Trust', 'Partnership')),

    -- Personal Information (for individuals)
    title VARCHAR(10),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(300) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),

    -- Corporate Information (for non-individuals)
    company_name VARCHAR(255),
    registration_number VARCHAR(50),
    incorporation_date DATE,

    -- Contact Information
    email VARCHAR(255),
    phone_primary VARCHAR(20),
    phone_secondary VARCHAR(20),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',

    -- KYC Information
    nationality VARCHAR(100),
    pan_number VARCHAR(20),
    aadhaar_number VARCHAR(20),
    passport_number VARCHAR(20),
    occupation VARCHAR(100),
    employer_name VARCHAR(255),
    annual_income_range VARCHAR(50),
    source_of_funds VARCHAR(255),

    -- Risk & Compliance
    kyc_status VARCHAR(20) DEFAULT 'Pending' CHECK (kyc_status IN ('Pending', 'Verified', 'Expired', 'Rejected')),
    kyc_verified_date DATE,
    kyc_expiry_date DATE,
    kyc_risk_rating VARCHAR(20) DEFAULT 'Medium' CHECK (kyc_risk_rating IN ('Low', 'Medium', 'High', 'Very High')),
    pep_status BOOLEAN DEFAULT false,
    sanctions_status BOOLEAN DEFAULT false,

    -- Relationship
    relationship_start_date DATE NOT NULL,
    relationship_manager_id UUID REFERENCES users(id),
    customer_segment VARCHAR(50),

    -- Expected Behavior
    expected_monthly_turnover_min DECIMAL(18, 2),
    expected_monthly_turnover_max DECIMAL(18, 2),
    expected_transaction_frequency VARCHAR(50),

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_customer_id ON customers(customer_id);
CREATE INDEX idx_customers_pan ON customers(pan_number);
CREATE INDEX idx_customers_kyc_risk ON customers(kyc_risk_rating);
CREATE INDEX idx_customers_type ON customers(customer_type);

-- =========================================================
-- ACCOUNTS
-- =========================================================

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id VARCHAR(20) UNIQUE NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),

    -- Account Details
    account_type VARCHAR(30) NOT NULL CHECK (account_type IN ('Savings', 'Current', 'Fixed Deposit', 'Recurring Deposit', 'NRE', 'NRO', 'Loan', 'Credit Card')),
    account_status VARCHAR(20) DEFAULT 'Active' CHECK (account_status IN ('Active', 'Dormant', 'Frozen', 'Closed', 'Blocked')),

    -- Branch Information
    branch_code VARCHAR(10),
    branch_name VARCHAR(100),
    ifsc_code VARCHAR(15),

    -- Balance Information
    current_balance DECIMAL(18, 2) DEFAULT 0,
    available_balance DECIMAL(18, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',

    -- Account Limits
    daily_transaction_limit DECIMAL(18, 2),
    monthly_transaction_limit DECIMAL(18, 2),

    -- Dates
    open_date DATE NOT NULL,
    last_transaction_date DATE,
    closure_date DATE,

    -- Joint Account Details
    is_joint_account BOOLEAN DEFAULT false,
    primary_holder_name VARCHAR(255),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_account_id ON accounts(account_id);
CREATE INDEX idx_accounts_customer_id ON accounts(customer_id);
CREATE INDEX idx_accounts_type ON accounts(account_type);
CREATE INDEX idx_accounts_status ON accounts(account_status);

-- =========================================================
-- TRANSACTIONS
-- =========================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(30) UNIQUE NOT NULL,
    account_id UUID NOT NULL REFERENCES accounts(id),

    -- Transaction Details
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('Credit', 'Debit', 'Transfer_In', 'Transfer_Out', 'Cash_Deposit', 'Cash_Withdrawal', 'NEFT', 'RTGS', 'IMPS', 'UPI', 'Wire_Transfer', 'Cheque', 'ATM', 'POS', 'International_Transfer')),
    transaction_status VARCHAR(20) DEFAULT 'Completed' CHECK (transaction_status IN ('Pending', 'Completed', 'Failed', 'Reversed', 'On_Hold')),

    -- Amount
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    exchange_rate DECIMAL(10, 6),
    amount_in_base_currency DECIMAL(18, 2),

    -- Counterparty Information
    counterparty_name VARCHAR(255),
    counterparty_account_number VARCHAR(30),
    counterparty_bank_name VARCHAR(255),
    counterparty_ifsc VARCHAR(15),
    counterparty_country VARCHAR(100),

    -- Transaction Details
    description VARCHAR(500),
    reference_number VARCHAR(50),
    channel VARCHAR(30) CHECK (channel IN ('Branch', 'ATM', 'Internet_Banking', 'Mobile_Banking', 'UPI', 'POS', 'Wire', 'Cheque')),

    -- Location Information
    transaction_location VARCHAR(255),
    ip_address VARCHAR(50),
    device_id VARCHAR(100),

    -- Timestamps
    transaction_date DATE NOT NULL,
    transaction_timestamp TIMESTAMP NOT NULL,
    value_date DATE,
    posting_date DATE,

    -- Balance After Transaction
    balance_after DECIMAL(18, 2),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_amount ON transactions(amount);
CREATE INDEX idx_transactions_counterparty ON transactions(counterparty_name);

-- =========================================================
-- ALERTS
-- =========================================================

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    account_id UUID REFERENCES accounts(id),

    -- Alert Classification
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('Suspicious Transaction', 'Structuring', 'Rapid Movement', 'High Value', 'Cross Border', 'PEP Activity', 'Sanctions Match', 'Unusual Pattern', 'Identity Alert', 'Fraud Alert')),
    alert_category VARCHAR(50) CHECK (alert_category IN ('AML', 'Fraud', 'Sanctions', 'KYC', 'Regulatory')),
    alert_priority VARCHAR(20) DEFAULT 'Medium' CHECK (alert_priority IN ('Low', 'Medium', 'High', 'Critical')),
    alert_status VARCHAR(30) DEFAULT 'Open' CHECK (alert_status IN ('Open', 'Under_Review', 'Escalated', 'SAR_Filed', 'Closed_No_Action', 'Closed_False_Positive')),

    -- Risk Assessment
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_rating VARCHAR(20) CHECK (risk_rating IN ('Low', 'Medium', 'High', 'Critical')),

    -- Monitoring Details
    monitoring_system VARCHAR(100),
    triggering_rules JSONB,

    -- Review Period
    review_period_start DATE,
    review_period_end DATE,

    -- Transaction Summary (for the alert period)
    total_inbound_amount DECIMAL(18, 2),
    total_outbound_amount DECIMAL(18, 2),
    inbound_transaction_count INTEGER,
    outbound_transaction_count INTEGER,
    unique_counterparties INTEGER,

    -- Alert Reasons
    alert_reasons JSONB,
    matched_typologies JSONB,

    -- Counterparty Indicators
    counterparty_indicators JSONB,

    -- Customer Interaction
    customer_interaction JSONB,

    -- Timestamps
    alert_generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_reviewed_at TIMESTAMP,
    escalated_at TIMESTAMP,
    closed_at TIMESTAMP,

    -- Assignment
    assigned_to UUID REFERENCES users(id),
    escalated_to UUID REFERENCES users(id),

    -- Jurisdiction
    jurisdiction VARCHAR(10) DEFAULT 'IN',

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_alert_id ON alerts(alert_id);
CREATE INDEX idx_alerts_customer_id ON alerts(customer_id);
CREATE INDEX idx_alerts_status ON alerts(alert_status);
CREATE INDEX idx_alerts_priority ON alerts(alert_priority);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_assigned ON alerts(assigned_to);
CREATE INDEX idx_alerts_generated_at ON alerts(alert_generated_at);

-- =========================================================
-- SAR REPORTS
-- =========================================================

CREATE TABLE sar_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sar_id VARCHAR(30) UNIQUE NOT NULL,
    alert_id UUID NOT NULL REFERENCES alerts(id),
    customer_id UUID NOT NULL REFERENCES customers(id),

    -- SAR Status
    sar_status VARCHAR(30) DEFAULT 'Draft' CHECK (sar_status IN ('Draft', 'Pending_Review', 'Under_Review', 'Revision_Required', 'Approved', 'Filed', 'Rejected')),

    -- SAR Content
    narrative_draft TEXT,
    narrative_final TEXT,

    -- Audit Trail (JSON of all edits and changes)
    audit_trail JSONB,

    -- Generation Details
    generated_by_model VARCHAR(100),
    generation_timestamp TIMESTAMP,

    -- Review Workflow
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),

    -- Review Comments
    analyst_feedback TEXT,
    reviewer_comments TEXT,

    -- Filing Details
    filing_reference VARCHAR(50),
    filed_date DATE,
    regulatory_body VARCHAR(100),

    -- Document Storage
    pdf_path VARCHAR(500),
    pdf_hash VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    filed_at TIMESTAMP
);

CREATE INDEX idx_sar_reports_sar_id ON sar_reports(sar_id);
CREATE INDEX idx_sar_reports_alert_id ON sar_reports(alert_id);
CREATE INDEX idx_sar_reports_customer_id ON sar_reports(customer_id);
CREATE INDEX idx_sar_reports_status ON sar_reports(sar_status);
CREATE INDEX idx_sar_reports_created_by ON sar_reports(created_by);

-- =========================================================
-- AUDIT LOGS
-- =========================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Action Details
    action VARCHAR(100) NOT NULL,
    action_category VARCHAR(50) CHECK (action_category IN ('Authentication', 'Alert', 'SAR', 'Customer', 'Transaction', 'System', 'Admin')),

    -- User Information
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    user_role VARCHAR(50),

    -- Entity Information
    entity_type VARCHAR(50),
    entity_id UUID,

    -- Details
    details JSONB,
    old_values JSONB,
    new_values JSONB,

    -- Request Information
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    session_id VARCHAR(100),

    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =========================================================
-- TYPOLOGIES (Reference Table)
-- =========================================================

CREATE TABLE typologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    typology_code VARCHAR(30) UNIQUE NOT NULL,
    typology_name VARCHAR(100) NOT NULL,
    description TEXT,
    risk_weight INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- ALERT RULES (Reference Table)
-- =========================================================

CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_code VARCHAR(30) UNIQUE NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    rule_category VARCHAR(50),
    description TEXT,
    threshold_value DECIMAL(18, 2),
    threshold_unit VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- SESSIONS (For JWT Token Management)
-- =========================================================

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    is_valid BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);

-- =========================================================
-- FUNCTIONS & TRIGGERS
-- =========================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sar_reports_updated_at BEFORE UPDATE ON sar_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- VIEWS
-- =========================================================

-- View for alert dashboard
CREATE VIEW alert_dashboard AS
SELECT
    a.id,
    a.alert_id,
    a.alert_type,
    a.alert_priority,
    a.alert_status,
    a.risk_rating,
    a.alert_generated_at,
    c.customer_id,
    c.full_name as customer_name,
    c.customer_type,
    c.kyc_risk_rating,
    u.first_name || ' ' || u.last_name as assigned_analyst,
    a.total_inbound_amount,
    a.total_outbound_amount
FROM alerts a
JOIN customers c ON a.customer_id = c.id
LEFT JOIN users u ON a.assigned_to = u.id;

-- View for SAR workflow
CREATE VIEW sar_workflow AS
SELECT
    s.id,
    s.sar_id,
    s.sar_status,
    a.alert_id,
    a.alert_type,
    c.customer_id,
    c.full_name as customer_name,
    creator.first_name || ' ' || creator.last_name as created_by_name,
    reviewer.first_name || ' ' || reviewer.last_name as reviewed_by_name,
    approver.first_name || ' ' || approver.last_name as approved_by_name,
    s.created_at,
    s.submitted_at,
    s.approved_at
FROM sar_reports s
JOIN alerts a ON s.alert_id = a.id
JOIN customers c ON s.customer_id = c.id
LEFT JOIN users creator ON s.created_by = creator.id
LEFT JOIN users reviewer ON s.reviewed_by = reviewer.id
LEFT JOIN users approver ON s.approved_by = approver.id;

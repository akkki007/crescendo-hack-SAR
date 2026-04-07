-- SAR Narrative Generator - Seed Data
-- Realistic Indian Banking Customer Data

-- =========================================================
-- USERS (Compliance Team)
-- =========================================================

INSERT INTO users (employee_id, email, password_hash, first_name, last_name, role, department, is_active) VALUES
('EMP001', 'rajesh.sharma@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Rajesh', 'Sharma', 'admin', 'Compliance', true),
('EMP002', 'priya.patel@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Priya', 'Patel', 'compliance_officer', 'Compliance', true),
('EMP003', 'amit.kumar@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Amit', 'Kumar', 'senior_analyst', 'AML Operations', true),
('EMP004', 'sneha.reddy@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Sneha', 'Reddy', 'analyst', 'AML Operations', true),
('EMP005', 'vikram.singh@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Vikram', 'Singh', 'analyst', 'AML Operations', true),
('EMP006', 'ananya.gupta@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Ananya', 'Gupta', 'analyst', 'AML Operations', true),
('EMP007', 'karthik.nair@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Karthik', 'Nair', 'senior_analyst', 'Fraud Detection', true),
('EMP008', 'divya.menon@bank.com', '$2a$10$GL/fEofLfeMV4Jv2iK23peoGBN1/tp0Ni.ljCSFslpG9zqxU9wVui', 'Divya', 'Menon', 'analyst', 'Fraud Detection', true);

-- =========================================================
-- TYPOLOGIES
-- =========================================================

INSERT INTO typologies (typology_code, typology_name, description, risk_weight, is_active) VALUES
('TYP-LAYERING', 'Layering', 'Movement of funds through multiple accounts to obscure the trail', 80, true),
('TYP-FUNNEL', 'Funnel Account Behavior', 'Multiple parties depositing into a single account with rapid withdrawal', 75, true),
('TYP-STRUCTURING', 'Structuring', 'Breaking large transactions into smaller amounts to avoid reporting thresholds', 85, true),
('TYP-SMURFING', 'Smurfing', 'Multiple individuals making deposits below threshold amounts', 70, true),
('TYP-ROUND-TRIP', 'Round Tripping', 'Funds leaving and returning through different channels', 65, true),
('TYP-TRADE-ML', 'Trade-Based Money Laundering', 'Over or under-invoicing of goods and services', 90, true),
('TYP-SHELL-CO', 'Shell Company Activity', 'Transactions through companies with no apparent business purpose', 85, true),
('TYP-RAPID-MOVE', 'Rapid Movement of Funds', 'Quick transfer of funds shortly after receipt', 60, true),
('TYP-DORMANT', 'Dormant Account Activation', 'Sudden activity in previously inactive accounts', 55, true),
('TYP-CROSS-BORDER', 'Cross-Border Suspicious', 'Unusual international transaction patterns', 70, true);

-- =========================================================
-- ALERT RULES
-- =========================================================

INSERT INTO alert_rules (rule_code, rule_name, rule_category, description, threshold_value, threshold_unit, is_active) VALUES
('AML-STR-001', 'High Value Transaction', 'AML', 'Single transaction exceeding threshold', 1000000.00, 'INR', true),
('AML-STR-022', 'Profile Deviation', 'AML', 'Transaction value inconsistent with customer profile', 500000.00, 'INR', true),
('AML-HT-014', 'Multiple Counterparties', 'AML', 'Multiple unrelated parties sending funds', 10, 'COUNT', true),
('AML-INT-031', 'International Rapid Transfer', 'AML', 'Rapid movement to international destination', 48, 'HOURS', true),
('AML-CTR-005', 'Cash Transaction Report', 'AML', 'Cash transactions requiring CTR filing', 1000000.00, 'INR', true),
('FRD-ACC-001', 'Account Takeover Pattern', 'Fraud', 'Suspicious login and transaction pattern', NULL, NULL, true),
('FRD-CNP-002', 'Card Not Present Fraud', 'Fraud', 'Multiple CNP transactions from different locations', NULL, NULL, true),
('SAN-PEP-001', 'PEP Transaction Monitor', 'Sanctions', 'Transactions involving politically exposed persons', NULL, NULL, true),
('SAN-WL-001', 'Watchlist Match', 'Sanctions', 'Name match against sanctions watchlist', NULL, NULL, true),
('KYC-EXP-001', 'KYC Expiry Alert', 'KYC', 'Customer KYC documents expired or expiring', NULL, NULL, true);

-- =========================================================
-- CUSTOMERS
-- =========================================================

-- Customer 1: Primary suspicious customer (matches the alert scenario)
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary, phone_secondary,
    address_line1, address_line2, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-458921', 'Individual', 'Mr', 'Akshay', NULL, 'Verma', 'Akshay Verma',
    '1988-07-14', 'Male', 'akshay.verma88@gmail.com', '+91-9876543210', '+91-11-23456789',
    '204, Sunrise Apartments', 'Sector 18, Rohini', 'New Delhi', 'Delhi', '110085', 'India',
    'Indian', 'AVEPV1234K', '1234-5678-9012', 'Salaried Employee', 'TechSoft Solutions Pvt Ltd',
    '3-5 Lakhs', 'Salary', 'Verified', '2024-03-15', '2027-03-15',
    'Medium', false, false, '2019-03-18',
    200000.00, 300000.00, 'Monthly', true
);

-- Customer 2: Corporate customer
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, address_line2, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-892341', 'Corporate', 'Bharath Exports Pvt Ltd', 'Bharath Exports Pvt Ltd', 'U51909DL2015PTC284521', '2015-08-20',
    'accounts@bharathexports.com', '+91-11-45678901', '15th Floor, Tower B', 'Connaught Place', 'New Delhi', 'Delhi', '110001', 'India',
    'AADCB1234M', 'Verified', '2024-01-10', '2027-01-10', 'Medium',
    false, false, '2015-10-01',
    5000000.00, 15000000.00, 'Daily', true
);

-- Customer 3: High-value individual customer
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, address_line2, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-234567', 'Individual', 'Mrs', 'Meera', 'Lakshmi', 'Krishnamurthy', 'Meera Lakshmi Krishnamurthy',
    '1975-12-03', 'Female', 'meera.k@krishcorp.com', '+91-9845123456',
    '45, 3rd Cross Road', 'Indiranagar', 'Bangalore', 'Karnataka', '560038', 'India',
    'Indian', 'AKMPK5678L', '9876-5432-1098', 'Business Owner', 'Self Employed',
    'Above 1 Crore', 'Business Income', 'Verified', '2023-06-01', '2026-06-01',
    'Low', false, false, '2018-02-14',
    2000000.00, 5000000.00, 'Weekly', true
);

-- Customer 4: NRI customer
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, address_line2, city, state, postal_code, country,
    nationality, pan_number, passport_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-345678', 'Individual', 'Mr', 'Sanjay', 'Ramesh', 'Desai', 'Sanjay Ramesh Desai',
    '1982-04-22', 'Male', 'sanjay.desai@techfirm.ae', '+971-50-1234567',
    'Apt 2301, Marina Tower', 'Dubai Marina', 'Dubai', 'Dubai', '00000', 'United Arab Emirates',
    'Indian', 'BMPSD9012P', 'K1234567', 'Software Engineer', 'TechFirm LLC',
    '50-75 Lakhs', 'Employment Income', 'Verified', '2024-02-20', '2027-02-20',
    'Medium', false, false, '2020-05-10',
    500000.00, 1000000.00, 'Monthly', true
);

-- Customer 5: Retail customer
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-456789', 'Individual', 'Ms', 'Pooja', NULL, 'Agarwal', 'Pooja Agarwal',
    '1995-09-18', 'Female', 'pooja.agarwal95@outlook.com', '+91-9123456789',
    '78, Vaishali Nagar', 'Jaipur', 'Rajasthan', '302021', 'India',
    'Indian', 'AKMPA3456Q', '5678-1234-9012', 'Marketing Executive', 'Digital Media Solutions',
    '5-10 Lakhs', 'Salary', 'Verified', '2024-08-01', '2027-08-01',
    'Low', false, false, '2022-01-05',
    80000.00, 120000.00, 'Monthly', true
);

-- Customer 6: Suspicious corporate (shell company pattern)
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-567890', 'Corporate', 'Global Trade Ventures LLP', 'Global Trade Ventures LLP', 'AAI-2348', '2023-03-15',
    'info@globaltrade.in', '+91-22-34567890', 'Office 302, Trade Center', 'Mumbai', 'Maharashtra', '400001', 'India',
    'AAHFG1234N', 'Verified', '2024-04-01', '2027-04-01', 'High',
    false, false, '2023-06-01',
    10000000.00, 50000000.00, 'Daily', true
);

-- Customer 7: Senior citizen customer
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-678901', 'Individual', 'Mr', 'Ramakrishna', 'Venkata', 'Rao', 'Ramakrishna Venkata Rao',
    '1952-11-30', 'Male', 'rv.rao52@gmail.com', '+91-9441234567',
    '12-5-89, Prakash Nagar', 'Hyderabad', 'Telangana', '500016', 'India',
    'Indian', 'AEOPR5678M', '3456-7890-1234', 'Retired',
    '10-25 Lakhs', 'Pension and Investments', 'Verified', '2023-12-15', '2026-12-15',
    'Low', false, false, '2010-04-01',
    150000.00, 300000.00, 'Monthly', true
);

-- Customer 8: Young professional
INSERT INTO customers (
    customer_id, customer_type, title, first_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-789012', 'Individual', 'Mr', 'Arjun', 'Malhotra', 'Arjun Malhotra',
    '1998-02-14', 'Male', 'arjun.malhotra@gmail.com', '+91-9876123450',
    'Flat 5B, Green Valley Apartments', 'Pune', 'Maharashtra', '411006', 'India',
    'Indian', 'BKZPM1234R', '8901-2345-6789', 'Data Analyst', 'Analytics Corp India',
    '10-15 Lakhs', 'Salary', 'Verified', '2024-06-01', '2027-06-01',
    'Low', false, false, '2023-08-15',
    100000.00, 150000.00, 'Monthly', true
);

-- Customer 9: Real estate business
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-890123', 'Corporate', 'Pinnacle Realty Developers', 'Pinnacle Realty Developers Pvt Ltd', 'U45201MH2012PTC234567', '2012-06-15',
    'finance@pinnaclerealty.in', '+91-22-45678901', '8th Floor, Phoenix Tower', 'Mumbai', 'Maharashtra', '400013', 'India',
    'AADCP7890K', 'Verified', '2024-05-01', '2027-05-01', 'High',
    false, false, '2012-08-01',
    25000000.00, 100000000.00, 'Weekly', true
);

-- Customer 10: Doctor with clinic
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-901234', 'Individual', 'Dr', 'Sunita', 'Devi', 'Choudhury', 'Dr. Sunita Devi Choudhury',
    '1970-05-08', 'Female', 'dr.sunita.choudhury@healthclinic.in', '+91-9830123456',
    '45, Park Street', 'Kolkata', 'West Bengal', '700016', 'India',
    'Indian', 'AHEPC5678N', '2345-6789-0123', 'Doctor', 'Self Employed - Health Care Clinic',
    '25-50 Lakhs', 'Professional Income', 'Verified', '2024-01-15', '2027-01-15',
    'Low', false, false, '2015-03-20',
    500000.00, 1000000.00, 'Weekly', true
);

-- =========================================================
-- ACCOUNTS
-- =========================================================

-- Accounts for Customer 1 (Akshay Verma - Suspicious)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-998877', '10234567891', id, 'Savings', 'Active', 'DEL001', 'Rohini Branch', 'DEMO0001234', 215000.00, 215000.00, 'INR', 500000.00, 2000000.00, '2019-03-18', '2026-01-11', false, 'Akshay Verma'
FROM customers WHERE customer_id = 'CUST-458921';

-- Accounts for Customer 2 (Bharath Exports)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-112233', '20345678901', id, 'Current', 'Active', 'DEL002', 'CP Main Branch', 'DEMO0002345', 8750000.00, 8500000.00, 'INR', 10000000.00, 50000000.00, '2015-10-01', '2026-01-14', false, 'Bharath Exports Pvt Ltd'
FROM customers WHERE customer_id = 'CUST-892341';

-- Accounts for Customer 3 (Meera Krishnamurthy)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-223344', '30456789012', id, 'Savings', 'Active', 'BLR001', 'Indiranagar Branch', 'DEMO0003456', 4520000.00, 4520000.00, 'INR', 2000000.00, 10000000.00, '2018-02-14', '2026-01-10', false, 'Meera Lakshmi Krishnamurthy'
FROM customers WHERE customer_id = 'CUST-234567';

INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-223345', '30456789013', id, 'Current', 'Active', 'BLR001', 'Indiranagar Branch', 'DEMO0003456', 12500000.00, 12000000.00, 'INR', 5000000.00, 25000000.00, '2018-03-01', '2026-01-13', false, 'Meera Lakshmi Krishnamurthy'
FROM customers WHERE customer_id = 'CUST-234567';

-- Accounts for Customer 4 (Sanjay Desai - NRI)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-334455', '40567890123', id, 'NRE', 'Active', 'MUM001', 'Fort Branch', 'DEMO0004567', 2850000.00, 2850000.00, 'INR', 1000000.00, 5000000.00, '2020-05-10', '2026-01-08', false, 'Sanjay Ramesh Desai'
FROM customers WHERE customer_id = 'CUST-345678';

-- Accounts for Customer 5 (Pooja Agarwal)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-445566', '50678901234', id, 'Savings', 'Active', 'JAI001', 'Vaishali Branch', 'DEMO0005678', 125000.00, 125000.00, 'INR', 200000.00, 500000.00, '2022-01-05', '2026-01-12', false, 'Pooja Agarwal'
FROM customers WHERE customer_id = 'CUST-456789';

-- Accounts for Customer 6 (Global Trade Ventures - Suspicious Corporate)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-556677', '60789012345', id, 'Current', 'Active', 'MUM002', 'Trade Center Branch', 'DEMO0006789', 45000000.00, 44000000.00, 'INR', 50000000.00, 200000000.00, '2023-06-01', '2026-01-14', false, 'Global Trade Ventures LLP'
FROM customers WHERE customer_id = 'CUST-567890';

-- Accounts for Customer 7 (Ramakrishna Rao - Senior Citizen)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-667788', '70890123456', id, 'Savings', 'Active', 'HYD001', 'Prakash Nagar Branch', 'DEMO0007890', 3250000.00, 3250000.00, 'INR', 500000.00, 2000000.00, '2010-04-01', '2026-01-05', false, 'Ramakrishna Venkata Rao'
FROM customers WHERE customer_id = 'CUST-678901';

INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-667789', '70890123457', id, 'Fixed Deposit', 'Active', 'HYD001', 'Prakash Nagar Branch', 'DEMO0007890', 10000000.00, 0.00, 'INR', 0.00, 0.00, '2015-01-01', '2025-01-01', false, 'Ramakrishna Venkata Rao'
FROM customers WHERE customer_id = 'CUST-678901';

-- Accounts for Customer 8 (Arjun Malhotra)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-778899', '80901234567', id, 'Savings', 'Active', 'PUN001', 'Koregaon Park Branch', 'DEMO0008901', 185000.00, 185000.00, 'INR', 200000.00, 500000.00, '2023-08-15', '2026-01-11', false, 'Arjun Malhotra'
FROM customers WHERE customer_id = 'CUST-789012';

-- Accounts for Customer 9 (Pinnacle Realty)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-889900', '90012345678', id, 'Current', 'Active', 'MUM003', 'Lower Parel Branch', 'DEMO0009012', 125000000.00, 120000000.00, 'INR', 100000000.00, 500000000.00, '2012-08-01', '2026-01-14', false, 'Pinnacle Realty Developers Pvt Ltd'
FROM customers WHERE customer_id = 'CUST-890123';

-- Accounts for Customer 10 (Dr. Sunita Choudhury)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-990011', '10123456789', id, 'Savings', 'Active', 'KOL001', 'Park Street Branch', 'DEMO0010123', 2850000.00, 2850000.00, 'INR', 1000000.00, 5000000.00, '2015-03-20', '2026-01-09', false, 'Dr. Sunita Devi Choudhury'
FROM customers WHERE customer_id = 'CUST-901234';

-- =========================================================
-- TRANSACTIONS FOR ALERT 1: CUST-458921 (Akshay Verma) - ACC-998877
-- Alert: AML-ALERT-2026-000987 | Review: 2026-01-05 to 2026-01-11
-- 47 inbound NEFT + 3 outbound International_Transfer = 50 transactions
-- =========================================================

-- Inbound transactions from multiple unrelated counterparties (47 transactions)
INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
SELECT
    'TXN-2026-' || LPAD(row_num::text, 6, '0'),
    (SELECT id FROM accounts WHERE account_id = 'ACC-998877'),
    'NEFT',
    'Completed',
    amount,
    'INR',
    counterparty_name,
    counterparty_acc,
    counterparty_bank,
    'India',
    'Fund transfer',
    'NEFT' || LPAD(row_num::text, 12, '0'),
    'Internet_Banking',
    transaction_date::date,
    transaction_date,
    transaction_date::date,
    transaction_date::date,
    running_balance
FROM (
    VALUES
    (1, 105000.00, 'Rahul Mehta', '12345678901', 'HDFC Bank', '2026-01-05 09:15:00'::timestamp, 105000.00),
    (2, 115000.00, 'Vikram Shah', '23456789012', 'ICICI Bank', '2026-01-05 10:30:00'::timestamp, 220000.00),
    (3, 98000.00, 'Anil Kapoor', '34567890123', 'SBI', '2026-01-05 11:45:00'::timestamp, 318000.00),
    (4, 125000.00, 'Suresh Kumar', '45678901234', 'Axis Bank', '2026-01-05 14:20:00'::timestamp, 443000.00),
    (5, 87000.00, 'Deepak Sharma', '56789012345', 'Kotak Bank', '2026-01-05 15:30:00'::timestamp, 530000.00),
    (6, 112000.00, 'Manish Gupta', '67890123456', 'Yes Bank', '2026-01-05 16:45:00'::timestamp, 642000.00),
    (7, 95000.00, 'Rajat Verma', '78901234567', 'Punjab National Bank', '2026-01-06 09:00:00'::timestamp, 737000.00),
    (8, 108000.00, 'Amit Joshi', '89012345678', 'Bank of Baroda', '2026-01-06 10:15:00'::timestamp, 845000.00),
    (9, 92000.00, 'Nikhil Saxena', '90123456789', 'Canara Bank', '2026-01-06 11:30:00'::timestamp, 937000.00),
    (10, 118000.00, 'Pankaj Mishra', '01234567890', 'Union Bank', '2026-01-06 13:00:00'::timestamp, 1055000.00),
    (11, 103000.00, 'Sandeep Yadav', '11234567890', 'HDFC Bank', '2026-01-06 14:30:00'::timestamp, 1158000.00),
    (12, 97000.00, 'Gaurav Singh', '22345678901', 'ICICI Bank', '2026-01-06 15:45:00'::timestamp, 1255000.00),
    (13, 115000.00, 'Rohit Tiwari', '33456789012', 'SBI', '2026-01-07 09:15:00'::timestamp, 1370000.00),
    (14, 88000.00, 'Vishal Pandey', '44567890123', 'Axis Bank', '2026-01-07 10:30:00'::timestamp, 1458000.00),
    (15, 122000.00, 'Ajay Dubey', '55678901234', 'Kotak Bank', '2026-01-07 11:45:00'::timestamp, 1580000.00),
    (16, 94000.00, 'Saurabh Jain', '66789012345', 'Yes Bank', '2026-01-07 14:00:00'::timestamp, 1674000.00),
    (17, 110000.00, 'Mohit Agarwal', '77890123456', 'Punjab National Bank', '2026-01-07 15:15:00'::timestamp, 1784000.00),
    (18, 99000.00, 'Anuj Sinha', '88901234567', 'Bank of Baroda', '2026-01-07 16:30:00'::timestamp, 1883000.00),
    (19, 107000.00, 'Varun Bhatt', '99012345678', 'Canara Bank', '2026-01-08 09:00:00'::timestamp, 1990000.00),
    (20, 113000.00, 'Kunal Arora', '10123456789', 'Union Bank', '2026-01-08 10:15:00'::timestamp, 2103000.00),
    (21, 96000.00, 'Harsh Malhotra', '21234567890', 'HDFC Bank', '2026-01-08 11:30:00'::timestamp, 2199000.00),
    (22, 119000.00, 'Tarun Khanna', '32345678901', 'ICICI Bank', '2026-01-08 13:45:00'::timestamp, 2318000.00),
    (23, 91000.00, 'Yash Bhatia', '43456789012', 'SBI', '2026-01-08 15:00:00'::timestamp, 2409000.00),
    (24, 106000.00, 'Dev Chopra', '54567890123', 'Axis Bank', '2026-01-08 16:15:00'::timestamp, 2515000.00),
    (25, 102000.00, 'Karan Mehra', '65678901234', 'Kotak Bank', '2026-01-09 09:30:00'::timestamp, 2617000.00),
    (26, 114000.00, 'Aryan Sethi', '76789012345', 'Yes Bank', '2026-01-09 10:45:00'::timestamp, 2731000.00),
    (27, 89000.00, 'Ishaan Malik', '87890123456', 'Punjab National Bank', '2026-01-09 12:00:00'::timestamp, 2820000.00),
    (28, 121000.00, 'Rehan Khan', '98901234567', 'Bank of Baroda', '2026-01-09 13:15:00'::timestamp, 2941000.00),
    (29, 93000.00, 'Farhan Ahmed', '09012345678', 'Canara Bank', '2026-01-09 14:30:00'::timestamp, 3034000.00),
    (30, 109000.00, 'Samir Patel', '10234567890', 'Union Bank', '2026-01-09 15:45:00'::timestamp, 3143000.00),
    (31, 100000.00, 'Nitin Goel', '21345678901', 'HDFC Bank', '2026-01-10 09:00:00'::timestamp, 3243000.00),
    (32, 116000.00, 'Ashish Bansal', '32456789012', 'ICICI Bank', '2026-01-10 10:15:00'::timestamp, 3359000.00),
    (33, 90000.00, 'Mayank Srivastava', '43567890123', 'SBI', '2026-01-10 11:30:00'::timestamp, 3449000.00),
    (34, 111000.00, 'Shubham Rastogi', '54678901234', 'Axis Bank', '2026-01-10 13:00:00'::timestamp, 3560000.00),
    (35, 98000.00, 'Aman Thakur', '65789012345', 'Kotak Bank', '2026-01-10 14:15:00'::timestamp, 3658000.00),
    (36, 117000.00, 'Vivek Chauhan', '76890123456', 'Yes Bank', '2026-01-10 15:30:00'::timestamp, 3775000.00),
    (37, 86000.00, 'Prateek Soni', '87901234567', 'Punjab National Bank', '2026-01-10 16:45:00'::timestamp, 3861000.00),
    (38, 123000.00, 'Abhishek Tandon', '98012345678', 'Bank of Baroda', '2026-01-11 09:00:00'::timestamp, 3984000.00),
    (39, 95000.00, 'Sachin Rawat', '09123456789', 'Canara Bank', '2026-01-11 10:15:00'::timestamp, 4079000.00),
    (40, 104000.00, 'Ravi Negi', '10345678901', 'Union Bank', '2026-01-11 11:30:00'::timestamp, 4183000.00),
    (41, 101000.00, 'Sumit Bisht', '21456789012', 'HDFC Bank', '2026-01-11 12:45:00'::timestamp, 4284000.00),
    (42, 120000.00, 'Akash Dhawan', '32567890123', 'ICICI Bank', '2026-01-11 14:00:00'::timestamp, 4404000.00),
    (43, 88000.00, 'Lokesh Narang', '43678901234', 'SBI', '2026-01-11 15:15:00'::timestamp, 4492000.00),
    (44, 112000.00, 'Hitesh Batra', '54789012345', 'Axis Bank', '2026-01-11 16:00:00'::timestamp, 4604000.00),
    (45, 99000.00, 'Jatin Vohra', '65890123456', 'Kotak Bank', '2026-01-11 16:30:00'::timestamp, 4703000.00),
    (46, 105000.00, 'Mukesh Grover', '76901234567', 'Yes Bank', '2026-01-11 17:00:00'::timestamp, 4808000.00),
    (47, 192000.00, 'Naveen Luthra', '87012345678', 'Punjab National Bank', '2026-01-11 17:30:00'::timestamp, 5000000.00)
) AS t(row_num, amount, counterparty_name, counterparty_acc, counterparty_bank, transaction_date, running_balance);

-- Outbound transactions to UAE (3 transactions totaling 48,00,000 INR)
INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
(
    'TXN-2026-000048',
    (SELECT id FROM accounts WHERE account_id = 'ACC-998877'),
    'International_Transfer',
    'Completed',
    1600000.00,
    'INR',
    'Al Rashid Trading LLC',
    'AE123456789012345678901',
    'Emirates NBD',
    'United Arab Emirates',
    'Investment transfer',
    'SWIFT2026001234567',
    'Internet_Banking',
    '2026-01-11',
    '2026-01-11 18:00:00',
    '2026-01-11',
    '2026-01-11',
    3400000.00
),
(
    'TXN-2026-000049',
    (SELECT id FROM accounts WHERE account_id = 'ACC-998877'),
    'International_Transfer',
    'Completed',
    1600000.00,
    'INR',
    'Al Rashid Trading LLC',
    'AE123456789012345678901',
    'Emirates NBD',
    'United Arab Emirates',
    'Investment transfer',
    'SWIFT2026001234568',
    'Internet_Banking',
    '2026-01-11',
    '2026-01-11 18:30:00',
    '2026-01-11',
    '2026-01-11',
    1800000.00
),
(
    'TXN-2026-000050',
    (SELECT id FROM accounts WHERE account_id = 'ACC-998877'),
    'International_Transfer',
    'Completed',
    1600000.00,
    'INR',
    'Al Rashid Trading LLC',
    'AE123456789012345678901',
    'Emirates NBD',
    'United Arab Emirates',
    'Investment transfer',
    'SWIFT2026001234569',
    'Internet_Banking',
    '2026-01-11',
    '2026-01-11 19:00:00',
    '2026-01-11',
    '2026-01-11',
    200000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 2: CUST-892341 (Bharath Exports) - ACC-112233
-- Alert: AML-ALERT-2026-001245 | Review: 2026-01-01 to 2026-01-14
-- Unusual Pattern: High volume with minimal documentation
-- Inbound: 7 txns totaling ~3,85,00,000 | Outbound: 8 txns totaling ~3,72,00,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
-- Inbound: Large RTGS receipts from various companies
(
    'TXN-2026-000051',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Sunrise Commodities Pvt Ltd', '11223344556677', 'HDFC Bank', 'India',
    'Payment for export consignment INV-2026-001', 'RTGS20260101001',
    'Internet_Banking', '2026-01-02', '2026-01-02 10:30:00', '2026-01-02', '2026-01-02', 13750000.00
),
(
    'TXN-2026-000052',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'Wire_Transfer', 'Completed', 8500000.00, 'INR',
    'Falcon International FZCO', 'AE987654321098765432101', 'Mashreq Bank', 'United Arab Emirates',
    'Trade settlement - LC 2026-FI-0045', 'SWIFT20260103001',
    'Wire', '2026-01-03', '2026-01-03 11:15:00', '2026-01-03', '2026-01-03', 22250000.00
),
(
    'TXN-2026-000053',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'NEFT', 'Completed', 3200000.00, 'INR',
    'Agarwal Textiles', '22334455667788', 'ICICI Bank', 'India',
    'Advance against PO-2026-0089', 'NEFT20260104001',
    'Internet_Banking', '2026-01-04', '2026-01-04 14:20:00', '2026-01-04', '2026-01-04', 25450000.00
),
(
    'TXN-2026-000054',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'RTGS', 'Completed', 7000000.00, 'INR',
    'Mehta Trading Co', '33445566778899', 'SBI', 'India',
    'Payment for goods exported - Bill E/2026/112', 'RTGS20260106001',
    'Internet_Banking', '2026-01-06', '2026-01-06 09:45:00', '2026-01-06', '2026-01-06', 32450000.00
),
(
    'TXN-2026-000055',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'Wire_Transfer', 'Completed', 6500000.00, 'INR',
    'Pacific Rim Trading Ltd', 'SG1234567890123456', 'DBS Bank', 'Singapore',
    'Export proceeds - Contract PCT-2025-234', 'SWIFT20260108001',
    'Wire', '2026-01-08', '2026-01-08 10:00:00', '2026-01-08', '2026-01-08', 38950000.00
),
(
    'TXN-2026-000056',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Naveen Industries', '44556677889900', 'Axis Bank', 'India',
    'Raw material supply payment', 'RTGS20260110001',
    'Internet_Banking', '2026-01-10', '2026-01-10 15:30:00', '2026-01-10', '2026-01-10', 43950000.00
),
(
    'TXN-2026-000057',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'NEFT', 'Completed', 3300000.00, 'INR',
    'Rajasthan Handicrafts Emporium', '55667788990011', 'Bank of Baroda', 'India',
    'Final settlement - Order RHE/2025/445', 'NEFT20260112001',
    'Internet_Banking', '2026-01-12', '2026-01-12 11:00:00', '2026-01-12', '2026-01-12', 47250000.00
),
-- Outbound: Rapid outflows shortly after inflows
(
    'TXN-2026-000058',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'RTGS', 'Completed', 4500000.00, 'INR',
    'Zenith Logistics Pvt Ltd', '66778899001122', 'Punjab National Bank', 'India',
    'Freight and logistics charges', 'RTGS20260102002',
    'Internet_Banking', '2026-01-02', '2026-01-02 16:00:00', '2026-01-02', '2026-01-02', 9250000.00
),
(
    'TXN-2026-000059',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'Wire_Transfer', 'Completed', 7500000.00, 'INR',
    'Dragon Star Imports Ltd', 'HK12345678901234', 'HSBC Hong Kong', 'Hong Kong',
    'Advance for import consignment DS-2026-011', 'SWIFT20260104002',
    'Wire', '2026-01-04', '2026-01-04 17:30:00', '2026-01-04', '2026-01-04', 17950000.00
),
(
    'TXN-2026-000060',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'NEFT', 'Completed', 5000000.00, 'INR',
    'Shree Balaji Enterprises', '77889900112233', 'Kotak Bank', 'India',
    'Commission payment - Q4 2025', 'NEFT20260106002',
    'Internet_Banking', '2026-01-06', '2026-01-06 14:00:00', '2026-01-06', '2026-01-06', 27450000.00
),
(
    'TXN-2026-000061',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'Wire_Transfer', 'Completed', 10000000.00, 'INR',
    'Gulf Commodities DMCC', 'AE112233445566778899001', 'First Abu Dhabi Bank', 'United Arab Emirates',
    'Trade advance - Gold import LC/2026/089', 'SWIFT20260108002',
    'Wire', '2026-01-08', '2026-01-08 16:45:00', '2026-01-08', '2026-01-08', 28950000.00
),
(
    'TXN-2026-000062',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'RTGS', 'Completed', 6000000.00, 'INR',
    'Paramount Packaging Solutions', '88990011223344', 'Union Bank', 'India',
    'Packaging and handling charges - bulk order', 'RTGS20260110002',
    'Internet_Banking', '2026-01-10', '2026-01-10 17:00:00', '2026-01-10', '2026-01-10', 37950000.00
),
(
    'TXN-2026-000063',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'Wire_Transfer', 'Completed', 5000000.00, 'INR',
    'Istanbul Textiles A.S.', 'TR123456789012345678901234', 'Garanti BBVA', 'Turkey',
    'Advance for fabric import - PO IT-2026-007', 'SWIFT20260112002',
    'Wire', '2026-01-12', '2026-01-12 15:30:00', '2026-01-12', '2026-01-12', 42250000.00
),
(
    'TXN-2026-000064',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'Cash_Withdrawal', 'Completed', 900000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash withdrawal - operational expenses', 'CW20260113001',
    'Branch', '2026-01-13', '2026-01-13 12:00:00', '2026-01-13', '2026-01-13', 41350000.00
),
(
    'TXN-2026-000065',
    (SELECT id FROM accounts WHERE account_id = 'ACC-112233'),
    'NEFT', 'Completed', 3200000.00, 'INR',
    'Reliable Warehousing Ltd', '99001122334455', 'Canara Bank', 'India',
    'Warehouse rental - Q1 2026', 'NEFT20260114001',
    'Internet_Banking', '2026-01-14', '2026-01-14 10:30:00', '2026-01-14', '2026-01-14', 38150000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 3: CUST-234567 (Meera Krishnamurthy) - ACC-223344
-- Alert: AML-ALERT-2026-000543 | Review: 2026-01-01 to 2026-01-15
-- Structuring: Multiple cash deposits just below 10 lakh threshold
-- Inbound: 8 txns totaling ~42,50,000 | Outbound: 4 txns totaling ~28,00,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
-- Inbound: Cash deposits structured below 10 lakh CTR threshold
(
    'TXN-2026-000066',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'Cash_Deposit', 'Completed', 950000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - business collections', 'CD20260102001',
    'Branch', '2026-01-02', '2026-01-02 10:30:00', '2026-01-02', '2026-01-02', 5470000.00
),
(
    'TXN-2026-000067',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'Cash_Deposit', 'Completed', 900000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - shop income', 'CD20260103001',
    'Branch', '2026-01-03', '2026-01-03 11:00:00', '2026-01-03', '2026-01-03', 6370000.00
),
(
    'TXN-2026-000068',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'Cash_Deposit', 'Completed', 980000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - retail collections', 'CD20260105001',
    'Branch', '2026-01-05', '2026-01-05 10:15:00', '2026-01-05', '2026-01-05', 7350000.00
),
(
    'TXN-2026-000069',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'Cash_Deposit', 'Completed', 920000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - daily takings', 'CD20260107001',
    'Branch', '2026-01-07', '2026-01-07 14:30:00', '2026-01-07', '2026-01-07', 8270000.00
),
(
    'TXN-2026-000070',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'NEFT', 'Completed', 350000.00, 'INR',
    'Srinivasan Textiles', '12340987654321', 'Indian Bank', 'India',
    'Payment received - Invoice KM-2025-890', 'NEFT20260108001',
    'Internet_Banking', '2026-01-08', '2026-01-08 09:45:00', '2026-01-08', '2026-01-08', 8620000.00
),
(
    'TXN-2026-000071',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'Cash_Deposit', 'Completed', 990000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - weekend sales', 'CD20260109001',
    'Branch', '2026-01-09', '2026-01-09 10:00:00', '2026-01-09', '2026-01-09', 9610000.00
),
(
    'TXN-2026-000072',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'UPI', 'Completed', 175000.00, 'INR',
    'Lakshmi Stores', 'lakshmi.stores@upi', NULL, 'India',
    'UPI collection - wholesale order', 'UPI20260111001',
    'UPI', '2026-01-11', '2026-01-11 13:00:00', '2026-01-11', '2026-01-11', 9785000.00
),
(
    'TXN-2026-000073',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'Cash_Deposit', 'Completed', 985000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - store collections', 'CD20260113001',
    'Branch', '2026-01-13', '2026-01-13 11:30:00', '2026-01-13', '2026-01-13', 10770000.00
),
-- Outbound: RTGS and NEFT transfers
(
    'TXN-2026-000074',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'RTGS', 'Completed', 1200000.00, 'INR',
    'Bangalore Silk House', '98765432101234', 'Canara Bank', 'India',
    'Silk fabric purchase - PO BSH-2026-012', 'RTGS20260104001',
    'Internet_Banking', '2026-01-04', '2026-01-04 15:00:00', '2026-01-04', '2026-01-04', 6170000.00
),
(
    'TXN-2026-000075',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'NEFT', 'Completed', 500000.00, 'INR',
    'Premium Designs Studio', '87654321098765', 'HDFC Bank', 'India',
    'Design services - Jan 2026', 'NEFT20260106001',
    'Internet_Banking', '2026-01-06', '2026-01-06 16:30:00', '2026-01-06', '2026-01-06', 7770000.00
),
(
    'TXN-2026-000076',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'RTGS', 'Completed', 800000.00, 'INR',
    'Mysore Silk Cooperative', '76543210987654', 'State Bank of Mysore', 'India',
    'Raw material advance - Jan batch', 'RTGS20260110001',
    'Internet_Banking', '2026-01-10', '2026-01-10 11:00:00', '2026-01-10', '2026-01-10', 8810000.00
),
(
    'TXN-2026-000077',
    (SELECT id FROM accounts WHERE account_id = 'ACC-223344'),
    'NEFT', 'Completed', 300000.00, 'INR',
    'Karnataka Commercial Tax', '00112233445566', 'SBI', 'India',
    'GST payment - December 2025', 'NEFT20260114001',
    'Internet_Banking', '2026-01-14', '2026-01-14 10:00:00', '2026-01-14', '2026-01-14', 10470000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 4: CUST-345678 (Sanjay Desai NRI) - ACC-334455
-- Alert: AML-ALERT-2026-000789 | Review: 2026-01-01 to 2026-01-08
-- Cross Border: Frequent international inflows with domestic outflows
-- Inbound: 5 txns totaling ~25,00,000 | Outbound: 3 txns totaling ~20,00,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
-- Inbound: International wire transfers
(
    'TXN-2026-000078',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'Wire_Transfer', 'Completed', 600000.00, 'INR',
    'TechFirm LLC - Salary', 'AE567890123456789012345', 'Emirates NBD', 'United Arab Emirates',
    'Salary credit - December 2025', 'SWIFT20260101001',
    'Wire', '2026-01-01', '2026-01-01 09:30:00', '2026-01-01', '2026-01-01', 3450000.00
),
(
    'TXN-2026-000079',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'Wire_Transfer', 'Completed', 500000.00, 'INR',
    'Pinnacle Ventures Singapore', 'SG9876543210987654', 'OCBC Bank', 'Singapore',
    'Investment returns - Q4 2025', 'SWIFT20260102001',
    'Wire', '2026-01-02', '2026-01-02 14:00:00', '2026-01-02', '2026-01-02', 3950000.00
),
(
    'TXN-2026-000080',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'Wire_Transfer', 'Completed', 450000.00, 'INR',
    'Al Habtoor Properties LLC', 'AE234567890123456789012', 'Abu Dhabi Commercial Bank', 'United Arab Emirates',
    'Rental deposit refund', 'SWIFT20260104001',
    'Wire', '2026-01-04', '2026-01-04 11:30:00', '2026-01-04', '2026-01-04', 4400000.00
),
(
    'TXN-2026-000081',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'Wire_Transfer', 'Completed', 750000.00, 'INR',
    'Sanjay Desai - NRO Transfer', 'AE345678901234567890123', 'Standard Chartered UAE', 'United Arab Emirates',
    'Transfer from NRO account', 'SWIFT20260106001',
    'Wire', '2026-01-06', '2026-01-06 10:00:00', '2026-01-06', '2026-01-06', 5150000.00
),
(
    'TXN-2026-000082',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'IMPS', 'Completed', 200000.00, 'INR',
    'Ravi Desai', '11122233344455', 'HDFC Bank', 'India',
    'Family support - brother', 'IMPS20260107001',
    'Mobile_Banking', '2026-01-07', '2026-01-07 08:45:00', '2026-01-07', '2026-01-07', 5350000.00
),
-- Outbound: Rapid domestic transfers
(
    'TXN-2026-000083',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'RTGS', 'Completed', 1000000.00, 'INR',
    'Desai Family Trust', '22233344455566', 'ICICI Bank', 'India',
    'Trust fund contribution - Jan 2026', 'RTGS20260103001',
    'Internet_Banking', '2026-01-03', '2026-01-03 16:00:00', '2026-01-03', '2026-01-03', 2950000.00
),
(
    'TXN-2026-000084',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'NEFT', 'Completed', 500000.00, 'INR',
    'Horizon Properties Pvt Ltd', '33344455566677', 'Axis Bank', 'India',
    'Property EMI - January 2026', 'NEFT20260105001',
    'Internet_Banking', '2026-01-05', '2026-01-05 12:00:00', '2026-01-05', '2026-01-05', 3900000.00
),
(
    'TXN-2026-000085',
    (SELECT id FROM accounts WHERE account_id = 'ACC-334455'),
    'RTGS', 'Completed', 500000.00, 'INR',
    'Sagar Investments', '44455566677788', 'SBI', 'India',
    'Mutual fund investment - lumpsum', 'RTGS20260108001',
    'Internet_Banking', '2026-01-08', '2026-01-08 14:30:00', '2026-01-08', '2026-01-08', 4850000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 5: CUST-567890 (Global Trade Ventures) - ACC-556677
-- Alert: AML-ALERT-2026-001345 | Review: 2026-01-05 to 2026-01-20
-- High Value: Shell company pattern with rapid fund movement
-- Inbound: 6 txns totaling ~3,50,00,000 | Outbound: 6 txns totaling ~3,40,00,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
-- Inbound: Large round-number deposits from multiple sources
(
    'TXN-2026-000086',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Omega Trading Corp', 'HK55667788990011', 'Hang Seng Bank', 'Hong Kong',
    'Trade advance - Contract OTC-2026-001', 'RTGS20260105001',
    'Internet_Banking', '2026-01-05', '2026-01-05 09:30:00', '2026-01-05', '2026-01-05', 50000000.00
),
(
    'TXN-2026-000087',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Wire_Transfer', 'Completed', 10000000.00, 'INR',
    'Crescent Moon Enterprises FZE', 'AE556677889900112233445', 'National Bank of Fujairah', 'United Arab Emirates',
    'Commodity trading settlement', 'SWIFT20260107001',
    'Wire', '2026-01-07', '2026-01-07 11:00:00', '2026-01-07', '2026-01-07', 60000000.00
),
(
    'TXN-2026-000088',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Shetty Brothers Import Export', '11223355446677', 'Karnataka Bank', 'India',
    'Commission on trade facilitation', 'RTGS20260109001',
    'Internet_Banking', '2026-01-09', '2026-01-09 10:15:00', '2026-01-09', '2026-01-09', 65000000.00
),
(
    'TXN-2026-000089',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Wire_Transfer', 'Completed', 5000000.00, 'INR',
    'Lucky Star Trading Ltd', 'SG5566778899001122', 'United Overseas Bank', 'Singapore',
    'Advance for copper import shipment', 'SWIFT20260112001',
    'Wire', '2026-01-12', '2026-01-12 14:30:00', '2026-01-12', '2026-01-12', 70000000.00
),
(
    'TXN-2026-000090',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Cash_Deposit', 'Completed', 5000000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - trade receivables', 'CD20260115001',
    'Branch', '2026-01-15', '2026-01-15 11:00:00', '2026-01-15', '2026-01-15', 75000000.00
),
(
    'TXN-2026-000091',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Priya Commodities Pvt Ltd', '99887766554433', 'Yes Bank', 'India',
    'Settlement - Invoice PC-2026-034', 'RTGS20260117001',
    'Internet_Banking', '2026-01-17', '2026-01-17 09:00:00', '2026-01-17', '2026-01-17', 80000000.00
),
-- Outbound: Rapid movement within hours/days of receipt
(
    'TXN-2026-000092',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Wire_Transfer', 'Completed', 5000000.00, 'INR',
    'Phoenix Global Holdings', 'HK99887766554433', 'Bank of China HK', 'Hong Kong',
    'Trade payment - PHG-INV-2026-009', 'SWIFT20260106001',
    'Wire', '2026-01-06', '2026-01-06 10:00:00', '2026-01-06', '2026-01-06', 45000000.00
),
(
    'TXN-2026-000093',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Wire_Transfer', 'Completed', 10000000.00, 'INR',
    'Eastern Promise DMCC', 'AE998877665544332211009', 'Dubai Islamic Bank', 'United Arab Emirates',
    'Commodity purchase advance', 'SWIFT20260108001',
    'Wire', '2026-01-08', '2026-01-08 15:30:00', '2026-01-08', '2026-01-08', 50000000.00
),
(
    'TXN-2026-000094',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Maheshwari Metals Pvt Ltd', '22334455667788', 'Bank of India', 'India',
    'Metal procurement - PO MM-2026-045', 'RTGS20260110001',
    'Internet_Banking', '2026-01-10', '2026-01-10 12:00:00', '2026-01-10', '2026-01-10', 60000000.00
),
(
    'TXN-2026-000095',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Wire_Transfer', 'Completed', 5000000.00, 'INR',
    'Silk Route International FZC', 'AE112299887766554433221', 'RAK Bank', 'United Arab Emirates',
    'Import advance - Textiles SRI-2026-078', 'SWIFT20260113001',
    'Wire', '2026-01-13', '2026-01-13 16:00:00', '2026-01-13', '2026-01-13', 65000000.00
),
(
    'TXN-2026-000096',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'Bharat Heavy Industries', '33445566778800', 'Central Bank of India', 'India',
    'Equipment purchase - BHI-PO-2026-012', 'RTGS20260116001',
    'Internet_Banking', '2026-01-16', '2026-01-16 11:30:00', '2026-01-16', '2026-01-16', 70000000.00
),
(
    'TXN-2026-000097',
    (SELECT id FROM accounts WHERE account_id = 'ACC-556677'),
    'Wire_Transfer', 'Completed', 4000000.00, 'INR',
    'Pacific Trading Co Ltd', 'SG8877665544332211', 'CIMB Singapore', 'Singapore',
    'Advance for electronics import', 'SWIFT20260118001',
    'Wire', '2026-01-18', '2026-01-18 14:00:00', '2026-01-18', '2026-01-18', 76000000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 6: CUST-456789 (Pooja Agarwal) - ACC-445566
-- Alert: AML-ALERT-2026-001456 | Review: 2026-01-15 to 2026-02-05
-- Unusual Pattern: Sudden spike in volume for a retail salary account
-- Inbound: 8 txns totaling ~8,50,000 | Outbound: 4 txns totaling ~7,20,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
(
    'TXN-2026-000098',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'NEFT', 'Completed', 85000.00, 'INR',
    'Digital Media Solutions', '55443322110099', 'HDFC Bank', 'India',
    'Salary credit - January 2026', 'NEFT20260115001',
    'Internet_Banking', '2026-01-15', '2026-01-15 10:00:00', '2026-01-15', '2026-01-15', 210000.00
),
(
    'TXN-2026-000099',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'UPI', 'Completed', 150000.00, 'INR',
    'Rohit Agarwal', 'rohit.agarwal@upi', NULL, 'India',
    'Transfer from brother', 'UPI20260117001',
    'UPI', '2026-01-17', '2026-01-17 19:30:00', '2026-01-17', '2026-01-17', 360000.00
),
(
    'TXN-2026-000100',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'IMPS', 'Completed', 125000.00, 'INR',
    'Neha Sharma', '66554433221100', 'ICICI Bank', 'India',
    'Wedding contribution', 'IMPS20260119001',
    'Mobile_Banking', '2026-01-19', '2026-01-19 11:00:00', '2026-01-19', '2026-01-19', 485000.00
),
(
    'TXN-2026-000101',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'UPI', 'Completed', 100000.00, 'INR',
    'Anita Agarwal', 'anita.agarwal@upi', NULL, 'India',
    'Gift from mother', 'UPI20260121001',
    'UPI', '2026-01-21', '2026-01-21 14:00:00', '2026-01-21', '2026-01-21', 585000.00
),
(
    'TXN-2026-000102',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'NEFT', 'Completed', 200000.00, 'INR',
    'Lucky Draw Promotions Pvt Ltd', '77665544332211', 'Yes Bank', 'India',
    'Contest winnings', 'NEFT20260123001',
    'Internet_Banking', '2026-01-23', '2026-01-23 15:30:00', '2026-01-23', '2026-01-23', 785000.00
),
(
    'TXN-2026-000103',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'UPI', 'Completed', 50000.00, 'INR',
    'Priya Mehta', 'priya.mehta@upi', NULL, 'India',
    'Freelance payment received', 'UPI20260126001',
    'UPI', '2026-01-26', '2026-01-26 20:00:00', '2026-01-26', '2026-01-26', 835000.00
),
(
    'TXN-2026-000104',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'Cash_Deposit', 'Completed', 75000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit', 'CD20260129001',
    'Branch', '2026-01-29', '2026-01-29 12:00:00', '2026-01-29', '2026-01-29', 910000.00
),
(
    'TXN-2026-000105',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'IMPS', 'Completed', 65000.00, 'INR',
    'Suresh Agarwal', '88776655443322', 'SBI', 'India',
    'Family support - father', 'IMPS20260201001',
    'Mobile_Banking', '2026-02-01', '2026-02-01 09:00:00', '2026-02-01', '2026-02-01', 975000.00
),
-- Outbound: Large sudden transfers inconsistent with profile
(
    'TXN-2026-000106',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'NEFT', 'Completed', 200000.00, 'INR',
    'Luxury Watches India Pvt Ltd', '99887700112233', 'Kotak Bank', 'India',
    'Purchase - luxury watch', 'NEFT20260120001',
    'Internet_Banking', '2026-01-20', '2026-01-20 16:00:00', '2026-01-20', '2026-01-20', 285000.00
),
(
    'TXN-2026-000107',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'RTGS', 'Completed', 300000.00, 'INR',
    'GoldStar Jewellers', '00112233998877', 'Punjab National Bank', 'India',
    'Jewellery purchase', 'RTGS20260124001',
    'Internet_Banking', '2026-01-24', '2026-01-24 11:30:00', '2026-01-24', '2026-01-24', 535000.00
),
(
    'TXN-2026-000108',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'UPI', 'Completed', 120000.00, 'INR',
    'Jaipur Heritage Boutique', 'jaipur.heritage@upi', NULL, 'India',
    'Designer clothing purchase', 'UPI20260130001',
    'UPI', '2026-01-30', '2026-01-30 18:00:00', '2026-01-30', '2026-01-30', 790000.00
),
(
    'TXN-2026-000109',
    (SELECT id FROM accounts WHERE account_id = 'ACC-445566'),
    'NEFT', 'Completed', 100000.00, 'INR',
    'Royal Spa and Wellness', '11009988776655', 'Axis Bank', 'India',
    'Annual membership', 'NEFT20260203001',
    'Internet_Banking', '2026-02-03', '2026-02-03 10:00:00', '2026-02-03', '2026-02-03', 875000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 7: CUST-890123 (Pinnacle Realty) - ACC-889900
-- Alert: AML-ALERT-2026-001567 | Review: 2026-01-10 to 2026-02-10
-- High Value: Large cash deposits and suspicious property deal patterns
-- Inbound: 6 txns totaling ~4,50,00,000 | Outbound: 5 txns totaling ~4,20,00,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
-- Inbound: Large deposits from property deals and cash
(
    'TXN-2026-000110',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'RTGS', 'Completed', 15000000.00, 'INR',
    'Rakesh Jhunjhunwala HUF', '12345600998877', 'Kotak Bank', 'India',
    'Booking amount - Tower C Flat 2301', 'RTGS20260110001',
    'Internet_Banking', '2026-01-10', '2026-01-10 10:30:00', '2026-01-10', '2026-01-10', 140000000.00
),
(
    'TXN-2026-000111',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'Cash_Deposit', 'Completed', 5000000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash received - plot sale advance', 'CD20260113001',
    'Branch', '2026-01-13', '2026-01-13 11:00:00', '2026-01-13', '2026-01-13', 145000000.00
),
(
    'TXN-2026-000112',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'RTGS', 'Completed', 10000000.00, 'INR',
    'Sharma Construction Co', '23456700112233', 'SBI', 'India',
    'JV profit sharing - Phoenix Mall project', 'RTGS20260117001',
    'Internet_Banking', '2026-01-17', '2026-01-17 14:00:00', '2026-01-17', '2026-01-17', 155000000.00
),
(
    'TXN-2026-000113',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'Cash_Deposit', 'Completed', 5000000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - site office collections', 'CD20260122001',
    'Branch', '2026-01-22', '2026-01-22 12:30:00', '2026-01-22', '2026-01-22', 160000000.00
),
(
    'TXN-2026-000114',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'RTGS', 'Completed', 5000000.00, 'INR',
    'HDFC Home Loans', '34567800223344', 'HDFC Bank', 'India',
    'Home loan disbursement - Flat buyer Rajendra Patil', 'RTGS20260128001',
    'Internet_Banking', '2026-01-28', '2026-01-28 15:00:00', '2026-01-28', '2026-01-28', 165000000.00
),
(
    'TXN-2026-000115',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'Cheque', 'Completed', 5000000.00, 'INR',
    'Ambani Realty Trust', '45678900334455', 'ICICI Bank', 'India',
    'Land deal advance - Navi Mumbai plot', 'CHQ20260205001',
    'Branch', '2026-02-05', '2026-02-05 10:00:00', '2026-02-05', '2026-02-05', 170000000.00
),
-- Outbound: Construction, land purchases and cash withdrawals
(
    'TXN-2026-000116',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'RTGS', 'Completed', 12000000.00, 'INR',
    'Tata Steel Distributors', '56789000445566', 'Axis Bank', 'India',
    'Steel and cement procurement - Tower D', 'RTGS20260112001',
    'Internet_Banking', '2026-01-12', '2026-01-12 11:00:00', '2026-01-12', '2026-01-12', 133000000.00
),
(
    'TXN-2026-000117',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'RTGS', 'Completed', 8000000.00, 'INR',
    'Bhumi Land Holdings Pvt Ltd', '67890100556677', 'Bank of Maharashtra', 'India',
    'Land acquisition deposit - Panvel', 'RTGS20260115001',
    'Internet_Banking', '2026-01-15', '2026-01-15 16:00:00', '2026-01-15', '2026-01-15', 137000000.00
),
(
    'TXN-2026-000118',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'Cash_Withdrawal', 'Completed', 5000000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash withdrawal - labor wages and site expenses', 'CW20260120001',
    'Branch', '2026-01-20', '2026-01-20 13:00:00', '2026-01-20', '2026-01-20', 155000000.00
),
(
    'TXN-2026-000119',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'RTGS', 'Completed', 10000000.00, 'INR',
    'National Highways Authority of India', '78901200667788', 'SBI', 'India',
    'Infrastructure cess and development charges', 'RTGS20260130001',
    'Internet_Banking', '2026-01-30', '2026-01-30 10:30:00', '2026-01-30', '2026-01-30', 155000000.00
),
(
    'TXN-2026-000120',
    (SELECT id FROM accounts WHERE account_id = 'ACC-889900'),
    'NEFT', 'Completed', 7000000.00, 'INR',
    'Excel Architects and Planners', '89012300778899', 'Union Bank', 'India',
    'Architecture fees - Phase 3', 'NEFT20260207001',
    'Internet_Banking', '2026-02-07', '2026-02-07 14:30:00', '2026-02-07', '2026-02-07', 163000000.00
);

-- =========================================================
-- TRANSACTIONS FOR ALERT 8: CUST-901234 (Dr. Sunita Choudhury) - ACC-990011
-- Alert: AML-ALERT-2026-001678 | Review: 2026-01-10 to 2026-02-10
-- Fraud Alert: Unusual large transfers from a doctor's savings account
-- Inbound: 5 txns totaling ~18,00,000 | Outbound: 5 txns totaling ~15,50,000
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
-- Inbound: Mix of professional income and suspicious receipts
(
    'TXN-2026-000121',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'NEFT', 'Completed', 250000.00, 'INR',
    'Star Health Insurance TPA', '11002233445566', 'HDFC Bank', 'India',
    'Insurance claim settlement - Dec 2025', 'NEFT20260110001',
    'Internet_Banking', '2026-01-10', '2026-01-10 10:00:00', '2026-01-10', '2026-01-10', 3100000.00
),
(
    'TXN-2026-000122',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'UPI', 'Completed', 150000.00, 'INR',
    'Kolkata Clinic Receipts', 'kolkataclinic@upi', NULL, 'India',
    'Clinic fee collections - week 2', 'UPI20260114001',
    'UPI', '2026-01-14', '2026-01-14 18:00:00', '2026-01-14', '2026-01-14', 3250000.00
),
(
    'TXN-2026-000123',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'NEFT', 'Completed', 500000.00, 'INR',
    'Apex Pharmaceutical Distributors', '22003344556677', 'ICICI Bank', 'India',
    'Consulting fees - product advisory', 'NEFT20260118001',
    'Internet_Banking', '2026-01-18', '2026-01-18 11:30:00', '2026-01-18', '2026-01-18', 3750000.00
),
(
    'TXN-2026-000124',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'Cash_Deposit', 'Completed', 500000.00, 'INR',
    NULL, NULL, NULL, 'India',
    'Cash deposit - clinic income', 'CD20260124001',
    'Branch', '2026-01-24', '2026-01-24 12:00:00', '2026-01-24', '2026-01-24', 4250000.00
),
(
    'TXN-2026-000125',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'RTGS', 'Completed', 400000.00, 'INR',
    'MedEquip India Pvt Ltd', '33004455667788', 'Axis Bank', 'India',
    'Refund - cancelled equipment order', 'RTGS20260201001',
    'Internet_Banking', '2026-02-01', '2026-02-01 09:30:00', '2026-02-01', '2026-02-01', 4650000.00
),
-- Outbound: Unusual large transfers
(
    'TXN-2026-000126',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'RTGS', 'Completed', 500000.00, 'INR',
    'Eastern Wellness Retreat LLP', '44005566778899', 'Yes Bank', 'India',
    'Investment in wellness center', 'RTGS20260112001',
    'Internet_Banking', '2026-01-12', '2026-01-12 14:00:00', '2026-01-12', '2026-01-12', 2600000.00
),
(
    'TXN-2026-000127',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'NEFT', 'Completed', 300000.00, 'INR',
    'Bengal Heritage Properties', '55006677889900', 'United Bank of India', 'India',
    'Property booking advance - Salt Lake', 'NEFT20260116001',
    'Internet_Banking', '2026-01-16', '2026-01-16 15:30:00', '2026-01-16', '2026-01-16', 2950000.00
),
(
    'TXN-2026-000128',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'Wire_Transfer', 'Completed', 350000.00, 'INR',
    'Bangkok Medical Conference Ltd', 'TH1234567890123456', 'Bangkok Bank', 'Thailand',
    'Conference registration and travel package', 'SWIFT20260121001',
    'Internet_Banking', '2026-01-21', '2026-01-21 10:00:00', '2026-01-21', '2026-01-21', 3400000.00
),
(
    'TXN-2026-000129',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'NEFT', 'Completed', 200000.00, 'INR',
    'Choudhury Family Trust', '66007788990011', 'SBI', 'India',
    'Monthly trust contribution', 'NEFT20260128001',
    'Internet_Banking', '2026-01-28', '2026-01-28 11:00:00', '2026-01-28', '2026-01-28', 4050000.00
),
(
    'TXN-2026-000130',
    (SELECT id FROM accounts WHERE account_id = 'ACC-990011'),
    'RTGS', 'Completed', 200000.00, 'INR',
    'Kolkata Art Gallery', '77008899001122', 'Allahabad Bank', 'India',
    'Art purchase - antique painting', 'RTGS20260205001',
    'Internet_Banking', '2026-02-05', '2026-02-05 16:00:00', '2026-02-05', '2026-02-05', 4450000.00
);

-- =========================================================
-- TRANSACTIONS FOR OTHER CUSTOMERS (Normal Behavior - no alerts)
-- =========================================================

-- Transactions for Customer 7 (Ramakrishna Rao - Normal Senior Citizen)
INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, description, channel, transaction_date, transaction_timestamp, balance_after)
SELECT
    'TXN-2026-RR' || LPAD(row_num::text, 4, '0'),
    (SELECT id FROM accounts WHERE account_id = 'ACC-667788'),
    txn_type,
    'Completed',
    amount,
    'INR',
    counterparty,
    description,
    channel,
    txn_date::date,
    txn_date,
    balance
FROM (
    VALUES
    (1, 'Credit', 175000.00, 'Government Pension Fund', 'Pension credit - January 2026', 'Internet_Banking', '2026-01-01 10:00:00'::timestamp, 3425000.00),
    (2, 'Debit', 50000.00, 'Apollo Pharmacy', 'Monthly medicines', 'UPI', '2026-01-05 11:00:00'::timestamp, 3375000.00),
    (3, 'Debit', 25000.00, 'LIC of India', 'Insurance premium', 'Internet_Banking', '2026-01-10 14:00:00'::timestamp, 3350000.00),
    (4, 'Credit', 100000.00, 'FD Interest Credit', 'Quarterly FD interest', 'Internet_Banking', '2026-01-15 10:00:00'::timestamp, 3450000.00),
    (5, 'Debit', 15000.00, 'Electricity Board', 'Electricity bill', 'Internet_Banking', '2026-01-20 09:30:00'::timestamp, 3435000.00)
) AS t(row_num, txn_type, amount, counterparty, description, channel, txn_date, balance);

-- Transactions for Customer 8 (Arjun Malhotra - Normal Salary)
INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, description, channel, transaction_date, transaction_timestamp, balance_after)
SELECT
    'TXN-2026-AM' || LPAD(row_num::text, 4, '0'),
    (SELECT id FROM accounts WHERE account_id = 'ACC-778899'),
    txn_type,
    'Completed',
    amount,
    'INR',
    counterparty,
    description,
    channel,
    txn_date::date,
    txn_date,
    balance
FROM (
    VALUES
    (1, 'Credit', 125000.00, 'Analytics Corp India', 'Salary credit', 'Internet_Banking', '2026-01-01 10:30:00'::timestamp, 285000.00),
    (2, 'Debit', 40000.00, 'HDFC Life', 'Insurance premium', 'Internet_Banking', '2026-01-03 11:00:00'::timestamp, 245000.00),
    (3, 'Debit', 35000.00, 'Landlord - Koregaon Park', 'Monthly rent', 'UPI', '2026-01-05 10:00:00'::timestamp, 210000.00),
    (4, 'Debit', 8000.00, 'Swiggy', 'Food orders', 'UPI', '2026-01-08 19:30:00'::timestamp, 202000.00),
    (5, 'Debit', 15000.00, 'Mutual Fund SIP', 'Investment', 'Internet_Banking', '2026-01-10 10:00:00'::timestamp, 187000.00)
) AS t(row_num, txn_type, amount, counterparty, description, channel, txn_date, balance);

-- =========================================================
-- ALERTS (8 total)
-- =========================================================

-- Alert 1: Primary Alert for Customer 1 (Akshay Verma) - ACC-998877
-- Suspicious Transaction: Funnel account with 47 inbound from unrelated parties, 3 outbound to UAE
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators, customer_interaction,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-000987',
    c.id,
    a.id,
    'Suspicious Transaction',
    'AML',
    'High',
    'Open',
    85,
    'High',
    'Upstream_AML_Engine',
    '["AML-STR-022", "AML-HT-014", "AML-INT-031"]'::jsonb,
    '2026-01-05',
    '2026-01-11',
    5000000.00,
    4800000.00,
    47,
    3,
    47,
    '[{"reason_code": "R001", "description": "Transaction value inconsistent with customer''s known profile"}, {"reason_code": "R014", "description": "Multiple unrelated counterparties sending funds"}, {"reason_code": "R031", "description": "Rapid movement of funds to an international destination"}]'::jsonb,
    '[{"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "High"}, {"typology_code": "TYP-FUNNEL", "typology_name": "Funnel Account Behavior", "confidence": "Medium"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Unrelated", "high_risk_geography_involved": true, "destination_country": "United Arab Emirates", "destination_risk_rating": "High"}'::jsonb,
    '{"contact_attempted": true, "contact_date": "2026-01-10", "customer_response": "Funds received on behalf of friends for investment purposes", "documentation_provided": false, "response_satisfactory": false}'::jsonb,
    '2026-01-12 09:45:30',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-458921' AND a.account_id = 'ACC-998877';

-- Alert 2: Bharath Exports - ACC-112233
-- Unusual Pattern: High volume with minimal documentation, rapid fund movement
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-001245',
    c.id,
    a.id,
    'Unusual Pattern',
    'AML',
    'High',
    'Under_Review',
    78,
    'High',
    'Upstream_AML_Engine',
    '["AML-STR-001", "AML-HT-014"]'::jsonb,
    '2026-01-01',
    '2026-01-14',
    38500000.00,
    42100000.00,
    7,
    8,
    13,
    '[{"reason_code": "R005", "description": "High volume transactions with minimal business documentation"}, {"reason_code": "R008", "description": "Transactions inconsistent with stated business purpose"}, {"reason_code": "R031", "description": "Rapid outflows to international destinations shortly after inflows"}]'::jsonb,
    '[{"typology_code": "TYP-TRADE-ML", "typology_name": "Trade-Based Money Laundering", "confidence": "Medium"}, {"typology_code": "TYP-RAPID-MOVE", "typology_name": "Rapid Movement of Funds", "confidence": "High"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Mixed", "high_risk_geography_involved": true, "destination_countries": ["Hong Kong", "United Arab Emirates", "Turkey"], "source_countries": ["United Arab Emirates", "Singapore", "India"]}'::jsonb,
    '2026-01-15 11:30:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-892341' AND a.account_id = 'ACC-112233';

-- Alert 3: Meera Krishnamurthy - ACC-223344
-- Structuring: Multiple cash deposits just below 10 lakh CTR threshold
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-000543',
    c.id,
    a.id,
    'Structuring',
    'AML',
    'Critical',
    'Escalated',
    72,
    'High',
    'Upstream_AML_Engine',
    '["AML-CTR-005", "AML-STR-022"]'::jsonb,
    '2026-01-01',
    '2026-01-15',
    6250000.00,
    2800000.00,
    8,
    4,
    4,
    '[{"reason_code": "R003", "description": "Multiple cash deposits below CTR reporting threshold of 10 lakhs"}, {"reason_code": "R004", "description": "Pattern of structured deposits within a short period"}]'::jsonb,
    '[{"typology_code": "TYP-STRUCTURING", "typology_name": "Structuring", "confidence": "High"}, {"typology_code": "TYP-SMURFING", "typology_name": "Smurfing", "confidence": "Low"}]'::jsonb,
    '2026-01-16 08:30:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-234567' AND a.account_id = 'ACC-223344';

-- Alert 4: Sanjay Desai NRI - ACC-334455
-- Cross Border: Frequent international transfers from multiple geographies
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-000789',
    c.id,
    a.id,
    'Cross Border',
    'AML',
    'Medium',
    'Open',
    55,
    'Medium',
    'Upstream_AML_Engine',
    '["AML-INT-031"]'::jsonb,
    '2026-01-01',
    '2026-01-08',
    2500000.00,
    2000000.00,
    5,
    3,
    7,
    '[{"reason_code": "R031", "description": "Frequent cross-border transactions"}, {"reason_code": "R012", "description": "Transactions from multiple geographies"}]'::jsonb,
    '[{"typology_code": "TYP-CROSS-BORDER", "typology_name": "Cross-Border Suspicious", "confidence": "Low"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Known Business", "high_risk_geography_involved": true, "source_countries": ["United Arab Emirates", "Singapore"], "destination_country": "India"}'::jsonb,
    '2026-01-09 10:15:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-345678' AND a.account_id = 'ACC-334455';

-- Alert 5: Global Trade Ventures - ACC-556677
-- High Value: Shell company pattern with round-number rapid fund movement
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-001345',
    c.id,
    a.id,
    'High Value',
    'AML',
    'Critical',
    'Escalated',
    92,
    'High',
    'Upstream_AML_Engine',
    '["AML-STR-001", "AML-HT-014", "AML-INT-031"]'::jsonb,
    '2026-01-05',
    '2026-01-20',
    35000000.00,
    34000000.00,
    6,
    6,
    11,
    '[{"reason_code": "R001", "description": "Transactions with round amounts indicating non-commercial pattern"}, {"reason_code": "R005", "description": "Rapid outflow to international entities shortly after large inflows"}, {"reason_code": "R008", "description": "Recently incorporated company with very high transaction volumes"}]'::jsonb,
    '[{"typology_code": "TYP-SHELL-CO", "typology_name": "Shell Company Activity", "confidence": "High"}, {"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "High"}, {"typology_code": "TYP-RAPID-MOVE", "typology_name": "Rapid Movement of Funds", "confidence": "Medium"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Unverified Entities", "high_risk_geography_involved": true, "destination_countries": ["Hong Kong", "United Arab Emirates", "Singapore"], "shell_company_indicators": true}'::jsonb,
    '2026-01-21 09:00:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-567890' AND a.account_id = 'ACC-556677';

-- Alert 6: Pooja Agarwal - ACC-445566
-- Unusual Pattern: Sudden spike in volume for retail salary account
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-001456',
    c.id,
    a.id,
    'Unusual Pattern',
    'AML',
    'Medium',
    'Open',
    48,
    'Medium',
    'Upstream_AML_Engine',
    '["AML-STR-022"]'::jsonb,
    '2026-01-15',
    '2026-02-05',
    850000.00,
    720000.00,
    8,
    4,
    8,
    '[{"reason_code": "R001", "description": "Transaction volume significantly exceeds customer profile"}, {"reason_code": "R009", "description": "Multiple third-party credits inconsistent with declared income"}]'::jsonb,
    '[{"typology_code": "TYP-FUNNEL", "typology_name": "Funnel Account Behavior", "confidence": "Low"}]'::jsonb,
    '2026-02-06 14:00:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-456789' AND a.account_id = 'ACC-445566';

-- Alert 7: Pinnacle Realty - ACC-889900
-- High Value: Large cash deposits and suspicious real estate deal patterns
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-001567',
    c.id,
    a.id,
    'High Value',
    'AML',
    'High',
    'Under_Review',
    75,
    'High',
    'Upstream_AML_Engine',
    '["AML-STR-001", "AML-CTR-005"]'::jsonb,
    '2026-01-10',
    '2026-02-10',
    45000000.00,
    42000000.00,
    6,
    5,
    9,
    '[{"reason_code": "R006", "description": "Significant cash deposits in a corporate real estate account"}, {"reason_code": "R007", "description": "Cash withdrawals cited as labor wages - potential layering"}]'::jsonb,
    '[{"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "Medium"}, {"typology_code": "TYP-STRUCTURING", "typology_name": "Structuring", "confidence": "Low"}]'::jsonb,
    '{"real_estate_indicators": true, "cash_intensive_business": true, "high_value_property_deals": true}'::jsonb,
    '2026-02-11 10:30:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-890123' AND a.account_id = 'ACC-889900';

-- Alert 8: Dr. Sunita Choudhury - ACC-990011
-- Fraud Alert: Unusual large transfers from a professional savings account
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-001678',
    c.id,
    a.id,
    'Fraud Alert',
    'Fraud',
    'Medium',
    'Open',
    52,
    'Medium',
    'Upstream_AML_Engine',
    '["FRD-ACC-001", "AML-STR-022"]'::jsonb,
    '2026-01-10',
    '2026-02-10',
    1800000.00,
    1550000.00,
    5,
    5,
    8,
    '[{"reason_code": "R010", "description": "International transfer to unfamiliar entity"}, {"reason_code": "R001", "description": "Transaction pattern inconsistent with customer profile as a medical professional"}]'::jsonb,
    '[{"typology_code": "TYP-ROUND-TRIP", "typology_name": "Round Tripping", "confidence": "Low"}]'::jsonb,
    '2026-02-11 15:00:00',
    'IN'
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-901234' AND a.account_id = 'ACC-990011';

-- =========================================================
-- AUDIT LOGS (Sample entries)
-- =========================================================

INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, details, ip_address, created_at)
SELECT
    'USER_LOGIN',
    'Authentication',
    id,
    email,
    role,
    'User',
    '{"login_method": "password", "success": true}'::jsonb,
    '192.168.1.100',
    '2026-01-15 09:00:00'
FROM users WHERE employee_id = 'EMP004';

INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address, created_at)
SELECT
    'ALERT_VIEWED',
    'Alert',
    u.id,
    u.email,
    u.role,
    'Alert',
    a.id,
    '{"alert_id": "AML-ALERT-2026-000987", "view_duration_seconds": 180}'::jsonb,
    '192.168.1.100',
    '2026-01-15 09:05:00'
FROM users u, alerts a
WHERE u.employee_id = 'EMP004' AND a.alert_id = 'AML-ALERT-2026-000987';

INSERT INTO audit_logs (action, action_category, user_id, user_email, user_role, entity_type, entity_id, details, ip_address, created_at)
SELECT
    'SAR_GENERATION_STARTED',
    'SAR',
    u.id,
    u.email,
    u.role,
    'Alert',
    a.id,
    '{"alert_id": "AML-ALERT-2026-000987", "generation_mode": "AI_Assisted"}'::jsonb,
    '192.168.1.100',
    '2026-01-15 09:10:00'
FROM users u, alerts a
WHERE u.employee_id = 'EMP004' AND a.alert_id = 'AML-ALERT-2026-000987';

-- SAR Narrative Generator - Extended Seed Data
-- Additional High/Medium risk customers, transactions, and alerts
-- Run AFTER seed.sql (depends on existing users)
-- =========================================================

-- =========================================================
-- CUSTOMERS (8 new - primarily High & Medium risk)
-- =========================================================

-- Customer 11: Jewelry dealer - cash intensive, High risk
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, address_line2, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100001', 'Individual', 'Mr', 'Rajendra', 'Prakash', 'Patil', 'Rajendra Prakash Patil',
    '1972-09-15', 'Male', 'rajendra.patil@rpjewels.com', '+91-9820456789',
    '105, Zaveri Bazaar', 'Bhuleshwar', 'Mumbai', 'Maharashtra', '400002', 'India',
    'Indian', 'AKPPP4567L', '4567-8901-2345', 'Jewellery Dealer', 'Self Employed - RP Jewels',
    '50-75 Lakhs', 'Business Income', 'Verified', '2024-06-15', '2027-06-15',
    'High', false, false, '2016-04-10',
    3000000.00, 8000000.00, 'Daily', true
);

-- Customer 12: Shell company indicators - import/export, High risk
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, address_line2, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100002', 'Corporate', 'Fatima Begum Trading Co', 'Fatima Begum Trading Co Pvt Ltd', 'U51101TN2024PTC198765', '2024-01-20',
    'accounts@fbtrading.in', '+91-44-28765432', 'Suite 408, Anna Salai Complex', 'Nandanam', 'Chennai', 'Tamil Nadu', '600035', 'India',
    'AADCF8901K', 'Verified', '2024-03-10', '2027-03-10', 'High',
    false, false, '2024-04-01',
    20000000.00, 80000000.00, 'Daily', true
);

-- Customer 13: Real estate broker - Medium risk, lots of cash
INSERT INTO customers (
    customer_id, customer_type, title, first_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, address_line2, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100003', 'Individual', 'Mr', 'Vikash', 'Choudhary', 'Vikash Choudhary',
    '1985-03-22', 'Male', 'vikash.realty@gmail.com', '+91-9312456789',
    '34, DLF Phase 2', 'Sector 25', 'Gurgaon', 'Haryana', '122002', 'India',
    'Indian', 'BKPVC2345M', '6789-0123-4567', 'Real Estate Broker', 'Self Employed - VC Realty Associates',
    '25-50 Lakhs', 'Commission Income', 'Verified', '2024-09-01', '2027-09-01',
    'Medium', false, false, '2020-07-15',
    1500000.00, 5000000.00, 'Weekly', true
);

-- Customer 14: Precious stones dealer - cross-border, High risk
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100004', 'Corporate', 'Sterling Gems International', 'Sterling Gems International Pvt Ltd', 'U36911GJ2019PTC112233', '2019-06-01',
    'finance@sterlinggems.in', '+91-79-26543210', 'Diamond Tower, Vastrapur', 'Ahmedabad', 'Gujarat', '380015', 'India',
    'AADCS5678N', 'Verified', '2024-08-20', '2027-08-20', 'High',
    false, false, '2019-08-01',
    15000000.00, 60000000.00, 'Daily', true
);

-- Customer 15: PEP-connected individual - Medium risk
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, address_line2, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100005', 'Individual', 'Mrs', 'Deepa', 'Ramachandra', 'Nair', 'Deepa Ramachandra Nair',
    '1980-11-05', 'Female', 'deepa.nair@drnconsulting.com', '+91-484-2567890',
    '12A, Marine Drive Apartments', 'Ernakulam', 'Kochi', 'Kerala', '682031', 'India',
    'Indian', 'AKPPN7890Q', '7890-1234-5678', 'Consultant', 'DRN Consulting Services',
    '25-50 Lakhs', 'Professional Fees & Investments', 'Verified', '2024-05-15', '2027-05-15',
    'Medium', true, false, '2017-11-01',
    500000.00, 2000000.00, 'Weekly', true
);

-- Customer 16: Hawala indicator company - Medium risk
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100006', 'Partnership', 'Kailash Group Holdings', 'Kailash Group Holdings', 'AAN-7845', '2021-03-10',
    'kailash.holdings@gmail.com', '+91-11-45612378', '3rd Floor, Nai Sarak', 'Chandni Chowk', 'New Delhi', 'Delhi', '110006', 'India',
    'AAHFK3456P', 'Verified', '2024-07-01', '2027-07-01', 'Medium',
    false, false, '2021-06-01',
    5000000.00, 20000000.00, 'Daily', true
);

-- Customer 17: Structuring pattern individual - High risk
INSERT INTO customers (
    customer_id, customer_type, title, first_name, middle_name, last_name, full_name,
    date_of_birth, gender, email, phone_primary,
    address_line1, city, state, postal_code, country,
    nationality, pan_number, aadhaar_number, occupation, employer_name,
    annual_income_range, source_of_funds, kyc_status, kyc_verified_date, kyc_expiry_date,
    kyc_risk_rating, pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100007', 'Individual', 'Mr', 'Mohammed', 'Tariq', 'Rizwan', 'Mohammed Tariq Rizwan',
    '1990-01-25', 'Male', 'rizwan.mt90@gmail.com', '+91-9876012345',
    '78, Aminabad Road', 'Lucknow', 'Uttar Pradesh', '226018', 'India',
    'Indian', 'BKPMR1234S', '8901-2345-6780', 'Textile Trader', 'Self Employed - MT Fabrics',
    '10-25 Lakhs', 'Business Income', 'Verified', '2025-01-10', '2028-01-10',
    'High', false, false, '2022-09-01',
    800000.00, 2500000.00, 'Weekly', true
);

-- Customer 18: Multiple red flags entity - Very High risk
INSERT INTO customers (
    customer_id, customer_type, full_name, company_name, registration_number, incorporation_date,
    email, phone_primary, address_line1, city, state, postal_code, country,
    pan_number, kyc_status, kyc_verified_date, kyc_expiry_date, kyc_risk_rating,
    pep_status, sanctions_status, relationship_start_date,
    expected_monthly_turnover_min, expected_monthly_turnover_max, expected_transaction_frequency, is_active
) VALUES (
    'CUST-100008', 'Corporate', 'Sapphire Financial Services LLP', 'Sapphire Financial Services LLP', 'AAJ-9923', '2023-11-01',
    'ops@sapphirefs.co.in', '+91-80-41234567', '2nd Floor, Brigade Road', 'Bangalore', 'Karnataka', '560025', 'India',
    'AAEFS6789M', 'Verified', '2024-02-01', '2027-02-01', 'Very High',
    false, false, '2024-01-15',
    50000000.00, 200000000.00, 'Daily', true
);

-- =========================================================
-- ACCOUNTS
-- =========================================================

-- Accounts for Customer 11 (Rajendra Patil - Jeweller)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200001', '20100001001', id, 'Current', 'Active', 'MUM004', 'Zaveri Bazaar Branch', 'DEMO0020001', 12500000.00, 12000000.00, 'INR', 10000000.00, 50000000.00, '2016-04-10', '2026-03-28', false, 'Rajendra Prakash Patil'
FROM customers WHERE customer_id = 'CUST-100001';

INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200002', '20100001002', id, 'Savings', 'Active', 'MUM004', 'Zaveri Bazaar Branch', 'DEMO0020001', 3500000.00, 3500000.00, 'INR', 2000000.00, 10000000.00, '2016-04-10', '2026-03-25', false, 'Rajendra Prakash Patil'
FROM customers WHERE customer_id = 'CUST-100001';

-- Accounts for Customer 12 (Fatima Begum Trading)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200003', '20100002001', id, 'Current', 'Active', 'CHN001', 'Anna Salai Branch', 'DEMO0020002', 35000000.00, 34000000.00, 'INR', 50000000.00, 200000000.00, '2024-04-01', '2026-03-30', false, 'Fatima Begum Trading Co Pvt Ltd'
FROM customers WHERE customer_id = 'CUST-100002';

-- Accounts for Customer 13 (Vikash Choudhary)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200004', '20100003001', id, 'Savings', 'Active', 'GUR001', 'DLF Phase 2 Branch', 'DEMO0020003', 6800000.00, 6800000.00, 'INR', 5000000.00, 20000000.00, '2020-07-15', '2026-03-29', false, 'Vikash Choudhary'
FROM customers WHERE customer_id = 'CUST-100003';

INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200005', '20100003002', id, 'Current', 'Active', 'GUR001', 'DLF Phase 2 Branch', 'DEMO0020003', 15200000.00, 15000000.00, 'INR', 10000000.00, 50000000.00, '2020-08-01', '2026-03-30', false, 'Vikash Choudhary'
FROM customers WHERE customer_id = 'CUST-100003';

-- Accounts for Customer 14 (Sterling Gems)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200006', '20100004001', id, 'Current', 'Active', 'AHM001', 'Vastrapur Branch', 'DEMO0020004', 28000000.00, 27000000.00, 'INR', 30000000.00, 100000000.00, '2019-08-01', '2026-03-30', false, 'Sterling Gems International Pvt Ltd'
FROM customers WHERE customer_id = 'CUST-100004';

-- Accounts for Customer 15 (Deepa Nair - PEP)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200007', '20100005001', id, 'Savings', 'Active', 'KOC001', 'Marine Drive Branch', 'DEMO0020005', 4200000.00, 4200000.00, 'INR', 2000000.00, 10000000.00, '2017-11-01', '2026-03-28', false, 'Deepa Ramachandra Nair'
FROM customers WHERE customer_id = 'CUST-100005';

-- Accounts for Customer 16 (Kailash Group)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200008', '20100006001', id, 'Current', 'Active', 'DEL003', 'Chandni Chowk Branch', 'DEMO0020006', 18500000.00, 18000000.00, 'INR', 20000000.00, 80000000.00, '2021-06-01', '2026-03-30', false, 'Kailash Group Holdings'
FROM customers WHERE customer_id = 'CUST-100006';

-- Accounts for Customer 17 (Mohammed Rizwan)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200009', '20100007001', id, 'Savings', 'Active', 'LKO001', 'Aminabad Branch', 'DEMO0020007', 2800000.00, 2800000.00, 'INR', 1000000.00, 5000000.00, '2022-09-01', '2026-03-29', false, 'Mohammed Tariq Rizwan'
FROM customers WHERE customer_id = 'CUST-100007';

INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200010', '20100007002', id, 'Current', 'Active', 'LKO001', 'Aminabad Branch', 'DEMO0020007', 5400000.00, 5200000.00, 'INR', 5000000.00, 20000000.00, '2023-01-15', '2026-03-30', false, 'Mohammed Tariq Rizwan'
FROM customers WHERE customer_id = 'CUST-100007';

-- Accounts for Customer 18 (Sapphire Financial)
INSERT INTO accounts (account_id, account_number, customer_id, account_type, account_status, branch_code, branch_name, ifsc_code, current_balance, available_balance, currency, daily_transaction_limit, monthly_transaction_limit, open_date, last_transaction_date, is_joint_account, primary_holder_name)
SELECT 'ACC-200011', '20100008001', id, 'Current', 'Active', 'BLR002', 'Brigade Road Branch', 'DEMO0020008', 95000000.00, 90000000.00, 'INR', 100000000.00, 500000000.00, '2024-01-15', '2026-03-30', false, 'Sapphire Financial Services LLP'
FROM customers WHERE customer_id = 'CUST-100008';

-- =========================================================
-- TRANSACTIONS: Customer 11 (Rajendra Patil - Jeweller)
-- Pattern: Heavy cash deposits, gold trade, structuring
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-001', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 980000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - daily shop sales', 'CD20260301001', 'Branch', '2026-03-01', '2026-03-01 10:30:00', '2026-03-01', '2026-03-01', 11480000.00),
('TXN-EXT-002', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 950000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - sales proceeds', 'CD20260302001', 'Branch', '2026-03-02', '2026-03-02 11:00:00', '2026-03-02', '2026-03-02', 12430000.00),
('TXN-EXT-003', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 990000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - retail collections', 'CD20260303001', 'Branch', '2026-03-03', '2026-03-03 10:45:00', '2026-03-03', '2026-03-03', 13420000.00),
('TXN-EXT-004', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 970000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - gold sales', 'CD20260304001', 'Branch', '2026-03-04', '2026-03-04 11:15:00', '2026-03-04', '2026-03-04', 14390000.00),
('TXN-EXT-005', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 960000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - walk-in customers', 'CD20260305001', 'Branch', '2026-03-05', '2026-03-05 10:30:00', '2026-03-05', '2026-03-05', 15350000.00),
('TXN-EXT-006', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'RTGS', 'Completed', 2500000.00, 'INR', 'MMTC-PAMP India Pvt Ltd', '11220033445566', 'SBI', 'India', 'Gold bullion purchase - 250gm', 'RTGS20260302001', 'Internet_Banking', '2026-03-02', '2026-03-02 15:30:00', '2026-03-02', '2026-03-02', 9930000.00),
('TXN-EXT-007', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Wire_Transfer', 'Completed', 5500000.00, 'INR', 'Dubai Gold Souk Trading LLC', 'AE445566778899001122334', 'Mashreq Bank', 'United Arab Emirates', 'Gold jewelry import - Invoice DGS-2026-089', 'SWIFT20260305001', 'Wire', '2026-03-05', '2026-03-05 16:00:00', '2026-03-05', '2026-03-05', 9850000.00),
('TXN-EXT-008', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 940000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - Holi festival sales', 'CD20260306001', 'Branch', '2026-03-06', '2026-03-06 10:00:00', '2026-03-06', '2026-03-06', 10790000.00),
('TXN-EXT-009', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'NEFT', 'Completed', 1200000.00, 'INR', 'Rajkot Gold Refinery', '33440055667788', 'Bank of Baroda', 'India', 'Refined gold purchase - 120gm', 'NEFT20260307001', 'Internet_Banking', '2026-03-07', '2026-03-07 14:00:00', '2026-03-07', '2026-03-07', 9590000.00),
('TXN-EXT-010', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 985000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - weekend sales', 'CD20260308001', 'Branch', '2026-03-08', '2026-03-08 11:30:00', '2026-03-08', '2026-03-08', 10575000.00),
('TXN-EXT-011', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Wire_Transfer', 'Completed', 3200000.00, 'INR', 'Bangkok Gems Co Ltd', 'TH9988776655443322', 'Bangkok Bank', 'Thailand', 'Precious stones import - Ruby lot', 'SWIFT20260310001', 'Wire', '2026-03-10', '2026-03-10 12:00:00', '2026-03-10', '2026-03-10', 7375000.00),
('TXN-EXT-012', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 975000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - custom orders', 'CD20260311001', 'Branch', '2026-03-11', '2026-03-11 10:45:00', '2026-03-11', '2026-03-11', 8350000.00),
('TXN-EXT-013', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'RTGS', 'Completed', 1800000.00, 'INR', 'Surat Diamond Bourse', '55660077889900', 'HDFC Bank', 'India', 'Diamond lot purchase - 5ct mixed', 'RTGS20260312001', 'Internet_Banking', '2026-03-12', '2026-03-12 15:00:00', '2026-03-12', '2026-03-12', 6550000.00),
('TXN-EXT-014', (SELECT id FROM accounts WHERE account_id = 'ACC-200001'), 'Cash_Deposit', 'Completed', 920000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - store income', 'CD20260313001', 'Branch', '2026-03-13', '2026-03-13 11:00:00', '2026-03-13', '2026-03-13', 7470000.00),
('TXN-EXT-015', (SELECT id FROM accounts WHERE account_id = 'ACC-200002'), 'Transfer_In', 'Completed', 2000000.00, 'INR', 'Rajendra Prakash Patil', '20100001001', 'Self Transfer', 'India', 'Transfer to savings', 'INT20260314001', 'Internet_Banking', '2026-03-14', '2026-03-14 18:00:00', '2026-03-14', '2026-03-14', 5500000.00);

-- =========================================================
-- TRANSACTIONS: Customer 12 (Fatima Begum Trading - Shell indicators)
-- Pattern: Large inflows from obscure entities, rapid outflows to high-risk jurisdictions
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-016', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 15000000.00, 'INR', 'Golden Horizon FZE', 'AE778899001122334455667', 'Emirates Islamic Bank', 'United Arab Emirates', 'Trade advance - Spice import LC-2026-045', 'SWIFT20260301001', 'Wire', '2026-03-01', '2026-03-01 10:00:00', '2026-03-01', '2026-03-01', 50000000.00),
('TXN-EXT-017', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 12000000.00, 'INR', 'Nairobi Trading House Ltd', 'KE1234567890123456789012', 'Kenya Commercial Bank', 'Kenya', 'Tea export proceeds - Contract NTH-2026-012', 'SWIFT20260302001', 'Wire', '2026-03-02', '2026-03-02 11:30:00', '2026-03-02', '2026-03-02', 62000000.00),
('TXN-EXT-018', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 14000000.00, 'INR', 'Phoenix Star Trading DMCC', 'AE334455667788990011223', 'National Bank of Ras Al Khaimah', 'United Arab Emirates', 'Commodity settlement', 'SWIFT20260303002', 'Wire', '2026-03-03', '2026-03-03 14:00:00', '2026-03-03', '2026-03-03', 62000000.00),
('TXN-EXT-019', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 13500000.00, 'INR', 'Colombo Spice Exchange PLC', 'LK1234567890123456', 'Commercial Bank of Ceylon', 'Sri Lanka', 'Cinnamon export settlement', 'SWIFT20260303001', 'Wire', '2026-03-03', '2026-03-03 09:30:00', '2026-03-03', '2026-03-03', 48500000.00),
('TXN-EXT-020', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'RTGS', 'Completed', 8000000.00, 'INR', 'Vijayalakshmi Enterprises', '77889900112244', 'Indian Overseas Bank', 'India', 'Commission on facilitation services', 'RTGS20260304001', 'Internet_Banking', '2026-03-04', '2026-03-04 12:00:00', '2026-03-04', '2026-03-04', 56500000.00),
('TXN-EXT-021', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 18000000.00, 'INR', 'Muscat International Trading LLC', 'OM12345678901234567890', 'Bank Muscat', 'Oman', 'Import advance - Dates and dry fruits', 'SWIFT20260305002', 'Wire', '2026-03-05', '2026-03-05 10:30:00', '2026-03-05', '2026-03-05', 38500000.00),
('TXN-EXT-022', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 10000000.00, 'INR', 'Lagos Commerce Ltd', 'NG1234567890123456789', 'First Bank of Nigeria', 'Nigeria', 'Payment for textile shipment', 'SWIFT20260306001', 'Wire', '2026-03-06', '2026-03-06 15:00:00', '2026-03-06', '2026-03-06', 28500000.00),
('TXN-EXT-023', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'RTGS', 'Completed', 5000000.00, 'INR', 'Anand Logistics Pvt Ltd', '88990011223355', 'Axis Bank', 'India', 'Freight charges - 6 containers', 'RTGS20260307001', 'Internet_Banking', '2026-03-07', '2026-03-07 16:30:00', '2026-03-07', '2026-03-07', 23500000.00),
('TXN-EXT-024', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 20000000.00, 'INR', 'Sharjah Free Zone Trading FZE', 'AE556677889900112233445', 'Sharjah Islamic Bank', 'United Arab Emirates', 'Pre-shipment advance - Gold jewelry', 'SWIFT20260308001', 'Wire', '2026-03-08', '2026-03-08 11:00:00', '2026-03-08', '2026-03-08', 43500000.00),
('TXN-EXT-025', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Wire_Transfer', 'Completed', 16000000.00, 'INR', 'Dhaka Garments Export Ltd', 'BD12345678901234567890', 'Standard Chartered Bangladesh', 'Bangladesh', 'Garment export advance', 'SWIFT20260309001', 'Wire', '2026-03-09', '2026-03-09 14:30:00', '2026-03-09', '2026-03-09', 27500000.00),
('TXN-EXT-026', (SELECT id FROM accounts WHERE account_id = 'ACC-200003'), 'Cash_Deposit', 'Completed', 5000000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - local trade receivables', 'CD20260310001', 'Branch', '2026-03-10', '2026-03-10 12:00:00', '2026-03-10', '2026-03-10', 32500000.00);

-- =========================================================
-- TRANSACTIONS: Customer 13 (Vikash Choudhary - Real estate broker)
-- Pattern: Round-trip between accounts, property deal cash, dormant-to-active
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-027', (SELECT id FROM accounts WHERE account_id = 'ACC-200004'), 'Cash_Deposit', 'Completed', 2500000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - booking advance received', 'CD20260301002', 'Branch', '2026-03-01', '2026-03-01 11:00:00', '2026-03-01', '2026-03-01', 9300000.00),
('TXN-EXT-028', (SELECT id FROM accounts WHERE account_id = 'ACC-200005'), 'RTGS', 'Completed', 8000000.00, 'INR', 'Oberoi Constructions Ltd', '44553366778899', 'HDFC Bank', 'India', 'Builder payment - Flat 1204 Palm Beach', 'RTGS20260301001', 'Internet_Banking', '2026-03-01', '2026-03-01 15:30:00', '2026-03-01', '2026-03-01', 7200000.00),
('TXN-EXT-029', (SELECT id FROM accounts WHERE account_id = 'ACC-200004'), 'NEFT', 'Completed', 3500000.00, 'INR', 'Sunita Devi', '55443322119988', 'Punjab National Bank', 'India', 'Brokerage commission - Sector 57 deal', 'NEFT20260303001', 'Internet_Banking', '2026-03-03', '2026-03-03 10:00:00', '2026-03-03', '2026-03-03', 12800000.00),
('TXN-EXT-030', (SELECT id FROM accounts WHERE account_id = 'ACC-200005'), 'Cash_Deposit', 'Completed', 4500000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - property deal earnest money', 'CD20260304001', 'Branch', '2026-03-04', '2026-03-04 12:30:00', '2026-03-04', '2026-03-04', 11700000.00),
('TXN-EXT-031', (SELECT id FROM accounts WHERE account_id = 'ACC-200005'), 'RTGS', 'Completed', 10000000.00, 'INR', 'DLF Homes Gurgaon', '66775544332211', 'ICICI Bank', 'India', 'Plot purchase - DLF Garden City Phase 3', 'RTGS20260305001', 'Internet_Banking', '2026-03-05', '2026-03-05 14:00:00', '2026-03-05', '2026-03-05', 1700000.00),
('TXN-EXT-032', (SELECT id FROM accounts WHERE account_id = 'ACC-200004'), 'Transfer_Out', 'Completed', 5000000.00, 'INR', 'Vikash Choudhary', '20100003002', 'Self Transfer', 'India', 'Self transfer to current account', 'INT20260305001', 'Internet_Banking', '2026-03-05', '2026-03-05 09:00:00', '2026-03-05', '2026-03-05', 7800000.00),
('TXN-EXT-033', (SELECT id FROM accounts WHERE account_id = 'ACC-200004'), 'NEFT', 'Completed', 2000000.00, 'INR', 'Ramesh Gupta', '77886655443322', 'SBI', 'India', 'Commission refund - cancelled deal', 'NEFT20260306001', 'Internet_Banking', '2026-03-06', '2026-03-06 16:00:00', '2026-03-06', '2026-03-06', 9800000.00),
('TXN-EXT-034', (SELECT id FROM accounts WHERE account_id = 'ACC-200005'), 'RTGS', 'Completed', 6000000.00, 'INR', 'GreenFields Developers', '88997766554433', 'Kotak Bank', 'India', 'Advance for farmhouse land deal', 'RTGS20260308001', 'Internet_Banking', '2026-03-08', '2026-03-08 11:30:00', '2026-03-08', '2026-03-08', 700000.00),
('TXN-EXT-035', (SELECT id FROM accounts WHERE account_id = 'ACC-200004'), 'Cash_Deposit', 'Completed', 3000000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - token money collection', 'CD20260309001', 'Branch', '2026-03-09', '2026-03-09 10:00:00', '2026-03-09', '2026-03-09', 12800000.00),
('TXN-EXT-036', (SELECT id FROM accounts WHERE account_id = 'ACC-200005'), 'NEFT', 'Completed', 1500000.00, 'INR', 'Haryana Revenue Department', '99008877665544', 'SBI', 'India', 'Stamp duty and registration charges', 'NEFT20260310001', 'Internet_Banking', '2026-03-10', '2026-03-10 14:00:00', '2026-03-10', '2026-03-10', 5200000.00);

-- =========================================================
-- TRANSACTIONS: Customer 14 (Sterling Gems - Cross-border precious stones)
-- Pattern: International wire transfers, trade-based ML indicators
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-037', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'Wire_Transfer', 'Completed', 8000000.00, 'INR', 'Antwerp Diamond Exchange NV', 'BE12345678901234', 'KBC Bank', 'Belgium', 'Diamond import - 50ct rough lot', 'SWIFT20260301002', 'Wire', '2026-03-01', '2026-03-01 10:30:00', '2026-03-01', '2026-03-01', 20000000.00),
('TXN-EXT-038', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'Wire_Transfer', 'Completed', 12000000.00, 'INR', 'Tel Aviv Precious Stones Ltd', 'IL123456789012345678', 'Bank Hapoalim', 'Israel', 'Emerald lot procurement - Invoice TPS-2026-045', 'SWIFT20260303001', 'Wire', '2026-03-03', '2026-03-03 14:00:00', '2026-03-03', '2026-03-03', 8000000.00),
('TXN-EXT-039', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'Wire_Transfer', 'Completed', 15000000.00, 'INR', 'Hong Kong Jade Trading Ltd', 'HK22334455667788', 'Bank of East Asia', 'Hong Kong', 'Jade and semi-precious stones import', 'SWIFT20260304001', 'Wire', '2026-03-04', '2026-03-04 11:00:00', '2026-03-04', '2026-03-04', 23000000.00),
('TXN-EXT-040', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'RTGS', 'Completed', 5000000.00, 'INR', 'Jaipur Gem Cutting House', '11223344667788', 'Bank of Rajasthan', 'India', 'Gem cutting and polishing charges', 'RTGS20260305002', 'Internet_Banking', '2026-03-05', '2026-03-05 12:30:00', '2026-03-05', '2026-03-05', 18000000.00),
('TXN-EXT-041', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'Wire_Transfer', 'Completed', 10000000.00, 'INR', 'Dubai Multi Commodities Centre', 'AE112233445566778899002', 'Emirates NBD', 'United Arab Emirates', 'Gold bar consignment - 1kg', 'SWIFT20260307001', 'Wire', '2026-03-07', '2026-03-07 15:00:00', '2026-03-07', '2026-03-07', 28000000.00),
('TXN-EXT-042', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'Wire_Transfer', 'Completed', 6000000.00, 'INR', 'Colombo Gem Bureau', 'LK9876543210987654', 'Hatton National Bank', 'Sri Lanka', 'Blue sapphire lot - 30ct', 'SWIFT20260309001', 'Wire', '2026-03-09', '2026-03-09 10:00:00', '2026-03-09', '2026-03-09', 22000000.00),
('TXN-EXT-043', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'RTGS', 'Completed', 7000000.00, 'INR', 'Mumbai Bullion Association', '99887711223344', 'Union Bank', 'India', 'Gold purchase - 700gm', 'RTGS20260310001', 'Internet_Banking', '2026-03-10', '2026-03-10 14:30:00', '2026-03-10', '2026-03-10', 15000000.00),
('TXN-EXT-044', (SELECT id FROM accounts WHERE account_id = 'ACC-200006'), 'Wire_Transfer', 'Completed', 20000000.00, 'INR', 'Siam Ruby Mining Corp', 'TH5566778899001122', 'Kasikornbank', 'Thailand', 'Ruby mining rights and rough stone purchase', 'SWIFT20260312001', 'Wire', '2026-03-12', '2026-03-12 11:30:00', '2026-03-12', '2026-03-12', 35000000.00);

-- =========================================================
-- TRANSACTIONS: Customer 15 (Deepa Nair - PEP connected)
-- Pattern: Government contract payments, political donation patterns
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-045', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'RTGS', 'Completed', 1500000.00, 'INR', 'Kerala State IT Dept', '11009922334455', 'SBI', 'India', 'Consulting fees - e-Governance project', 'RTGS20260301002', 'Internet_Banking', '2026-03-01', '2026-03-01 10:00:00', '2026-03-01', '2026-03-01', 5700000.00),
('TXN-EXT-046', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'NEFT', 'Completed', 800000.00, 'INR', 'BJP Kerala State Committee', '22001133445566', 'HDFC Bank', 'India', 'Political donation - Q1 2026', 'NEFT20260303002', 'Internet_Banking', '2026-03-03', '2026-03-03 14:30:00', '2026-03-03', '2026-03-03', 4900000.00),
('TXN-EXT-047', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'RTGS', 'Completed', 2000000.00, 'INR', 'Kochi Metro Rail Corp', '33002244556677', 'Canara Bank', 'India', 'Advisory fees - Phase 2 planning', 'RTGS20260305003', 'Internet_Banking', '2026-03-05', '2026-03-05 11:00:00', '2026-03-05', '2026-03-05', 6900000.00),
('TXN-EXT-048', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'NEFT', 'Completed', 500000.00, 'INR', 'Ramachandra Foundation Trust', '44003355667788', 'Federal Bank', 'India', 'Trust contribution - family trust', 'NEFT20260306002', 'Internet_Banking', '2026-03-06', '2026-03-06 16:00:00', '2026-03-06', '2026-03-06', 6400000.00),
('TXN-EXT-049', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'Wire_Transfer', 'Completed', 350000.00, 'INR', 'Singapore Consulting Pte Ltd', 'SG2233445566778899', 'DBS Bank', 'Singapore', 'Overseas consulting assignment fee', 'SWIFT20260308002', 'Wire', '2026-03-08', '2026-03-08 10:30:00', '2026-03-08', '2026-03-08', 6050000.00),
('TXN-EXT-050', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'Cash_Deposit', 'Completed', 900000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - event honorarium', 'CD20260310002', 'Branch', '2026-03-10', '2026-03-10 11:00:00', '2026-03-10', '2026-03-10', 6950000.00),
('TXN-EXT-051', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'NEFT', 'Completed', 1200000.00, 'INR', 'Nair Real Estate Holdings', '55004466778899', 'South Indian Bank', 'India', 'Property rental income - 3 months', 'NEFT20260312002', 'Internet_Banking', '2026-03-12', '2026-03-12 14:00:00', '2026-03-12', '2026-03-12', 8150000.00),
('TXN-EXT-052', (SELECT id FROM accounts WHERE account_id = 'ACC-200007'), 'RTGS', 'Completed', 750000.00, 'INR', 'Luxury Motors Kerala', '66005577889900', 'Kotak Bank', 'India', 'Vehicle purchase - Mercedes GLC', 'RTGS20260314001', 'Internet_Banking', '2026-03-14', '2026-03-14 15:30:00', '2026-03-14', '2026-03-14', 7400000.00);

-- =========================================================
-- TRANSACTIONS: Customer 16 (Kailash Group - Hawala indicators)
-- Pattern: Many small counterparties, same-day in-out, geographic spread
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-053', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 450000.00, 'INR', 'Abdul Rahman', '11223344556600', 'Jammu & Kashmir Bank', 'India', 'Trade settlement - cloth', 'NEFT20260301003', 'Internet_Banking', '2026-03-01', '2026-03-01 09:15:00', '2026-03-01', '2026-03-01', 18950000.00),
('TXN-EXT-054', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 380000.00, 'INR', 'Sharma Brothers Textiles', '22334455667711', 'Punjab National Bank', 'India', 'Fabric purchase', 'NEFT20260301004', 'Internet_Banking', '2026-03-01', '2026-03-01 09:45:00', '2026-03-01', '2026-03-01', 18570000.00),
('TXN-EXT-055', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'IMPS', 'Completed', 200000.00, 'INR', 'Gulshan Enterprises', '33445566778822', 'Bank of India', 'India', 'Payment received', 'IMPS20260301001', 'Mobile_Banking', '2026-03-01', '2026-03-01 10:30:00', '2026-03-01', '2026-03-01', 18770000.00),
('TXN-EXT-056', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 350000.00, 'INR', 'Javed Akhtar', '44556677889933', 'Central Bank of India', 'India', 'Trade payment', 'NEFT20260301005', 'Internet_Banking', '2026-03-01', '2026-03-01 11:00:00', '2026-03-01', '2026-03-01', 19120000.00),
('TXN-EXT-057', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 500000.00, 'INR', 'Lucknow Chikan House', '55667788990044', 'Allahabad Bank', 'India', 'Embroidery order payment', 'NEFT20260302001', 'Internet_Banking', '2026-03-02', '2026-03-02 09:00:00', '2026-03-02', '2026-03-02', 18620000.00),
('TXN-EXT-058', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 420000.00, 'INR', 'Moradabad Brass Works', '66778899001155', 'Canara Bank', 'India', 'Handicraft merchandise', 'NEFT20260302002', 'Internet_Banking', '2026-03-02', '2026-03-02 10:30:00', '2026-03-02', '2026-03-02', 18200000.00),
('TXN-EXT-059', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'IMPS', 'Completed', 300000.00, 'INR', 'Faizal Khan', '77889900112266', 'Yes Bank', 'India', 'Collection received', 'IMPS20260302002', 'Mobile_Banking', '2026-03-02', '2026-03-02 12:00:00', '2026-03-02', '2026-03-02', 18500000.00),
('TXN-EXT-060', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 600000.00, 'INR', 'Srinagar Carpet Exports', '88990011223377', 'J&K Bank', 'India', 'Carpet export consignment', 'NEFT20260303003', 'Internet_Banking', '2026-03-03', '2026-03-03 09:30:00', '2026-03-03', '2026-03-03', 17900000.00),
('TXN-EXT-061', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'Wire_Transfer', 'Completed', 2500000.00, 'INR', 'Kuwait Carpet Gallery WLL', 'KW12345678901234567890', 'National Bank of Kuwait', 'Kuwait', 'Carpet export payment', 'SWIFT20260304001', 'Wire', '2026-03-04', '2026-03-04 14:00:00', '2026-03-04', '2026-03-04', 20400000.00),
('TXN-EXT-062', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'NEFT', 'Completed', 480000.00, 'INR', 'Riyaz Handicrafts', '99001122334488', 'Union Bank', 'India', 'Artisan payment', 'NEFT20260304002', 'Internet_Banking', '2026-03-04', '2026-03-04 15:30:00', '2026-03-04', '2026-03-04', 19920000.00),
('TXN-EXT-063', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'Cash_Deposit', 'Completed', 900000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - Nai Sarak sales', 'CD20260305001', 'Branch', '2026-03-05', '2026-03-05 11:00:00', '2026-03-05', '2026-03-05', 20820000.00),
('TXN-EXT-064', (SELECT id FROM accounts WHERE account_id = 'ACC-200008'), 'Wire_Transfer', 'Completed', 3000000.00, 'INR', 'Bahrain Trading House BSC', 'BH12345678901234567890', 'National Bank of Bahrain', 'Bahrain', 'Trade settlement - textile export', 'SWIFT20260306002', 'Wire', '2026-03-06', '2026-03-06 10:00:00', '2026-03-06', '2026-03-06', 17820000.00);

-- =========================================================
-- TRANSACTIONS: Customer 17 (Mohammed Rizwan - Structuring)
-- Pattern: Multiple deposits just under 10L, split across 2 accounts
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-065', (SELECT id FROM accounts WHERE account_id = 'ACC-200009'), 'Cash_Deposit', 'Completed', 950000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - fabric sales', 'CD20260301003', 'Branch', '2026-03-01', '2026-03-01 10:00:00', '2026-03-01', '2026-03-01', 3750000.00),
('TXN-EXT-066', (SELECT id FROM accounts WHERE account_id = 'ACC-200010'), 'Cash_Deposit', 'Completed', 980000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - shop collection', 'CD20260301004', 'Branch', '2026-03-01', '2026-03-01 14:00:00', '2026-03-01', '2026-03-01', 6380000.00),
('TXN-EXT-067', (SELECT id FROM accounts WHERE account_id = 'ACC-200009'), 'Cash_Deposit', 'Completed', 920000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - wholesale order', 'CD20260302003', 'Branch', '2026-03-02', '2026-03-02 10:30:00', '2026-03-02', '2026-03-02', 4670000.00),
('TXN-EXT-068', (SELECT id FROM accounts WHERE account_id = 'ACC-200010'), 'Cash_Deposit', 'Completed', 960000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - trade receipts', 'CD20260302004', 'Branch', '2026-03-02', '2026-03-02 15:00:00', '2026-03-02', '2026-03-02', 7340000.00),
('TXN-EXT-069', (SELECT id FROM accounts WHERE account_id = 'ACC-200009'), 'Cash_Deposit', 'Completed', 990000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - festival sales', 'CD20260303004', 'Branch', '2026-03-03', '2026-03-03 10:15:00', '2026-03-03', '2026-03-03', 5660000.00),
('TXN-EXT-070', (SELECT id FROM accounts WHERE account_id = 'ACC-200010'), 'Cash_Deposit', 'Completed', 940000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - daily sales', 'CD20260303005', 'Branch', '2026-03-03', '2026-03-03 14:30:00', '2026-03-03', '2026-03-03', 8280000.00),
('TXN-EXT-071', (SELECT id FROM accounts WHERE account_id = 'ACC-200010'), 'RTGS', 'Completed', 3500000.00, 'INR', 'Surat Textile Mills', '22334455001122', 'Bank of Baroda', 'India', 'Fabric bulk purchase', 'RTGS20260304002', 'Internet_Banking', '2026-03-04', '2026-03-04 11:00:00', '2026-03-04', '2026-03-04', 4780000.00),
('TXN-EXT-072', (SELECT id FROM accounts WHERE account_id = 'ACC-200009'), 'Cash_Deposit', 'Completed', 970000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - Eid advance orders', 'CD20260305003', 'Branch', '2026-03-05', '2026-03-05 10:00:00', '2026-03-05', '2026-03-05', 6630000.00),
('TXN-EXT-073', (SELECT id FROM accounts WHERE account_id = 'ACC-200010'), 'Cash_Deposit', 'Completed', 930000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - wholesale collection', 'CD20260305004', 'Branch', '2026-03-05', '2026-03-05 15:00:00', '2026-03-05', '2026-03-05', 5710000.00),
('TXN-EXT-074', (SELECT id FROM accounts WHERE account_id = 'ACC-200009'), 'NEFT', 'Completed', 1500000.00, 'INR', 'Varanasi Silk Emporium', '33445566007788', 'Allahabad Bank', 'India', 'Silk fabric order - Banarasi', 'NEFT20260306003', 'Internet_Banking', '2026-03-06', '2026-03-06 12:00:00', '2026-03-06', '2026-03-06', 5130000.00),
('TXN-EXT-075', (SELECT id FROM accounts WHERE account_id = 'ACC-200009'), 'Cash_Deposit', 'Completed', 985000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - market sales', 'CD20260307001', 'Branch', '2026-03-07', '2026-03-07 10:30:00', '2026-03-07', '2026-03-07', 6115000.00),
('TXN-EXT-076', (SELECT id FROM accounts WHERE account_id = 'ACC-200010'), 'Cash_Deposit', 'Completed', 955000.00, 'INR', NULL, NULL, NULL, 'India', 'Cash deposit - seasonal orders', 'CD20260307002', 'Branch', '2026-03-07', '2026-03-07 14:00:00', '2026-03-07', '2026-03-07', 6665000.00);

-- =========================================================
-- TRANSACTIONS: Customer 18 (Sapphire Financial - Multiple red flags)
-- Pattern: Round amounts, layering through multiple entities, offshore
-- =========================================================

INSERT INTO transactions (transaction_id, account_id, transaction_type, transaction_status, amount, currency, counterparty_name, counterparty_account_number, counterparty_bank_name, counterparty_country, description, reference_number, channel, transaction_date, transaction_timestamp, value_date, posting_date, balance_after)
VALUES
('TXN-EXT-077', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 25000000.00, 'INR', 'Cayman Islands Holding Corp', 'KY12345678901234567890', 'Butterfield Bank', 'Cayman Islands', 'Investment return - Fund A', 'SWIFT20260301003', 'Wire', '2026-03-01', '2026-03-01 10:00:00', '2026-03-01', '2026-03-01', 120000000.00),
('TXN-EXT-078', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 20000000.00, 'INR', 'BVI Asset Management Ltd', 'VG12345678901234567890', 'First Caribbean International Bank', 'British Virgin Islands', 'Fund redemption proceeds', 'SWIFT20260302002', 'Wire', '2026-03-02', '2026-03-02 11:00:00', '2026-03-02', '2026-03-02', 140000000.00),
('TXN-EXT-079', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'RTGS', 'Completed', 10000000.00, 'INR', 'Infinity Capital Partners', '11223344998877', 'Yes Bank', 'India', 'Investment advisory fees received', 'RTGS20260303002', 'Internet_Banking', '2026-03-03', '2026-03-03 09:30:00', '2026-03-03', '2026-03-03', 150000000.00),
('TXN-EXT-080', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 30000000.00, 'INR', 'Panama Wealth Holdings SA', 'PA12345678901234567890', 'Banco General', 'Panama', 'Fund allocation - Emerging Markets', 'SWIFT20260304002', 'Wire', '2026-03-04', '2026-03-04 14:00:00', '2026-03-04', '2026-03-04', 120000000.00),
('TXN-EXT-081', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 15000000.00, 'INR', 'Mauritius Gateway Fund Ltd', 'MU12345678901234567890', 'State Bank of Mauritius', 'Mauritius', 'FDI route - Equity subscription', 'SWIFT20260305004', 'Wire', '2026-03-05', '2026-03-05 10:00:00', '2026-03-05', '2026-03-05', 105000000.00),
('TXN-EXT-082', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'RTGS', 'Completed', 15000000.00, 'INR', 'Zenith Infra Developers Pvt Ltd', '22334455001199', 'ICICI Bank', 'India', 'Infrastructure project investment', 'RTGS20260306003', 'Internet_Banking', '2026-03-06', '2026-03-06 15:00:00', '2026-03-06', '2026-03-06', 90000000.00),
('TXN-EXT-083', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 18000000.00, 'INR', 'Swiss Private Wealth AG', 'CH12345678901234567890', 'Credit Suisse', 'Switzerland', 'Wealth management fee settlement', 'SWIFT20260307002', 'Wire', '2026-03-07', '2026-03-07 11:30:00', '2026-03-07', '2026-03-07', 72000000.00),
('TXN-EXT-084', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 22000000.00, 'INR', 'Dubai International Financial Centre', 'AE998877665544332211001', 'Standard Chartered UAE', 'United Arab Emirates', 'Fund transfer - DIFC investment vehicle', 'SWIFT20260308003', 'Wire', '2026-03-08', '2026-03-08 10:00:00', '2026-03-08', '2026-03-08', 50000000.00),
('TXN-EXT-085', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'RTGS', 'Completed', 20000000.00, 'INR', 'Eclipse Ventures Pvt Ltd', '33445566002211', 'Kotak Bank', 'India', 'Startup fund allocation - Series B', 'RTGS20260309002', 'Internet_Banking', '2026-03-09', '2026-03-09 14:00:00', '2026-03-09', '2026-03-09', 70000000.00),
('TXN-EXT-086', (SELECT id FROM accounts WHERE account_id = 'ACC-200011'), 'Wire_Transfer', 'Completed', 12000000.00, 'INR', 'Singapore Sovereign Wealth Advisors', 'SG9988776655443322', 'OCBC Bank', 'Singapore', 'Advisory mandate fees', 'SWIFT20260310002', 'Wire', '2026-03-10', '2026-03-10 16:00:00', '2026-03-10', '2026-03-10', 82000000.00);

-- =========================================================
-- ALERTS (8 new alerts for extended customers)
-- =========================================================

-- Alert 9: Rajendra Patil - Structuring cash deposits
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002001', c.id, a.id,
    'Structuring', 'AML', 'High', 'Open',
    82, 'High', 'Upstream_AML_Engine',
    '["AML-CTR-005", "AML-STR-022", "AML-INT-031"]'::jsonb,
    '2026-03-01', '2026-03-14',
    8670000.00, 14200000.00, 9, 5, 6,
    '[{"reason_code": "R003", "description": "Eight cash deposits in 14 days, all below 10 lakh CTR threshold"}, {"reason_code": "R006", "description": "Cash-intensive business with deposits structured between 9.2L-9.9L"}, {"reason_code": "R031", "description": "Wire transfers to UAE and Thailand for gold and gems import"}]'::jsonb,
    '[{"typology_code": "TYP-STRUCTURING", "typology_name": "Structuring", "confidence": "High"}, {"typology_code": "TYP-TRADE-ML", "typology_name": "Trade-Based Money Laundering", "confidence": "Medium"}]'::jsonb,
    '{"cash_intensive_business": true, "high_risk_geography_involved": true, "destination_countries": ["United Arab Emirates", "Thailand"], "precious_metals_dealer": true}'::jsonb,
    '2026-03-15 09:00:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100001' AND a.account_id = 'ACC-200001';

-- Alert 10: Fatima Begum Trading - Shell company, rapid international movement
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002002', c.id, a.id,
    'Suspicious Transaction', 'AML', 'Critical', 'Open',
    95, 'Critical', 'Upstream_AML_Engine',
    '["AML-STR-001", "AML-HT-014", "AML-INT-031"]'::jsonb,
    '2026-03-01', '2026-03-10',
    53000000.00, 84500000.00, 4, 7, 10,
    '[{"reason_code": "R001", "description": "Recently incorporated company with massive international fund flows"}, {"reason_code": "R005", "description": "Wire transfers to high-risk jurisdictions including Nigeria, Oman, Bangladesh"}, {"reason_code": "R008", "description": "No verifiable trade documentation for majority of transactions"}]'::jsonb,
    '[{"typology_code": "TYP-SHELL-CO", "typology_name": "Shell Company Activity", "confidence": "High"}, {"typology_code": "TYP-TRADE-ML", "typology_name": "Trade-Based Money Laundering", "confidence": "High"}, {"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "Medium"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Unverified Entities", "high_risk_geography_involved": true, "destination_countries": ["United Arab Emirates", "Nigeria", "Oman", "Kenya", "Bangladesh", "Sri Lanka"], "shell_company_indicators": true, "recently_incorporated": true}'::jsonb,
    '2026-03-11 08:30:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100002' AND a.account_id = 'ACC-200003';

-- Alert 11: Vikash Choudhary - Real estate cash, round-trip
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002003', c.id, a.id,
    'High Value', 'AML', 'High', 'Under_Review',
    74, 'High', 'Upstream_AML_Engine',
    '["AML-STR-001", "AML-CTR-005"]'::jsonb,
    '2026-03-01', '2026-03-10',
    16000000.00, 32000000.00, 4, 6, 7,
    '[{"reason_code": "R006", "description": "Large cash deposits in a real estate broker account"}, {"reason_code": "R007", "description": "Self-transfers between savings and current accounts to obscure fund trail"}, {"reason_code": "R008", "description": "Property transactions with unverified source of funds"}]'::jsonb,
    '[{"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "Medium"}, {"typology_code": "TYP-ROUND-TRIP", "typology_name": "Round Tripping", "confidence": "High"}]'::jsonb,
    '{"real_estate_indicators": true, "cash_intensive_business": true, "self_transfer_pattern": true}'::jsonb,
    '2026-03-11 11:00:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100003' AND a.account_id = 'ACC-200004';

-- Alert 12: Sterling Gems - Cross border trade-based ML
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002004', c.id, a.id,
    'Cross Border', 'AML', 'Critical', 'Open',
    88, 'Critical', 'Upstream_AML_Engine',
    '["AML-STR-001", "AML-INT-031"]'::jsonb,
    '2026-03-01', '2026-03-12',
    40000000.00, 71000000.00, 2, 6, 8,
    '[{"reason_code": "R001", "description": "Very high-value international transfers across 6 countries"}, {"reason_code": "R005", "description": "Precious stones trade used for potential trade-based money laundering"}, {"reason_code": "R031", "description": "Rapid cross-border fund flows exceeding declared business profile"}]'::jsonb,
    '[{"typology_code": "TYP-TRADE-ML", "typology_name": "Trade-Based Money Laundering", "confidence": "High"}, {"typology_code": "TYP-CROSS-BORDER", "typology_name": "Cross-Border Suspicious", "confidence": "High"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Trade Partners", "high_risk_geography_involved": true, "destination_countries": ["Belgium", "Israel", "Hong Kong", "United Arab Emirates", "Sri Lanka", "Thailand"], "precious_metals_dealer": true}'::jsonb,
    '2026-03-13 09:45:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100004' AND a.account_id = 'ACC-200006';

-- Alert 13: Deepa Nair - PEP Activity
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002005', c.id, a.id,
    'PEP Activity', 'AML', 'Medium', 'Open',
    62, 'Medium', 'Upstream_AML_Engine',
    '["SAN-PEP-001", "AML-STR-022"]'::jsonb,
    '2026-03-01', '2026-03-14',
    6950000.00, 2600000.00, 5, 3, 8,
    '[{"reason_code": "R015", "description": "PEP-flagged individual with government contract income"}, {"reason_code": "R016", "description": "Political donations from a government consultant"}, {"reason_code": "R010", "description": "International wire transfer to Singapore entity"}]'::jsonb,
    '[{"typology_code": "TYP-ROUND-TRIP", "typology_name": "Round Tripping", "confidence": "Low"}]'::jsonb,
    '{"pep_status": true, "government_contracts": true, "political_donations": true}'::jsonb,
    '2026-03-15 10:30:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100005' AND a.account_id = 'ACC-200007';

-- Alert 14: Kailash Group - Rapid Movement (Hawala pattern)
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002006', c.id, a.id,
    'Rapid Movement', 'AML', 'High', 'Open',
    79, 'High', 'Upstream_AML_Engine',
    '["AML-HT-014", "AML-STR-022", "AML-INT-031"]'::jsonb,
    '2026-03-01', '2026-03-06',
    7680000.00, 8450000.00, 7, 5, 12,
    '[{"reason_code": "R014", "description": "12 unique counterparties in 6 days - far exceeding normal pattern"}, {"reason_code": "R004", "description": "Same-day inflows and outflows with minimal holding period"}, {"reason_code": "R031", "description": "International wire transfers to Kuwait and Bahrain interspersed with domestic settlements"}]'::jsonb,
    '[{"typology_code": "TYP-RAPID-MOVE", "typology_name": "Rapid Movement of Funds", "confidence": "High"}, {"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "Medium"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Unrelated", "high_risk_geography_involved": true, "destination_countries": ["Kuwait", "Bahrain"], "hawala_indicators": true, "multiple_small_counterparties": true}'::jsonb,
    '2026-03-07 09:15:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100006' AND a.account_id = 'ACC-200008';

-- Alert 15: Mohammed Rizwan - Structuring across accounts
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002007', c.id, a.id,
    'Structuring', 'AML', 'High', 'Open',
    84, 'High', 'Upstream_AML_Engine',
    '["AML-CTR-005", "AML-STR-022"]'::jsonb,
    '2026-03-01', '2026-03-07',
    10580000.00, 5000000.00, 10, 2, 2,
    '[{"reason_code": "R003", "description": "10 cash deposits across two accounts in 7 days, all below 10 lakh"}, {"reason_code": "R004", "description": "Systematic splitting of deposits between savings and current accounts"}, {"reason_code": "R002", "description": "Amounts clustered between 9.2L and 9.9L indicating deliberate threshold avoidance"}]'::jsonb,
    '[{"typology_code": "TYP-STRUCTURING", "typology_name": "Structuring", "confidence": "Very High"}, {"typology_code": "TYP-SMURFING", "typology_name": "Smurfing", "confidence": "Medium"}]'::jsonb,
    '2026-03-08 08:00:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100007' AND a.account_id = 'ACC-200009';

-- Alert 16: Sapphire Financial - Multiple Red Flags (Layering + Offshore)
INSERT INTO alerts (
    alert_id, customer_id, account_id, alert_type, alert_category, alert_priority, alert_status,
    risk_score, risk_rating, monitoring_system, triggering_rules,
    review_period_start, review_period_end,
    total_inbound_amount, total_outbound_amount, inbound_transaction_count, outbound_transaction_count, unique_counterparties,
    alert_reasons, matched_typologies, counterparty_indicators,
    alert_generated_at, jurisdiction
)
SELECT
    'AML-ALERT-2026-002008', c.id, a.id,
    'Suspicious Transaction', 'AML', 'Critical', 'Escalated',
    98, 'Critical', 'Upstream_AML_Engine',
    '["AML-STR-001", "AML-HT-014", "AML-INT-031"]'::jsonb,
    '2026-03-01', '2026-03-10',
    112000000.00, 130000000.00, 4, 6, 10,
    '[{"reason_code": "R001", "description": "Extremely high-value transactions totaling 24.2 Cr in 10 days"}, {"reason_code": "R005", "description": "Fund flows through tax havens - Cayman Islands, BVI, Panama, Mauritius"}, {"reason_code": "R008", "description": "Recently incorporated LLP with no verifiable business history"}, {"reason_code": "R031", "description": "Round-amount wire transfers suggesting non-commercial nature"}]'::jsonb,
    '[{"typology_code": "TYP-LAYERING", "typology_name": "Layering", "confidence": "Very High"}, {"typology_code": "TYP-SHELL-CO", "typology_name": "Shell Company Activity", "confidence": "High"}, {"typology_code": "TYP-ROUND-TRIP", "typology_name": "Round Tripping", "confidence": "High"}]'::jsonb,
    '{"inbound_counterparties_relationship": "Unverified Offshore Entities", "high_risk_geography_involved": true, "destination_countries": ["Cayman Islands", "British Virgin Islands", "Panama", "Mauritius", "Switzerland", "United Arab Emirates", "Singapore"], "tax_haven_connections": true, "shell_company_indicators": true, "recently_incorporated": true}'::jsonb,
    '2026-03-11 07:30:00', 'IN'
FROM customers c JOIN accounts a ON a.customer_id = c.id
WHERE c.customer_id = 'CUST-100008' AND a.account_id = 'ACC-200011';

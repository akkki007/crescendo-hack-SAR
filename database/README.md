# Database Setup

## PostgreSQL Database for SAR Narrative Generator

### Prerequisites
- PostgreSQL 14+ installed
- psql CLI tool available

### Quick Setup

1. **Create the database:**
```bash
psql -U postgres -c "CREATE DATABASE sar_generator;"
```

2. **Run the initialization script:**
```bash
cd database
psql -U postgres -d sar_generator -f init.sql
```

Or run schema and seed separately:
```bash
psql -U postgres -d sar_generator -f schema.sql
psql -U postgres -d sar_generator -f seed.sql
```

### Database Structure

#### Core Tables
- `users` - Compliance team members and analysts
- `customers` - Customer profiles with KYC information
- `accounts` - Bank accounts linked to customers
- `transactions` - Transaction records
- `alerts` - AML/Fraud alerts
- `sar_reports` - Generated SAR narratives
- `audit_logs` - System audit trail

#### Reference Tables
- `typologies` - Money laundering typologies
- `alert_rules` - AML monitoring rules
- `sessions` - User session management

### Seed Data Summary
- 8 users (compliance team)
- 10 customers (mix of individuals and corporates)
- 14 accounts
- 55+ transactions (including suspicious pattern)
- 4 alerts (various statuses)
- 10 typologies
- 10 alert rules

### Connection String
```
postgresql://username:password@localhost:5432/sar_generator
```

### Environment Variables
Set these in your `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sar_generator
DB_USER=postgres
DB_PASSWORD=your_password
```

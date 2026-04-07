# SAR Narrative Generator - Backend

Express.js REST API for the SAR Narrative Generator with Audit Trail.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database:**
```bash
# Create database and run migrations
cd ../database
psql -U postgres -d sar_generator -f init.sql
```

4. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password

### Customers
- `GET /api/customers` - List customers (paginated)
- `GET /api/customers/:id` - Get customer details
- `GET /api/customers/:id/profile` - Get full customer profile
- `GET /api/customers/:id/accounts` - Get customer accounts
- `GET /api/customers/:id/transactions` - Get customer transactions
- `GET /api/customers/:id/alerts` - Get customer alerts

### Alerts
- `GET /api/alerts` - List alerts (paginated, filterable)
- `GET /api/alerts/summary` - Get alert statistics
- `GET /api/alerts/:id` - Get alert details
- `GET /api/alerts/:id/transactions` - Get transactions for alert period
- `POST /api/alerts/:id/assign` - Assign alert to analyst
- `PATCH /api/alerts/:id/status` - Update alert status

### SAR Reports
- `GET /api/sar` - List SAR reports
- `GET /api/sar/:id` - Get SAR details
- `POST /api/sar` - Create new SAR from alert
- `GET /api/sar/alert-data/:alertId` - Get formatted data for SAR generation
- `PATCH /api/sar/:id/narrative` - Update SAR narrative
- `POST /api/sar/:id/submit` - Submit SAR for review
- `POST /api/sar/:id/approve` - Approve SAR (compliance officers)
- `POST /api/sar/:id/reject` - Reject SAR with comments

### Audit Logs
- `GET /api/audit` - List audit logs
- `GET /api/audit/summary` - Get audit summary
- `GET /api/audit/:id` - Get audit log details
- `GET /api/audit/entity/:type/:id` - Get entity audit trail
- `GET /api/audit/user/:userId` - Get user activity (admin only)

### Dashboard
- `GET /api/dashboard/overview` - Get overview statistics
- `GET /api/dashboard/alert-trends` - Get alert trends
- `GET /api/dashboard/alerts-by-type` - Get alerts grouped by type
- `GET /api/dashboard/sar-workflow` - Get SAR workflow stats
- `GET /api/dashboard/recent-activity` - Get recent activity
- `GET /api/dashboard/my-stats` - Get current user stats

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── customer.controller.js
│   │   ├── alert.controller.js
│   │   ├── sar.controller.js
│   │   ├── audit.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Global error handler
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── customer.routes.js
│   │   ├── alert.routes.js
│   │   ├── sar.routes.js
│   │   ├── audit.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   └── llm.service.js   # Python LLM backend integration
│   ├── utils/
│   │   ├── logger.js        # Winston logger
│   │   └── validators.js    # Request validation
│   └── index.js             # Express app entry point
├── package.json
├── .env.example
└── README.md
```

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/refresh-token` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Roles

- `admin` - Full access
- `compliance_officer` - Can approve/reject SARs
- `senior_analyst` - Can escalate and reject SARs
- `analyst` - Basic access, can create and submit SARs

## Test Credentials

After running seed data:
```
Admin Email: rajesh.sharma@bank.com
Admin Password: password123

Email: sneha.reddy@bank.com
Password: password123
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run linting
npm run lint

# Run tests
npm test
```

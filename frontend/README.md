# SAR Narrative Generator - Frontend

React.js frontend for the SAR Narrative Generator with Audit Trail.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start the development server:**
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Features

### Dashboard
- Overview statistics for alerts and SARs
- Team workload distribution
- Recent activity feed

### Alerts Management
- View and filter alerts by status, priority
- Assign alerts to analysts
- View transaction details for alerts
- Generate SAR from alert

### SAR Reports
- View all SAR reports
- Edit SAR narrative
- AI-powered narrative generation
- Submit for review workflow
- Approval/rejection by compliance officers
- Audit trail tracking

### Customer Profiles
- Search and view customers
- View accounts and transaction history
- See associated alerts and SARs

### Audit Logs
- Complete system audit trail
- Filter by category and entity type

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js          # Main app layout with sidebar
│   │   └── ProtectedRoute.js  # Auth route wrapper
│   ├── context/
│   │   └── AuthContext.js     # Authentication state
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Alerts.js
│   │   ├── AlertDetail.js
│   │   ├── SarReports.js
│   │   ├── SarDetail.js
│   │   ├── Customers.js
│   │   ├── CustomerDetail.js
│   │   └── AuditLogs.js
│   ├── services/
│   │   └── api.js             # API client and services
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Axios
- Heroicons
- Recharts (for charts)

## Development

```bash
# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

# SAR Narrative Generator with Audit Trail

AI-powered Suspicious Activity Report (SAR) narrative generation system for regulated financial institutions. This solution automates the drafting of clear, consistent, regulator-ready SAR narratives while ensuring transparency and auditability.

## Problem Statement

Banks must file Suspicious Activity Reports (SARs) whenever they detect activity that may indicate money laundering, fraud, or other financial crime. Writing these SAR narratives is:
- **Mandatory** - Regulatory requirement
- **High-risk** - Poorly written SARs can lead to enforcement actions
- **Labor-intensive** - Takes analysts 5-6 hours per report

This solution reduces manual effort, supports analysts in producing defensible reports at scale, and maintains complete audit trails.

## Architecture

```
SAR-Narrative-Generator/
├── backend/           # ExpressJS REST API
├── frontend/          # ReactJS Web Application
├── database/          # PostgreSQL Schema & Seed Data
├── sar_generator.py   # LLM Workflow (LangChain/LangGraph)
├── app.py             # Streamlit UI
└── main.py            # FastAPI endpoints
```

## Tech Stack

### Backend (ExpressJS)
- Node.js + Express
- PostgreSQL database
- JWT authentication
- Role-based access control

### Frontend (ReactJS)
- React 18 + React Router
- Tailwind CSS
- Axios for API calls

### LLM Workflow (Python)
- LangChain + LangGraph
- Ollama (Mistral 7B) or Groq
- Three-stage SAR generation pipeline:
  1. **Drafting LLM** - Converts AML JSON to narrative
  2. **Regulator LLM** - Validates and corrects for compliance
  3. **Audit LLM** - Generates sentence-level audit trail

### Database
- PostgreSQL 14+
- Complete schema for customers, accounts, transactions, alerts, SARs
- Comprehensive audit logging

## Quick Start

### 1. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE sar_generator;"

# Run schema and seed data
cd database
psql -U postgres -d sar_generator -f schema.sql
psql -U postgres -d sar_generator -f seed.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### 4. LLM Service (Python)

```bash
pip install -r requirements.txt
# Ensure Ollama is running with mistral:7b-instruct model
uvicorn main:app --reload --port 8000
```

Or run Streamlit UI:
```bash
streamlit run app.py
```

## Features

### Core Capabilities
- **AI-Powered Narrative Generation** - LLM-based SAR narrative drafting
- **Multi-Stage Validation** - Draft generation, regulatory compliance check, audit trail generation
- **Complete Audit Trail** - Explains why each part of the narrative was written
- **Human-in-the-Loop** - Analysts can edit and approve narratives

### LLM Workflow

```
AML JSON Input
       ↓
[ LLM 1: Narrative Drafting ]
       ↓
[ LLM 2: Regulatory Validation ]
       ↓
[ LLM 3: Audit Trail Generation ]
       ↓
Final SAR + Audit Trail
```

### Hard Compliance Rules

The system prevents regulatory violations:
- No inference of criminal intent
- No SAR filing or submission claims
- No investigative recommendations
- No high-risk labeling
- No rule IDs, typology codes, or model references
- Facts only from source JSON

### User Roles
- **Analyst** - Create and submit SARs
- **Senior Analyst** - Review and escalate
- **Compliance Officer** - Approve/reject SARs
- **Admin** - Full system access

## Seed Data

The database includes realistic sample data:
- 8 compliance team users
- 10 customers (individuals and corporates)
- 14 bank accounts
- 55+ transactions including a suspicious pattern
- 4 alerts (various statuses)
- Reference data for typologies and alert rules

### Sample Suspicious Activity Pattern
Customer receives INR 50,00,000 from 47 different unrelated accounts in one week, then immediately transfers funds to UAE - matching money laundering typologies (Layering, Funnel Account Behavior).

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Alerts
- `GET /api/alerts` - List alerts (filterable)
- `GET /api/alerts/:id` - Alert details
- `GET /api/alerts/:id/transactions` - Alert transactions
- `POST /api/alerts/:id/assign` - Assign to analyst

### SAR Reports
- `POST /api/sar` - Create SAR from alert
- `GET /api/sar/:id` - SAR details
- `PATCH /api/sar/:id/narrative` - Update narrative
- `POST /api/sar/:id/submit` - Submit for review
- `POST /api/sar/:id/approve` - Approve SAR
- `POST /api/sar/:id/reject` - Reject with comments

### Dashboard
- `GET /api/dashboard/overview` - Statistics
- `GET /api/dashboard/recent-activity` - Activity feed
- `GET /api/dashboard/my-stats` - User stats

### Audit
- `GET /api/audit` - Audit logs
- `GET /api/audit/entity/:type/:id` - Entity audit trail

## SAR Output Format

```
Subject Overview
Detection Summary
Description of Transaction Activity
Basis for Suspicion
Customer Interaction (if provided)
Conclusion and Action Taken
```

## Security Considerations

- JWT-based authentication
- Role-based access control
- Complete audit logging
- Data isolation per customer/domain
- No PII in LLM prompts (aggregated data only)

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Python 3.10+
- Ollama with Mistral 7B model

### Running Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## License

ISC

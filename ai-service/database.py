import asyncpg
import json
import os
from datetime import datetime
from typing import Optional, List, Dict, Any


class Database:
    """PostgreSQL database connection for AI Service"""

    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None
        self.dsn = self._build_dsn()

    def _build_dsn(self) -> str:
        """Build database connection string from environment variables"""
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "5432")
        database = os.getenv("DB_NAME", "sar_generator")
        user = os.getenv("DB_USER", "postgres")
        password = os.getenv("DB_PASSWORD", "akshay1234")

        return f"postgresql://{user}:{password}@{host}:{port}/{database}"

    async def connect(self):
        """Create database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                self.dsn,
                min_size=2,
                max_size=10,
                command_timeout=60
            )
            print("Database connected successfully")
        except Exception as e:
            print(f"Database connection failed: {e}")
            self.pool = None

    async def disconnect(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            print("Database disconnected")

    async def check_connection(self) -> bool:
        """Check if database connection is healthy"""
        if not self.pool:
            return False
        try:
            async with self.pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            return True
        except Exception:
            return False

    async def log_sar_generation(
        self,
        sar_id: str,
        narrative: str,
        audit_trail: List[Dict[str, Any]],
        user_id: Optional[str] = None,
        feedback: Optional[str] = None
    ):
        """
        Log SAR generation to database.
        Updates the sar_reports table with generated narrative and audit trail.
        """
        if not self.pool:
            return

        try:
            async with self.pool.acquire() as conn:
                # Update SAR report with generated narrative
                await conn.execute("""
                    UPDATE sar_reports
                    SET narrative_draft = $1,
                        audit_trail = $2,
                        analyst_feedback = $3,
                        generation_timestamp = $4,
                        generated_by_model = $5,
                        updated_at = $4
                    WHERE sar_id = $6
                """,
                    narrative,
                    json.dumps(audit_trail),
                    feedback,
                    datetime.utcnow(),
                    "mistral:7b-instruct",
                    sar_id
                )

                # Log audit event
                await conn.execute("""
                    INSERT INTO audit_logs (action, action_category, user_id, entity_type, details, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6)
                """,
                    "SAR_NARRATIVE_GENERATED",
                    "SAR",
                    user_id,
                    "SAR",
                    json.dumps({
                        "sar_id": sar_id,
                        "model": "mistral:7b-instruct",
                        "has_feedback": bool(feedback)
                    }),
                    datetime.utcnow()
                )

        except Exception as e:
            print(f"Error logging SAR generation: {e}")

    async def log_sar_regeneration(
        self,
        sar_id: str,
        narrative: str,
        audit_trail: List[Dict[str, Any]],
        user_id: Optional[str] = None,
        feedback: Optional[str] = None
    ):
        """
        Log SAR regeneration to database.
        Updates the sar_reports table and appends to audit trail history.
        """
        if not self.pool:
            return

        try:
            async with self.pool.acquire() as conn:
                # Get current audit trail to append
                row = await conn.fetchrow(
                    "SELECT audit_trail FROM sar_reports WHERE sar_id = $1",
                    sar_id
                )

                current_audit = []
                if row and row['audit_trail']:
                    try:
                        current_audit = json.loads(row['audit_trail']) if isinstance(row['audit_trail'], str) else row['audit_trail']
                    except:
                        current_audit = []

                # Add regeneration entry
                regeneration_entry = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "action": "regenerated",
                    "feedback": feedback,
                    "audit_trail": audit_trail
                }

                # Append new audit trail
                if isinstance(current_audit, list):
                    current_audit.append(regeneration_entry)
                else:
                    current_audit = [regeneration_entry]

                # Update SAR report
                await conn.execute("""
                    UPDATE sar_reports
                    SET narrative_draft = $1,
                        audit_trail = $2,
                        analyst_feedback = $3,
                        generation_timestamp = $4,
                        updated_at = $4
                    WHERE sar_id = $5
                """,
                    narrative,
                    json.dumps(current_audit),
                    feedback,
                    datetime.utcnow(),
                    sar_id
                )

                # Log audit event
                await conn.execute("""
                    INSERT INTO audit_logs (action, action_category, user_id, entity_type, details, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6)
                """,
                    "SAR_NARRATIVE_REGENERATED",
                    "SAR",
                    user_id,
                    "SAR",
                    json.dumps({
                        "sar_id": sar_id,
                        "model": "mistral:7b-instruct",
                        "feedback": feedback
                    }),
                    datetime.utcnow()
                )

        except Exception as e:
            print(f"Error logging SAR regeneration: {e}")

    async def get_alert_data(self, alert_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch alert data from database for SAR generation.
        Returns formatted AML data structure.
        """
        if not self.pool:
            return None

        try:
            async with self.pool.acquire() as conn:
                # Get alert with customer and account info
                row = await conn.fetchrow("""
                    SELECT
                        a.*,
                        c.customer_id as cust_code, c.customer_type, c.full_name,
                        c.date_of_birth, c.nationality, c.occupation,
                        c.kyc_risk_rating, c.relationship_start_date,
                        c.expected_monthly_turnover_min, c.expected_monthly_turnover_max,
                        acc.account_id as acc_code, acc.account_type, acc.account_status
                    FROM alerts a
                    JOIN customers c ON a.customer_id = c.id
                    LEFT JOIN accounts acc ON a.account_id = acc.id
                    WHERE a.alert_id = $1 OR a.id::text = $1
                """, alert_id)

                if not row:
                    return None

                # Format as AML data structure
                aml_data = {
                    "alert_metadata": {
                        "alert_id": row['alert_id'],
                        "alert_type": row['alert_type'],
                        "alert_priority": row['alert_priority'],
                        "alert_status": row['alert_status'],
                        "alert_generated_timestamp": row['alert_generated_at'].isoformat() if row['alert_generated_at'] else None,
                        "monitoring_system": row['monitoring_system'],
                        "triggering_rules": row['triggering_rules'],
                        "risk_rating": row['risk_rating'],
                        "jurisdiction": row['jurisdiction']
                    },
                    "customer_profile": {
                        "customer_id": row['cust_code'],
                        "customer_type": row['customer_type'],
                        "full_name": row['full_name'],
                        "date_of_birth": str(row['date_of_birth']) if row['date_of_birth'] else None,
                        "nationality": row['nationality'],
                        "occupation": row['occupation'],
                        "kyc_risk_rating": row['kyc_risk_rating'],
                        "relationship_start_date": str(row['relationship_start_date']) if row['relationship_start_date'] else None,
                        "expected_monthly_turnover": {
                            "min": float(row['expected_monthly_turnover_min']) if row['expected_monthly_turnover_min'] else 0,
                            "max": float(row['expected_monthly_turnover_max']) if row['expected_monthly_turnover_max'] else 0,
                            "currency": "INR"
                        }
                    },
                    "accounts": [{
                        "account_id": row['acc_code'],
                        "account_type": row['account_type'],
                        "account_status": row['account_status'],
                        "primary_holder": row['full_name']
                    }] if row['acc_code'] else [],
                    "transaction_summary": {
                        "review_period": {
                            "from": str(row['review_period_start']) if row['review_period_start'] else None,
                            "to": str(row['review_period_end']) if row['review_period_end'] else None
                        },
                        "total_inbound_amount": float(row['total_inbound_amount']) if row['total_inbound_amount'] else 0,
                        "total_outbound_amount": float(row['total_outbound_amount']) if row['total_outbound_amount'] else 0,
                        "currency": "INR",
                        "inbound_transaction_count": row['inbound_transaction_count'] or 0,
                        "outbound_transaction_count": row['outbound_transaction_count'] or 0,
                        "unique_inbound_counterparties": row['unique_counterparties'] or 0
                    },
                    "counterparty_indicators": row['counterparty_indicators'] if row['counterparty_indicators'] else {},
                    "alert_reasons": row['alert_reasons'] if row['alert_reasons'] else [],
                    "matched_typologies": row['matched_typologies'] if row['matched_typologies'] else [],
                    "customer_interaction": row['customer_interaction'] if row['customer_interaction'] else None
                }

                return aml_data

        except Exception as e:
            print(f"Error fetching alert data: {e}")
            return None

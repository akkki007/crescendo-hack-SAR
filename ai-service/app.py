from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager
import json
from datetime import datetime
import os
from dotenv import load_dotenv

from sar_generator import wf
from database import Database

load_dotenv()

# Database instance
db = Database()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle."""
    await db.connect()
    try:
        yield
    finally:
        await db.disconnect()


app = FastAPI(
    title="SAR Narrative Generator - AI Service",
    description="AI-powered SAR narrative generation using LLM workflow",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5000,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class AlertData(BaseModel):
    alert_metadata: Dict[str, Any]
    customer_profile: Dict[str, Any]
    accounts: List[Dict[str, Any]]
    transaction_summary: Dict[str, Any]
    counterparty_indicators: Optional[Dict[str, Any]] = None
    alert_reasons: List[Dict[str, Any]]
    matched_typologies: Optional[List[Dict[str, Any]]] = None
    customer_interaction: Optional[Dict[str, Any]] = None


class GenerateSARRequest(BaseModel):
    alert_data: AlertData
    analyst_feedback: Optional[str] = ""
    sar_id: Optional[str] = None
    user_id: Optional[str] = None


class RegenerateSARRequest(BaseModel):
    alert_data: AlertData
    current_narrative: str
    analyst_feedback: str
    sar_id: Optional[str] = None
    user_id: Optional[str] = None


class SARResponse(BaseModel):
    narrative: str
    audit_trail: List[Dict[str, Any]]
    generated_at: str
    model_used: str


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    database_connected: bool


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check service health and database connectivity"""
    db_connected = await db.check_connection()
    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        timestamp=datetime.utcnow().isoformat(),
        database_connected=db_connected
    )


@app.post("/generate", response_model=SARResponse)
async def generate_sar(request: GenerateSARRequest):
    """
    Generate a new SAR narrative from alert data.

    This endpoint:
    1. Takes structured AML alert data as input
    2. Generates a draft SAR narrative using LLM
    3. Validates the narrative for regulatory compliance
    4. Generates a sentence-level audit trail
    5. Logs the generation to database
    6. Returns the final narrative with audit trail
    """
    try:
        # Convert alert data to JSON string for the workflow
        user_data = json.dumps(request.alert_data.model_dump(), indent=2)
        feedback = request.analyst_feedback or ""

        # Invoke the LLM workflow
        result = wf.invoke({
            'user_data_context': user_data,
            'feedback': feedback
        })

        # Extract narrative
        controlled_sar = result.get('controlled_sar', '')
        if hasattr(controlled_sar, 'content'):
            narrative = controlled_sar.content
        else:
            narrative = str(controlled_sar)

        # Parse audit trail
        audit_trail = []
        audit_trail_raw = result.get('audit_trail', '')
        if audit_trail_raw:
            try:
                if isinstance(audit_trail_raw, str):
                    # Find JSON array in response
                    start_idx = audit_trail_raw.find('[')
                    end_idx = audit_trail_raw.rfind(']') + 1
                    if start_idx != -1 and end_idx > start_idx:
                        audit_trail = json.loads(audit_trail_raw[start_idx:end_idx])
                else:
                    audit_trail = audit_trail_raw
            except json.JSONDecodeError:
                audit_trail = []

        generated_at = datetime.utcnow().isoformat()

        # Log to database if SAR ID provided
        if request.sar_id:
            await db.log_sar_generation(
                sar_id=request.sar_id,
                narrative=narrative,
                audit_trail=audit_trail,
                user_id=request.user_id,
                feedback=feedback
            )

        return SARResponse(
            narrative=narrative,
            audit_trail=audit_trail,
            generated_at=generated_at,
            model_used="mistral:7b-instruct"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SAR generation failed: {str(e)}")


@app.post("/regenerate", response_model=SARResponse)
async def regenerate_sar(request: RegenerateSARRequest):
    """
    Regenerate SAR narrative with analyst feedback.

    Use this endpoint when an analyst wants to modify the narrative
    based on specific feedback or corrections.
    """
    try:
        # Include current narrative context in feedback
        enhanced_feedback = f"""
Previous narrative for reference:
{request.current_narrative}

Analyst feedback:
{request.analyst_feedback}
"""
        # Convert alert data to JSON string
        user_data = json.dumps(request.alert_data.model_dump(), indent=2)

        # Invoke the LLM workflow
        result = wf.invoke({
            'user_data_context': user_data,
            'feedback': enhanced_feedback
        })

        # Extract narrative
        controlled_sar = result.get('controlled_sar', '')
        if hasattr(controlled_sar, 'content'):
            narrative = controlled_sar.content
        else:
            narrative = str(controlled_sar)

        # Parse audit trail
        audit_trail = []
        audit_trail_raw = result.get('audit_trail', '')
        if audit_trail_raw:
            try:
                if isinstance(audit_trail_raw, str):
                    start_idx = audit_trail_raw.find('[')
                    end_idx = audit_trail_raw.rfind(']') + 1
                    if start_idx != -1 and end_idx > start_idx:
                        audit_trail = json.loads(audit_trail_raw[start_idx:end_idx])
                else:
                    audit_trail = audit_trail_raw
            except json.JSONDecodeError:
                audit_trail = []

        generated_at = datetime.utcnow().isoformat()

        # Log regeneration to database
        if request.sar_id:
            await db.log_sar_regeneration(
                sar_id=request.sar_id,
                narrative=narrative,
                audit_trail=audit_trail,
                user_id=request.user_id,
                feedback=request.analyst_feedback
            )

        return SARResponse(
            narrative=narrative,
            audit_trail=audit_trail,
            generated_at=generated_at,
            model_used="mistral:7b-instruct"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SAR regeneration failed: {str(e)}")


# Request model for SAR ID based generation
class GenerateBySarIdRequest(BaseModel):
    feedback: Optional[str] = ""


class RegenerateBySarIdRequest(BaseModel):
    feedback: str


class GenerateFromAlertRequest(BaseModel):
    feedback: Optional[str] = ""
    user_id: Optional[str] = None


class CreateAndGenerateResponse(BaseModel):
    sar_id: str
    narrative: str
    audit_trail: List[Dict[str, Any]]
    generated_at: str
    model_used: str


@app.post("/alert/{alert_id}/generate-sar", response_model=CreateAndGenerateResponse)
async def create_and_generate_sar(alert_id: str, request: GenerateFromAlertRequest):
    """
    Create SAR from alert and generate narrative in one call.
    This is the main endpoint for generating SAR from an alert.
    """
    import uuid

    try:
        if not db.pool:
            raise HTTPException(status_code=503, detail="Database not connected")

        async with db.pool.acquire() as conn:
            # Get alert details
            alert_row = await conn.fetchrow("""
                SELECT a.id, a.customer_id, a.alert_id
                FROM alerts a
                WHERE a.alert_id = $1 OR a.id::text = $1
            """, alert_id)

            if not alert_row:
                raise HTTPException(status_code=404, detail="Alert not found")

            # Check if SAR already exists
            existing_sar = await conn.fetchrow("""
                SELECT id, sar_id FROM sar_reports WHERE alert_id = $1
            """, alert_row['id'])

            if existing_sar:
                sar_id = existing_sar['sar_id']
            else:
                # Create new SAR
                sar_id = f"SAR-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
                # Get user UUID if user_id was passed
                user_uuid = None
                if request.user_id:
                    try:
                        user_uuid = uuid.UUID(request.user_id)
                    except (ValueError, AttributeError):
                        pass
                await conn.execute("""
                    INSERT INTO sar_reports (sar_id, alert_id, customer_id, sar_status, created_by, created_at)
                    VALUES ($1, $2, $3, 'Draft', $4, CURRENT_TIMESTAMP)
                """, sar_id, alert_row['id'], alert_row['customer_id'], user_uuid)

            # Fetch full alert data for generation
            alert_data = await db.get_alert_data(alert_row['alert_id'])

            if not alert_data:
                raise HTTPException(status_code=404, detail="Alert data not found")

        # Convert to JSON for workflow
        user_data = json.dumps(alert_data, indent=2, default=str)
        feedback = request.feedback or ""

        # Invoke the LLM workflow
        result = wf.invoke({
            'user_data_context': user_data,
            'feedback': feedback
        })

        # Extract narrative
        controlled_sar = result.get('controlled_sar', '')
        if hasattr(controlled_sar, 'content'):
            narrative = controlled_sar.content
        else:
            narrative = str(controlled_sar)

        # Parse audit trail
        audit_trail = []
        audit_trail_raw = result.get('audit_trail', '')
        if audit_trail_raw:
            try:
                if isinstance(audit_trail_raw, str):
                    start_idx = audit_trail_raw.find('[')
                    end_idx = audit_trail_raw.rfind(']') + 1
                    if start_idx != -1 and end_idx > start_idx:
                        audit_trail = json.loads(audit_trail_raw[start_idx:end_idx])
                else:
                    audit_trail = audit_trail_raw
            except json.JSONDecodeError:
                audit_trail = []

        generated_at = datetime.utcnow().isoformat()

        # Update SAR with generated narrative
        await db.log_sar_generation(
            sar_id=sar_id,
            narrative=narrative,
            audit_trail=audit_trail,
            user_id=request.user_id,
            feedback=feedback
        )

        return CreateAndGenerateResponse(
            sar_id=sar_id,
            narrative=narrative,
            audit_trail=audit_trail,
            generated_at=generated_at,
            model_used="mistral:7b-instruct"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SAR creation and generation failed: {str(e)}")


@app.post("/sar/{sar_id}/generate", response_model=SARResponse)
async def generate_sar_by_id(sar_id: str, request: GenerateBySarIdRequest):
    """
    Generate SAR narrative by SAR ID.
    Fetches alert data from database and generates narrative.
    """
    try:
        # Get SAR and alert info from database
        if not db.pool:
            raise HTTPException(status_code=503, detail="Database not connected")

        async with db.pool.acquire() as conn:
            # Get SAR with alert ID
            sar_row = await conn.fetchrow("""
                SELECT s.id, s.sar_id, s.alert_id, s.narrative_draft,
                       a.alert_id as alert_code
                FROM sar_reports s
                JOIN alerts a ON s.alert_id = a.id
                WHERE s.sar_id = $1 OR s.id::text = $1
            """, sar_id)

            if not sar_row:
                raise HTTPException(status_code=404, detail="SAR not found")

            # Fetch full alert data
            alert_data = await db.get_alert_data(sar_row['alert_code'])

            if not alert_data:
                raise HTTPException(status_code=404, detail="Alert data not found")

        # Convert to JSON for workflow
        user_data = json.dumps(alert_data, indent=2, default=str)
        feedback = request.feedback or ""

        # Invoke the LLM workflow
        result = wf.invoke({
            'user_data_context': user_data,
            'feedback': feedback
        })

        # Extract narrative
        controlled_sar = result.get('controlled_sar', '')
        if hasattr(controlled_sar, 'content'):
            narrative = controlled_sar.content
        else:
            narrative = str(controlled_sar)

        # Parse audit trail
        audit_trail = []
        audit_trail_raw = result.get('audit_trail', '')
        if audit_trail_raw:
            try:
                if isinstance(audit_trail_raw, str):
                    start_idx = audit_trail_raw.find('[')
                    end_idx = audit_trail_raw.rfind(']') + 1
                    if start_idx != -1 and end_idx > start_idx:
                        audit_trail = json.loads(audit_trail_raw[start_idx:end_idx])
                else:
                    audit_trail = audit_trail_raw
            except json.JSONDecodeError:
                audit_trail = []

        generated_at = datetime.utcnow().isoformat()

        # Log to database
        await db.log_sar_generation(
            sar_id=sar_id,
            narrative=narrative,
            audit_trail=audit_trail,
            user_id=None,
            feedback=feedback
        )

        return SARResponse(
            narrative=narrative,
            audit_trail=audit_trail,
            generated_at=generated_at,
            model_used="mistral:7b-instruct"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SAR generation failed: {str(e)}")


@app.post("/sar/{sar_id}/regenerate", response_model=SARResponse)
async def regenerate_sar_by_id(sar_id: str, request: RegenerateBySarIdRequest):
    """
    Regenerate SAR narrative by SAR ID with analyst feedback.
    """
    try:
        if not request.feedback:
            raise HTTPException(status_code=400, detail="Feedback is required for regeneration")

        if not db.pool:
            raise HTTPException(status_code=503, detail="Database not connected")

        async with db.pool.acquire() as conn:
            # Get SAR with current narrative
            sar_row = await conn.fetchrow("""
                SELECT s.id, s.sar_id, s.alert_id, s.narrative_draft,
                       a.alert_id as alert_code
                FROM sar_reports s
                JOIN alerts a ON s.alert_id = a.id
                WHERE s.sar_id = $1 OR s.id::text = $1
            """, sar_id)

            if not sar_row:
                raise HTTPException(status_code=404, detail="SAR not found")

            # Fetch full alert data
            alert_data = await db.get_alert_data(sar_row['alert_code'])

            if not alert_data:
                raise HTTPException(status_code=404, detail="Alert data not found")

            current_narrative = sar_row['narrative_draft'] or ""

        # Enhanced feedback with current narrative
        enhanced_feedback = f"""
Previous narrative for reference:
{current_narrative}

Analyst feedback:
{request.feedback}
"""
        user_data = json.dumps(alert_data, indent=2, default=str)

        # Invoke the LLM workflow
        result = wf.invoke({
            'user_data_context': user_data,
            'feedback': enhanced_feedback
        })

        # Extract narrative
        controlled_sar = result.get('controlled_sar', '')
        if hasattr(controlled_sar, 'content'):
            narrative = controlled_sar.content
        else:
            narrative = str(controlled_sar)

        # Parse audit trail
        audit_trail = []
        audit_trail_raw = result.get('audit_trail', '')
        if audit_trail_raw:
            try:
                if isinstance(audit_trail_raw, str):
                    start_idx = audit_trail_raw.find('[')
                    end_idx = audit_trail_raw.rfind(']') + 1
                    if start_idx != -1 and end_idx > start_idx:
                        audit_trail = json.loads(audit_trail_raw[start_idx:end_idx])
                else:
                    audit_trail = audit_trail_raw
            except json.JSONDecodeError:
                audit_trail = []

        generated_at = datetime.utcnow().isoformat()

        # Log regeneration to database
        await db.log_sar_regeneration(
            sar_id=sar_id,
            narrative=narrative,
            audit_trail=audit_trail,
            user_id=None,
            feedback=request.feedback
        )

        return SARResponse(
            narrative=narrative,
            audit_trail=audit_trail,
            generated_at=generated_at,
            model_used="mistral:7b-instruct"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SAR regeneration failed: {str(e)}")


# Legacy endpoint for backward compatibility
@app.post("/get_sar")
async def get_sar_legacy(user_data: str, analyst_feedback: str = ""):
    """Legacy endpoint - use /generate instead"""
    try:
        if analyst_feedback == "" or analyst_feedback == " ":
            response = wf.invoke({'user_data_context': user_data})
        else:
            response = wf.invoke({'user_data_context': user_data, 'feedback': analyst_feedback})

        return {
            "SAR_report": response['controlled_sar'],
            "Audit_trail": response['audit_trail']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000))
    )

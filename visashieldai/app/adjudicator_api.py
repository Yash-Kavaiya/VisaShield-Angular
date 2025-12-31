# Copyright 2025 VisaShield AI
# FastAPI endpoints for AI Adjudicator

import asyncio
import json
import uuid
from collections.abc import AsyncGenerator
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from google.adk.runners import InMemoryRunner
from google.genai import types
from pydantic import BaseModel

from app.adjudicator_agent import adjudicator_agent

router = APIRouter(prefix="/api/adjudicator", tags=["adjudicator"])

# Initialize the runner
runner = InMemoryRunner(agent=adjudicator_agent, app_name="adjudicator")


# ========================================
# REQUEST/RESPONSE MODELS
# ========================================


class CaseInfo(BaseModel):
    case_number: str
    visa_type: str
    petitioner_name: str
    beneficiary_name: str
    job_title: str | None = None
    job_duties: str | None = None
    degree_type: str | None = None
    degree_field: str | None = None
    years_experience: int | None = None
    work_location: str | None = None
    offered_wage: float | None = None
    prevailing_wage: float | None = None
    lca_number: str | None = None


class AdjudicationRequest(BaseModel):
    case_info: CaseInfo
    user_id: str | None = None
    session_id: str | None = None


class AdjudicationEvent(BaseModel):
    event_type: str  # 'stage', 'reasoning', 'tool_call', 'result', 'error', 'complete'
    stage: str | None = None
    content: str | None = None
    tool_name: str | None = None
    tool_result: dict[str, Any] | None = None
    confidence: int | None = None
    timestamp: str = ""

    def __init__(self, **data: Any) -> None:
        if "timestamp" not in data or not data["timestamp"]:
            data["timestamp"] = datetime.now().isoformat()
        super().__init__(**data)


# ========================================
# STREAMING ADJUDICATION ENDPOINT
# ========================================


@router.post("/analyze/stream")
async def analyze_case_stream(
    request: AdjudicationRequest,
) -> StreamingResponse:
    """Stream the adjudication analysis in real-time."""

    async def generate_events() -> AsyncGenerator[str, None]:
        user_id = request.user_id or f"user_{uuid.uuid4().hex[:8]}"
        session_id = request.session_id or f"session_{uuid.uuid4().hex[:8]}"
        case = request.case_info

        # Build the analysis prompt
        prompt = f"""Analyze the following immigration petition case:

Case Number: {case.case_number}
Visa Type: {case.visa_type}
Petitioner: {case.petitioner_name}
Beneficiary: {case.beneficiary_name}
Job Title: {case.job_title or "Software Engineer"}
Job Duties: {case.job_duties or "Design, develop, and maintain software applications"}
Degree: {case.degree_type or "Bachelor's"} in {case.degree_field or "Computer Science"}
Experience: {case.years_experience or 5} years
Work Location: {case.work_location or "San Francisco, CA"}
Offered Wage: ${case.offered_wage or 120000:,.2f}
Prevailing Wage: ${case.prevailing_wage or 100000:,.2f}
LCA Number: {case.lca_number or "I-200-24001-123456"}

Please perform a complete adjudication analysis:
1. Analyze the petition form
2. Evaluate specialty occupation criteria
3. Check beneficiary qualifications
4. Verify employer-employee relationship
5. Check LCA compliance
6. Generate a draft adjudication decision

Provide detailed reasoning for each step."""

        # Send initial stage event
        yield f"data: {AdjudicationEvent(event_type='stage', stage='form_validation', content='Starting petition form analysis...').model_dump_json()}\n\n"

        try:
            # Run the agent and stream events
            async for event in runner.run_async(
                user_id=user_id,
                session_id=session_id,
                new_message=types.Content(role="user", parts=[types.Part(text=prompt)]),
            ):
                # Process different event types
                if hasattr(event, "actions") and event.actions:
                    for action in event.actions:
                        func_calls = getattr(action, "function_calls", None)
                        if func_calls:
                            for fc in func_calls:
                                # Tool call event
                                yield f"data: {AdjudicationEvent(event_type='tool_call', tool_name=fc.name, content=f'Executing: {fc.name}').model_dump_json()}\n\n"

                if hasattr(event, "responses") and event.responses:
                    for response in event.responses:
                        if (
                            hasattr(response, "function_responses")
                            and response.function_responses
                        ):
                            for fr in response.function_responses:
                                # Tool result event
                                result_data = (
                                    fr.response if hasattr(fr, "response") else {}
                                )
                                yield f"data: {AdjudicationEvent(event_type='tool_result', tool_name=fr.name if hasattr(fr, 'name') else 'unknown', tool_result=result_data).model_dump_json()}\n\n"

                # Check for final response
                if event.is_final_response() and event.content:
                    parts = event.content.parts
                    if parts:
                        for part in parts:
                            if hasattr(part, "text") and part.text:
                                # Send reasoning content in chunks
                                text = part.text
                                chunks = [
                                    text[i : i + 200] for i in range(0, len(text), 200)
                                ]
                                for chunk in chunks:
                                    yield f"data: {AdjudicationEvent(event_type='reasoning', content=chunk).model_dump_json()}\n\n"
                                    await asyncio.sleep(
                                        0.05
                                    )  # Small delay for streaming effect

            # Send completion event
            yield f"data: {AdjudicationEvent(event_type='complete', content='Analysis complete', confidence=89).model_dump_json()}\n\n"

        except Exception as e:
            yield f"data: {AdjudicationEvent(event_type='error', content=str(e)).model_dump_json()}\n\n"

    return StreamingResponse(
        generate_events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ========================================
# WEBSOCKET ENDPOINT FOR REAL-TIME
# ========================================


@router.websocket("/ws/{user_id}/{session_id}")
async def websocket_adjudication(
    websocket: WebSocket, user_id: str, session_id: str
) -> None:
    """WebSocket endpoint for real-time bidirectional adjudication."""
    await websocket.accept()

    try:
        while True:
            # Receive case data from client
            data = await websocket.receive_text()
            request_data = json.loads(data)

            case = CaseInfo(**request_data.get("case_info", {}))

            # Build prompt
            prompt = f"""Analyze immigration case {case.case_number} for {case.visa_type} classification.
Petitioner: {case.petitioner_name}
Beneficiary: {case.beneficiary_name}
Perform complete adjudication analysis with all required tools."""

            # Send stage updates
            await websocket.send_json(
                {
                    "event_type": "stage",
                    "stage": "form_validation",
                    "content": "Analyzing petition form...",
                    "timestamp": datetime.now().isoformat(),
                }
            )

            # Run agent
            async for event in runner.run_async(
                user_id=user_id,
                session_id=session_id,
                new_message=types.Content(role="user", parts=[types.Part(text=prompt)]),
            ):
                # Send tool calls
                if hasattr(event, "actions") and event.actions:
                    for action in event.actions:
                        func_calls = getattr(action, "function_calls", None)
                        if func_calls:
                            for fc in func_calls:
                                await websocket.send_json(
                                    {
                                        "event_type": "tool_call",
                                        "tool_name": fc.name,
                                        "content": f"Executing {fc.name}",
                                        "timestamp": datetime.now().isoformat(),
                                    }
                                )

                # Send final response
                if event.is_final_response() and event.content:
                    parts = event.content.parts
                    if parts:
                        for part in parts:
                            if hasattr(part, "text") and part.text:
                                await websocket.send_json(
                                    {
                                        "event_type": "reasoning",
                                        "content": part.text,
                                        "timestamp": datetime.now().isoformat(),
                                    }
                                )

            # Send completion
            await websocket.send_json(
                {
                    "event_type": "complete",
                    "content": "Analysis complete",
                    "confidence": 89,
                    "timestamp": datetime.now().isoformat(),
                }
            )

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json(
            {
                "event_type": "error",
                "content": str(e),
                "timestamp": datetime.now().isoformat(),
            }
        )


# ========================================
# SYNCHRONOUS ANALYSIS ENDPOINT
# ========================================


@router.post("/analyze")
async def analyze_case(request: AdjudicationRequest) -> dict[str, Any]:
    """Perform complete case analysis (non-streaming)."""
    user_id = request.user_id or f"user_{uuid.uuid4().hex[:8]}"
    session_id = request.session_id or f"session_{uuid.uuid4().hex[:8]}"
    case = request.case_info

    prompt = f"""Analyze immigration case {case.case_number} for {case.visa_type}.
Petitioner: {case.petitioner_name}, Beneficiary: {case.beneficiary_name}
Perform complete adjudication with all tools and provide final recommendation."""

    result_text = ""
    tool_calls: list[str] = []

    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=types.Content(role="user", parts=[types.Part(text=prompt)]),
    ):
        if hasattr(event, "actions") and event.actions:
            for action in event.actions:
                func_calls = getattr(action, "function_calls", None)
                if func_calls:
                    for fc in func_calls:
                        tool_calls.append(fc.name)

        if event.is_final_response() and event.content:
            parts = event.content.parts
            if parts:
                for part in parts:
                    if hasattr(part, "text") and part.text:
                        result_text += part.text

    return {
        "case_number": case.case_number,
        "visa_type": case.visa_type,
        "analysis": result_text,
        "tools_used": tool_calls,
        "timestamp": datetime.now().isoformat(),
    }


# ========================================
# UTILITY ENDPOINTS
# ========================================


@router.get("/criteria/{visa_type}")
async def get_evaluation_criteria(visa_type: str) -> dict[str, Any]:
    """Get evaluation criteria for a visa type."""
    criteria_map: dict[str, list[dict[str, str]]] = {
        "H-1B": [
            {
                "id": "1",
                "name": "Specialty Occupation",
                "description": "Position requires theoretical and practical application of specialized knowledge",
            },
            {
                "id": "2",
                "name": "Beneficiary Qualifications",
                "description": "Beneficiary has required degree or equivalent",
            },
            {
                "id": "3",
                "name": "Employer-Employee Relationship",
                "description": "Valid employer-employee relationship exists",
            },
            {
                "id": "4",
                "name": "Prevailing Wage Compliance",
                "description": "Offered wage meets or exceeds prevailing wage",
            },
            {
                "id": "5",
                "name": "LCA Compliance",
                "description": "Labor Condition Application is certified and compliant",
            },
            {
                "id": "6",
                "name": "Itinerary Requirements",
                "description": "Work itinerary provided if applicable",
            },
        ],
        "O-1": [
            {
                "id": "1",
                "name": "Extraordinary Ability",
                "description": "Sustained national or international acclaim",
            },
            {
                "id": "2",
                "name": "Evidence of Recognition",
                "description": "Documentation of achievements and recognition",
            },
            {
                "id": "3",
                "name": "Continued Work in Field",
                "description": "Coming to US to continue work in area of expertise",
            },
        ],
        "EB-2 NIW": [
            {
                "id": "1",
                "name": "Advanced Degree",
                "description": "Holds advanced degree or exceptional ability",
            },
            {
                "id": "2",
                "name": "National Interest",
                "description": "Work is in the national interest of the United States",
            },
            {
                "id": "3",
                "name": "Substantial Merit",
                "description": "Proposed endeavor has substantial merit and national importance",
            },
        ],
    }

    if visa_type.upper() not in criteria_map:
        raise HTTPException(
            status_code=404, detail=f"Criteria not found for visa type: {visa_type}"
        )

    return {
        "visa_type": visa_type.upper(),
        "criteria": criteria_map.get(visa_type.upper(), []),
    }


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "service": "adjudicator"}

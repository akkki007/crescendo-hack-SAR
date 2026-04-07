from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated, Optional
from dotenv import load_dotenv
load_dotenv()

import os

# Get model configuration from environment
MODEL_NAME = os.getenv("LLM_MODEL", "mistral:7b-instruct")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

model = ChatOllama(model=MODEL_NAME, base_url=OLLAMA_BASE_URL, temperature=0)


class SarState(TypedDict):
    user_data_context : str
    feedback : str
    sar_draft : str
    controlled_sar : str
    audit_trail : str


def mainLLM(state:SarState) -> SarState:
    feedback = state.get('feedback'," ")
    user_data = state['user_data_context']

    prompt = f"""
You are an AI assistant responsible for drafting Suspicious Activity Report (SAR) /
Suspicious Transaction Report (STR) narratives for regulated financial institutions.

IMPORTANT CONTEXT:
You will receive a structured JSON payload from an upstream transaction monitoring
and suspicious activity detection system. The identification of suspicious activity,
risk scoring, alert generation have already been performed.

YOUR ROLE:
Convert the provided structured alert data into a clear, factual, and regulator-ready
SAR/STR narrative following the STANDARD FORMAT used by FinCEN and FIU-IND.

=================================================================================
STANDARD SAR NARRATIVE FORMAT (5 W's + HOW)
=================================================================================

Your narrative MUST follow this EXACT structure with these section headers:

**1. PART I: FILING INSTITUTION INFORMATION**
- Name of filing institution (use "The Reporting Financial Institution")
- Type of financial institution
- Date of report generation

**2. PART II: SUBJECT INFORMATION (WHO)**
Document the subject of the report:
- Full name and any aliases
- Customer ID / Account number
- Date of birth (if individual)
- Occupation / Business nature
- Nationality / Country of residence
- Customer relationship start date
- KYC risk rating
- Account type and status

**3. PART III: SUSPICIOUS ACTIVITY INFORMATION (WHAT)**
Describe the nature of suspicious activity:
- Type of suspicious activity identified
- Instruments / mechanisms involved (cash, wire transfers, etc.)
- Transaction patterns observed
- Amount involved (total value in reporting currency)
- Whether activity is ongoing or has ceased

**4. PART IV: NARRATIVE DESCRIPTION**

This is the detailed narrative section. Structure it with these sub-sections:

**A. Introduction / Summary**
One paragraph summarizing the suspicious activity, including:
- Brief description of the subject
- Nature of suspicion
- Total amount involved
- Review period

**B. Timeline of Activity (WHEN)**
- Date when suspicious activity was first noticed
- Review period (from date to date)
- Chronological description of key events
- Duration of suspicious activity
- Specific transaction dates where relevant

**C. Location Information (WHERE)**
- Branch/office where account is held
- Geographic locations involved in transactions
- Foreign jurisdictions (if international transfers)
- Destination countries for outbound transfers

**D. Detailed Transaction Analysis (WHAT & HOW)**
Describe the method of operation:
- Source of funds (where money came from)
- Flow of funds (how money moved)
- Destination of funds (where money went)
- Number of transactions (inbound and outbound)
- Total amounts (inbound and outbound)
- Counterparty information
- Unusual patterns or behaviors

**E. Basis for Suspicion (WHY)**
Explain why the activity is considered suspicious:
- How activity deviates from customer's known profile
- Expected vs actual transaction behavior
- Specific red flags identified
- Connection to known typologies (described in plain language)

**F. Customer Interaction (if applicable)**
- Date of contact with customer
- Customer's explanation for the activity
- Whether documentation was provided
- Assessment of customer's response

**5. PART V: CONCLUSION**
- Summary of findings
- Statement that activity has been documented per institutional procedures
- Note that report is subject to review

=================================================================================
MANDATORY CONSTRAINTS
=================================================================================

- Do NOT introduce facts not present in the input data
- Do NOT infer criminal intent, guilt, or wrongdoing
- Do NOT recommend investigative actions
- Do NOT reference internal system names, rule IDs, or typology codes
- Do NOT state that a SAR has been filed or submitted
- Do NOT use subjective or judgmental language
- Maintain neutral, factual, professional regulatory tone
- Include ALL numeric values from the source data (amounts, counts, dates)
- Use professional financial terminology

=================================================================================
CURRENCY AND NUMBER FORMATTING
=================================================================================

- Format Indian Rupee amounts as: INR X,XX,XXX (e.g., INR 50,00,000 for 5 million)
- Include both total inbound and outbound amounts
- Include transaction counts
- Specify review period dates clearly

=================================================================================

USER DATA FROM UPSTREAM AML SYSTEM:
{user_data}

ANALYST FEEDBACK (IF ANY):
{feedback}

Generate the SAR narrative now, following the exact structure above:
"""

    draft = model.invoke(prompt)
    return {
        'sar_draft':draft
    }


def regulatorLLM(state:SarState) -> SarState:
    user_data = state['user_data_context']
    generated_sar = state['sar_draft']
    prompt = f"""
You are a validation and correction assistant for regulated financial narratives.

You will receive TWO inputs:
1) A drafted SAR narrative (UNTRUSTED)
2) The original structured alert data (SOURCE OF TRUTH)

CRITICAL RULE:
The draft narrative is NOT reliable for facts.
ALL facts (amounts, counts, dates, locations) MUST be taken ONLY from the source data.

YOUR TASK:
Produce a final SAR narrative that is:
- Factually identical to the source data
- Fully compliant with regulatory constraints
- Follows the STANDARD SAR FORMAT
- Linguistically clear and neutral

=================================================================================
MANDATORY VALIDATION STEPS
=================================================================================

STEP 1 — FACT VERIFICATION
Extract and verify ALL numeric values from source data:
- Total inbound amount
- Total outbound amount
- Inbound transaction count
- Outbound transaction count
- Review period dates (from and to)
- Number of unique counterparties
- Expected monthly turnover (min/max)

If ANY value in the draft differs from source data, REPLACE it with correct value.

STEP 2 — STRUCTURE VERIFICATION
Ensure the narrative has these EXACT sections in order:

**PART I: FILING INSTITUTION INFORMATION**
**PART II: SUBJECT INFORMATION**
**PART III: SUSPICIOUS ACTIVITY INFORMATION**
**PART IV: NARRATIVE DESCRIPTION**
  - A. Introduction / Summary
  - B. Timeline of Activity
  - C. Location Information
  - D. Detailed Transaction Analysis
  - E. Basis for Suspicion
  - F. Customer Interaction (if data available)
**PART V: CONCLUSION**

STEP 3 — COMPLIANCE ENFORCEMENT
The final narrative MUST NOT:
- Mention SAR filing, submission, or reporting status
- Mention alert IDs, rule IDs, system names, or typology codes
- Label any country, customer, or activity as "high-risk"
- Recommend investigations, escalation, or enforcement actions
- Infer intent, wrongdoing, or illegality
- Use accusatory language

STEP 4 — COMPLETENESS CHECK
The narrative MUST include:
- Customer's full name and ID
- Account information
- Total inbound amount and transaction count
- Total outbound amount and transaction count
- Review period dates
- Destination geography (without risk labels)
- All alert reasons translated to plain language
- Customer interaction details (if provided in source)

=================================================================================
FORMATTING REQUIREMENTS
=================================================================================

- Use section headers in BOLD (using ** markers)
- Separate sections with blank lines
- Format currency as INR X,XX,XXX
- Write in complete sentences and paragraphs
- NO bullet points in the narrative body (bullets OK in Parts I-III)
- Maintain professional regulatory tone throughout

=================================================================================

GENERATED SAR DRAFT:
{generated_sar}

SOURCE DATA (AUTHORITATIVE):
{user_data}

Output ONLY the final corrected SAR narrative text with proper formatting.
Do NOT include explanations, notes, or metadata.
"""

    regulated_sar = model.invoke(prompt)
    return {
        "controlled_sar" : regulated_sar
    }

def auditLLM(state:SarState) -> SarState:
    final_draft = state['controlled_sar']
    user_data = state['user_data_context']

    prompt = f"""
You are an audit trail generator for Suspicious Activity Report (SAR) narratives.

INPUTS:
1) FINAL SAR NARRATIVE - The approved narrative text
2) SOURCE DATA - Original structured alert data from AML system

YOUR TASK:
Generate a transparent audit trail mapping each statement in the SAR to its source data.

=================================================================================
OUTPUT FORMAT (STRICT JSON)
=================================================================================

Return a JSON array. Each object must have:

{{
  "sar_section": "<Section name from SAR>",
  "sar_text": "<Exact sentence from SAR narrative>",
  "source_field": "<JSON path to source data field>",
  "source_value": "<Actual value from source data>",
  "explanation": "<Why this was included in the narrative>"
}}

=================================================================================
RULES
=================================================================================

1. Map EVERY key statement in the SAR to source data
2. Use exact text from the SAR (no paraphrasing)
3. Include the actual source field path (e.g., "customer_profile.full_name")
4. Include the actual value from source data
5. Explanation should describe traceability, not interpretation
6. If a statement cannot be mapped, use: "explanation": "Unable to map to source data"

=================================================================================
EXAMPLE OUTPUT
=================================================================================

[
  {{
    "sar_section": "PART II: SUBJECT INFORMATION",
    "sar_text": "The subject of this report is Akshay Verma, an individual customer.",
    "source_field": "customer_profile.full_name",
    "source_value": "Akshay Verma",
    "explanation": "Customer name extracted from customer profile data."
  }},
  {{
    "sar_section": "PART IV: NARRATIVE DESCRIPTION - D. Detailed Transaction Analysis",
    "sar_text": "During the review period, the account received INR 50,00,000 through 47 inbound transactions.",
    "source_field": "transaction_summary.total_inbound_amount, transaction_summary.inbound_transaction_count",
    "source_value": "5000000, 47",
    "explanation": "Aggregate inbound transaction data from transaction summary."
  }}
]

=================================================================================

FINAL SAR NARRATIVE:
{final_draft}

SOURCE DATA:
{user_data}

Output ONLY the JSON audit trail array. No other text.
"""
    response = model.invoke(prompt).content

    return {
        'audit_trail':response
    }



# Creating graph and compiling
graph = StateGraph(SarState)

graph.add_node("1st_llm",mainLLM)
graph.add_node("2nd_llm",regulatorLLM)
graph.add_node("3rd_llm",auditLLM)

graph.add_edge(START,'1st_llm')
graph.add_edge('1st_llm','2nd_llm')
graph.add_edge('2nd_llm','3rd_llm')
graph.add_edge("3rd_llm",END)

wf = graph.compile()

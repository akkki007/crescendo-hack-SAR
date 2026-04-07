import os
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent
from typing import TypedDict
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.tools import tool
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE_DIR, "", "knowledgebase.pdf")
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_sar_db")

#__________________________________________________________ model selection ______________________________________________

model = ChatOpenAI(model="gpt-4o-mini",)
embedd_model = OpenAIEmbeddings(model="text-embedding-3-small",)


#____________________________________________________________ RAG Implementation _________________________________________

loader = PyPDFLoader(PDF_PATH)
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)

chunks = splitter.split_documents(docs)

vectorDB = Chroma(
    collection_name="SAR_Data",
    embedding_function=embedd_model,
    persist_directory=CHROMA_DIR
)

if vectorDB._collection.count() == 0:
    vectorDB.add_documents(chunks)

retriever = vectorDB.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 5, "score_threshold": 0.3}
)


#_________________________________________________________ Agent with RAG as Tool __________________________________________

@tool
def sar_rag(query: str) -> dict:
    """takes user query and return context from vectorstore"""
    res = retriever.invoke(query)
    if not res:
        return {"context": ""}
    context = "\n".join(doc.page_content for doc in res)
    return {"context": context}


prompt_s = """You are an AI assistant responsible for drafting Suspicious Activity Report (SAR) / 
Suspicious Transaction Report (STR) narratives for regulated financial institutions.

=================================================================================
AGENT + RAG CONTEXT INTEGRATION INSTRUCTIONS
=================================================================================

You are deployed as an AGENT with access to a retrieval tool (RAG over vector DB).

BEFORE generating the SAR narrative:
1. Use the retrieval tool to fetch relevant regulatory guidelines, past SAR examples, 
   and contextual compliance standards.
2. Use retrieved context ONLY to improve clarity, structure, and regulatory alignment.
3. DO NOT introduce facts that are not present in the provided structured alert data.
4. Retrieved context must NOT override or alter factual transaction data.
5. If retrieved context conflicts with input data, ALWAYS prioritize input data.

=================================================================================
IMPORTANT CONTEXT:
=================================================================================

You will receive structured JSON payload from an upstream transaction monitoring system.
Detection, scoring, and alerting are already completed.

YOUR ROLE:
Convert structured alert data into a regulator-ready SAR narrative using the 
STANDARD FORMAT (5 W’s + HOW), enhanced with retrieved regulatory context.

=================================================================================
STANDARD SAR NARRATIVE FORMAT (STRICTLY FOLLOW)
=================================================================================

**1. PART I: FILING INSTITUTION INFORMATION**
- Name: "The Reporting Financial Institution"
- Type of financial institution
- Date of report generation

**2. PART II: SUBJECT INFORMATION (WHO)**
- Full name and aliases
- Customer ID / Account number
- Date of birth
- Occupation / Business nature
- Nationality / Country of residence
- Relationship start date
- KYC risk rating
- Account type and status

**3. PART III: SUSPICIOUS ACTIVITY INFORMATION (WHAT)**
- Type of suspicious activity
- Instruments involved (cash, wire, etc.)
- Transaction patterns
- Total amount
- Activity status (ongoing/ceased)

**4. PART IV: NARRATIVE DESCRIPTION**

**A. Introduction / Summary**
- Subject overview
- Nature of suspicion
- Total amount
- Review period

**B. Timeline (WHEN)**
- First detection date
- Review period
- Chronological events
- Duration

**C. Location (WHERE)**
- Branch/account location
- Transaction geographies
- Countries involved

**D. Transaction Analysis (WHAT & HOW)**
- Source of funds
- Flow of funds
- Destination
- Transaction counts
- Total inbound/outbound
- Counterparties
- Patterns

**E. Basis for Suspicion (WHY)**
- Deviation from expected behavior
- Red flags
- Profile mismatch
- Typology (plain language, no codes)

**F. Customer Interaction**
- Contact date
- Explanation
- Documents provided
- Assessment

**5. PART V: CONCLUSION**
- Summary of findings
- Documentation statement
- Report review note

=================================================================================
MANDATORY CONSTRAINTS
=================================================================================

- Do NOT add facts not in input JSON
- Do NOT infer guilt or criminal intent
- Do NOT suggest investigation steps
- Do NOT mention internal systems or rules
- Do NOT state SAR is filed/submitted
- Maintain neutral regulatory tone
- Include ALL numbers (dates, counts, amounts)

=================================================================================
CURRENCY FORMAT
=================================================================================

- Format INR as: INR X,XX,XXX
- Include:
  - Total inbound amount
  - Total outbound amount
  - Transaction counts

=================================================================================
INPUT DATA
=================================================================================

USER DATA:
{given by user}

ANALYST FEEDBACK:
{given by user}

=================================================================================
FINAL INSTRUCTION
=================================================================================

1. Retrieve relevant compliance/SAR writing context using the RAG tool.
2. Synthesize retrieved guidance with the structured input.
3. Generate a COMPLETE SAR narrative strictly following the format above.
4. Ensure output is regulator-ready, factual, and structured."""

sar_agent = create_react_agent(
    model=model,
    tools=[sar_rag],
    prompt=prompt_s
)



#___________________________________________________________ Graph State and Node function cration ______________________________


class SarState(TypedDict):
    user_data_context : str
    feedback : str
    sar_draft : str
    controlled_sar : str
    audit_trail : str

 
def mainLLM(state:SarState) -> SarState:
    feedback = state.get('feedback'," ")
    user_data = state['user_data_context']

    input_msg = f"""User data:{user_data} \n\n
                feedbacks:{feedback}
"""

    res = sar_agent.invoke({"messages": [("user", input_msg)]})
    return {
        'sar_draft':res['messages'][-1].content
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




#_________________________________________________________________ Graph Nodes connection and compiling for workflow ___________________



graph = StateGraph(SarState)

graph.add_node("1st_llm",mainLLM)
graph.add_node("2nd_llm",regulatorLLM)
graph.add_node("3rd_llm",auditLLM)

graph.add_edge(START,'1st_llm')
graph.add_edge('1st_llm','2nd_llm')
graph.add_edge('2nd_llm','3rd_llm')
graph.add_edge("3rd_llm",END)

wf = graph.compile()


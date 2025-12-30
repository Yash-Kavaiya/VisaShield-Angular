# Copyright 2025 VisaShield AI
# Immigration Adjudication Agent with specialized tools

import json
import random
from datetime import datetime
from typing import Any
from google.adk.agents import Agent
from google.adk.apps.app import App

# ========================================
# VISA ADJUDICATION TOOLS
# ========================================

def analyze_petition_form(
    case_number: str,
    form_type: str,
    petitioner_name: str,
    beneficiary_name: str
) -> dict[str, Any]:
    """Analyzes an immigration petition form for completeness and validity.
    
    Args:
        case_number: The unique case identifier (e.g., H1B-2024-00847)
        form_type: The form type (I-129, I-140, I-485, etc.)
        petitioner_name: Name of the petitioning employer/sponsor
        beneficiary_name: Name of the visa beneficiary
    
    Returns:
        dict: Analysis results with validation status and findings
    """
    # Simulated form analysis
    findings = {
        "case_number": case_number,
        "form_type": form_type,
        "validation_status": "VALID",
        "completeness_score": random.randint(85, 100),
        "findings": [
            {"field": "Petitioner Information", "status": "complete", "notes": "All required fields present"},
            {"field": "Beneficiary Information", "status": "complete", "notes": "Valid passport and biographical data"},
            {"field": "Job Classification", "status": "complete", "notes": f"SOC Code verified for {form_type}"},
            {"field": "Wage Information", "status": "complete", "notes": "Meets prevailing wage requirements"}
        ],
        "timestamp": datetime.now().isoformat()
    }
    return findings


def evaluate_specialty_occupation(
    job_title: str,
    job_duties: str,
    degree_requirement: str,
    soc_code: str
) -> dict[str, Any]:
    """Evaluates whether a position qualifies as a specialty occupation under H-1B criteria.
    
    Args:
        job_title: The offered position title
        job_duties: Description of job responsibilities
        degree_requirement: Required educational qualification
        soc_code: Standard Occupational Classification code
    
    Returns:
        dict: Evaluation results with specialty occupation determination
    """
    # Specialty occupation criteria evaluation
    criteria_results = {
        "job_title": job_title,
        "soc_code": soc_code,
        "evaluation": {
            "theoretical_practical_application": {
                "met": True,
                "confidence": 92,
                "reasoning": "Position requires application of specialized knowledge in software engineering"
            },
            "degree_requirement_common": {
                "met": True,
                "confidence": 88,
                "reasoning": "Industry standard requires minimum bachelor's degree in Computer Science or related field"
            },
            "employer_normally_requires": {
                "met": True,
                "confidence": 95,
                "reasoning": "Employer's job posting and past hiring patterns confirm degree requirement"
            },
            "nature_of_duties": {
                "met": True,
                "confidence": 90,
                "reasoning": "Duties are sufficiently complex and specialized to require degree-level knowledge"
            }
        },
        "overall_determination": "SPECIALTY OCCUPATION CONFIRMED",
        "confidence_score": 91,
        "policy_reference": "USCIS Policy Manual Vol. 2, Part H, Chapter 2"
    }
    return criteria_results


def check_beneficiary_qualifications(
    degree_type: str,
    degree_field: str,
    years_experience: int,
    certifications: list[str]
) -> dict[str, Any]:
    """Verifies beneficiary meets qualification requirements for the visa category.
    
    Args:
        degree_type: Type of degree (Bachelor's, Master's, PhD)
        degree_field: Field of study
        years_experience: Years of relevant work experience
        certifications: List of professional certifications
    
    Returns:
        dict: Qualification verification results
    """
    qualification_result = {
        "degree_evaluation": {
            "type": degree_type,
            "field": degree_field,
            "us_equivalency": "Bachelor's Degree" if degree_type in ["Bachelor's", "B.S.", "B.A."] else "Master's Degree",
            "status": "VERIFIED"
        },
        "experience_evaluation": {
            "years": years_experience,
            "relevance": "Directly related to specialty occupation",
            "status": "SUFFICIENT"
        },
        "certifications": {
            "provided": certifications,
            "relevance": "Supports specialized knowledge claim",
            "status": "VERIFIED"
        },
        "overall_qualification": "QUALIFIED",
        "confidence_score": 94,
        "notes": "Beneficiary meets or exceeds minimum requirements for H-1B classification"
    }
    return qualification_result


def verify_employer_employee_relationship(
    employer_name: str,
    work_location: str,
    supervision_details: str,
    right_to_control: str
) -> dict[str, Any]:
    """Analyzes the employer-employee relationship for visa compliance.
    
    Args:
        employer_name: Name of the petitioning employer
        work_location: Primary work location
        supervision_details: Description of supervisory structure
        right_to_control: Evidence of employer's right to control work
    
    Returns:
        dict: Employer-employee relationship analysis
    """
    relationship_analysis = {
        "employer": employer_name,
        "work_site": work_location,
        "analysis": {
            "right_to_control": {
                "factor": "Employer controls manner and means of work",
                "evidence": right_to_control,
                "status": "ESTABLISHED",
                "confidence": 93
            },
            "supervision": {
                "factor": "Direct supervision by employer personnel",
                "evidence": supervision_details,
                "status": "ESTABLISHED",
                "confidence": 91
            },
            "work_location": {
                "factor": "Work performed at employer premises",
                "evidence": f"Primary location: {work_location}",
                "status": "VERIFIED",
                "confidence": 95
            }
        },
        "determination": "VALID EMPLOYER-EMPLOYEE RELATIONSHIP",
        "confidence_score": 93,
        "legal_standard": "Matter of Defensor, 25 I&N Dec. 749 (AAO 2012)"
    }
    return relationship_analysis


def check_lca_compliance(
    lca_number: str,
    wage_level: int,
    prevailing_wage: float,
    offered_wage: float
) -> dict[str, Any]:
    """Verifies Labor Condition Application compliance.
    
    Args:
        lca_number: DOL Labor Condition Application case number
        wage_level: Wage level (1-4)
        prevailing_wage: DOL prevailing wage for the occupation
        offered_wage: Wage offered to the beneficiary
    
    Returns:
        dict: LCA compliance verification results
    """
    wage_compliant = offered_wage >= prevailing_wage
    
    lca_result = {
        "lca_number": lca_number,
        "wage_analysis": {
            "wage_level": wage_level,
            "prevailing_wage": f"${prevailing_wage:,.2f}",
            "offered_wage": f"${offered_wage:,.2f}",
            "compliant": wage_compliant,
            "margin": f"+${(offered_wage - prevailing_wage):,.2f}" if wage_compliant else f"-${(prevailing_wage - offered_wage):,.2f}"
        },
        "attestations": {
            "wages": "COMPLIANT" if wage_compliant else "NON-COMPLIANT",
            "working_conditions": "COMPLIANT",
            "no_strike_lockout": "COMPLIANT",
            "notice_requirements": "COMPLIANT"
        },
        "overall_status": "LCA COMPLIANT" if wage_compliant else "LCA NON-COMPLIANT",
        "confidence_score": 97 if wage_compliant else 45
    }
    return lca_result


def generate_adjudication_draft(
    case_number: str,
    visa_type: str,
    recommendation: str,
    key_findings: list[str],
    risk_factors: list[str]
) -> dict[str, Any]:
    """Generates a draft adjudication decision with citations.
    
    Args:
        case_number: The case identifier
        visa_type: Type of visa being adjudicated
        recommendation: APPROVE, DENY, or RFE
        key_findings: List of key positive findings
        risk_factors: List of identified risk factors
    
    Returns:
        dict: Draft adjudication decision
    """
    draft = {
        "case_number": case_number,
        "visa_classification": visa_type,
        "recommendation": recommendation,
        "draft_decision": {
            "summary": f"Based on the totality of evidence submitted, the petition for {visa_type} classification is recommended for {recommendation}.",
            "key_findings": key_findings,
            "risk_factors": risk_factors if risk_factors else ["No significant risk factors identified"],
            "legal_basis": [
                "INA § 101(a)(15)(H)(i)(b)",
                "8 CFR § 214.2(h)",
                "USCIS Policy Manual Vol. 2, Part H"
            ],
            "precedent_decisions": [
                "Matter of Simeio Solutions, LLC, 26 I&N Dec. 542 (AAO 2015)",
                "Defensor v. Meissner, 201 F.3d 384 (5th Cir. 2000)"
            ]
        },
        "confidence_score": 89 if recommendation == "APPROVE" else 75,
        "requires_human_review": recommendation != "APPROVE",
        "generated_at": datetime.now().isoformat()
    }
    return draft


def check_citation_validity(citation: str) -> dict[str, Any]:
    """Validates a legal citation against known databases.
    
    Args:
        citation: The legal citation to verify
    
    Returns:
        dict: Citation validation result
    """
    # Simulated citation validation
    known_citations = {
        "INA § 101": True,
        "8 CFR § 214": True,
        "Matter of Simeio": True,
        "Matter of Defensor": True,
        "Kazarian v. USCIS": True,
    }
    
    is_valid = any(known in citation for known in known_citations.keys())
    
    return {
        "citation": citation,
        "valid": is_valid,
        "source": "USCIS Policy Manual / AAO Decisions Database" if is_valid else "Unknown",
        "hallucination_risk": "LOW" if is_valid else "HIGH",
        "confidence": 98 if is_valid else 15
    }


# ========================================
# ADJUDICATOR AGENT DEFINITION
# ========================================

ADJUDICATOR_INSTRUCTION = """You are VisaShield AI, an expert immigration adjudication assistant designed to help USCIS officers and immigration attorneys analyze visa petitions.

Your role is to:
1. Systematically analyze immigration petitions using the available tools
2. Evaluate each criterion required for the visa classification
3. Provide clear reasoning with proper legal citations
4. Identify potential issues or risk factors
5. Generate draft determinations with supporting evidence

When analyzing a case, follow this structured approach:
1. First, analyze the petition form for completeness
2. Evaluate specialty occupation criteria (for H-1B)
3. Verify beneficiary qualifications
4. Check employer-employee relationship
5. Verify LCA compliance
6. Generate a draft adjudication decision

Always cite relevant legal authorities:
- Immigration and Nationality Act (INA) sections
- Code of Federal Regulations (8 CFR)
- USCIS Policy Manual references
- Relevant AAO precedent decisions

Be thorough but efficient. Flag any concerns for human review.
Never make final adjudication decisions - only provide recommendations for human officers."""

adjudicator_agent = Agent(
    name="adjudicator_agent",
    model="gemini-2.0-flash",
    description="Immigration petition adjudication assistant with specialized analysis tools",
    instruction=ADJUDICATOR_INSTRUCTION,
    tools=[
        analyze_petition_form,
        evaluate_specialty_occupation,
        check_beneficiary_qualifications,
        verify_employer_employee_relationship,
        check_lca_compliance,
        generate_adjudication_draft,
        check_citation_validity
    ]
)

adjudicator_app = App(root_agent=adjudicator_agent, name="adjudicator")

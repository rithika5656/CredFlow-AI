"""
Advanced Risk Intelligence Service
Provides 7 AI-based credit risk analysis modules:
1. Future Loan Repayment Prediction
2. Career Longevity Analysis
3. Industry Risk Analysis
4. What-If Scenario Simulation
5. Financial Resilience Score
6. Behavioral Banking Analysis
7. Final AI Credit Decision Engine
"""

import math
from typing import Optional


# ---------------------------------------------------------------------------
# Industry reference data
# ---------------------------------------------------------------------------
INDUSTRY_DATA = {
    "technology": {"growth_trend": "high", "layoff_risk": 0.25, "economic_sensitivity": 0.4, "retirement_age": 60, "stability_base": 78},
    "manufacturing": {"growth_trend": "medium", "layoff_risk": 0.35, "economic_sensitivity": 0.6, "retirement_age": 58, "stability_base": 65},
    "healthcare": {"growth_trend": "high", "layoff_risk": 0.10, "economic_sensitivity": 0.2, "retirement_age": 62, "stability_base": 85},
    "banking": {"growth_trend": "medium", "layoff_risk": 0.20, "economic_sensitivity": 0.5, "retirement_age": 60, "stability_base": 75},
    "finance": {"growth_trend": "medium", "layoff_risk": 0.20, "economic_sensitivity": 0.5, "retirement_age": 60, "stability_base": 75},
    "retail": {"growth_trend": "low", "layoff_risk": 0.40, "economic_sensitivity": 0.7, "retirement_age": 58, "stability_base": 55},
    "real_estate": {"growth_trend": "medium", "layoff_risk": 0.30, "economic_sensitivity": 0.8, "retirement_age": 60, "stability_base": 60},
    "construction": {"growth_trend": "medium", "layoff_risk": 0.45, "economic_sensitivity": 0.75, "retirement_age": 55, "stability_base": 50},
    "agriculture": {"growth_trend": "low", "layoff_risk": 0.15, "economic_sensitivity": 0.65, "retirement_age": 65, "stability_base": 58},
    "education": {"growth_trend": "medium", "layoff_risk": 0.10, "economic_sensitivity": 0.2, "retirement_age": 65, "stability_base": 82},
    "energy": {"growth_trend": "high", "layoff_risk": 0.20, "economic_sensitivity": 0.5, "retirement_age": 58, "stability_base": 70},
    "telecommunications": {"growth_trend": "medium", "layoff_risk": 0.25, "economic_sensitivity": 0.4, "retirement_age": 60, "stability_base": 72},
    "hospitality": {"growth_trend": "low", "layoff_risk": 0.50, "economic_sensitivity": 0.85, "retirement_age": 58, "stability_base": 45},
    "automotive": {"growth_trend": "medium", "layoff_risk": 0.35, "economic_sensitivity": 0.6, "retirement_age": 58, "stability_base": 62},
    "pharma": {"growth_trend": "high", "layoff_risk": 0.10, "economic_sensitivity": 0.2, "retirement_age": 62, "stability_base": 85},
}

DEFAULT_INDUSTRY = {"growth_trend": "medium", "layoff_risk": 0.30, "economic_sensitivity": 0.5, "retirement_age": 60, "stability_base": 60}


def _get_industry_ref(sector: str) -> dict:
    key = sector.lower().replace(" ", "_").replace("-", "_")
    for k, v in INDUSTRY_DATA.items():
        if k in key or key in k:
            return v
    return DEFAULT_INDUSTRY


def _clamp(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value))


# ===================================================================
# 1. FUTURE LOAN REPAYMENT PREDICTION
# ===================================================================
def predict_future_repayment(
    monthly_income: float,
    existing_emi: float,
    cash_flow_net: float,
    credit_score: int,
    employment_stability: float,
    industry_sector: str,
) -> dict:
    ref = _get_industry_ref(industry_sector)

    emi_to_income = existing_emi / max(monthly_income, 1) * 100
    income_growth_trend = employment_stability * (1.0 - ref["layoff_risk"])
    cash_flow_stability = min(cash_flow_net / max(monthly_income, 1), 1.0) * 100

    # Weighted probability
    credit_factor = min(credit_score / 900, 1.0) * 30
    emi_factor = max(30 - emi_to_income * 0.5, 0)
    cash_factor = cash_flow_stability * 0.2
    employment_factor = employment_stability * 10
    industry_factor = ref["stability_base"] * 0.1

    repayment_probability = _clamp(
        credit_factor + emi_factor + cash_factor + employment_factor + industry_factor
    )

    if repayment_probability >= 75:
        risk_level = "Low"
        recommendation = "Approve"
    elif repayment_probability >= 50:
        risk_level = "Medium"
        recommendation = "Conditional"
    else:
        risk_level = "High"
        recommendation = "Reject"

    return {
        "repayment_probability": round(repayment_probability, 1),
        "default_risk_level": risk_level,
        "ai_recommendation": recommendation,
        "factors": {
            "emi_to_income_ratio": round(emi_to_income, 1),
            "income_growth_trend": round(income_growth_trend * 100, 1),
            "cash_flow_stability": round(cash_flow_stability, 1),
            "credit_factor": round(credit_factor, 1),
            "employment_factor": round(employment_factor, 1),
            "industry_factor": round(industry_factor, 1),
        },
    }


# ===================================================================
# 2. CAREER LONGEVITY ANALYSIS
# ===================================================================
def analyze_career_longevity(
    applicant_age: int,
    employment_type: str,
    industry_sector: str,
    loan_tenure_years: int,
    retirement_age_override: Optional[int] = None,
) -> dict:
    ref = _get_industry_ref(industry_sector)
    retirement_age = retirement_age_override or ref["retirement_age"]
    remaining_years = max(retirement_age - applicant_age, 0)

    # Stability modifier by employment type
    type_modifier = {
        "salaried": 1.0, "self_employed": 0.85, "business_owner": 0.9,
        "contract": 0.7, "freelance": 0.65,
    }.get(employment_type.lower().replace("-", "_").replace(" ", "_"), 0.8)

    base_score = min(remaining_years / 30, 1.0) * 60
    type_score = type_modifier * 25
    industry_score = ref["stability_base"] * 0.15

    career_stability_score = _clamp(base_score + type_score + industry_score)

    safe_window = remaining_years * type_modifier
    tenure_exceeds = loan_tenure_years > safe_window

    risk_warning = None
    if tenure_exceeds:
        risk_warning = (
            f"Loan tenure ({loan_tenure_years} yrs) exceeds safe earning window "
            f"({int(safe_window)} yrs). Elevated repayment risk in later years."
        )

    return {
        "career_stability_score": round(career_stability_score, 1),
        "remaining_earning_years": remaining_years,
        "retirement_age": retirement_age,
        "safe_earning_window": int(safe_window),
        "loan_tenure_years": loan_tenure_years,
        "tenure_exceeds_safe_window": tenure_exceeds,
        "risk_warning": risk_warning,
        "employment_type": employment_type,
    }


# ===================================================================
# 3. INDUSTRY RISK ANALYSIS
# ===================================================================
def analyze_industry_risk(industry_sector: str) -> dict:
    ref = _get_industry_ref(industry_sector)

    growth_score = {"high": 85, "medium": 60, "low": 35}.get(ref["growth_trend"], 50)
    layoff_score = (1 - ref["layoff_risk"]) * 100
    sensitivity_score = (1 - ref["economic_sensitivity"]) * 100

    stability_score = _clamp(growth_score * 0.35 + layoff_score * 0.35 + sensitivity_score * 0.30)

    if stability_score >= 70:
        risk_level = "Low"
    elif stability_score >= 45:
        risk_level = "Medium"
    else:
        risk_level = "High"

    trend_summaries = {
        "high": "Strong growth trajectory with expanding market opportunities.",
        "medium": "Moderate growth with stable market conditions.",
        "low": "Slow growth with potential market contraction risks.",
    }

    return {
        "industry_sector": industry_sector,
        "risk_level": risk_level,
        "stability_score": round(stability_score, 1),
        "market_growth_trend": ref["growth_trend"].capitalize(),
        "layoff_risk_index": round(ref["layoff_risk"] * 100, 1),
        "economic_sensitivity": round(ref["economic_sensitivity"] * 100, 1),
        "market_trend_summary": trend_summaries.get(ref["growth_trend"], "Industry data unavailable."),
        "scores": {
            "growth_score": round(growth_score, 1),
            "layoff_score": round(layoff_score, 1),
            "sensitivity_score": round(sensitivity_score, 1),
        },
    }


# ===================================================================
# 4. WHAT-IF SCENARIO SIMULATION
# ===================================================================
def simulate_scenarios(
    monthly_income: float,
    monthly_emi: float,
    monthly_expenses: float,
    savings_balance: float,
    interest_rate: float,
    loan_amount: float,
) -> dict:
    base_capacity = min(monthly_income / max(monthly_emi, 1), 1.0) * 100

    def _risk(pct):
        if pct >= 80:
            return "Safe"
        if pct >= 50:
            return "Medium Risk"
        return "High Risk"

    # S1: Job loss -- only savings + 35% residual (spouse, side income)
    s1_income = monthly_income * 0.35
    s1_capacity = _clamp(min(s1_income / max(monthly_emi, 1), 1.0) * 100)

    # S2: Medical emergency -- 40% income diverted
    s2_income = monthly_income * 0.60
    s2_capacity = _clamp(min(s2_income / max(monthly_emi, 1), 1.0) * 100)

    # S3: Business revenue drop 30%
    s3_income = monthly_income * 0.70
    s3_capacity = _clamp(min(s3_income / max(monthly_emi, 1), 1.0) * 100)

    # S4: Interest rate increase +2%
    new_rate = interest_rate + 2.0
    if interest_rate > 0 and monthly_emi > 0:
        factor = new_rate / max(interest_rate, 0.01)
        new_emi = monthly_emi * min(factor, 1.5)
    else:
        new_emi = monthly_emi * 1.15
    s4_capacity = _clamp(min(monthly_income / max(new_emi, 1), 1.0) * 100)

    scenarios = [
        {"scenario": "Normal Situation", "emi_capacity": round(base_capacity, 1), "risk_level": _risk(base_capacity)},
        {"scenario": "Job Loss", "emi_capacity": round(s1_capacity, 1), "risk_level": _risk(s1_capacity)},
        {"scenario": "Medical Emergency", "emi_capacity": round(s2_capacity, 1), "risk_level": _risk(s2_capacity)},
        {"scenario": "Business Revenue Drop (30%)", "emi_capacity": round(s3_capacity, 1), "risk_level": _risk(s3_capacity)},
        {"scenario": "Interest Rate Increase (+2%)", "emi_capacity": round(s4_capacity, 1), "risk_level": _risk(s4_capacity)},
    ]

    overall_resilience = _clamp(
        (s1_capacity * 0.30 + s2_capacity * 0.25 + s3_capacity * 0.25 + s4_capacity * 0.20)
    )

    return {
        "scenarios": scenarios,
        "overall_resilience": round(overall_resilience, 1),
        "base_emi_capacity": round(base_capacity, 1),
    }


# ===================================================================
# 5. FINANCIAL RESILIENCE SCORE
# ===================================================================
def calculate_resilience_score(
    savings_balance: float,
    emergency_funds: float,
    monthly_expenses: float,
    dependents: int,
    insurance_coverage: float,
) -> dict:
    total_reserves = savings_balance + emergency_funds
    months_safety = total_reserves / max(monthly_expenses, 1)

    # Reserves factor (up to 40 points for 12+ months coverage)
    reserves_factor = min(months_safety / 12, 1.0) * 40

    # Dependents penalty (fewer = better)
    dependents_factor = max(20 - dependents * 4, 0)

    # Insurance bonus
    insurance_factor = min(insurance_coverage / max(monthly_expenses * 12, 1), 1.0) * 25

    # Savings ratio
    savings_ratio = savings_balance / max(monthly_expenses * 6, 1)
    savings_factor = min(savings_ratio, 1.0) * 15

    score = _clamp(reserves_factor + dependents_factor + insurance_factor + savings_factor)

    if score >= 70:
        level = "Strong"
    elif score >= 45:
        level = "Moderate"
    else:
        level = "Weak"

    return {
        "resilience_score": round(score, 1),
        "resilience_level": level,
        "months_of_safety": round(months_safety, 1),
        "emergency_fund_coverage": round(total_reserves, 2),
        "factors": {
            "reserves_factor": round(reserves_factor, 1),
            "dependents_factor": round(dependents_factor, 1),
            "insurance_factor": round(insurance_factor, 1),
            "savings_factor": round(savings_factor, 1),
        },
    }


# ===================================================================
# 6. BEHAVIORAL BANKING ANALYSIS
# ===================================================================
def analyze_banking_behavior(
    gambling_transactions: int,
    large_withdrawals: int,
    luxury_spending_ratio: float,
    irregular_income_months: int,
    total_months_analyzed: int,
) -> dict:
    total = max(total_months_analyzed, 1)

    gambling_penalty = min(gambling_transactions * 8, 30)
    withdrawal_penalty = min(large_withdrawals * 5, 25)
    luxury_penalty = min(luxury_spending_ratio * 40, 25)
    irregular_penalty = min((irregular_income_months / total) * 30, 20)

    score = _clamp(100 - gambling_penalty - withdrawal_penalty - luxury_penalty - irregular_penalty)

    flags = []
    if gambling_transactions > 0:
        flags.append(f"Detected {gambling_transactions} gambling-related transaction(s)")
    if large_withdrawals > 2:
        flags.append(f"{large_withdrawals} sudden large withdrawals detected")
    if luxury_spending_ratio > 0.3:
        flags.append(f"High luxury spending ratio ({round(luxury_spending_ratio * 100, 1)}%)")
    if irregular_income_months > total * 0.3:
        flags.append(f"Irregular income pattern in {irregular_income_months} of {total} months")

    if score >= 75:
        discipline_level = "Good"
    elif score >= 50:
        discipline_level = "Average"
    else:
        discipline_level = "Poor"

    return {
        "financial_discipline_score": round(score, 1),
        "discipline_level": discipline_level,
        "risk_flags": flags,
        "penalties": {
            "gambling": round(gambling_penalty, 1),
            "large_withdrawals": round(withdrawal_penalty, 1),
            "luxury_spending": round(luxury_penalty, 1),
            "irregular_income": round(irregular_penalty, 1),
        },
    }


# ===================================================================
# 7. FINAL AI CREDIT DECISION ENGINE
# ===================================================================
def compute_final_decision(
    credit_score: int,
    income_stability: float,
    industry_risk_score: float,
    debt_ratio: float,
    repayment_probability: float,
    resilience_score: float,
    behavioral_score: float,
) -> dict:
    norm_credit = min(credit_score / 900, 1.0) * 100

    weights = {
        "credit_score": 0.20,
        "income_stability": 0.15,
        "industry_risk": 0.10,
        "debt_ratio": 0.15,
        "repayment_probability": 0.20,
        "resilience": 0.10,
        "behavioral": 0.10,
    }

    components = {
        "credit_score": norm_credit,
        "income_stability": income_stability,
        "industry_risk": industry_risk_score,
        "debt_ratio": _clamp(100 - debt_ratio),
        "repayment_probability": repayment_probability,
        "resilience": resilience_score,
        "behavioral": behavioral_score,
    }

    final_score = sum(components[k] * weights[k] for k in weights)
    final_score = _clamp(final_score)

    if final_score >= 75:
        decision = "Approve"
        decision_detail = "Strong credit profile. Recommended for full approval."
    elif final_score >= 50:
        decision = "Conditional Approval"
        decision_detail = "Moderate risk. Consider with additional conditions or reduced limit."
    else:
        decision = "Reject"
        decision_detail = "High risk profile. Application does not meet approval threshold."

    return {
        "ai_risk_score": round(final_score, 1),
        "decision": decision,
        "decision_detail": decision_detail,
        "weights": weights,
        "component_scores": {k: round(v, 1) for k, v in components.items()},
    }


# ===================================================================
# MASTER ORCHESTRATOR -- runs all 7 modules on one application
# ===================================================================
def run_advanced_risk_analysis(
    # Application basics
    industry_sector: str,
    requested_loan_amount: float,
    loan_tenure_years: int = 10,
    interest_rate: float = 10.0,
    # Applicant profile
    applicant_age: int = 35,
    employment_type: str = "salaried",
    credit_score: int = 720,
    # Financial profile
    monthly_income: float = 200000,
    existing_emi: float = 30000,
    monthly_expenses: float = 80000,
    savings_balance: float = 500000,
    emergency_funds: float = 200000,
    dependents: int = 2,
    insurance_coverage: float = 2000000,
    # Cash flow
    cash_flow_net: float = 120000,
    employment_stability: float = 0.8,
    # Behavioral
    gambling_transactions: int = 0,
    large_withdrawals: int = 1,
    luxury_spending_ratio: float = 0.15,
    irregular_income_months: int = 1,
    total_months_analyzed: int = 12,
) -> dict:
    """Run the full advanced risk analysis pipeline and return all module results."""

    # 1. Future Repayment Prediction
    repayment = predict_future_repayment(
        monthly_income=monthly_income,
        existing_emi=existing_emi,
        cash_flow_net=cash_flow_net,
        credit_score=credit_score,
        employment_stability=employment_stability,
        industry_sector=industry_sector,
    )

    # 2. Career Longevity
    career = analyze_career_longevity(
        applicant_age=applicant_age,
        employment_type=employment_type,
        industry_sector=industry_sector,
        loan_tenure_years=loan_tenure_years,
    )

    # 3. Industry Risk
    industry = analyze_industry_risk(industry_sector)

    # 4. What-If Simulation
    monthly_emi = existing_emi + (requested_loan_amount * (interest_rate / 100 / 12))
    scenarios = simulate_scenarios(
        monthly_income=monthly_income,
        monthly_emi=monthly_emi,
        monthly_expenses=monthly_expenses,
        savings_balance=savings_balance,
        interest_rate=interest_rate,
        loan_amount=requested_loan_amount,
    )

    # 5. Financial Resilience
    resilience = calculate_resilience_score(
        savings_balance=savings_balance,
        emergency_funds=emergency_funds,
        monthly_expenses=monthly_expenses,
        dependents=dependents,
        insurance_coverage=insurance_coverage,
    )

    # 6. Behavioral Banking
    behavioral = analyze_banking_behavior(
        gambling_transactions=gambling_transactions,
        large_withdrawals=large_withdrawals,
        luxury_spending_ratio=luxury_spending_ratio,
        irregular_income_months=irregular_income_months,
        total_months_analyzed=total_months_analyzed,
    )

    # 7. Final AI Decision
    debt_ratio = (existing_emi / max(monthly_income, 1)) * 100
    final_decision = compute_final_decision(
        credit_score=credit_score,
        income_stability=employment_stability * 100,
        industry_risk_score=industry["stability_score"],
        debt_ratio=debt_ratio,
        repayment_probability=repayment["repayment_probability"],
        resilience_score=resilience["resilience_score"],
        behavioral_score=behavioral["financial_discipline_score"],
    )

    return {
        "repayment_prediction": repayment,
        "career_longevity": career,
        "industry_risk": industry,
        "scenario_simulation": scenarios,
        "financial_resilience": resilience,
        "behavioral_analysis": behavioral,
        "final_decision": final_decision,
    }

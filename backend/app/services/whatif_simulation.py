"""
What-If Risk Simulation Service
Simulates financial stress scenarios to evaluate borrower repayment capacity.
Scenarios: Job Loss, Medical Emergency, Business Revenue Drop, Interest Rate Increase.
"""
from typing import Optional
import math


SCENARIOS = [
    {
        "id": "job_loss",
        "name": "Job Loss",
        "description": "Complete loss of primary income source for 6 months",
        "icon": "briefcase_off",
        "income_impact": -1.0,      # 100% income drop
        "expense_impact": 0.0,       # expenses stay same
        "savings_impact": -0.3,      # 30% savings consumed
    },
    {
        "id": "medical_emergency",
        "name": "Medical Emergency",
        "description": "Unexpected medical expenses of ₹3–5L depleting savings",
        "icon": "heart_pulse",
        "income_impact": -0.3,       # 30% income drop (reduced working capacity)
        "expense_impact": 0.40,      # 40% increase in monthly expenses
        "savings_impact": -0.5,      # 50% savings wiped out
    },
    {
        "id": "revenue_drop",
        "name": "Business Revenue Drop",
        "description": "30% decline in business revenue due to market conditions",
        "icon": "trending_down",
        "income_impact": -0.30,      # 30% income drop
        "expense_impact": 0.0,
        "savings_impact": -0.15,
    },
    {
        "id": "rate_hike",
        "name": "Interest Rate Hike",
        "description": "3% increase in interest rate raising EMI burden",
        "icon": "percent",
        "income_impact": 0.0,
        "expense_impact": 0.0,
        "savings_impact": 0.0,
        "rate_hike_pct": 3.0,        # extra percentage points
    },
]


def _calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> float:
    """Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)"""
    if annual_rate <= 0:
        return principal / tenure_months if tenure_months > 0 else 0
    r = annual_rate / 100 / 12
    n = tenure_months
    emi = principal * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)
    return round(emi, 2)


def _get_risk_level(capacity_pct: float) -> dict:
    """Map EMI capacity percentage to risk level."""
    if capacity_pct >= 60:
        return {"level": "Safe", "color": "green", "badge": "bg-green-100 text-green-800",
                "bar_color": "#22c55e", "description": "Borrower can comfortably service EMI"}
    elif capacity_pct >= 30:
        return {"level": "Medium Risk", "color": "yellow", "badge": "bg-yellow-100 text-yellow-800",
                "bar_color": "#eab308", "description": "EMI repayment may be stressed"}
    else:
        return {"level": "High Risk", "color": "red", "badge": "bg-red-100 text-red-800",
                "bar_color": "#ef4444", "description": "High probability of default under this scenario"}


def run_whatif_simulation(
    monthly_income: float,
    monthly_expenses: float,
    existing_emi: float,
    savings_balance: float,
    loan_amount: float,
    interest_rate: float,
    loan_tenure_years: int,
) -> dict:
    """
    Run all 4 stress scenarios and return simulation results.
    Returns scenario table data + aggregate risk insight.
    """
    tenure_months = loan_tenure_years * 12
    base_emi = _calculate_emi(loan_amount, interest_rate, tenure_months)

    # Baseline: net disposable income after expenses + existing EMI
    base_disposable = monthly_income - monthly_expenses - existing_emi
    base_capacity_pct = round((base_disposable / base_emi) * 100, 1) if base_emi > 0 else 0

    base_risk = _get_risk_level(base_capacity_pct)

    scenario_results = []

    for sc in SCENARIOS:
        # Apply income impact
        stressed_income = monthly_income * (1 + sc["income_impact"])

        # Apply expense impact
        stressed_expenses = monthly_expenses * (1 + sc.get("expense_impact", 0))

        # Apply savings impact (informational)
        stressed_savings = max(0, savings_balance * (1 + sc.get("savings_impact", 0)))

        # Apply rate hike if applicable
        stressed_rate = interest_rate + sc.get("rate_hike_pct", 0)
        stressed_emi = _calculate_emi(loan_amount, stressed_rate, tenure_months)

        # Stressed disposable
        stressed_disposable = stressed_income - stressed_expenses - existing_emi

        # EMI capacity % = what fraction of stressed_emi can the disposable cover
        if stressed_emi > 0:
            capacity_pct = round((stressed_disposable / stressed_emi) * 100, 1)
        else:
            capacity_pct = 100.0

        capacity_pct = max(-100, min(200, capacity_pct))
        risk_info = _get_risk_level(capacity_pct)

        scenario_results.append({
            "scenario_id": sc["id"],
            "scenario_name": sc["name"],
            "description": sc["description"],
            "stressed_monthly_income": round(stressed_income, 2),
            "stressed_monthly_expenses": round(stressed_expenses, 2),
            "stressed_savings": round(stressed_savings, 2),
            "stressed_emi": round(stressed_emi, 2),
            "stressed_disposable": round(stressed_disposable, 2),
            "emi_capacity_pct": capacity_pct,
            "risk_level": risk_info["level"],
            "risk_color": risk_info["color"],
            "risk_badge": risk_info["badge"],
            "bar_color": risk_info["bar_color"],
            "risk_description": risk_info["description"],
        })

    # Aggregate insight
    avg_capacity = round(sum(s["emi_capacity_pct"] for s in scenario_results) / len(scenario_results), 1)
    high_risk_count = sum(1 for s in scenario_results if s["risk_level"] == "High Risk")
    medium_risk_count = sum(1 for s in scenario_results if s["risk_level"] == "Medium Risk")

    if high_risk_count >= 2:
        overall_vulnerability = "High Vulnerability"
        overall_color = "red"
        overall_recommendation = (
            "Multiple critical stress scenarios show high default probability. "
            "Recommend additional collateral or loan restructuring."
        )
    elif high_risk_count == 1 or medium_risk_count >= 2:
        overall_vulnerability = "Moderate Vulnerability"
        overall_color = "yellow"
        overall_recommendation = (
            "Some stress scenarios present repayment risk. "
            "Consider conditional approval with insurance requirement."
        )
    else:
        overall_vulnerability = "Low Vulnerability"
        overall_color = "green"
        overall_recommendation = (
            "Borrower demonstrates strong financial resilience across all stress scenarios. "
            "Proceed with standard approval process."
        )

    return {
        "base_analysis": {
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "existing_emi": existing_emi,
            "savings_balance": savings_balance,
            "loan_amount": loan_amount,
            "interest_rate": interest_rate,
            "loan_tenure_years": loan_tenure_years,
            "base_emi": round(base_emi, 2),
            "base_disposable": round(base_disposable, 2),
            "base_capacity_pct": base_capacity_pct,
            "base_risk_level": base_risk["level"],
            "base_risk_color": base_risk["color"],
        },
        "scenarios": scenario_results,
        "aggregate": {
            "avg_emi_capacity_pct": avg_capacity,
            "high_risk_scenarios": high_risk_count,
            "medium_risk_scenarios": medium_risk_count,
            "safe_scenarios": len(scenario_results) - high_risk_count - medium_risk_count,
            "overall_vulnerability": overall_vulnerability,
            "overall_color": overall_color,
            "overall_recommendation": overall_recommendation,
        },
    }

"""
Digital Twin Borrower Simulation Service
Generates a digital financial twin and simulates future financial stability over 5 years.
"""
from typing import Dict, List, Any
import math
import random

def generate_digital_twin(
    applicant_name: str,
    monthly_income: float,
    existing_emi: float,
    monthly_expenses: float,
    savings_balance: float,
    loan_amount: float,
    interest_rate: float,
    loan_tenure_years: int,
) -> Dict[str, Any]:
    """Generates a digital twin and simulates financial stability."""
    
    # Calculate base EMI
    r = interest_rate / 100 / 12
    n = loan_tenure_years * 12
    if r > 0:
        base_emi = loan_amount * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)
    else:
        base_emi = loan_amount / n if n > 0 else 0

    base_disposable = monthly_income - monthly_expenses - existing_emi - base_emi
    
    # Financial Stability Score (0-100)
    savings_ratio = savings_balance / (monthly_expenses * 6) if monthly_expenses > 0 else 1.0
    dti_ratio = (existing_emi + base_emi) / monthly_income if monthly_income > 0 else 1.0
    
    score_base = 100
    if dti_ratio > 0.5:
        score_base -= (dti_ratio - 0.5) * 100
    if savings_ratio < 1.0:
        score_base -= (1.0 - savings_ratio) * 20
        
    stability_score = max(0, min(100, int(score_base)))
    
    # Generate 5-year predictions for scenarios
    years = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
    
    def generate_trajectory(start_score, impact, recovery_rate):
        trajectory = []
        current = start_score
        for _ in range(5):
            current = current * (1 + impact)
            trajectory.append(max(0, min(100, int(current))))
            impact += recovery_rate # gradual recovery or worsening
        return trajectory

    scenarios = [
        {
            "id": "base",
            "name": "Base Scenario",
            "data": generate_trajectory(stability_score, 0.02, -0.005)
        },
        {
            "id": "job_loss",
            "name": "Job Loss (6 Months)",
            "data": generate_trajectory(stability_score, -0.4, 0.1)
        },
        {
            "id": "revenue_drop",
            "name": "Revenue Drop (-30%)",
            "data": generate_trajectory(stability_score, -0.2, 0.05)
        },
        {
            "id": "economic_slowdown",
            "name": "Economic Slowdown",
            "data": generate_trajectory(stability_score, -0.15, 0.02)
        },
        {
            "id": "rate_hike",
            "name": "Interest Rate Changes (+3%)",
            "data": generate_trajectory(stability_score, -0.1, 0.01)
        }
    ]
    
    twin_profile = {
        "twin_id": f"DT-{random.randint(1000, 9999)}",
        "name": applicant_name,
        "base_metrics": {
            "monthly_income": monthly_income,
            "total_obligations": existing_emi + base_emi,
            "disposable_income": base_disposable,
            "savings_buffer_months": round(savings_balance / monthly_expenses, 1) if monthly_expenses else 0
        }
    }

    return {
        "digital_twin": twin_profile,
        "financial_stability_score": stability_score,
        "stability_category": "Excellent" if stability_score >= 80 else "Good" if stability_score >= 60 else "Fair" if stability_score >= 40 else "High Risk",
        "prediction_graph": {
            "labels": years,
            "datasets": scenarios
        }
    }

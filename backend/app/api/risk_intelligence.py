"""
Advanced Risk Intelligence API
Exposes endpoints for all 7 AI risk analysis modules.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User, UserRole
from app.models.application import LoanApplication
from app.services.advanced_risk import run_advanced_risk_analysis
from app.services.whatif_simulation import run_whatif_simulation

router = APIRouter(prefix="/api/risk-intelligence", tags=["Risk Intelligence"])


class AdvancedRiskInput(BaseModel):
    applicant_age: int = Field(default=35, ge=18, le=80)
    employment_type: str = "salaried"
    credit_score: int = Field(default=720, ge=300, le=900)
    monthly_income: float = Field(default=200000, ge=0)
    existing_emi: float = Field(default=30000, ge=0)
    monthly_expenses: float = Field(default=80000, ge=0)
    savings_balance: float = Field(default=500000, ge=0)
    emergency_funds: float = Field(default=200000, ge=0)
    dependents: int = Field(default=2, ge=0)
    insurance_coverage: float = Field(default=2000000, ge=0)
    cash_flow_net: float = Field(default=120000)
    employment_stability: float = Field(default=0.8, ge=0, le=1)
    loan_tenure_years: int = Field(default=10, ge=1, le=30)
    interest_rate: float = Field(default=10.0, ge=0)
    gambling_transactions: int = Field(default=0, ge=0)
    large_withdrawals: int = Field(default=1, ge=0)
    luxury_spending_ratio: float = Field(default=0.15, ge=0, le=1)
    irregular_income_months: int = Field(default=1, ge=0)
    total_months_analyzed: int = Field(default=12, ge=1)


@router.post("/{application_id}/analyze")
async def run_risk_intelligence(
    application_id: int,
    params: AdvancedRiskInput,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.BANK_OFFICER)),
):
    """Run all 7 advanced risk analysis modules for a loan application."""
    result = await db.execute(
        select(LoanApplication).where(LoanApplication.id == application_id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    analysis = run_advanced_risk_analysis(
        industry_sector=app.industry_sector,
        requested_loan_amount=app.requested_loan_amount,
        loan_tenure_years=params.loan_tenure_years,
        interest_rate=params.interest_rate,
        applicant_age=params.applicant_age,
        employment_type=params.employment_type,
        credit_score=params.credit_score,
        monthly_income=params.monthly_income,
        existing_emi=params.existing_emi,
        monthly_expenses=params.monthly_expenses,
        savings_balance=params.savings_balance,
        emergency_funds=params.emergency_funds,
        dependents=params.dependents,
        insurance_coverage=params.insurance_coverage,
        cash_flow_net=params.cash_flow_net,
        employment_stability=params.employment_stability,
        gambling_transactions=params.gambling_transactions,
        large_withdrawals=params.large_withdrawals,
        luxury_spending_ratio=params.luxury_spending_ratio,
        irregular_income_months=params.irregular_income_months,
        total_months_analyzed=params.total_months_analyzed,
    )

    # Persist to database
    app.advanced_risk_analysis = analysis
    await db.flush()
    await db.refresh(app)

    return {"application_id": app.id, **analysis}


@router.get("/dashboard/summary")
async def risk_intelligence_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.BANK_OFFICER)),
):
    """Aggregate risk intelligence data across all analyzed applications."""
    result = await db.execute(
        select(LoanApplication).where(LoanApplication.advanced_risk_analysis.isnot(None))
    )
    apps = result.scalars().all()

    if not apps:
        return {
            "total_analyzed": 0,
            "avg_risk_score": 0,
            "total_loan_exposure": 0,
            "risk_distribution": {"Approve": 0, "Conditional Approval": 0, "Reject": 0},
            "industry_distribution": {},
            "score_histogram": [],
            "applications": [],
        }

    scores = []
    risk_dist = {"Approve": 0, "Conditional Approval": 0, "Reject": 0}
    industry_dist = {}
    total_exposure = 0
    app_summaries = []

    for a in apps:
        data = a.advanced_risk_analysis
        fd = data.get("final_decision", {})
        ai_score = fd.get("ai_risk_score", 0)
        decision = fd.get("decision", "")
        scores.append(ai_score)
        total_exposure += a.requested_loan_amount

        if decision in risk_dist:
            risk_dist[decision] += 1

        sect = a.industry_sector
        industry_dist[sect] = industry_dist.get(sect, 0) + 1

        app_summaries.append({
            "id": a.id,
            "company_name": a.company_name,
            "industry_sector": sect,
            "requested_loan_amount": a.requested_loan_amount,
            "ai_risk_score": ai_score,
            "decision": decision,
            "repayment_probability": data.get("repayment_prediction", {}).get("repayment_probability", 0),
            "resilience_score": data.get("financial_resilience", {}).get("resilience_score", 0),
        })

    histogram = [0] * 10
    for s in scores:
        bucket = min(int(s // 10), 9)
        histogram[bucket] += 1
    hist_labels = [f"{i*10}-{i*10+9}" for i in range(10)]
    score_histogram = [{"range": hist_labels[i], "count": histogram[i]} for i in range(10)]

    return {
        "total_analyzed": len(apps),
        "avg_risk_score": round(sum(scores) / len(scores), 1) if scores else 0,
        "total_loan_exposure": total_exposure,
        "risk_distribution": risk_dist,
        "industry_distribution": industry_dist,
        "score_histogram": score_histogram,
        "applications": sorted(app_summaries, key=lambda x: x["ai_risk_score"], reverse=True),
    }


@router.get("/{application_id}")
async def get_risk_intelligence(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.BANK_OFFICER)),
):
    """Retrieve stored advanced risk analysis for an application."""
    result = await db.execute(
        select(LoanApplication).where(LoanApplication.id == application_id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if not app.advanced_risk_analysis:
        raise HTTPException(status_code=404, detail="Advanced risk analysis not yet performed")

    return {"application_id": app.id, **app.advanced_risk_analysis}


class WhatIfInput(BaseModel):
    monthly_income: float = Field(default=200000, ge=0, description="Borrower monthly income in INR")
    monthly_expenses: float = Field(default=80000, ge=0, description="Monthly living expenses in INR")
    existing_emi: float = Field(default=30000, ge=0, description="Existing EMI obligations in INR")
    savings_balance: float = Field(default=500000, ge=0, description="Current savings balance in INR")
    interest_rate: float = Field(default=10.0, ge=0, le=40, description="Annual interest rate %")
    loan_tenure_years: int = Field(default=10, ge=1, le=30, description="Loan tenure in years")


@router.post("/{application_id}/simulate")
async def whatif_simulation(
    application_id: int,
    params: WhatIfInput,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.BANK_OFFICER)),
):
    """Run What-If stress scenario simulation for a loan application."""
    result = await db.execute(
        select(LoanApplication).where(LoanApplication.id == application_id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    simulation = run_whatif_simulation(
        monthly_income=params.monthly_income,
        monthly_expenses=params.monthly_expenses,
        existing_emi=params.existing_emi,
        savings_balance=params.savings_balance,
        loan_amount=app.requested_loan_amount,
        interest_rate=params.interest_rate,
        loan_tenure_years=params.loan_tenure_years,
    )

    return {"application_id": app.id, "loan_amount": app.requested_loan_amount, **simulation}

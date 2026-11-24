from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Expense
from ..schemas import ExpenseCreate, ExpenseOut

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.get("", response_model=List[ExpenseOut])
def list_expenses(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Expense).order_by(Expense.expense_date.desc())
    if category:
        query = query.filter(Expense.category == category)
    return query.all()

@router.post("", response_model=ExpenseOut)
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    exp_date = expense_in.expense_date or datetime.now(timezone.utc)
    expense = Expense(
        category=expense_in.category,
        description=expense_in.description,
        amount=expense_in.amount,
        currency=expense_in.currency,
        payment_method=expense_in.payment_method,
        expense_date=exp_date,
        created_by="Admin"
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

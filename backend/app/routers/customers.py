from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Customer
from ..schemas import CustomerCreate, CustomerOut

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=List[CustomerOut])
def list_customers(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Customer)
    if search:
        s_filter = f"%{search}%"
        query = query.filter(
            (Customer.name.ilike(s_filter)) |
            (Customer.phone.ilike(s_filter)) |
            (Customer.nif.ilike(s_filter))
        )
    return query.order_by(Customer.name.asc()).all()

@router.post("", response_model=CustomerOut)
def create_customer(customer_in: CustomerCreate, db: Session = Depends(get_db)):
    customer = Customer(
        name=customer_in.name,
        phone=customer_in.phone,
        email=customer_in.email,
        address=customer_in.address,
        nif=customer_in.nif,
        credit_limit=customer_in.credit_limit,
        opening_balance=customer_in.opening_balance,
        current_balance=customer_in.opening_balance
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

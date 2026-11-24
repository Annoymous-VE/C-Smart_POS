from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sale, Customer, Branch
from ..schemas import SaleCreate, SaleOut
from ..services import SaleService

router = APIRouter(prefix="/sales", tags=["Sales"])

def format_sale_out(sale: Sale) -> SaleOut:
    s_out = SaleOut.model_validate(sale)
    s_out.customer_name = sale.customer.name if sale.customer else "Client Comptant"
    s_out.branch_name = sale.branch.name if sale.branch else "Kinshasa Gombe"
    return s_out

@router.get("", response_model=List[SaleOut])
def list_sales(
    branch_id: Optional[int] = None,
    customer_id: Optional[int] = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Sale).order_by(Sale.created_at.desc())
    if branch_id:
        query = query.filter(Sale.branch_id == branch_id)
    if customer_id:
        query = query.filter(Sale.customer_id == customer_id)
    
    sales = query.limit(limit).all()
    return [format_sale_out(s) for s in sales]

@router.post("", response_model=SaleOut)
def create_sale(sale_in: SaleCreate, db: Session = Depends(get_db)):
    created = SaleService.create_sale(db, sale_in)
    return format_sale_out(created)

@router.get("/{sale_id}", response_model=SaleOut)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return format_sale_out(sale)

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Purchase, Supplier
from ..schemas import PurchaseCreate, PurchaseOut
from ..services import PurchaseService

router = APIRouter(prefix="/purchases", tags=["Purchases"])

def format_purchase_out(p: Purchase) -> PurchaseOut:
    p_out = PurchaseOut.model_validate(p)
    p_out.supplier_name = p.supplier.name if p.supplier else "Fournisseur Inconnu"
    return p_out

@router.get("", response_model=List[PurchaseOut])
def list_purchases(
    supplier_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Purchase).order_by(Purchase.created_at.desc())
    if supplier_id:
        query = query.filter(Purchase.supplier_id == supplier_id)
    if status:
        query = query.filter(Purchase.status == status)
    
    purchases = query.all()
    return [format_purchase_out(p) for p in purchases]

@router.post("", response_model=PurchaseOut)
def create_purchase(purchase_in: PurchaseCreate, db: Session = Depends(get_db)):
    created = PurchaseService.create_purchase(db, purchase_in)
    return format_purchase_out(created)

@router.get("/{purchase_id}", response_model=PurchaseOut)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return format_purchase_out(purchase)

@router.post("/{purchase_id}/receive", response_model=PurchaseOut)
def receive_purchase_goods(purchase_id: int, db: Session = Depends(get_db)):
    received = PurchaseService.receive_purchase(db, purchase_id)
    return format_purchase_out(received)

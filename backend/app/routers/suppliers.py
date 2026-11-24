from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Supplier
from ..schemas import SupplierCreate, SupplierOut

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("", response_model=List[SupplierOut])
def list_suppliers(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Supplier)
    if search:
        s_filter = f"%{search}%"
        query = query.filter(
            (Supplier.name.ilike(s_filter)) |
            (Supplier.phone.ilike(s_filter)) |
            (Supplier.nif.ilike(s_filter)) |
            (Supplier.rccm.ilike(s_filter))
        )
    return query.order_by(Supplier.name.asc()).all()

@router.post("", response_model=SupplierOut)
def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    supplier = Supplier(
        name=supplier_in.name,
        phone=supplier_in.phone,
        email=supplier_in.email,
        address=supplier_in.address,
        nif=supplier_in.nif,
        rccm=supplier_in.rccm,
        opening_balance=supplier_in.opening_balance,
        current_balance=supplier_in.opening_balance
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.get("/{supplier_id}", response_model=SupplierOut)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

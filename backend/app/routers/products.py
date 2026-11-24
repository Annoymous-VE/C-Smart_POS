from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Product
from ..schemas import ProductCreate, ProductUpdate, ProductOut, StockAdjustment
from ..services import InventoryService

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
def list_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    low_stock_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.active == True)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_filter)) |
            (Product.sku.ilike(search_filter)) |
            (Product.barcode.ilike(search_filter))
        )
    if category:
        query = query.filter(Product.category == category)
    if low_stock_only:
        query = query.filter(Product.stock_quantity <= Product.minimum_stock)

    return query.order_by(Product.name.asc()).all()

@router.post("", response_model=ProductOut)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(Product).filter(Product.sku == product_in.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Product with SKU '{product_in.sku}' already exists.")
    
    product = Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product

@router.post("/{product_id}/adjust-stock", response_model=ProductOut)
def adjust_product_stock(
    product_id: int,
    adjustment: StockAdjustment,
    db: Session = Depends(get_db)
):
    return InventoryService.adjust_stock(db, product_id, adjustment)

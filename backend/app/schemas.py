from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    sku: str
    barcode: Optional[str] = None
    category: str
    unit: str = "Piece"
    cost_price: float = Field(ge=0.0)
    selling_price: float = Field(ge=0.0)
    minimum_stock: int = Field(ge=0, default=5)
    tax_category: str = "STANDARD_16"
    active: bool = True

class ProductCreate(ProductBase):
    stock_quantity: int = Field(ge=0, default=0)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    minimum_stock: Optional[int] = None
    tax_category: Optional[str] = None
    active: Optional[bool] = None

class StockAdjustment(BaseModel):
    quantity_change: int
    reason: str = "Manual stock correction"

class ProductOut(ProductBase):
    id: int
    stock_quantity: int

    class Config:
        from_attributes = True

# --- Customer Schemas ---
class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    nif: Optional[str] = None
    credit_limit: float = 0.0

class CustomerCreate(CustomerBase):
    opening_balance: float = 0.0

class CustomerOut(CustomerBase):
    id: int
    opening_balance: float
    current_balance: float

    class Config:
        from_attributes = True

# --- Supplier Schemas ---
class SupplierBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    nif: Optional[str] = None
    rccm: Optional[str] = None

class SupplierCreate(SupplierBase):
    opening_balance: float = 0.0

class SupplierOut(SupplierBase):
    id: int
    opening_balance: float
    current_balance: float

    class Config:
        from_attributes = True

# --- Sale Schemas ---
class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_price: Optional[float] = None
    discount_amount: float = Field(ge=0.0, default=0.0)

class SaleItemOut(BaseModel):
    id: int
    product_id: int
    product_name_snapshot: str
    quantity: int
    unit_price: float
    discount_amount: float
    tax_rate: float
    line_total: float

    class Config:
        from_attributes = True

class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    branch_id: int = 1
    currency: str = "USD"
    payment_method: str = "Cash"  # Cash, M-Pesa, Airtel Money, Orange Money, Card, Split
    discount_amount: float = Field(ge=0.0, default=0.0)
    items: List[SaleItemCreate]

class SaleOut(BaseModel):
    id: int
    invoice_number: str
    customer_id: Optional[int]
    customer_name: Optional[str] = None
    branch_id: int
    branch_name: Optional[str] = None
    subtotal: float
    discount_amount: float
    tax_amount: float
    total: float
    currency: str
    payment_method: str
    payment_status: str
    status: str
    created_at: datetime
    cashier_name: str
    items: List[SaleItemOut]

    class Config:
        from_attributes = True

# --- Purchase Schemas ---
class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_cost: float = Field(ge=0.0)

class PurchaseItemOut(BaseModel):
    id: int
    product_id: int
    product_name_snapshot: str
    quantity: int
    unit_cost: float
    line_total: float

    class Config:
        from_attributes = True

class PurchaseCreate(BaseModel):
    supplier_id: int
    currency: str = "USD"
    items: List[PurchaseItemCreate]

class PurchaseOut(BaseModel):
    id: int
    reference: str
    supplier_id: int
    supplier_name: Optional[str] = None
    subtotal: float
    total: float
    currency: str
    status: str
    created_at: datetime
    received_at: Optional[datetime] = None
    items: List[PurchaseItemOut]

    class Config:
        from_attributes = True

# --- Expense Schemas ---
class ExpenseCreate(BaseModel):
    category: str
    description: str
    amount: float = Field(gt=0.0)
    currency: str = "USD"
    payment_method: str = "Cash"
    expense_date: Optional[datetime] = None

class ExpenseOut(BaseModel):
    id: int
    category: str
    description: str
    amount: float
    currency: str
    payment_method: str
    expense_date: datetime
    created_by: str

    class Config:
        from_attributes = True

# --- Dashboard & Reports Schemas ---
class DashboardSummary(BaseModel):
    today_sales: float
    today_transactions_count: int
    total_revenue: float
    gross_profit_estimate: float
    low_stock_count: int
    out_of_stock_count: int
    currency: str
    payment_methods_breakdown: dict
    recent_sales: List[SaleOut]
    low_stock_products: List[ProductOut]

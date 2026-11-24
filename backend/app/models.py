from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    city = Column(String(100), default="Kinshasa")
    address = Column(String(200), nullable=True)
    active = Column(Boolean, default=True)

    sales = relationship("Sale", back_populates="branch")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    role = Column(String(50), default="Cashier")  # Owner, Branch Manager, Cashier, Accountant
    active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    barcode = Column(String(50), index=True, nullable=True)
    category = Column(String(100), index=True, nullable=False)
    unit = Column(String(20), default="Piece")
    cost_price = Column(Float, nullable=False, default=0.0)
    selling_price = Column(Float, nullable=False, default=0.0)
    stock_quantity = Column(Integer, nullable=False, default=0)
    minimum_stock = Column(Integer, nullable=False, default=5)
    tax_category = Column(String(50), default="STANDARD_16")  # STANDARD_16, EXEMPT_0
    active = Column(Boolean, default=True)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(String(200), nullable=True)
    nif = Column(String(50), nullable=True)  # DRC Tax identification number (Numéro d'Impôt Fédéral)
    credit_limit = Column(Float, default=0.0)
    opening_balance = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)

    sales = relationship("Sale", back_populates="customer")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(String(200), nullable=True)
    nif = Column(String(50), nullable=True)
    rccm = Column(String(50), nullable=True)  # Registre du Commerce et du Crédit Mobilier
    opening_balance = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)

    purchases = relationship("Purchase", back_populates="supplier")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False, default=1)
    subtotal = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, nullable=False, default=0.0)
    tax_amount = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), default="USD")  # USD or CDF
    payment_method = Column(String(50), default="Cash")  # Cash, M-Pesa, Airtel Money, Orange Money, Card, Split
    payment_status = Column(String(30), default="PAID")  # PAID, PENDING, REFUNDED
    status = Column(String(30), default="COMPLETED")  # COMPLETED, CANCELLED
    created_at = Column(DateTime, default=utc_now)
    cashier_name = Column(String(100), default="Jeanne Kalala")

    customer = relationship("Customer", back_populates="sales")
    branch = relationship("Branch", back_populates="sales")
    items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name_snapshot = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, nullable=False, default=0.0)
    tax_rate = Column(Float, nullable=False, default=0.16)  # 16% DRC VAT
    line_total = Column(Float, nullable=False, default=0.0)

    sale = relationship("Sale", back_populates="items")
    product = relationship("Product")

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(50), unique=True, index=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    subtotal = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), default="USD")
    status = Column(String(30), default="RECEIVED")  # DRAFT, ORDERED, RECEIVED, CANCELLED
    created_at = Column(DateTime, default=utc_now)
    received_at = Column(DateTime, nullable=True)

    supplier = relationship("Supplier", back_populates="purchases")
    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")

class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name_snapshot = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_cost = Column(Float, nullable=False, default=0.0)
    line_total = Column(Float, nullable=False, default=0.0)

    purchase = relationship("Purchase", back_populates="items")
    product = relationship("Product")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)  # Rent, Fuel / Generator, Utilities, Transport, Salaries, Office
    description = Column(String(250), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    payment_method = Column(String(50), default="Cash")
    expense_date = Column(DateTime, default=utc_now)
    created_by = Column(String(100), default="Admin")

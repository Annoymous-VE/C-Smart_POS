from datetime import datetime, timezone
import random
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Product, Sale, SaleItem, Purchase, PurchaseItem, Customer, Supplier, Branch
from .schemas import SaleCreate, PurchaseCreate, StockAdjustment

def utc_now():
    return datetime.now(timezone.utc)

def generate_invoice_number(db: Session, prefix: str = "INV-KIN") -> str:
    today_str = datetime.now().strftime("%Y%m%d")
    count = db.query(Sale).count() + 1
    rand_suffix = random.randint(100, 999)
    return f"{prefix}-{today_str}-{count:04d}-{rand_suffix}"

def generate_purchase_reference(db: Session, prefix: str = "PO-KIN") -> str:
    today_str = datetime.now().strftime("%Y%m%d")
    count = db.query(Purchase).count() + 1
    return f"{prefix}-{today_str}-{count:04d}"

class InventoryService:
    @staticmethod
    def adjust_stock(db: Session, product_id: int, adjustment: StockAdjustment) -> Product:
        product = db.query(Product).filter(Product.id == product_id).with_for_update().first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        new_quantity = product.stock_quantity + adjustment.quantity_change
        if new_quantity < 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot reduce stock below 0. Current stock is {product.stock_quantity}."
            )
        
        product.stock_quantity = new_quantity
        db.commit()
        db.refresh(product)
        return product

class SaleService:
    @staticmethod
    def create_sale(db: Session, sale_in: SaleCreate) -> Sale:
        if not sale_in.items:
            raise HTTPException(status_code=400, detail="Cannot create sale with empty cart")

        subtotal = 0.0
        tax_total = 0.0
        sale_items_to_create = []

        # Validate products and stock
        for item_in in sale_in.items:
            product = db.query(Product).filter(Product.id == item_in.product_id).with_for_update().first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product with ID {item_in.product_id} not found")
            if not product.active:
                raise HTTPException(status_code=400, detail=f"Product '{product.name}' is inactive")
            if product.stock_quantity < item_in.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.name}'. Available: {product.stock_quantity}, requested: {item_in.quantity}"
                )

            unit_price = item_in.unit_price if item_in.unit_price is not None else product.selling_price
            line_subtotal = round(unit_price * item_in.quantity - item_in.discount_amount, 2)
            if line_subtotal < 0:
                line_subtotal = 0.0

            # DRC 16% standard VAT
            tax_rate = 0.16 if product.tax_category == "STANDARD_16" else 0.0
            line_tax = round(line_subtotal * tax_rate, 2)

            subtotal += line_subtotal
            tax_total += line_tax

            # Decrement stock atomically
            product.stock_quantity -= item_in.quantity

            sale_items_to_create.append({
                "product_id": product.id,
                "product_name_snapshot": product.name,
                "quantity": item_in.quantity,
                "unit_price": unit_price,
                "discount_amount": item_in.discount_amount,
                "tax_rate": tax_rate,
                "line_total": round(line_subtotal + line_tax, 2)
            })

        subtotal = round(subtotal, 2)
        total_discount = round(sale_in.discount_amount, 2)
        tax_total = round(tax_total, 2)
        final_total = max(0.0, round(subtotal + tax_total - total_discount, 2))

        invoice_num = generate_invoice_number(db)

        # Create Sale
        sale = Sale(
            invoice_number=invoice_num,
            customer_id=sale_in.customer_id,
            branch_id=sale_in.branch_id,
            subtotal=subtotal,
            discount_amount=total_discount,
            tax_amount=tax_total,
            total=final_total,
            currency=sale_in.currency,
            payment_method=sale_in.payment_method,
            payment_status="PAID",
            status="COMPLETED",
            created_at=utc_now(),
            cashier_name="Jeanne Kalala"
        )
        db.add(sale)
        db.flush()  # Get sale.id

        for item_data in sale_items_to_create:
            sale_item = SaleItem(
                sale_id=sale.id,
                **item_data
            )
            db.add(sale_item)

        # Update customer balance if applicable
        if sale_in.customer_id and sale_in.payment_method == "Credit":
            customer = db.query(Customer).filter(Customer.id == sale_in.customer_id).first()
            if customer:
                customer.current_balance = round(customer.current_balance + final_total, 2)

        db.commit()
        db.refresh(sale)
        return sale

class PurchaseService:
    @staticmethod
    def create_purchase(db: Session, purchase_in: PurchaseCreate) -> Purchase:
        if not purchase_in.items:
            raise HTTPException(status_code=400, detail="Purchase must contain at least one item")

        supplier = db.query(Supplier).filter(Supplier.id == purchase_in.supplier_id).first()
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

        subtotal = 0.0
        items_to_create = []
        for item_in in purchase_in.items:
            product = db.query(Product).filter(Product.id == item_in.product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product with ID {item_in.product_id} not found")

            line_total = round(item_in.unit_cost * item_in.quantity, 2)
            subtotal += line_total
            items_to_create.append({
                "product_id": product.id,
                "product_name_snapshot": product.name,
                "quantity": item_in.quantity,
                "unit_cost": item_in.unit_cost,
                "line_total": line_total
            })

        ref = generate_purchase_reference(db)
        purchase = Purchase(
            reference=ref,
            supplier_id=supplier.id,
            subtotal=round(subtotal, 2),
            total=round(subtotal, 2),
            currency=purchase_in.currency,
            status="ORDERED",
            created_at=utc_now()
        )
        db.add(purchase)
        db.flush()

        for item_data in items_to_create:
            purchase_item = PurchaseItem(
                purchase_id=purchase.id,
                **item_data
            )
            db.add(purchase_item)

        db.commit()
        db.refresh(purchase)
        return purchase

    @staticmethod
    def receive_purchase(db: Session, purchase_id: int) -> Purchase:
        purchase = db.query(Purchase).filter(Purchase.id == purchase_id).with_for_update().first()
        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")
        if purchase.status == "RECEIVED":
            raise HTTPException(status_code=400, detail="Purchase order has already been received. Stock was already updated.")
        if purchase.status == "CANCELLED":
            raise HTTPException(status_code=400, detail="Cannot receive a cancelled purchase order.")

        # Increment stock atomically
        for item in purchase.items:
            product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
            if product:
                product.stock_quantity += item.quantity
                # Update cost price to latest
                product.cost_price = item.unit_cost

        purchase.status = "RECEIVED"
        purchase.received_at = utc_now()
        db.commit()
        db.refresh(purchase)
        return purchase

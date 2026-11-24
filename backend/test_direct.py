import sys
from app.database import SessionLocal
from app.models import Product, Purchase, Sale
from app.schemas import SaleCreate, SaleItemCreate, PurchaseCreate, PurchaseItemCreate
from app.services import SaleService, PurchaseService, InventoryService
from app.routers.dashboard import get_dashboard_summary
from app.routers.fiscal import get_fiscal_invoice_preview

def run_tests():
    db = SessionLocal()
    print("1. Testing Dashboard summary...")
    summary = get_dashboard_summary(db=db)
    assert summary.total_revenue > 0
    assert summary.low_stock_count >= 1
    assert "Cash" in summary.payment_methods_breakdown or len(summary.payment_methods_breakdown) > 0
    print(f"✓ Dashboard OK: Revenue = ${summary.total_revenue:.2f}, Low-stock items = {summary.low_stock_count}")

    print("\n2. Testing Sale checkout with atomic stock decrement...")
    prod = db.query(Product).filter(Product.stock_quantity >= 5).first()
    assert prod is not None
    prod_id = prod.id
    initial_stock = prod.stock_quantity

    sale_in = SaleCreate(
        customer_id=1,
        branch_id=1,
        currency="USD",
        payment_method="Airtel Money",
        discount_amount=0.0,
        items=[SaleItemCreate(product_id=prod_id, quantity=3, discount_amount=0.0)]
    )
    sale = SaleService.create_sale(db, sale_in)
    assert sale.id is not None
    assert sale.invoice_number.startswith("INV-KIN")
    
    # Reload product from db
    db.expire_all()
    prod_after = db.query(Product).filter(Product.id == prod_id).first()
    assert prod_after.stock_quantity == initial_stock - 3
    print(f"✓ Sale created: {sale.invoice_number}, Stock decremented atomically: {initial_stock} -> {prod_after.stock_quantity}")

    print("\n3. Testing Purchase receiving with atomic stock increment...")
    # Find an ordered purchase or create one
    po = db.query(Purchase).filter(Purchase.status == "ORDERED").first()
    if not po:
        po_in = PurchaseCreate(
            supplier_id=1,
            currency="USD",
            items=[PurchaseItemCreate(product_id=prod_id, quantity=10, unit_cost=prod.cost_price)]
        )
        po = PurchaseService.create_purchase(db, po_in)
    
    po_id = po.id
    target_item = po.items[0]
    target_prod_id = target_item.product_id
    qty_to_receive = target_item.quantity
    
    prod_before_po = db.query(Product).filter(Product.id == target_prod_id).first()
    stock_before_po = prod_before_po.stock_quantity

    received_po = PurchaseService.receive_purchase(db, po_id)
    assert received_po.status == "RECEIVED"
    
    db.expire_all()
    prod_after_po = db.query(Product).filter(Product.id == target_prod_id).first()
    assert prod_after_po.stock_quantity == stock_before_po + qty_to_receive
    print(f"✓ Purchase received ({received_po.reference}): Stock incremented: {stock_before_po} -> {prod_after_po.stock_quantity}")

    print("\n4. Testing duplicate receiving prevention...")
    try:
        PurchaseService.receive_purchase(db, po_id)
        assert False, "Should have raised HTTPException for duplicate receiving"
    except Exception as e:
        print(f"✓ Duplicate purchase receiving successfully rejected: {e.detail}")

    print("\n5. Testing Fiscal invoice representation...")
    fiscal_inv = get_fiscal_invoice_preview(sale.id, db=db)
    assert "DEMO ONLY" in fiscal_inv["legal_disclaimer"]
    assert "qr_code_data" in fiscal_inv
    assert fiscal_inv["vat_16_total"] > 0
    print(f"✓ Fiscal preview verified: Disclaimer present, Serial = {fiscal_inv['fiscal_device_serial']}")

    db.close()
    print("\n==========================================")
    print("ALL CORE BACKEND BUSINESS TESTS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    run_tests()

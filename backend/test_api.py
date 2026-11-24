from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Product, Purchase

client = TestClient(app, base_url="http://127.0.0.1")

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("✓ Health endpoint OK")

def test_dashboard_summary():
    res = client.get("/api/v1/dashboard/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_revenue" in data
    assert "payment_methods_breakdown" in data
    print("✓ Dashboard summary OK: Revenue = $" + str(data["total_revenue"]))

def test_sale_checkout_decrements_stock():
    db = SessionLocal()
    prod = db.query(Product).filter(Product.stock_quantity > 5).first()
    assert prod is not None
    initial_stock = prod.stock_quantity
    prod_id = prod.id
    db.close()

    sale_payload = {
        "customer_id": 1,
        "branch_id": 1,
        "currency": "USD",
        "payment_method": "M-Pesa",
        "discount_amount": 0.0,
        "items": [
            {
                "product_id": prod_id,
                "quantity": 2,
                "discount_amount": 0.0
            }
        ]
    }
    res = client.post("/api/v1/sales", json=sale_payload)
    assert res.status_code == 200
    sale_data = res.json()
    assert sale_data["invoice_number"].startswith("INV-KIN")

    db2 = SessionLocal()
    prod_after = db2.query(Product).filter(Product.id == prod_id).first()
    assert prod_after.stock_quantity == initial_stock - 2
    db2.close()
    print(f"✓ Sale checkout atomically decremented stock: {initial_stock} -> {prod_after.stock_quantity}")

def test_purchase_receive_increments_stock_once():
    db = SessionLocal()
    po = db.query(Purchase).filter(Purchase.status == "ORDERED").first()
    assert po is not None
    po_id = po.id
    item = po.items[0]
    prod_id = item.product_id
    expected_inc = item.quantity
    initial_stock = item.product.stock_quantity
    db.close()

    res = client.post(f"/api/v1/purchases/{po_id}/receive")
    assert res.status_code == 200
    po_data = res.json()
    assert po_data["status"] == "RECEIVED"

    db2 = SessionLocal()
    prod_after = db2.query(Product).filter(Product.id == prod_id).first()
    assert prod_after.stock_quantity == initial_stock + expected_inc
    db2.close()
    print(f"✓ Purchase receiving atomically incremented stock: {initial_stock} -> {prod_after.stock_quantity}")

    res2 = client.post(f"/api/v1/purchases/{po_id}/receive")
    assert res2.status_code == 400
    print("✓ Duplicate purchase receiving successfully rejected with 400 Bad Request")

def test_fiscal_invoice():
    res = client.get("/api/v1/sales")
    assert res.status_code == 200
    sales = res.json()
    assert len(sales) > 0
    sale_id = sales[0]["id"]

    res_fiscal = client.get(f"/api/v1/fiscal/invoice/{sale_id}")
    assert res_fiscal.status_code == 200
    f_data = res_fiscal.json()
    assert "DEMO ONLY" in f_data["legal_disclaimer"]
    assert "DEF-MOCK" in f_data["fiscal_device_serial"]
    print("✓ Fiscal invoice preview endpoint OK with required disclaimer")

if __name__ == "__main__":
    test_health()
    test_dashboard_summary()
    test_sale_checkout_decrements_stock()
    test_purchase_receive_increments_stock_once()
    test_fiscal_invoice()
    print("\nALL BACKEND API AND TRANSACTION TESTS PASSED!")

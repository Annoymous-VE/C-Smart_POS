from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Sale, SaleItem, Product, Customer, Branch
from ..schemas import DashboardSummary, SaleOut, ProductOut

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    branch_id: Optional[int] = None,
    currency: str = "USD",
    db: Session = Depends(get_db)
):
    sales_query = db.query(Sale).filter(Sale.status == "COMPLETED")
    if branch_id:
        sales_query = sales_query.filter(Sale.branch_id == branch_id)

    sales = sales_query.all()
    today_date = datetime.now().date()

    today_sales_total = 0.0
    today_tx_count = 0
    total_revenue = 0.0
    payment_methods_breakdown = {}

    for s in sales:
        total_revenue += s.total
        s_date = s.created_at.date() if hasattr(s.created_at, "date") else today_date
        if s_date == today_date:
            today_sales_total += s.total
            today_tx_count += 1
        
        pm = s.payment_method or "Cash"
        payment_methods_breakdown[pm] = round(payment_methods_breakdown.get(pm, 0.0) + s.total, 2)

    # Estimate gross profit: sum of (item.unit_price - product.cost_price) * item.quantity
    sale_items = db.query(SaleItem).join(Sale).filter(Sale.status == "COMPLETED").all()
    gross_profit = 0.0
    for itm in sale_items:
        cost = itm.product.cost_price if itm.product else 0.0
        profit_per_unit = itm.unit_price - cost
        gross_profit += profit_per_unit * itm.quantity

    # Products stock alerts
    products = db.query(Product).filter(Product.active == True).all()
    low_stock = [p for p in products if 0 < p.stock_quantity <= p.minimum_stock]
    out_of_stock = [p for p in products if p.stock_quantity <= 0]

    # Recent sales (latest 6)
    recent_sales = sales_query.order_by(Sale.created_at.desc()).limit(6).all()
    recent_sales_out = []
    for s in recent_sales:
        s_out = SaleOut.model_validate(s)
        s_out.customer_name = s.customer.name if s.customer else "Client Comptant"
        s_out.branch_name = s.branch.name if s.branch else "Kinshasa Gombe"
        recent_sales_out.append(s_out)

    return DashboardSummary(
        today_sales=round(today_sales_total, 2),
        today_transactions_count=today_tx_count,
        total_revenue=round(total_revenue, 2),
        gross_profit_estimate=round(gross_profit, 2),
        low_stock_count=len(low_stock),
        out_of_stock_count=len(out_of_stock),
        currency=currency,
        payment_methods_breakdown=payment_methods_breakdown,
        recent_sales=recent_sales_out,
        low_stock_products=[ProductOut.model_validate(p) for p in (low_stock + out_of_stock)[:6]]
    )

import io
import csv
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sale, SaleItem, Expense, Product

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary")
def get_reports_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    branch_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    sales_q = db.query(Sale).filter(Sale.status == "COMPLETED")
    expenses_q = db.query(Expense)

    if branch_id:
        sales_q = sales_q.filter(Sale.branch_id == branch_id)

    sales = sales_q.all()
    expenses = expenses_q.all()

    total_sales = sum(s.total for s in sales)
    total_tax = sum(s.tax_amount for s in sales)
    total_expenses = sum(e.amount for e in expenses)

    # Top products by sales volume
    items = db.query(SaleItem).join(Sale).filter(Sale.status == "COMPLETED").all()
    product_stats = {}
    for itm in items:
        p_name = itm.product_name_snapshot
        if p_name not in product_stats:
            product_stats[p_name] = {"name": p_name, "quantity_sold": 0, "revenue": 0.0}
        product_stats[p_name]["quantity_sold"] += itm.quantity
        product_stats[p_name]["revenue"] = round(product_stats[p_name]["revenue"] + itm.line_total, 2)

    top_products = sorted(product_stats.values(), key=lambda x: x["revenue"], reverse=True)[:5]

    # Payment breakdown
    payments = {}
    for s in sales:
        pm = s.payment_method or "Cash"
        payments[pm] = round(payments.get(pm, 0.0) + s.total, 2)

    # Expenses breakdown by category
    exp_by_cat = {}
    for e in expenses:
        exp_by_cat[e.category] = round(exp_by_cat.get(e.category, 0.0) + e.amount, 2)

    return {
        "total_sales": round(total_sales, 2),
        "total_tax_collected": round(total_tax, 2),
        "total_expenses": round(total_expenses, 2),
        "net_estimated_margin": round(total_sales - total_expenses, 2),
        "total_transactions": len(sales),
        "top_selling_products": top_products,
        "payment_methods": payments,
        "expense_categories": exp_by_cat
    }

@router.get("/export/csv")
def export_sales_csv(db: Session = Depends(get_db)):
    sales = db.query(Sale).order_by(Sale.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Invoice Number", "Date", "Customer", "Payment Method", "Currency",
        "Subtotal", "Tax Amount (VAT 16%)", "Discount", "Total", "Status"
    ])

    for s in sales:
        cust_name = s.customer.name if s.customer else "Client Comptant"
        writer.writerow([
            s.invoice_number,
            s.created_at.strftime("%Y-%m-%d %H:%M:%S") if s.created_at else "",
            cust_name,
            s.payment_method,
            s.currency,
            f"{s.subtotal:.2f}",
            f"{s.tax_amount:.2f}",
            f"{s.discount_amount:.2f}",
            f"{s.total:.2f}",
            s.status
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=drc_smart_pos_sales.csv"}
    )

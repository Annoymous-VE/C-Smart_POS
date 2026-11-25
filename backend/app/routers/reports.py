import io
import csv
from datetime import datetime, timedelta
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
    items_q = db.query(SaleItem).join(Sale).filter(Sale.status == "COMPLETED")

    if branch_id:
        sales_q = sales_q.filter(Sale.branch_id == branch_id)
        items_q = items_q.filter(Sale.branch_id == branch_id)

    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            sales_q = sales_q.filter(Sale.created_at >= start_dt)
            expenses_q = expenses_q.filter(Expense.expense_date >= start_dt)
            items_q = items_q.filter(Sale.created_at >= start_dt)
        except ValueError:
            pass

    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
            sales_q = sales_q.filter(Sale.created_at < end_dt)
            expenses_q = expenses_q.filter(Expense.expense_date < end_dt)
            items_q = items_q.filter(Sale.created_at < end_dt)
        except ValueError:
            pass

    sales = sales_q.all()
    expenses = expenses_q.all()

    total_sales = sum(s.total for s in sales)
    total_tax = sum(s.tax_amount for s in sales)
    total_expenses = sum(e.amount for e in expenses)

    # Top products by sales volume
    items = items_q.all()
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

    # Determine trend granularity based on requested timeframe
    granularity = "day"
    if start_date and end_date and start_date == end_date:
        granularity = "hour"
    elif not start_date and not end_date:
        all_dates = [s.created_at for s in sales if s.created_at] + [e.expense_date for e in expenses if e.expense_date]
        if all_dates and (max(all_dates) - min(all_dates)).days > 35:
            granularity = "week"

    def bucket_key(dt: datetime) -> str:
        if granularity == "hour":
            return dt.strftime("%H:00")
        if granularity == "week":
            iso_year, iso_week, _ = dt.isocalendar()
            return f"{iso_year}-W{iso_week:02d}"
        return dt.strftime("%Y-%m-%d")

    # Trend grouping (revenue vs expenses)
    daily_map = {}
    for s in sales:
        if s.created_at:
            d_key = bucket_key(s.created_at)
            if d_key not in daily_map:
                daily_map[d_key] = {"date": d_key, "revenue": 0.0, "expenses": 0.0}
            daily_map[d_key]["revenue"] = round(daily_map[d_key]["revenue"] + s.total, 2)

    for e in expenses:
        if e.expense_date:
            d_key = bucket_key(e.expense_date)
            if d_key not in daily_map:
                daily_map[d_key] = {"date": d_key, "revenue": 0.0, "expenses": 0.0}
            daily_map[d_key]["expenses"] = round(daily_map[d_key]["expenses"] + e.amount, 2)

    daily_trend = []
    for d_key in sorted(daily_map.keys()):
        entry = daily_map[d_key]
        entry["net_margin"] = round(entry["revenue"] - entry["expenses"], 2)
        daily_trend.append(entry)

    return {
        "total_sales": round(total_sales, 2),
        "total_tax_collected": round(total_tax, 2),
        "total_expenses": round(total_expenses, 2),
        "net_estimated_margin": round(total_sales - total_expenses, 2),
        "total_transactions": len(sales),
        "top_selling_products": top_products,
        "payment_methods": payments,
        "expense_categories": exp_by_cat,
        "expenses_by_category": exp_by_cat,
        "daily_trend": daily_trend,
        "granularity": granularity
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

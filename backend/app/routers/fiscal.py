import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sale, SaleItem

router = APIRouter(prefix="/fiscal", tags=["Fiscal"])

@router.get("/invoice/{sale_id}")
def get_fiscal_invoice_preview(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # Generate a demo non-fiscal QR string & digital signature hash
    raw_sig = f"DRC-DEMO-{sale.invoice_number}-{sale.total}-{sale.created_at}"
    demo_digital_signature = hashlib.sha256(raw_sig.encode()).hexdigest()[:24].upper()
    demo_qr_payload = f"https://demo.drcsmartpos.cd/verify?ref={sale.invoice_number}&sig={demo_digital_signature}&demo=true"

    customer_info = {
        "name": sale.customer.name if sale.customer else "CLIENT COMPTANT / PARTICULIER",
        "nif": sale.customer.nif if (sale.customer and sale.customer.nif) else "NON-SPECIFIE",
        "phone": sale.customer.phone if (sale.customer and sale.customer.phone) else "N/A",
        "address": sale.customer.address if (sale.customer and sale.customer.address) else "Kinshasa, RDC"
    }

    seller_info = {
        "company_name": "DRC SMART POS DEMO SARL",
        "rccm": "CD/KIN/RCCM/21-B-04892",
        "nif": "A2109845X",
        "centre_fiscal": "CDI Gombe - Direction Générale des Impôts (DGI)",
        "address": "14 Boulevard du 30 Juin, Gombe, Kinshasa, RDC",
        "phone": "+243 81 000 0000 / +243 99 000 0000",
        "email": "contact@drcsmartpos.cd"
    }

    line_items = []
    for item in sale.items:
        vat_amount = round(item.unit_price * item.quantity * item.tax_rate, 2)
        line_items.append({
            "product_name": item.product_name_snapshot,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "tax_rate_percent": int(item.tax_rate * 100),
            "tax_amount": vat_amount,
            "discount": item.discount_amount,
            "total_line": item.line_total
        })

    return {
        "legal_disclaimer": "DEMO ONLY — NOT A DGI-VALIDATED / HOMOLOGATED INVOICE. Non-fiscal transaction reference generated for demonstration purposes.",
        "invoice_number": sale.invoice_number,
        "fiscal_device_serial": "DEF-MOCK-KIN-00984",
        "fiscal_counter": f"FC-{sale.id:06d}",
        "digital_signature": demo_digital_signature,
        "qr_code_data": demo_qr_payload,
        "date_time": sale.created_at.strftime("%d/%m/%Y %H:%M:%S") if sale.created_at else "",
        "seller": seller_info,
        "customer": customer_info,
        "currency": sale.currency,
        "payment_method": sale.payment_method,
        "subtotal": sale.subtotal,
        "vat_16_total": sale.tax_amount,
        "discount_total": sale.discount_amount,
        "total_ttc": sale.total,
        "line_items": line_items,
        "cashier": sale.cashier_name or "Jeanne Kalala"
    }

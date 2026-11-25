from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from .models import Branch, User, Product, Customer, Supplier, Sale, SaleItem, Purchase, PurchaseItem, Expense
from .database import Base, engine, SessionLocal

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Branch).count() > 0:
        return

    now = datetime.now(timezone.utc)

    # 1. Branches
    branch_gombe = Branch(
        name="Siège & Magasin Principal - Gombe",
        city="Kinshasa",
        address="14 Boulevard du 30 Juin, Gombe, Kinshasa",
        active=True
    )
    branch_limete = Branch(
        name="Dépôt & Comptoir de Vente - Limete",
        city="Kinshasa",
        address="7ème Rue Limete Industriel, Kinshasa",
        active=True
    )
    db.add_all([branch_gombe, branch_limete])
    db.flush()

    # 2. Users
    users = [
        User(full_name="Patrick Tshisekedi", email="admin@drcsmartpos.cd", role="Owner", active=True),
        User(full_name="Michel Mutombo", email="mmutombo@drcsmartpos.cd", role="Branch Manager", active=True),
        User(full_name="Jeanne Kalala", email="jkalala@drcsmartpos.cd", role="Cashier", active=True),
        User(full_name="Marie Mwamba", email="mmwamba@drcsmartpos.cd", role="Accountant", active=True)
    ]
    db.add_all(users)
    db.flush()

    # 3. Products
    products_data = [
        # Staples / Food
        {"name": "Riz Blanc Parfumé 25kg", "sku": "RIZ-25KG", "barcode": "6001001001", "category": "Alimentation", "unit": "Sac", "cost_price": 22.0, "selling_price": 28.0, "stock_quantity": 45, "minimum_stock": 10, "tax_category": "STANDARD_16"},
        {"name": "Farine de Froment Bralima 50kg", "sku": "FAR-50KG", "barcode": "6001001002", "category": "Alimentation", "unit": "Sac", "cost_price": 31.0, "selling_price": 38.5, "stock_quantity": 20, "minimum_stock": 8, "tax_category": "STANDARD_16"},
        {"name": "Huile Végétale Simba 5L", "sku": "HUI-5L", "barcode": "6001001003", "category": "Alimentation", "unit": "Bidon", "cost_price": 9.5, "selling_price": 12.0, "stock_quantity": 35, "minimum_stock": 10, "tax_category": "STANDARD_16"},
        {"name": "Sucre Blanc Kwilu Ngongo 5kg", "sku": "SUC-5KG", "barcode": "6001001004", "category": "Alimentation", "unit": "Sac", "cost_price": 5.8, "selling_price": 7.5, "stock_quantity": 4, "minimum_stock": 10, "tax_category": "STANDARD_16"}, # LOW STOCK
        {"name": "Lait Concentré Sucré Bonnet Bleu 397g", "sku": "LAI-397G", "barcode": "6001001005", "category": "Alimentation", "unit": "Boîte", "cost_price": 1.3, "selling_price": 1.8, "stock_quantity": 80, "minimum_stock": 20, "tax_category": "STANDARD_16"},

        # Beverages
        {"name": "Primus Bouteille 72cl Casier 12", "sku": "BEV-PRI72", "barcode": "6002001001", "category": "Boissons", "unit": "Casier", "cost_price": 14.5, "selling_price": 18.0, "stock_quantity": 50, "minimum_stock": 15, "tax_category": "STANDARD_16"},
        {"name": "Maltina Canette 33cl Pack 24", "sku": "BEV-MAL24", "barcode": "6002001002", "category": "Boissons", "unit": "Pack", "cost_price": 18.0, "selling_price": 22.5, "stock_quantity": 15, "minimum_stock": 8, "tax_category": "STANDARD_16"},
        {"name": "Eau Minérale Swissta 1.5L Pack 6", "sku": "EAU-SW15", "barcode": "6002001003", "category": "Boissons", "unit": "Pack", "cost_price": 2.8, "selling_price": 4.0, "stock_quantity": 0, "minimum_stock": 12, "tax_category": "STANDARD_16"}, # OUT OF STOCK

        # Tech & Electronics
        {"name": "Routeur 4G LTE Wi-Fi Mobile", "sku": "ELEC-RT4G", "barcode": "6003001001", "category": "Électronique", "unit": "Pièce", "cost_price": 35.0, "selling_price": 45.0, "stock_quantity": 12, "minimum_stock": 5, "tax_category": "STANDARD_16"},
        {"name": "Câble USB-C Tressé Rapide 1.5m", "sku": "ACC-USBC", "barcode": "6003001002", "category": "Électronique", "unit": "Pièce", "cost_price": 1.5, "selling_price": 3.5, "stock_quantity": 65, "minimum_stock": 15, "tax_category": "STANDARD_16"},
        {"name": "Ampoule LED Rechargeable 15W", "sku": "ELEC-LED15", "barcode": "6003001003", "category": "Électronique", "unit": "Pièce", "cost_price": 5.0, "selling_price": 8.0, "stock_quantity": 3, "minimum_stock": 8, "tax_category": "STANDARD_16"}, # LOW STOCK
        {"name": "Kit Solaire Portable 50W", "sku": "SOL-50W", "barcode": "6003001004", "category": "Électronique", "unit": "Kit", "cost_price": 48.0, "selling_price": 65.0, "stock_quantity": 8, "minimum_stock": 3, "tax_category": "STANDARD_16"},

        # Maintenance & Household
        {"name": "Savon Antiseptique Monganga Boîte 12", "sku": "SAV-MON12", "barcode": "6004001001", "category": "Hygiène", "unit": "Boîte", "cost_price": 4.2, "selling_price": 6.0, "stock_quantity": 28, "minimum_stock": 10, "tax_category": "STANDARD_16"},
        {"name": "Détergent Omo Poudre 500g", "sku": "DET-OMO500", "barcode": "6004001002", "category": "Hygiène", "unit": "Sachet", "cost_price": 1.6, "selling_price": 2.2, "stock_quantity": 40, "minimum_stock": 15, "tax_category": "STANDARD_16"},
    ]

    products_map = {}
    for p_data in products_data:
        p = Product(**p_data, active=True)
        db.add(p)
        db.flush()
        products_map[p.sku] = p

    # 4. Customers
    customers_data = [
        {"name": "Entreprise Générale du Congo SPRL", "phone": "+243 81 234 5678", "email": "contact@egc-rdc.com", "address": "Boulevard du 30 Juin, Gombe", "nif": "A1234567B", "credit_limit": 2000.0, "opening_balance": 150.0, "current_balance": 150.0},
        {"name": "Supermarché Kin-Express", "phone": "+243 99 876 5432", "email": "achats@kinexpress.cd", "address": "7ème Rue Résidentiel, Limete", "nif": "B9876543C", "credit_limit": 5000.0, "opening_balance": 0.0, "current_balance": 0.0},
        {"name": "Hôtel Sultani Kinshasa", "phone": "+243 82 456 7890", "email": "compta@hotelsultani.cd", "address": "Avenue de la Justice, Gombe", "nif": "C4567891D", "credit_limit": 3000.0, "opening_balance": 450.0, "current_balance": 450.0},
        {"name": "Clinique Médicale Ngaliema", "phone": "+243 84 321 6540", "email": "procurement@ngaliema-med.cd", "address": "Avenue Kintambo, Ngaliema", "nif": "D3216549E", "credit_limit": 1500.0, "opening_balance": 0.0, "current_balance": 0.0},
        {"name": "Client Comptant (Particulier)", "phone": "+243 89 000 0000", "email": "particulier@drcsmartpos.cd", "address": "Kinshasa", "nif": "NON-SPECIFIE", "credit_limit": 0.0, "opening_balance": 0.0, "current_balance": 0.0},
    ]

    customers = []
    for c_data in customers_data:
        c = Customer(**c_data)
        db.add(c)
        db.flush()
        customers.append(c)

    # 5. Suppliers
    suppliers_data = [
        {"name": "Bralima RDC SA", "phone": "+243 81 555 1111", "email": "ventes@bralima.cd", "address": "Avenue du Drapeau, Barumbu, Kinshasa", "nif": "A0700123M", "rccm": "CD/KIN/RCCM/14-B-0012", "opening_balance": 0.0, "current_balance": 0.0},
        {"name": "Minoterie du Congo (MIDEMA)", "phone": "+243 99 555 2222", "email": "commandes@midema.cd", "address": "Port de Matadi & Gare Fluviale, Kinshasa", "nif": "A0800456X", "rccm": "CD/KIN/RCCM/15-B-0456", "opening_balance": 0.0, "current_balance": 0.0},
        {"name": "Congo Equipements & Tech SARL", "phone": "+243 82 555 3333", "email": "distribution@congo-tech.cd", "address": "12ème Rue Limete Industriel", "nif": "A0900789Z", "rccm": "CD/KIN/RCCM/18-B-0789", "opening_balance": 0.0, "current_balance": 0.0},
        {"name": "Socimex Import & Distribution", "phone": "+243 84 555 4444", "email": "commercial@socimex.cd", "address": "Avenue des Poids Lourds, Kingabwa", "nif": "A0850321K", "rccm": "CD/KIN/RCCM/16-B-0321", "opening_balance": 0.0, "current_balance": 0.0},
    ]

    suppliers = []
    for s_data in suppliers_data:
        s = Supplier(**s_data)
        db.add(s)
        db.flush()
        suppliers.append(s)

    # 6. Historical Sales (Past 3 days)
    sample_sales = [
        {
            "offset_hours": 48,
            "customer_id": customers[0].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Airtel Money",
            "items": [
                {"product": products_map["RIZ-25KG"], "quantity": 2, "discount": 0.0},
                {"product": products_map["HUI-5L"], "quantity": 3, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 36,
            "customer_id": customers[1].id,
            "branch_id": branch_gombe.id,
            "payment_method": "M-Pesa",
            "items": [
                {"product": products_map["BEV-PRI72"], "quantity": 5, "discount": 5.0},
                {"product": products_map["BEV-MAL24"], "quantity": 2, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 24,
            "customer_id": customers[4].id,
            "branch_id": branch_limete.id,
            "payment_method": "Cash",
            "items": [
                {"product": products_map["ELEC-RT4G"], "quantity": 1, "discount": 0.0},
                {"product": products_map["ACC-USBC"], "quantity": 2, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 12,
            "customer_id": customers[2].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Orange Money",
            "items": [
                {"product": products_map["FAR-50KG"], "quantity": 2, "discount": 0.0},
                {"product": products_map["LAI-397G"], "quantity": 10, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 4,
            "customer_id": customers[4].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Cash",
            "items": [
                {"product": products_map["SAV-MON12"], "quantity": 3, "discount": 0.0},
                {"product": products_map["DET-OMO500"], "quantity": 4, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 2,
            "customer_id": customers[3].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Card",
            "items": [
                {"product": products_map["SOL-50W"], "quantity": 1, "discount": 5.0},
                {"product": products_map["ELEC-LED15"], "quantity": 2, "discount": 0.0}
            ]
        },
        # 8-30 days ago
        {
            "offset_hours": 24 * 12,
            "customer_id": customers[0].id,
            "branch_id": branch_gombe.id,
            "payment_method": "M-Pesa",
            "items": [
                {"product": products_map["FAR-50KG"], "quantity": 4, "discount": 0.0},
                {"product": products_map["SUC-5KG"], "quantity": 6, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 24 * 19,
            "customer_id": customers[2].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Airtel Money",
            "items": [
                {"product": products_map["BEV-PRI72"], "quantity": 8, "discount": 10.0},
                {"product": products_map["BEV-EAU6"], "quantity": 10, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 24 * 25,
            "customer_id": customers[1].id,
            "branch_id": branch_limete.id,
            "payment_method": "Cash",
            "items": [
                {"product": products_map["RIZ-25KG"], "quantity": 5, "discount": 0.0},
                {"product": products_map["HUI-5L"], "quantity": 4, "discount": 0.0}
            ]
        },
        # 31-60 days ago
        {
            "offset_hours": 24 * 38,
            "customer_id": customers[3].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Card",
            "items": [
                {"product": products_map["SOL-50W"], "quantity": 3, "discount": 10.0},
                {"product": products_map["ELEC-RT4G"], "quantity": 2, "discount": 0.0}
            ]
        },
        {
            "offset_hours": 24 * 52,
            "customer_id": customers[0].id,
            "branch_id": branch_gombe.id,
            "payment_method": "Orange Money",
            "items": [
                {"product": products_map["RIZ-25KG"], "quantity": 6, "discount": 0.0},
                {"product": products_map["SAV-MON12"], "quantity": 5, "discount": 0.0}
            ]
        },
    ]

    for idx, sale_data in enumerate(sample_sales, start=1):
        sale_time = now - timedelta(hours=sale_data["offset_hours"])
        subtotal = 0.0
        tax_total = 0.0
        items_objs = []

        for item_entry in sale_data["items"]:
            prod = item_entry["product"]
            qty = item_entry["quantity"]
            disc = item_entry["discount"]
            unit_p = prod.selling_price
            line_sub = round(unit_p * qty - disc, 2)
            tax_rate = 0.16 if prod.tax_category == "STANDARD_16" else 0.0
            line_tax = round(line_sub * tax_rate, 2)

            subtotal += line_sub
            tax_total += line_tax

            items_objs.append(SaleItem(
                product_id=prod.id,
                product_name_snapshot=prod.name,
                quantity=qty,
                unit_price=unit_p,
                discount_amount=disc,
                tax_rate=tax_rate,
                line_total=round(line_sub + line_tax, 2)
            ))

        subtotal = round(subtotal, 2)
        tax_total = round(tax_total, 2)
        total = round(subtotal + tax_total, 2)

        sale_obj = Sale(
            invoice_number=f"INV-KIN-20261124-{idx:04d}",
            customer_id=sale_data["customer_id"],
            branch_id=sale_data["branch_id"],
            subtotal=subtotal,
            discount_amount=0.0,
            tax_amount=tax_total,
            total=total,
            currency="USD",
            payment_method=sale_data["payment_method"],
            payment_status="PAID",
            status="COMPLETED",
            created_at=sale_time,
            cashier_name="Jeanne Kalala"
        )
        db.add(sale_obj)
        db.flush()

        for itm in items_objs:
            itm.sale_id = sale_obj.id
            db.add(itm)

    # 7. Purchases
    # Purchase 1: Received from Bralima
    po1 = Purchase(
        reference="PO-KIN-20261120-0001",
        supplier_id=suppliers[0].id,
        subtotal=725.0,
        total=725.0,
        currency="USD",
        status="RECEIVED",
        created_at=now - timedelta(days=4),
        received_at=now - timedelta(days=3)
    )
    db.add(po1)
    db.flush()
    db.add(PurchaseItem(
        purchase_id=po1.id,
        product_id=products_map["BEV-PRI72"].id,
        product_name_snapshot=products_map["BEV-PRI72"].name,
        quantity=50,
        unit_cost=14.5,
        line_total=725.0
    ))

    # Purchase 2: Received from MIDEMA
    po2 = Purchase(
        reference="PO-KIN-20261122-0002",
        supplier_id=suppliers[1].id,
        subtotal=620.0,
        total=620.0,
        currency="USD",
        status="RECEIVED",
        created_at=now - timedelta(days=2),
        received_at=now - timedelta(days=1)
    )
    db.add(po2)
    db.flush()
    db.add(PurchaseItem(
        purchase_id=po2.id,
        product_id=products_map["FAR-50KG"].id,
        product_name_snapshot=products_map["FAR-50KG"].name,
        quantity=20,
        unit_cost=31.0,
        line_total=620.0
    ))

    # Purchase 3: Ordered / Pending from Congo Equipements (DEMO READY to receive!)
    po3 = Purchase(
        reference="PO-KIN-20261124-0003",
        supplier_id=suppliers[2].id,
        subtotal=730.0,
        total=730.0,
        currency="USD",
        status="ORDERED",
        created_at=now - timedelta(hours=5),
        received_at=None
    )
    db.add(po3)
    db.flush()
    db.add_all([
        PurchaseItem(
            purchase_id=po3.id,
            product_id=products_map["ELEC-RT4G"].id,
            product_name_snapshot=products_map["ELEC-RT4G"].name,
            quantity=10,
            unit_cost=35.0,
            line_total=350.0
        ),
        PurchaseItem(
            purchase_id=po3.id,
            product_id=products_map["SOL-50W"].id,
            product_name_snapshot=products_map["SOL-50W"].name,
            quantity=5,
            unit_cost=48.0,
            line_total=240.0
        ),
        PurchaseItem(
            purchase_id=po3.id,
            product_id=products_map["ELEC-LED15"].id,
            product_name_snapshot=products_map["ELEC-LED15"].name,
            quantity=28,
            unit_cost=5.0,
            line_total=140.0
        )
    ])

    # 8. Expenses
    expenses_data = [
        {"category": "Groupe Électrogène & Carburant", "description": "150L Gasoil pour groupe électrogène (Délestage SNEL Gombe)", "amount": 195.0, "currency": "USD", "payment_method": "Cash", "days_ago": 1},
        {"category": "Loyer & Charges", "description": "Loyer commercial mensuel - Siège Gombe (Acompte)", "amount": 1200.0, "currency": "USD", "payment_method": "Bank Transfer", "days_ago": 3},
        {"category": "Électricité & Eau", "description": "Facture mensuelle SNEL & REGIDESO", "amount": 145.0, "currency": "USD", "payment_method": "M-Pesa", "days_ago": 2},
        {"category": "Logistique & Transport", "description": "Frais de transport camionnette livraison Limete vers Gombe", "amount": 60.0, "currency": "USD", "payment_method": "Cash", "days_ago": 0},
        {"category": "Télécoms & Internet", "description": "Abonnement Internet Fibre Optique Vodacom Business", "amount": 120.0, "currency": "USD", "payment_method": "Airtel Money", "days_ago": 2},
        {"category": "Fournitures de Bureau", "description": "Carton rouleaux papier thermique 80mm pour caisse", "amount": 45.0, "currency": "USD", "payment_method": "Cash", "days_ago": 1},
        {"category": "Groupe Électrogène & Carburant", "description": "Appoint carburant groupe électrogène (Quinzaine)", "amount": 160.0, "currency": "USD", "payment_method": "Cash", "days_ago": 14},
        {"category": "Logistique & Transport", "description": "Livraison entrepôt Kingabwa -> Gombe", "amount": 85.0, "currency": "USD", "payment_method": "M-Pesa", "days_ago": 21},
        {"category": "Loyer & Charges", "description": "Loyer commercial mensuel - Mois précédent", "amount": 1200.0, "currency": "USD", "payment_method": "Bank Transfer", "days_ago": 35},
        {"category": "Électricité & Eau", "description": "Facture SNEL & REGIDESO - Mois précédent", "amount": 135.0, "currency": "USD", "payment_method": "M-Pesa", "days_ago": 45},
    ]

    for exp in expenses_data:
        e = Expense(
            category=exp["category"],
            description=exp["description"],
            amount=exp["amount"],
            currency=exp["currency"],
            payment_method=exp["payment_method"],
            expense_date=now - timedelta(days=exp["days_ago"]),
            created_by="Patrick Tshisekedi"
        )
        db.add(e)

    db.commit()
    print("Database successfully seeded with Kinshasa demo dataset!")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()

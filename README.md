# DRC Smart POS — Commercial Demonstration MVP (Kinshasa, RDC)

**DRC Smart POS** is a modern, high-contrast, robust Point of Sale (POS) and fiscal business management platform designed specifically for commercial enterprises, retail chains, and wholesalers operating in the **Democratic Republic of Congo (Kinshasa)**.

---

## 1. Quickstart Run Instructions

### Option A: Unified Application Server (FastAPI + React SPA)
You can run the entire platform (backend API + production-built React frontend) from a single server on **Port 8000**:

#### Windows (PowerShell)
```powershell
# 1. Navigate to the project root
cd "C:\Users\sandipansarkar\Documents\Client Demos\POS"

# 2. Start the unified application server
.\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```
Open your browser to: **`http://localhost:8000`** (or access API docs at **`http://localhost:8000/docs`**).

---

### Option B: Separate Backend and Vite Frontend (Development Mode)
If you wish to run the Vite dev server with Hot Module Replacement (HMR):

#### Terminal 1 — Backend:
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

#### Terminal 2 — Frontend:
```powershell
$env:PATH = "$((Get-Item .).FullName)\node_bin;$env:PATH"
cd frontend
..\node_bin\node.exe ..\node_bin\node_modules\npm\bin\npm-cli.js run dev
```
Open your browser to: **`http://localhost:5173`**.

---

## 2. Recommended Client Walkthrough Sequence

| Step | Screen | What to demonstrate to the client |
| :--- | :--- | :--- |
| **1** | **M01. Tableau de Bord** | Present real-time sales KPIs ($500+ revenue, gross profit margin estimate, low stock alerts, mobile money payment breakdown M-Pesa/Airtel/Orange). |
| **2** | **M03. Stocks & Produits** | Show the catalog of 14 realistic Kinshasa products (Staples, Beverages, Electronics). Highlight the out-of-stock item (`EAU-SW15`) and low-stock items. Demonstrate the stock valuation cards. |
| **3** | **M02. Caisse & Ventes (POS)** | Perform a live sale: search `RIZ-25KG` or scan barcode `6001001001`. Add 2 units to cart, select a client (`Supermarché Kin-Express`), choose payment method (`M-Pesa`), and click **Valider la Vente**. |
| **4** | **Ticket de Caisse** | Show the thermal receipt popup (toggle between 80mm and 58mm layouts), review the subtotal and 16% DGI VAT. Click **Imprimer le Reçu** (triggers print stylesheet). Notice the explicit legal disclaimer. |
| **5** | **Vérification Stock** | Return to **M03. Stocks & Produits** and show that the stock quantity of `RIZ-25KG` decreased immediately and atomically. |
| **6** | **M04. Achats & Fournisseurs** | Open pending purchase order `PO-KIN-20261124-0003` from *Congo Equipements & Tech*. Click **Réceptionner & Entrer en Stock**; show that stock immediately increases. Attempting to click again is safely rejected. |
| **7** | **M07. Dépenses d'Exploitation** | Click **Enregistrer une Dépense**, log a $65 expense for *Groupe Électrogène & Carburant (Gasoil délestage SNEL)*. |
| **8** | **M10. Facture Normalisée DGI** | Open the fiscal invoice preview. Point out the seller NIF/RCCM, customer NIF, 16% VAT breakdown, demo QR code, and mandatory non-fiscal disclaimer. |
| **9** | **M15. Rapports & Export CSV** | Review updated financial figures and download the sales ledger via **Exporter les Ventes en CSV**. |
| **10** | **M16–M18. Modèle SaaS & Sécurité** | Showcase commercial subscription tiers (Starter $29/mo, Pro $69/mo, Enterprise $149/mo) and multi-tenant security architecture. |

---

## 3. Coverage of all 18 Modules

- **M01. Dashboard & Business Overview**: Live KPIs, sales, profit estimate, alerts, payment breakdown.
- **M02. POS & Sales Management**: Search, barcode scanning, cart, 16% VAT, cash & mobile money, thermal receipts.
- **M03. Inventory & Stock Management**: Product catalog, minimum alert thresholds, stock adjustments, stock valuation.
- **M04. Purchase & Procurement Management**: Purchase orders, supplier tracking, atomic stock receiving.
- **M05. Customer Management (CRM)**: Customer directory with DRC NIF numbers, credit limits, balances.
- **M06. Supplier Management**: Directory of DRC suppliers (Bralima, MIDEMA, Socimex) with RCCM and NIF.
- **M07. Expense Management**: Operational expense tracking (fuel generator, store rent, SNEL power, transport).
- **M08. Financial & Accounting Management**: Cashbook summary, P&L widget, OHADA chart of accounts structure.
- **M09. Tax & VAT Management**: Configurable DRC 16% standard VAT, tax-inclusive vs exclusive rules.
- **M10. DGI Facture Normalisée**: Fiscal invoice layout, demo QR code, compliance watermark, DEF adapter placeholder.
- **M11. User Roles & Permissions**: Role switcher (Owner, Branch Manager, Cashier, Accountant).
- **M12. Multi-Branch Management**: Branch switcher between Kinshasa Gombe flagship and Limete depot.
- **M13. Hardware & Printer Management**: 58mm and 80mm thermal receipt templates, cash drawer kick configuration.
- **M14. Offline & Online Synchronization**: Manual demo offline toggle with local queue simulation.
- **M15. Reports & Business Analytics**: Date-range sales summary, top products, expense breakdown, CSV export.
- **M16. Subscription & License Management**: Starter, Pro, Enterprise tier presentation.
- **M17. Super Admin & Tenant Management**: Multi-tenant database partitioning overview.
- **M18. Security, Audit & System Configuration**: Audit trail logs, SHA-256 digital signature hashes, health checks.

---

## 4. Regulatory & Legal Disclaimer Guardrails

> [!IMPORTANT]
> **DEMO ONLY — NOT A DGI-VALIDATED / HOMOLOGATED INVOICE.**
> In accordance with regulatory standards, all fiscal invoice previews and receipts generated by this prototype are clearly watermarked as non-homologated specimens. Actual DGI integration requires certification with an authorized Electronic Fiscal Device (DEF / MCF) provider and official credentials from the *Direction Générale des Impôts*.

---

## 5. Technology Stack

- **Multi-Language Support**: Seamless instant toggle between **Français (RDC)** and **English** right from the top navigation bar.
- **Clean Business Navigation**: All artificial module numbers (e.g. `M01`, `M02`, etc.) have been removed across all navigation items, headers, and views for an authentic enterprise user experience.
- **Backend**: Python 3.12, FastAPI, Uvicorn, SQLAlchemy 2, SQLite with WAL mode, Pydantic v2.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React icons, Vite 6.
- **Data & Seeding**: Idempotent Kinshasa demo dataset with branches, users, products, suppliers, customers, sales, purchases, and expenses.

# -*- coding: utf-8 -*-
"""
DRC Smart POS — Professional User Manual Generator
Generates comprehensive, publication-quality User Manuals in HTML, PDF, and DOC formats.
"""

import os
import subprocess
import sys

def build_manual_html():
    return """<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <title>DRC Smart POS — Complete User Manual & Store Operations Guide</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 8pt;
        font-family: 'Inter', sans-serif;
        color: #64748b;
      }
      @bottom-left {
        content: "DRC Smart POS — Official User Manual (Kinshasa, DRC)";
        font-size: 8pt;
        font-family: 'Inter', sans-serif;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 8.8pt;
      background: #ffffff;
    }

    .cover {
      background: linear-gradient(135deg, #0f172a 0%, #042f2e 100%);
      color: #ffffff;
      padding: 34px 30px;
      border-radius: 12px;
      margin-bottom: 22px;
      border-bottom: 5px solid #0d9488;
      page-break-after: avoid;
    }

    .cover-badge {
      display: inline-block;
      background: rgba(13, 148, 136, 0.25);
      border: 1px solid #14b8a6;
      color: #5eead4;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }

    .cover h1 {
      font-size: 21pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
      color: #ffffff;
      line-height: 1.2;
    }

    .cover p.subtitle {
      font-size: 10.5pt;
      color: #94a3b8;
      font-weight: 400;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .cover-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      font-size: 8pt;
      color: #cbd5e1;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 12px;
    }

    .cover-meta span strong {
      color: #ffffff;
    }

    h2 {
      font-size: 12.5pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 22px;
      margin-bottom: 8px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      page-break-after: avoid;
    }

    h2 .section-tag {
      background: #0f766e;
      color: #ffffff;
      font-size: 7.5pt;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    h3 {
      font-size: 10.2pt;
      font-weight: 700;
      color: #0f766e;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 9.2pt;
      font-weight: 600;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 4px;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
      text-align: justify;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 10px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    strong {
      color: #0f172a;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background: #f1f5f9;
      color: #0f766e;
      padding: 1px 4px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 11px 13px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .card-teal {
      background: #f0fdfa;
      border-left: 4px solid #0d9488;
      border-color: #ccfbf1 #ccfbf1 #ccfbf1 #0d9488;
    }

    .card-amber {
      background: #fffbeb;
      border-left: 4px solid #d97706;
      border-color: #fef3c7 #fef3c7 #fef3c7 #d97706;
    }

    .card-rose {
      background: #fff1f2;
      border-left: 4px solid #e11d48;
      border-color: #ffe4e6 #ffe4e6 #ffe4e6 #e11d48;
    }

    .card-blue {
      background: #f0f9ff;
      border-left: 4px solid #0284c7;
      border-color: #e0f2fe #e0f2fe #e0f2fe #0284c7;
    }

    .card-title {
      font-weight: 700;
      font-size: 9.2pt;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card-teal .card-title { color: #0f766e; }
    .card-amber .card-title { color: #92400e; }
    .card-rose .card-title { color: #9f1239; }
    .card-blue .card-title { color: #0369a1; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 9px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .step-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 9px 11px;
      text-align: left;
      page-break-inside: avoid;
    }

    .step-num {
      font-size: 7.5pt;
      font-weight: 800;
      color: #0d9488;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }

    .step-title {
      font-size: 8.8pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
    }

    .step-desc {
      font-size: 7.8pt;
      color: #64748b;
      line-height: 1.35;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 11px 0;
      font-size: 8.2pt;
      page-break-inside: avoid;
    }

    th, td {
      padding: 6px 9px;
      text-align: left;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }

    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.2pt;
      font-weight: 700;
    }

    .badge-teal { background: #ccfbf1; color: #0f766e; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-rose { background: #ffe4e6; color: #9f1239; }
    .badge-blue { background: #e0f2fe; color: #0369a1; }
    .badge-slate { background: #f1f5f9; color: #475569; }

    .toc {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .toc-title {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 4px;
    }

    .toc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 14px;
      font-size: 8.2pt;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      color: #334155;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 2px;
    }

    .toc-item span:first-child {
      font-weight: 600;
      color: #0f766e;
    }

    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div class="cover-badge">Official Software Documentation & User Guide</div>
    <h1>DRC SMART POS — USER MANUAL</h1>
    <p class="subtitle">
      A comprehensive, professional, and practical operations guide explaining every feature, navigation control, 
      business module, and standard workflow for retail and wholesale businesses operating in the Democratic Republic of Congo (Kinshasa).
    </p>
    <div class="cover-meta">
      <span><strong>Document Reference:</strong> DOC-DRC-POS-UM-2026-V2</span>
      <span><strong>Release Edition:</strong> Version 2.0 Commercial</span>
      <span><strong>Territory:</strong> Kinshasa, RDC</span>
      <span><strong>Currencies:</strong> Dual USD ($) & CDF (FC)</span>
      <span><strong>Fiscal Authority:</strong> DGI (TVA 16% Normalisée)</span>
      <span><strong>Accounting Standard:</strong> SYSCOHADA</span>
      <span><strong>Interface Languages:</strong> English & Français (RDC)</span>
    </div>
  </div>

  <!-- ==================== TABLE OF CONTENTS ==================== -->
  <div class="toc">
    <div class="toc-title">Table of Contents & Quick Reference</div>
    <div class="toc-grid">
      <div class="toc-item"><span>Section 1. Executive Summary & Purpose</span><span>Core Vision & Target Market</span></div>
      <div class="toc-item"><span>Section 2. Layout & Global Navigation</span><span>Top Bar & Sidebar Functions</span></div>
      <div class="toc-item"><span>Section 3. Daily Store Opening Checklist</span><span>Shift Setup & Hardware Test</span></div>
      <div class="toc-item"><span>Section 4. Dashboard & Business Overview</span><span>Live KPIs & Restock Alerts</span></div>
      <div class="toc-item"><span>Section 5. POS & Sales Register</span><span>Scanning, Cart & Payments</span></div>
      <div class="toc-item"><span>Section 6. Inventory & Stock Management</span><span>Catalog, Costs & Adjustments</span></div>
      <div class="toc-item"><span>Section 7. Purchases & Supplier Orders</span><span>POs & Atomic Stock Receiving</span></div>
      <div class="toc-item"><span>Section 8. Customer Relationship Management</span><span>Profiles, Credit & DRC NIF</span></div>
      <div class="toc-item"><span>Section 9. Supplier Directory</span><span>Bralima, Midema, Socimex</span></div>
      <div class="toc-item"><span>Section 10. Operational Expense Tracking</span><span>Generator Fuel, Rent, Payroll</span></div>
      <div class="toc-item"><span>Section 11. Accounting & Cashbook</span><span>SYSCOHADA Ledger & P&L</span></div>
      <div class="toc-item"><span>Section 12. DGI Normalized Invoicing</span><span>16% VAT Specimen & QR Code</span></div>
      <div class="toc-item"><span>Section 13. Hardware & Printers</span><span>58mm/80mm Thermal & Drawer</span></div>
      <div class="toc-item"><span>Section 14. Offline Mode & Resilience</span><span>Local Queuing & Auto-Sync</span></div>
      <div class="toc-item"><span>Section 15. Reports & Analytics</span><span>Sales Summaries & CSV Export</span></div>
      <div class="toc-item"><span>Section 16. SaaS Licensing & Security</span><span>Tiers, Multi-Tenancy & Audit</span></div>
      <div class="toc-item"><span>Section 17. Step-by-Step SOPs</span><span>7 Core Daily Procedures</span></div>
      <div class="toc-item"><span>Section 18. Troubleshooting & Glossary</span><span>Common Issues & DRC Terms</span></div>
    </div>
  </div>

  <!-- ==================== SECTION 1 ==================== -->
  <h2><span class="section-tag">01</span> Executive Summary & Purpose of DRC Smart POS</h2>
  <p>
    <strong>DRC Smart POS</strong> is a specialized Point of Sale and Fiscal Management platform engineered specifically 
    for commercial enterprises, retail chains, supermarkets, pharmacies, and wholesale distributors in the 
    <strong>Democratic Republic of Congo (DRC)</strong>. It solves the unique challenges of the Congolese business environment, 
    including dual-currency pricing (USD & Congolese Franc CDF), mobile money dominance (M-Pesa, Airtel Money, Orange Money), 
    frequent electrical/telecom interruptions (SNEL power outages and internet downtime), and strict compliance requirements with the 
    <strong>Direction Générale des Impôts (DGI)</strong> and the <strong>SYSCOHADA</strong> accounting standard.
  </p>

  <div class="grid-3">
    <div class="card card-teal">
      <div class="card-title">Real-Time Dual Currency</div>
      <p class="step-desc">
        Instant seamless conversion between <strong>USD ($)</strong> and <strong>CDF (FC)</strong> at a configurable reference rate 
        (e.g., 2,850 FC = 1 USD). Cashiers can take cash in USD or CDF without manual calculator errors.
      </p>
    </div>
    <div class="card card-teal">
      <div class="card-title">Congolese Payment Integration</div>
      <p class="step-desc">
        Native handling of cash as well as major Congolese mobile money networks: <strong>Vodacom M-Pesa</strong>, 
        <strong>Airtel Money</strong>, <strong>Orange Money</strong>, plus Visa/Mastercard banking cards.
      </p>
    </div>
    <div class="card card-teal">
      <div class="card-title">DGI Fiscal Normalization</div>
      <p class="step-desc">
        Pre-formatted normalized invoices with company NIF, RCCM, National ID, CDI tax center, 16% standard VAT breakdown, 
        cryptographic QR code specimens, and regulatory disclaimers.
      </p>
    </div>
  </div>

  <!-- ==================== SECTION 2 ==================== -->
  <h2><span class="section-tag">02</span> User Interface & Global Navigation Guide</h2>
  <p>
    The web application is partitioned into two persistent control areas: the <strong>Top Navigation Bar (TopBar)</strong> 
    and the <strong>Side Navigation Bar (Sidebar)</strong>, surrounding the dynamic central workspace.
  </p>

  <h3>A. The Top Navigation Bar (TopBar)</h3>
  <p>Available on every screen, the TopBar contains mission-critical operational switches:</p>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">UI Control</th>
        <th style="width: 25%;">Visual Appearance</th>
        <th>Operational Function & User Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Branch Selector</strong></td>
        <td>Store icon with dropdown selector</td>
        <td>
          Switches between <code>Siège Principal — Gombe (Blvd 30 Juin)</code> and <code>Dépôt & Comptoir — Limete (7ème Rue)</code>. 
          Instantly filters inventory levels, sales histories, and local registers to the active facility.
        </td>
      </tr>
      <tr>
        <td><strong>Refresh Button</strong></td>
        <td>Circular arrow icon (RefreshCw)</td>
        <td>
          Re-queries the central database to refresh all product quantities, transactions, and metrics without losing your current view or reloading the web page.
        </td>
      </tr>
      <tr>
        <td><strong>Language Converter</strong></td>
        <td>Pill toggle with <code>FR</code> and <code>EN</code></td>
        <td>
          Toggles the entire interface between <strong>Français (RDC)</strong> and <strong>English</strong>. All menus, product names, categories, units, and receipt modals update instantly.
        </td>
      </tr>
      <tr>
        <td><strong>Currency Converter</strong></td>
        <td>Pill toggle with <code>USD ($)</code> and <code>CDF (FC)</code></td>
        <td>
          Converts all catalog prices, cart line items, receipt totals, and financial reports between USD and Congolese Francs in real-time.
        </td>
      </tr>
      <tr>
        <td><strong>Offline Simulation Toggle</strong></td>
        <td>Wifi icon (Green = Online, Amber = Offline)</td>
        <td>
          Simulates network disconnection. When enabled, transactions are queued locally in browser storage and uploaded automatically upon reconnection.
        </td>
      </tr>
      <tr>
        <td><strong>User Role Switcher</strong></td>
        <td>User icon with role dropdown</td>
        <td>
          Simulates different user permission profiles: <em>Caissier (Jeanne Kalala)</em>, <em>Directeur Commercial (Patrick Tshisekedi)</em>, 
          <em>Gérant de Dépôt (Michel Mutombo)</em>, and <em>Comptable (Marie Mwamba)</em>.
        </td>
      </tr>
    </tbody>
  </table>

  <h3>B. The Side Navigation Bar (Sidebar)</h3>
  <p>
    The Sidebar categorizes the 13 functional modules into 5 intuitive business areas. Artificial numbering has been removed for a clean corporate appearance:
  </p>
  <div class="grid-2">
    <div>
      <h4>1. Commercial Operations (Opérations Commerciales)</h4>
      <ul>
        <li><strong>Tableau de Bord / Dashboard:</strong> Executive sales KPIs, margin, payment breakdown, and restock alerts.</li>
        <li><strong>Caisse & Ventes / POS:</strong> High-speed barcode scanning, cart checkout, customer assignment, and thermal receipt printing.</li>
        <li><strong>Stocks & Produits / Inventory:</strong> Product catalog, stock levels, valuations, and physical count adjustments.</li>
        <li><strong>Achats & Commandes / Purchases:</strong> Supplier purchase orders with atomic "Receive & Restock" automation.</li>
        <li><strong>Clients & CRM:</strong> Customer directory with DRC NIF numbers, credit limits, and outstanding balances.</li>
        <li><strong>Fournisseurs / Suppliers:</strong> Supplier directory with RCCM, NIF, and contact details.</li>
      </ul>
    </div>
    <div>
      <h4>2. Finance & Fiscal (Finance & Fiscalité DGI)</h4>
      <ul>
        <li><strong>Dépenses d'Exploitation / Expenses:</strong> Operating expense tracking (generator diesel, rent, logistics, salaries).</li>
        <li><strong>Comptabilité / Accounting:</strong> SYSCOHADA ledger, cashbook accounts (571100, 521100), and P&L margin estimates.</li>
        <li><strong>TVA & Paramètres / Taxes:</strong> DRC 16% standard VAT, tax-inclusive vs exclusive pricing rules, and CDI tax center.</li>
        <li><strong>Facture Normalisée DGI:</strong> Official specimen fiscal invoice generator with QR code and compliance watermarks.</li>
      </ul>
      <h4>3. Administration, Reports & Security</h4>
      <ul>
        <li><strong>Matériel & Admin:</strong> 58mm & 80mm thermal receipt formats, cash drawer kick configuration, and role permissions.</li>
        <li><strong>Rapports & Analytique:</strong> Date-range sales metrics, best-selling products, and CSV export.</li>
        <li><strong>Licences & Audit SaaS:</strong> Subscription pricing tiers (Starter, Pro, Enterprise) and SHA-256 audit logs.</li>
      </ul>
    </div>
  </div>

  <!-- ==================== SECTION 3 ==================== -->
  <h2><span class="section-tag">03</span> Daily Store Opening & Shift Checklist</h2>
  <div class="grid-4">
    <div class="step-box">
      <div class="step-num">Step 1</div>
      <div class="step-title">Select Branch</div>
      <div class="step-desc">Verify in the TopBar that you are set to your local branch (Gombe Siège or Limete Dépôt).</div>
    </div>
    <div class="step-box">
      <div class="step-num">Step 2</div>
      <div class="step-title">Select Operator</div>
      <div class="step-desc">Confirm your user identity (e.g. Jeanne Kalala for cashiers) so all sales receipts carry your signature.</div>
    </div>
    <div class="step-box">
      <div class="step-num">Step 3</div>
      <div class="step-title">Check Printer</div>
      <div class="step-desc">Visit Hardware Settings to ensure the paper roll width (80mm standard or 58mm compact) is properly configured.</div>
    </div>
    <div class="step-box">
      <div class="step-num">Step 4</div>
      <div class="step-title">Launch POS</div>
      <div class="step-desc">Navigate to Caisse & Ventes (POS) to initialize the barcode scanner and start welcoming retail customers.</div>
    </div>
  </div>

  <!-- ==================== SECTION 4 ==================== -->
  <h2><span class="section-tag">04</span> Dashboard & Business Pilotage (Tableau de Bord)</h2>
  <p>
    The <strong>Dashboard</strong> serves as the executive command center. It computes real-time business health indicators 
    and notifies store managers of critical replenishment needs:
  </p>
  <ul>
    <li><strong>Ventes du Jour (Today's Sales):</strong> Displays total revenue collected today along with the exact number of completed customer transactions.</li>
    <li><strong>Chiffre d'Affaires Total (Total Revenue):</strong> Cumulative revenue across all sales recorded since system launch.</li>
    <li><strong>Marge Brute Estimée (Estimated Gross Profit):</strong> Instantaneous gross profit calculation (Selling Price minus Purchase Cost Price), allowing managers to track profit margins in real-time.</li>
    <li><strong>Alertes de Réapprovisionnement (Stock Alerts):</strong> Counts products that are completely out of stock (<span class="badge badge-rose">Rupture</span>) and items that have dropped below their minimum safety stock threshold (<span class="badge badge-amber">Stock Bas</span>).</li>
    <li><strong>Payment Method Breakdown Widget:</strong> Interactive card showing revenue collected by Cash, Vodacom M-Pesa, Airtel Money, Orange Money, and Bank Card.</li>
    <li><strong>Recent Sales Ledger:</strong> List of the latest completed transactions with cashier name, customer, total amount, and an <strong>Aperçu Fiscal</strong> button that immediately opens the transaction in the DGI Facture Normalisée viewer.</li>
  </ul>

  <!-- ==================== SECTION 5 ==================== -->
  <h2><span class="section-tag">05</span> Point of Sale & Sales Register (Caisse & Ventes / POS)</h2>
  <p>
    The POS screen is optimized for speed, accuracy, and zero checkout latency. It provides full control over item selection, 
    cart management, customer tagging, discounts, and thermal receipt generation:
  </p>

  <div class="card card-teal">
    <div class="card-title">POS Operational Components</div>
    <ul>
      <li><strong>Dynamic Product Search:</strong> Type product names (e.g. "Riz", "Bière Primus", "Eau") or SKUs (e.g. <code>RIZ-25KG</code>) to filter items instantly.</li>
      <li><strong>Dedicated Barcode Scanner Input:</strong> Accepts inputs from USB handheld laser guns or Bluetooth scanners. Scan an EAN barcode (e.g. <code>6001001001</code>) and press Enter to instantly add the item to the cart.</li>
      <li><strong>Category Filter Tabs:</strong> Quick buttons (All, Staples/Épicerie, Beverages/Boissons, Electronics, etc.) to browse products visually.</li>
      <li><strong>Stock Limit Safeguard:</strong> The system strictly prohibits adding out-of-stock items or exceeding available physical inventory. If an item has 12 units in stock, attempting to add 13 units triggers an immediate warning.</li>
      <li><strong>Customer Selection Dropdown:</strong> Defaulted to <code>Client Comptant / Particulier (Walk-in)</code>. Can be linked to registered B2B corporate customers (e.g. <em>Supermarché Kin-Express</em>) so their official DRC NIF number is automatically printed on the receipt.</li>
      <li><strong>Discount Handling:</strong> Enter promotional or commercial discounts in currency value, deducted prior to VAT calculation.</li>
      <li><strong>16% DGI VAT Engine:</strong> Automatically computes Subtotal HT (pre-tax), 16% standard VAT, and Total TTC (all taxes included).</li>
      <li><strong>Thermal Receipt Modal:</strong> Upon clicking <strong>Valider la Vente</strong>, an interactive receipt popup appears with a toggle between <strong>80mm</strong> (supermarket layout) and <strong>58mm</strong> (compact mobile layout), featuring a sample QR code, invoice serial, cashier signature, and print button.</li>
    </ul>
  </div>

  <!-- ==================== SECTION 6 ==================== -->
  <h2><span class="section-tag">06</span> Inventory & Stock Management (Stocks & Produits)</h2>
  <p>
    The <strong>Inventory Module</strong> gives complete visibility over merchandise across all store departments:
  </p>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">SKU Reference</th>
        <th style="width: 25%;">Product Name (FR / EN)</th>
        <th>Category</th>
        <th>Cost Price</th>
        <th>Selling Price</th>
        <th>Stock Level</th>
        <th>Min Alert</th>
        <th>Status Badge</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>RIZ-25KG</code></td>
        <td>Riz Blanc Super Lion 25kg</td>
        <td>Épicerie / Staples</td>
        <td>18.50 $</td>
        <td>24.00 $</td>
        <td>35 Sacs</td>
        <td>10 Sacs</td>
        <td><span class="badge badge-teal">Normal</span></td>
      </tr>
      <tr>
        <td><code>BRAL-PRIM</code></td>
        <td>Bière Primus Bralima 72cl</td>
        <td>Boissons / Drinks</td>
        <td>0.85 $</td>
        <td>1.30 $</td>
        <td>120 Bouteilles</td>
        <td>24 Bouteilles</td>
        <td><span class="badge badge-teal">Normal</span></td>
      </tr>
      <tr>
        <td><code>HUI-5L</code></td>
        <td>Huile Végétale Simba 5L</td>
        <td>Épicerie / Staples</td>
        <td>7.50 $</td>
        <td>9.50 $</td>
        <td>8 Bidons</td>
        <td>10 Bidons</td>
        <td><span class="badge badge-amber">Stock Bas (Low)</span></td>
      </tr>
      <tr>
        <td><code>EAU-SW15</code></td>
        <td>Eau Minérale Swissta 1.5L</td>
        <td>Boissons / Drinks</td>
        <td>0.35 $</td>
        <td>0.60 $</td>
        <td>0 Packs</td>
        <td>15 Packs</td>
        <td><span class="badge badge-rose">Rupture (Out)</span></td>
      </tr>
    </tbody>
  </table>

  <h3>Creating New Products & Stock Adjustments</h3>
  <ul>
    <li><strong>New Product Button (+ Nouvel Article):</strong> Opens a modal to input Name, SKU, Barcode, Category, Unit (Pièce, Carton, Sac, Litre), Cost Price, Selling Price, Initial Stock, and Minimum Stock alert threshold.</li>
    <li><strong>Stock Adjustment Modal (ArrowUpDown icon):</strong> Used during periodic inventory counts or to record damaged/expired items. Enter the adjustment quantity (+5 or -2) and select an audit reason: <em>Periodic Physical Inventory</em>, <em>Shelf Damage / Loss</em>, or <em>Special Restock</em>.</li>
  </ul>

  <!-- ==================== SECTION 7 ==================== -->
  <h2><span class="section-tag">07</span> Purchases & Supplier Procurement (Achats & Commandes)</h2>
  <p>
    This module manages the procurement lifecycle with major Congolese distributors (Bralima, MIDEMA, Socimex, etc.):
  </p>
  <div class="card card-amber">
    <div class="card-title">Atomic Restock Operation: "Réceptionner & Entrer en Stock"</div>
    <p>
      When a delivery truck arrives at the warehouse, the storekeeper opens the pending purchase order (e.g. <code>PO-KIN-20261124-0003</code>) 
      and clicks <strong>Réceptionner & Entrer en Stock</strong>. This triggers an automated atomic database transaction:
    </p>
    <ol>
      <li>The Purchase Order status is permanently switched from <code>En attente (Pending)</code> to <code>Réceptionné (Received)</code>.</li>
      <li>The inventory quantities for every line item in the order are automatically incremented in the database.</li>
      <li>The button is disabled to guarantee that goods can never be mistakenly credited twice.</li>
    </ol>
  </div>

  <!-- ==================== SECTION 8 & 9 ==================== -->
  <h2><span class="section-tag">08</span> Customer Relationship Management & Suppliers</h2>
  <div class="grid-2">
    <div>
      <h3>Customer Directory & DRC NIF Compliance</h3>
      <p>
        For official B2B transactions under Congolese tax law, invoices must include the customer's 
        <strong>Numéro d'Identification Fiscale (NIF)</strong>. The Customers module provides:
      </p>
      <ul>
        <li>Corporate & individual profile records with telephone, email, and physical address in Kinshasa.</li>
        <li>DRC tax credentials: <strong>NIF</strong> (e.g. <code>A1234567B</code>) and <strong>RCCM</strong> registration numbers.</li>
        <li>Financial risk management: Credit limit authorization and real-time outstanding balance tracking.</li>
      </ul>
    </div>
    <div>
      <h3>Supplier Directory (Fournisseurs)</h3>
      <p>
        Centralized registry of authorized vendors and wholesalers:
      </p>
      <ul>
        <li>Key partners: <em>Bralima RDC</em>, <em>MIDEMA</em>, <em>Socimex</em>, <em>Congo Equipements & Tech</em>.</li>
        <li>Commercial contacts, phone numbers, warehouse addresses, and tax identifiers.</li>
        <li>Historical record of delivered purchase orders and pending accounts payable balances.</li>
      </ul>
    </div>
  </div>

  <!-- ==================== SECTION 10 ==================== -->
  <h2><span class="section-tag">09</span> Operational Expense Tracking (Dépenses d'Exploitation)</h2>
  <p>
    Running a business in Kinshasa entails specific operational overheads, particularly energy resilience. 
    The <strong>Expenses Module</strong> tracks every petty cash or bank disbursement:
  </p>
  <ul>
    <li><strong>Carburant Groupe Électrogène (SNEL Relay):</strong> Tracking diesel fuel expenses to keep cold rooms, lighting, and POS servers running during public grid power cuts.</li>
    <li><strong>Loyer Magasin (Commercial Rent):</strong> Tracking monthly lease payments for prime retail locations in Gombe or Limete.</li>
    <li><strong>Transport & Logistique (Urban Transport):</strong> Port-to-warehouse drayage, municipal delivery, and truck unloading fees.</li>
    <li><strong>Salaires & Primes (Payroll & Overtime):</strong> Shift compensation for sales clerks, cashiers, and inventory handlers.</li>
  </ul>
  <p>
    All logged expenses are deducted from gross revenues to calculate accurate net operating margin figures in the accounting view.
  </p>

  <!-- ==================== SECTION 11 ==================== -->
  <h2><span class="section-tag">10</span> Accounting, Cashbook & SYSCOHADA Ledger</h2>
  <p>
    The system maps commercial activities directly into the <strong>Système Comptable OHADA (SYSCOHADA)</strong>, 
    the mandatory legal accounting framework in the DRC:
  </p>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">OHADA Account</th>
        <th style="width: 30%;">Account Title (Intitulé)</th>
        <th style="width: 20%;">Accounting Class</th>
        <th>System Role & Financial Flow</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>571100</code></td>
        <td>Caisse Centrale Siège Gombe</td>
        <td>Asset (Cash / Trésorerie)</td>
        <td>Records all physical cash taken at store registers.</td>
      </tr>
      <tr>
        <td><code>521100</code></td>
        <td>Banque Rawbank USD Courant</td>
        <td>Asset (Bank / Banque)</td>
        <td>Records electronic card settlements and bank wire transfers.</td>
      </tr>
      <tr>
        <td><code>701100</code></td>
        <td>Ventes de Marchandises en RDC</td>
        <td>Revenue (Produits)</td>
        <td>Aggregates pre-tax revenue from completed retail sales.</td>
      </tr>
      <tr>
        <td><code>443100</code></td>
        <td>État, TVA Facturée sur Ventes</td>
        <td>Liability (Dettes Fiscales)</td>
        <td>Accumulates the 16% VAT collected on behalf of the DGI.</td>
      </tr>
      <tr>
        <td><code>605100</code></td>
        <td>Carburant & Énergie (Groupe SNEL)</td>
        <td>Expense (Charges)</td>
        <td>Consolidates generator fuel and operational energy costs.</td>
      </tr>
      <tr>
        <td><code>613100</code></td>
        <td>Locations Immobilières Commerciales</td>
        <td>Expense (Charges)</td>
        <td>Records store and depot rental payments.</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 12 ==================== -->
  <h2><span class="section-tag">11</span> DGI Normalized Fiscal Invoice (Facture Normalisée DGI)</h2>
  <p>
    In accordance with the regulations of the <strong>Direction Générale des Impôts (DGI)</strong>, 
    DRC Smart POS includes a dedicated normalized fiscal invoice generator. Every generated invoice features:
  </p>
  <div class="card card-rose">
    <div class="card-title">Mandatory DGI Regulatory Elements Present on the Invoice</div>
    <ul>
      <li><strong>Enterprise Header:</strong> Company Name, NIF, RCCM, National ID (ID Nat), Tax File Number (Numéro Impôt), and Tax Center of Jurisdiction (CDI Kinshasa Gombe).</li>
      <li><strong>Client Fiscal Identification:</strong> Customer Trade Name, Physical Address, and official DRC NIF.</li>
      <li><strong>Sequential Invoicing Code:</strong> Unalterable chronological invoice code (e.g. <code>FAC-KIN-20261124-0001</code>).</li>
      <li><strong>Triple Price Column Breakdown:</strong> Line-item unit prices displayed HT (Hors Taxe / Pre-Tax), 16% VAT calculation, and TTC (Toutes Taxes Comprises / Total with Tax).</li>
      <li><strong>Specimen QR Code & Digital Signature:</strong> Cryptographic verification hash specimen designed for automated tax auditor inspection.</li>
      <li><strong>Mandatory Legal Guardrail:</strong> Explicit watermark declaring that this preview is a non-homologated commercial demonstration specimen awaiting official DEF/MCF certification.</li>
    </ul>
  </div>

  <!-- ==================== SECTION 13 ==================== -->
  <h2><span class="section-tag">12</span> Hardware, Thermal Printers & Peripherals (Matériel)</h2>
  <p>
    The <strong>Hardware & Administration Module</strong> enables plug-and-play management of store peripherals:
  </p>
  <ul>
    <li><strong>80mm Thermal Receipt Layout:</strong> Standard wide receipt format featuring bold store headers, full line-item names, tax breakdowns, barcode/QR codes, and fiscal disclaimers.</li>
    <li><strong>58mm Compact Receipt Layout:</strong> Narrow layout designed for compact desktop printers and handheld Bluetooth mPOS terminals used in kiosks.</li>
    <li><strong>Cash Drawer Kick Signal:</strong> Automatic electronic RJ11 pulse sent through the printer port to pop the cash drawer open upon finalizing a cash payment.</li>
    <li><strong>Role Permission Matrix:</strong> Visual security matrix documenting role access rights across Owner, Branch Manager, Cashier, and Accountant.</li>
  </ul>

  <!-- ==================== SECTION 14 ==================== -->
  <h2><span class="section-tag">13</span> Offline Mode & Telecommunications Resilience</h2>
  <p>
    Given the frequent network fluctuations in Central Africa, DRC Smart POS is built with an <em>Offline-First</em> architecture:
  </p>
  <div class="grid-3">
    <div class="step-box">
      <div class="step-num">Step 1: Detection</div>
      <div class="step-title">Automatic Fallback</div>
      <div class="step-desc">When internet drops, the TopBar status switches to amber (Offline Mode Active). Zero cashier interruption.</div>
    </div>
    <div class="step-box">
      <div class="step-num">Step 2: Local Queue</div>
      <div class="step-title">Local IndexedDB Queue</div>
      <div class="step-desc">Sales, receipts, and inventory updates are encrypted and stored in the browser's persistent local storage.</div>
    </div>
    <div class="step-box">
      <div class="step-num">Step 3: Auto-Sync</div>
      <div class="step-title">Seamless Reconnection</div>
      <div class="step-desc">As soon as connection is re-established, the queue synchronizes with the server, updating central inventory and ledger.</div>
    </div>
  </div>

  <!-- ==================== SECTION 15 & 16 ==================== -->
  <h2><span class="section-tag">14</span> Reports, SaaS Licensing & Security Audit Trail</h2>
  <div class="grid-2">
    <div>
      <h3>Business Analytics & CSV Export</h3>
      <p>
        The <strong>Reports Module</strong> provides clear commercial intelligence:
      </p>
      <ul>
        <li>Date range filtering: <em>Today</em>, <em>Last 7 Days</em>, <em>Last 30 Days</em>, and <em>This Month</em>.</li>
        <li>Financial aggregations: Total Revenue, Total Margin, and Average Ticket Value.</li>
        <li>Top-performing product rankings by units sold and gross turnover.</li>
        <li><strong>Exporter les Ventes en CSV:</strong> One-click download of the complete sales ledger formatted for Microsoft Excel and external audit software.</li>
      </ul>
    </div>
    <div>
      <h3>Commercial SaaS Model & Audit Trail</h3>
      <p>
        The <strong>SaaS Roadmap Module</strong> outlines licensing and security:
      </p>
      <ul>
        <li><strong>Starter Tier ($29/mo):</strong> Single branch, 2 cashiers, offline sync.</li>
        <li><strong>Pro Tier ($69/mo):</strong> 3 branches, unlimited cashiers, DGI compliance.</li>
        <li><strong>Enterprise Tier ($149/mo):</strong> Unlimited depots, custom DEF adapter, multi-tenant database isolation.</li>
        <li><strong>SHA-256 Audit Trail:</strong> Every database edit, stock adjustment, and sale is recorded with an immutable cryptographic digital signature.</li>
      </ul>
    </div>
  </div>

  <!-- ==================== SECTION 17 ==================== -->
  <h2><span class="section-tag">15</span> Step-by-Step Standard Operating Procedures (SOPs)</h2>

  <h3>SOP-01: Processing a Standard Cash Sale with Thermal Receipt</h3>
  <ol>
    <li>Click on <strong>Caisse & Ventes (POS)</strong> in the sidebar.</li>
    <li>Scan the product barcode using the laser scanner or type the SKU (e.g. <code>RIZ-25KG</code>) in the search field.</li>
    <li>Use the <code>+</code> button to adjust the quantity.</li>
    <li>Ensure the customer is set to <code>Client Comptant / Particulier (Walk-in)</code>.</li>
    <li>Select <code>Espèces (Cash)</code> under Payment Method.</li>
    <li>Click the large green <strong>Valider la Vente (Complete Sale)</strong> button.</li>
    <li>The thermal receipt popup appears. Verify the 16% VAT amount and click <strong>Imprimer le Reçu</strong> to print the ticket.</li>
  </ol>

  <h3>SOP-02: Processing a B2B Sale with Customer NIF & M-Pesa</h3>
  <ol>
    <li>In the <strong>POS</strong> screen, open the Customer dropdown and select the client company (e.g. <em>Supermarché Kin-Express</em>).</li>
    <li>Add the requested items to the cart.</li>
    <li>Select <code>M-Pesa</code> under Payment Method.</li>
    <li>Verify the customer has transferred the total funds to the store's Vodacom merchant till.</li>
    <li>Click <strong>Valider la Vente</strong>.</li>
    <li>Navigate to <strong>Facture Normalisée DGI</strong> to print the formal A4 corporate invoice displaying both the seller's and buyer's NIF numbers.</li>
  </ol>

  <h3>SOP-03: Receiving a Shipment from a Supplier into Stock</h3>
  <ol>
    <li>Navigate to <strong>Achats & Commandes (Purchases)</strong> in the sidebar.</li>
    <li>Locate the purchase order in <code>En attente (Pending)</code> status (e.g. <code>PO-KIN-20261124-0003</code> from <em>Congo Equipements & Tech</em>).</li>
    <li>Verify that the physical boxes delivered match the quantities listed on the screen.</li>
    <li>Click the blue <strong>Réceptionner & Entrer en Stock (Receive & Restock)</strong> button.</li>
    <li>The order status updates to <code>Réceptionné (Received)</code> and product stock quantities increase immediately and atomically in the database.</li>
  </ol>

  <h3>SOP-04: Performing a Physical Inventory Stock Adjustment</h3>
  <ol>
    <li>Navigate to <strong>Stocks & Produits (Inventory)</strong>.</li>
    <li>Locate the product requiring adjustment (e.g. <code>EAU-SW15</code>).</li>
    <li>Click the <strong>ArrowUpDown</strong> icon on the product row to open the Stock Adjustment modal.</li>
    <li>Enter the quantity adjustment (e.g. <code>+10</code> for found inventory, or <code>-2</code> for damaged units).</li>
    <li>Select the required reason from the dropdown: <em>Inventaire physique périodique</em>, <em>Perte ou dégradation</em>, or <em>Entrée exceptionnelle</em>.</li>
    <li>Click <strong>Enregistrer l'Ajustement</strong> to commit the change.</li>
  </ol>

  <h3>SOP-05: Logging Daily Generator Diesel Expense (Groupe Électrogène)</h3>
  <ol>
    <li>Navigate to <strong>Dépenses d'Exploitation (Expenses)</strong>.</li>
    <li>Click the <strong>Enregistrer une Dépense</strong> button.</li>
    <li>Select the category <em>Carburant & Groupe Électrogène (SNEL)</em>.</li>
    <li>Enter the amount paid (e.g. <code>65.00 $</code>).</li>
    <li>Choose the payment method (e.g. <code>Caisse Espèces</code>).</li>
    <li>In the description, type: <em>Achat 50L Gasoil pour groupe électrogène relais délestage SNEL</em>.</li>
    <li>Click <strong>Enregistrer</strong>. The expense is instantly reflected in the P&L and cashbook ledger.</li>
  </ol>

  <h3>SOP-06: End-of-Day Register Closure (Clôture de Caisse) & CSV Export</h3>
  <ol>
    <li>At the end of the business day, navigate to <strong>Rapports & Analytique (Reports)</strong>.</li>
    <li>Set the date filter to <strong>Aujourd'hui (Today)</strong>.</li>
    <li>Verify the breakdown of sales by payment method against the physical cash in the drawer and mobile money transaction SMS records.</li>
    <li>Click <strong>Exporter les Ventes en CSV</strong> to save the official daily sales ledger for accounting and audit purposes.</li>
  </ol>

  <!-- ==================== SECTION 18 ==================== -->
  <h2><span class="section-tag">16</span> Congolese Commercial & Fiscal Glossary</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Term / Abbreviation</th>
        <th style="width: 30%;">Full Name / Official Meaning</th>
        <th>Practical Application in DRC Smart POS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>DGI</strong></td>
        <td>Direction Générale des Impôts</td>
        <td>The revenue and tax authority of the Democratic Republic of Congo responsible for tax collection and fiscal invoice normalization standards.</td>
      </tr>
      <tr>
        <td><strong>NIF</strong></td>
        <td>Numéro d'Identification Fiscale</td>
        <td>The unique 9-digit alphanumeric tax identification code assigned to registered corporate entities and businesses in the DRC. Mandatory on all B2B invoices.</td>
      </tr>
      <tr>
        <td><strong>RCCM</strong></td>
        <td>Registre du Commerce et du Crédit Mobilier</td>
        <td>The legal commercial company registry number mandatory for businesses operating legally within OHADA member states.</td>
      </tr>
      <tr>
        <td><strong>CDF (FC)</strong></td>
        <td>Franc Congolais</td>
        <td>The official national currency of the Democratic Republic of Congo, converted dynamically in DRC Smart POS alongside USD.</td>
      </tr>
      <tr>
        <td><strong>M-Pesa / Airtel / Orange</strong></td>
        <td>Congolese Mobile Money Networks</td>
        <td>The predominant digital payment rails used across Kinshasa and DRC provinces for cash-free retail settlements.</td>
      </tr>
      <tr>
        <td><strong>SYSCOHADA</strong></td>
        <td>Système Comptable de l'OHADA</td>
        <td>The unified uniform accounting framework established by the Organization for the Harmonization of Business Law in Africa.</td>
      </tr>
      <tr>
        <td><strong>DEF / MCF</strong></td>
        <td>Dispositif Électronique Fiscal</td>
        <td>The electronic fiscal device hardware or certified cryptographic middleware required for final tax certification with the DGI.</td>
      </tr>
      <tr>
        <td><strong>SNEL</strong></td>
        <td>Société Nationale d'Électricité</td>
        <td>The national electricity utility of the DRC, whose load-shedding cycles require tracking generator diesel fuel expenses.</td>
      </tr>
    </tbody>
  </table>

  <!-- SIGN-OFF FOOTER -->
  <div class="card card-teal" style="margin-top: 22px; text-align: center; page-break-inside: avoid;">
    <div class="card-title" style="justify-content: center; font-size: 10.5pt;">DRC Smart POS — Commercial Operations & Software Documentation</div>
    <p style="font-size: 8pt; color: #0f766e; margin-bottom: 0;">
      Engineered for commercial enterprises in the Democratic Republic of Congo.<br>
      DGI RDC Fiscal Standards | SYSCOHADA Accounting | Dual USD / CDF Currencies | Offline-First Architecture
    </p>
  </div>

</body>
</html>
"""

def generate_manual():
    base_dir = r"C:\Users\sandipansarkar\Documents\Client Demos\POS"
    html_path = os.path.join(base_dir, "DRC_Smart_POS_User_Manual.html")
    pdf_path = os.path.join(base_dir, "DRC_Smart_POS_User_Manual.pdf")
    doc_path = os.path.join(base_dir, "DRC_Smart_POS_User_Manual.doc")

    print("[1/3] Generating User Manual HTML...")
    html_content = build_manual_html()
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"HTML manual generated at: {html_path} ({len(html_content)} bytes)")

    print("[2/3] Generating Word-compatible .DOC manual...")
    # Word natively opens UTF-8 HTML with standard Office namespaces as full formatted documents
    with open(doc_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"DOC manual generated at: {doc_path} ({len(html_content)} bytes)")

    print("[3/3] Rendering publication-quality PDF via headless Chrome...")
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_path):
        chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

    if os.path.exists(chrome_path):
        cmd = [
            chrome_path,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(pdf_path):
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"PDF manual successfully created at: {pdf_path} ({size_kb:.1f} KB)")
        else:
            print(f"PDF generation failed: {res.stderr}")
    else:
        print("Neither Chrome nor Edge found on system for PDF conversion.")

if __name__ == "__main__":
    generate_manual()

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Product, Customer, Sale } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations, translateProductName, translateCategory, translateUnit, translateCustomerName } from '../i18n';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  X,
  AlertCircle,
  Receipt
} from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

interface PosViewProps {
  branchId: number;
  currency: string;
  lang: Language;
  isOfflineDemo: boolean;
  onSaleCompleted?: () => void;
}

export const PosView: React.FC<PosViewProps> = ({ branchId, currency, lang, isOfflineDemo, onSaleCompleted }) => {
  const t = translations[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [barcodeInput, setBarcodeInput] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Completed sale modal for receipt preview
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [receiptWidth, setReceiptWidth] = useState<'80mm' | '58mm'>('80mm');

  // Load products & customers
  const loadData = async () => {
    try {
      const [prods, custs] = await Promise.all([
        api.getProducts(),
        api.getCustomers()
      ]);
      setProducts(prods);
      setCustomers(custs);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors du chargement des données POS');
    }
  };

  useEffect(() => {
    loadData();
  }, [branchId]);

  // Categories
  const rawCategories = Array.from(new Set(products.map(p => p.category)));
  const categories = ['ALL', ...rawCategories];

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || selectedCategory === 'Tous' || selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      translateProductName(p.name, lang).toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));
    return matchesCategory && matchesSearch;
  });

  // Add product to cart
  const addToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      alert(lang === 'fr' ? `Le produit "${product.name}" est en rupture de stock!` : `Product "${translateProductName(product.name, lang)}" is out of stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          alert(lang === 'fr' ? `Stock insuffisant. Maximum disponible: ${product.stock_quantity}` : `Insufficient stock. Max available: ${product.stock_quantity}`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock_quantity) {
              alert(lang === 'fr' ? `Stock disponible: ${item.product.stock_quantity}` : `Stock available: ${item.product.stock_quantity}`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Barcode / SKU scan submit
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find(
      p => p.barcode === barcodeInput.trim() || p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
    );
    if (found) {
      addToCart(found);
      setBarcodeInput('');
    } else {
      alert(lang === 'fr' ? `Aucun produit trouvé avec le code: ${barcodeInput}` : `No product found with code: ${barcodeInput}`);
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.selling_price * item.quantity), 0);
  const taxRate = 0.16; // DRC 16% VAT
  const taxAmount = roundTwoDecimals(subtotal * taxRate);
  const finalTotal = Math.max(0, roundTwoDecimals(subtotal + taxAmount - discountAmount));

  function roundTwoDecimals(val: number) {
    return Math.round(val * 100) / 100;
  }

  // Handle Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (isOfflineDemo) {
      alert(lang === 'fr' ? "Mode Démo Hors-ligne: La transaction est mise en file d'attente locale (simulation)." : "Offline Demo Mode: Transaction queued locally (simulation).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        customer_id: selectedCustomerId,
        branch_id: branchId,
        currency,
        payment_method: paymentMethod,
        discount_amount: discountAmount,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          discount_amount: item.discount
        }))
      };

      const createdSale = await api.createSale(payload);
      setCompletedSale(createdSale);
      setCart([]);
      setDiscountAmount(0);

      // Refresh product stock
      await loadData();
      if (onSaleCompleted) onSaleCompleted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la validation du panier');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
      {/* LEFT: Product Catalog & Search */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden border-r border-slate-200">
        {/* Search & Barcode Scan Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchProductPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            />
          </div>

          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <div className="relative">
              <Barcode className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={t.scanBarcodePlaceholder}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-44 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700 shadow-sm transition"
            >
              {t.btnScan}
            </button>
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'ALL' && (selectedCategory === 'Tous' || selectedCategory === 'All'));
            const label = cat === 'ALL' ? (lang === 'fr' ? 'Tous' : 'All') : translateCategory(cat, lang);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock_quantity <= 0;
              const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.minimum_stock;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && addToCart(product)}
                  className={`p-3.5 rounded-xl border transition flex flex-col justify-between ${
                    isOutOfStock
                      ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-teal-500 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{product.sku}</span>
                      {isOutOfStock ? (
                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">{t.statusOut}</span>
                      ) : isLowStock ? (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">{t.statusLow}</span>
                      ) : (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                          {product.stock_quantity} {translateUnit(product.unit, lang)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">
                      {translateProductName(product.name, lang)}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-teal-800">
                      {formatMoney(product.selling_price, currency)}
                    </span>
                    <button
                      disabled={isOutOfStock}
                      className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center hover:bg-teal-600 hover:text-white transition disabled:opacity-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Active Cart, Totals & Payment */}
      <div className="w-full lg:w-96 bg-white flex flex-col h-full border-t lg:border-t-0 shadow-lg">
        {/* Cart Header & Customer selection */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-700" />
              {t.cartTitle} ({cart.length})
            </h2>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-600 hover:underline"
              >
                {t.btnClearCart}
              </button>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.selectCustomerLabel}
            </label>
            <select
              value={selectedCustomerId || ''}
              onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">{t.walkInCustomer}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {translateCustomerName(c.name, lang)} {c.nif ? `(NIF: ${c.nif})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <Receipt className="w-12 h-12 mb-2 stroke-1 text-slate-300" />
              <p className="text-xs font-medium">{t.cartEmpty}</p>
              <p className="text-[11px] text-slate-400 mt-1">{t.cartEmptyDesc}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{translateProductName(item.product.name, lang)}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatMoney(item.product.selling_price, currency)} × {item.quantity}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right pl-2">
                  <p className="text-xs font-bold text-slate-900">
                    {formatMoney(item.product.selling_price * item.quantity, currency)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-red-500 hover:text-red-700"
                  >
                    {t.btnRemove}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Selector & Calculations */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          {/* Payment Method Pills */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">{t.paymentMethodLabel}</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
              {[
                { id: 'Cash', label: 'Cash (Espèces)', icon: Banknote },
                { id: 'M-Pesa', label: 'M-Pesa (Vodacom)', icon: Smartphone },
                { id: 'Airtel Money', label: 'Airtel Money', icon: Smartphone },
                { id: 'Orange Money', label: 'Orange Money', icon: Smartphone },
                { id: 'Card', label: lang === 'fr' ? 'Carte Bancaire' : 'Bank Card', icon: CreditCard },
                { id: 'Credit', label: lang === 'fr' ? 'Crédit Client' : 'Customer Credit', icon: Banknote }
              ].map(pm => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`py-1.5 px-2 rounded-lg border text-center text-[11px] transition ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 font-semibold shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pm.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtotals & Taxes breakdown */}
          <div className="space-y-1.5 text-xs pt-1 border-t border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>{t.subtotalHt}</span>
              <span className="font-semibold text-slate-800">{formatMoney(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.vatDgi}</span>
              <span className="font-semibold text-slate-800">{formatMoney(taxAmount, currency)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>{t.discount}</span>
              <div className="flex items-center gap-1">
                <span>$</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={discountAmount || ''}
                  placeholder="0"
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                  className="w-16 px-1.5 py-0.5 text-right border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-300">
              <span>{t.totalToPay}</span>
              <span className="text-teal-700">{formatMoney(finalTotal, currency)}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Checkout Button */}
          <button
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleCheckout}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>{t.btnProcessSale}</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{t.btnValidateSale} ({formatMoney(finalTotal, currency)})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL: Thermal Receipt / Fiscal Preview After Sale */}
      {completedSale && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">{t.receiptTitle}</h3>
              </div>
              <button
                onClick={() => setCompletedSale(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Preview Body (Supports 80mm & 58mm view) */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex flex-col items-center">
              {/* Width toggle */}
              <div className="flex gap-2 mb-3 text-xs no-print">
                <button
                  onClick={() => setReceiptWidth('80mm')}
                  className={`px-2.5 py-1 rounded font-medium ${receiptWidth === '80mm' ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 border'}`}
                >
                  {t.format80mm}
                </button>
                <button
                  onClick={() => setReceiptWidth('58mm')}
                  className={`px-2.5 py-1 rounded font-medium ${receiptWidth === '58mm' ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 border'}`}
                >
                  {t.format58mm}
                </button>
              </div>

              {/* Printable Receipt Paper */}
              <div
                className={`print-area bg-white shadow-md p-4 text-black font-mono border border-slate-300 transition-all ${
                  receiptWidth === '58mm' ? 'w-[58mm] text-[10px]' : 'w-[80mm] text-xs'
                }`}
              >
                {/* Header */}
                <div className="text-center border-b border-dashed pb-2 mb-2">
                  <p className="font-bold text-sm">DRC SMART POS</p>
                  <p className="text-[10px]">COMMERCE & DISTRIBUTION SARL</p>
                  <p className="text-[9px]">14 Blvd du 30 Juin, Gombe, Kinshasa</p>
                  <p className="text-[9px]">RCCM: CD/KIN/RCCM/21-B-04892</p>
                  <p className="text-[9px]">NIF: A2109845X | CDI GOMBE</p>
                </div>

                {/* Meta */}
                <div className="text-[10px] space-y-0.5 border-b border-dashed pb-2 mb-2">
                  <p>{lang === 'fr' ? 'Facture:' : 'Invoice:'} <span className="font-bold">{completedSale.invoice_number}</span></p>
                  <p>Date: {formatDate(completedSale.created_at)}</p>
                  <p>{lang === 'fr' ? 'Caisse: Caisse 01 | Caissier:' : 'Register: POS 01 | Cashier:'} {completedSale.cashier_name}</p>
                  <p>{lang === 'fr' ? 'Client:' : 'Customer:'} {translateCustomerName(completedSale.customer_name, lang) || t.walkInCustomer}</p>
                  <p>{lang === 'fr' ? 'Règlement:' : 'Payment:'} {completedSale.payment_method}</p>
                </div>

                {/* Items */}
                <div className="border-b border-dashed pb-2 mb-2">
                  <div className="flex justify-between font-bold text-[10px] mb-1">
                    <span>{lang === 'fr' ? 'Désignation' : 'Description'}</span>
                    <span>Total</span>
                  </div>
                  {completedSale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] mb-0.5">
                      <span className="truncate pr-1">
                        {item.quantity}× {translateProductName(item.product_name_snapshot, lang)}
                      </span>
                      <span className="font-semibold">${item.line_total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-0.5 text-[10px] border-b border-dashed pb-2 mb-2">
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'Sous-Total HT:' : 'Subtotal (HT):'}</span>
                    <span>${completedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'TVA DGI (16%):' : 'DGI VAT (16%):'}</span>
                    <span>${completedSale.tax_amount.toFixed(2)}</span>
                  </div>
                  {completedSale.discount_amount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'fr' ? 'Remise:' : 'Discount:'}</span>
                      <span>-${completedSale.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t">
                    <span>TOTAL TTC:</span>
                    <span>${completedSale.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Non-Fiscal Demo Disclaimer & Local QR */}
                <div className="text-center pt-1 text-[9px] space-y-1">
                  <div className="p-1 bg-slate-100 border border-slate-300 font-bold text-amber-900 leading-tight">
                    DEMO ONLY — NOT A DGI-VALIDATED / HOMOLOGATED INVOICE.
                  </div>
                  <div className="w-16 h-16 bg-slate-200 border mx-auto flex items-center justify-center text-[8px] font-mono">
                    [QR CODE DEMO]
                  </div>
                  <p className="text-[8px] text-slate-500">{t.thankYou}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 bg-white flex gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" />
                {t.btnPrintReceipt}
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold"
              >
                {t.btnNewSale}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

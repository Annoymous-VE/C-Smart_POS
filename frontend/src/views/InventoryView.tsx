import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Product } from '../types';
import { formatMoney } from '../utils';
import { Language, translations, translateProductName, translateCategory, translateUnit } from '../i18n';
import {
  Package,
  Search,
  Plus,
  ArrowUpDown,
  X
} from 'lucide-react';

interface InventoryViewProps {
  currency: string;
  lang: Language;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Stock Adjustment Modal
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Inventaire physique périodique');

  // New Product Modal
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductData, setNewProductData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    barcode: '',
    category: 'Alimentation',
    unit: 'Pièce',
    cost_price: 10,
    selling_price: 15,
    stock_quantity: 20,
    minimum_stock: 5,
    tax_category: 'STANDARD_16'
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(search, selectedCategory || undefined, lowStockOnly);
      setProducts(data);
    } catch (err: any) {
      alert(err.message || 'Erreur lors du chargement des stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, selectedCategory, lowStockOnly]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct || adjustmentDelta === 0) return;

    try {
      await api.adjustStock(adjustModalProduct.id, adjustmentDelta, adjustmentReason);
      setAdjustModalProduct(null);
      setAdjustmentDelta(0);
      loadProducts();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'ajustement du stock");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct(newProductData);
      setShowNewProductModal(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création du produit');
    }
  };

  const totalStockCount = products.reduce((acc, p) => acc + p.stock_quantity, 0);
  const totalStockCostValue = products.reduce((acc, p) => acc + (p.stock_quantity * p.cost_price), 0);
  const totalStockRetailValue = products.reduce((acc, p) => acc + (p.stock_quantity * p.selling_price), 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header & Valuation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-700" />
            {t.inventoryTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.inventorySubtitle}
          </p>
        </div>
        <button
          onClick={() => setShowNewProductModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow transition"
        >
          <Plus className="w-4 h-4" />
          {t.btnAddProduct}
        </button>
      </div>

      {/* Valuation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiTotalUnits}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStockCount.toLocaleString('fr-FR')}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{products.length} {lang === 'fr' ? 'références actives' : 'active references'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiCostValuation}</p>
          <p className="text-2xl font-bold text-teal-800 mt-1">{formatMoney(totalStockCostValue, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'Investissement stock immobilisé' : 'Tied-up inventory capital'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiRetailValuation}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatMoney(totalStockRetailValue, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? "Chiffre d'affaires potentiel" : 'Estimated retail value'}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchProductPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="">{t.allCategories}</option>
            <option value="Alimentation">{translateCategory('Alimentation', lang)}</option>
            <option value="Boissons">{translateCategory('Boissons', lang)}</option>
            <option value="Électronique">{translateCategory('Électronique', lang)}</option>
            <option value="Hygiène">{translateCategory('Hygiène', lang)}</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>{t.filterLowStockOnly}</span>
          </label>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.colProduct}</th>
                <th className="py-3 px-3">{t.colSku}</th>
                <th className="py-3 px-3">{t.colCategory}</th>
                <th className="py-3 px-3 text-right">{t.colBuyPrice}</th>
                <th className="py-3 px-3 text-right">{t.colSellPrice}</th>
                <th className="py-3 px-3 text-right">{t.colStockQty}</th>
                <th className="py-3 px-3 text-right">{t.colMinThreshold}</th>
                <th className="py-3 px-3 text-center">{t.colStatus}</th>
                <th className="py-3 px-4 text-center">{t.colAdjust}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const isOutOfStock = p.stock_quantity <= 0;
                const isLowStock = p.stock_quantity > 0 && p.stock_quantity <= p.minimum_stock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{translateProductName(p.name, lang)}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      <div>{p.sku}</div>
                      {p.barcode && <div className="text-slate-400 text-[10px]">{p.barcode}</div>}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{translateCategory(p.category, lang)}</td>
                    <td className="py-3 px-3 text-right text-slate-500">{formatMoney(p.cost_price, currency)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{formatMoney(p.selling_price, currency)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">
                      {p.stock_quantity} <span className="font-normal text-[10px] text-slate-400">{translateUnit(p.unit, lang)}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{p.minimum_stock}</td>
                    <td className="py-3 px-3 text-center">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          {t.statusOut}
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {t.statusLow}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                          {t.statusNormal}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setAdjustModalProduct(p);
                          setAdjustmentDelta(0);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-teal-700 transition"
                        title={t.modalAdjustTitle}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Stock Adjustment */}
      {adjustModalProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">{t.modalAdjustTitle}</h3>
              <button onClick={() => setAdjustModalProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <p className="font-medium text-slate-700">{t.colProduct}: <span className="font-bold text-slate-900">{translateProductName(adjustModalProduct.name, lang)}</span></p>
                <p className="text-slate-500">{t.colInStock}: <span className="font-bold text-slate-800">{adjustModalProduct.stock_quantity}</span> {translateUnit(adjustModalProduct.unit, lang)}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.modalVariation}
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentDelta}
                  onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold text-center"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.modalNewStock} <span className="font-bold text-teal-700">{adjustModalProduct.stock_quantity + adjustmentDelta}</span>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.modalReason}</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="Inventaire physique périodique">{lang === 'fr' ? 'Inventaire physique périodique' : 'Periodic physical audit'}</option>
                  <option value="Avarie / Casse constatée">{lang === 'fr' ? 'Avarie / Casse constatée' : 'Damaged / Expired stock'}</option>
                  <option value="Correction erreur de saisie">{lang === 'fr' ? 'Correction erreur de saisie' : 'Data entry correction'}</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500"
                >
                  {t.btnSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: New Product */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">{t.modalNewProductTitle}</h3>
              <button onClick={() => setShowNewProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">{t.colProduct}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Eau Minérale Swissta 500ml"
                    value={newProductData.name || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colSku}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: EAU-SW500"
                    value={newProductData.sku || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, sku: e.target.value.toUpperCase() })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code-barres</label>
                  <input
                    type="text"
                    placeholder="Ex: 6002001009"
                    value={newProductData.barcode || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, barcode: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colCategory}</label>
                  <select
                    value={newProductData.category || 'Alimentation'}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Alimentation">{lang === 'fr' ? 'Alimentation' : 'Food & Staples'}</option>
                    <option value="Boissons">{lang === 'fr' ? 'Boissons' : 'Beverages'}</option>
                    <option value="Électronique">{lang === 'fr' ? 'Électronique' : 'Electronics'}</option>
                    <option value="Hygiène">{lang === 'fr' ? 'Hygiène' : 'Household & Personal Care'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unité</label>
                  <input
                    type="text"
                    placeholder="Sac, Pièce, Bouteille..."
                    value={newProductData.unit || 'Pièce'}
                    onChange={(e) => setNewProductData({ ...newProductData, unit: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colBuyPrice} ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProductData.cost_price ?? ''}
                    onChange={(e) => setNewProductData({ ...newProductData, cost_price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colSellPrice} ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProductData.selling_price ?? ''}
                    onChange={(e) => setNewProductData({ ...newProductData, selling_price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold text-teal-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colStockQty}</label>
                  <input
                    type="number"
                    required
                    value={newProductData.stock_quantity ?? ''}
                    onChange={(e) => setNewProductData({ ...newProductData, stock_quantity: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colMinThreshold}</label>
                  <input
                    type="number"
                    required
                    value={newProductData.minimum_stock ?? ''}
                    onChange={(e) => setNewProductData({ ...newProductData, minimum_stock: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500"
                >
                  {t.btnSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

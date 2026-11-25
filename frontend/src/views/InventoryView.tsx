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
  X,
  AlertTriangle,
  Boxes,
  DollarSign
} from 'lucide-react';
import { Button, Badge, Card, StatCard, Modal } from '../components/ui';

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
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0D9488]" />
            {t.inventoryTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.inventorySubtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewProductModal(true)}
        >
          {t.btnAddProduct}
        </Button>
      </div>

      {/* Valuation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={t.kpiTotalUnits}
          value={totalStockCount.toLocaleString('fr-FR')}
          subtitle={`${products.length} ${lang === 'fr' ? 'références en catalogue' : 'catalog references'}`}
          icon={<Boxes className="w-4 h-4" />}
        />
        <StatCard
          title={t.kpiCostValuation}
          value={formatMoney(totalStockCostValue, currency)}
          subtitle={lang === 'fr' ? 'Investissement stock immobilisé' : 'Tied-up inventory capital'}
          icon={<DollarSign className="w-4 h-4 text-teal-700" />}
        />
        <StatCard
          title={t.kpiRetailValuation}
          value={formatMoney(totalStockRetailValue, currency)}
          subtitle={lang === 'fr' ? "Chiffre d'affaires potentiel" : 'Estimated retail value'}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Filters & Search Toolbar */}
      <Card padding="sm" className="bg-white">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchProductPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D9488] transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
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
                className="rounded text-[#0D9488] focus:ring-[#0D9488] w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold">{t.filterLowStockOnly}</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card padding="none" className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{t.colProduct}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colSku}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colCategory}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colBuyPrice}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colSellPrice}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colStockQty}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colMinThreshold}</th>
                <th className="py-2.5 px-3 font-semibold text-center">{t.colStatus}</th>
                <th className="py-2.5 px-4 font-semibold text-center">{t.colAdjust}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const isOutOfStock = p.stock_quantity <= 0;
                const isLowStock = p.stock_quantity > 0 && p.stock_quantity <= p.minimum_stock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{translateProductName(p.name, lang)}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      <div>{p.sku}</div>
                      {p.barcode && <div className="text-slate-400 text-[10px]">{p.barcode}</div>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{translateCategory(p.category, lang)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">{formatMoney(p.cost_price, currency)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatMoney(p.selling_price, currency)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      {p.stock_quantity} <span className="font-normal font-sans text-[10px] text-slate-400">{translateUnit(p.unit, lang)}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">{p.minimum_stock}</td>
                    <td className="py-2.5 px-3 text-center">
                      {isOutOfStock ? (
                        <Badge variant="rose" size="sm" dot>{t.statusOut}</Badge>
                      ) : isLowStock ? (
                        <Badge variant="amber" size="sm" dot>{t.statusLow}</Badge>
                      ) : (
                        <Badge variant="teal" size="sm" dot>{t.statusNormal}</Badge>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setAdjustModalProduct(p);
                          setAdjustmentDelta(0);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-[#0D9488] transition"
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
      </Card>

      {/* MODAL: Stock Adjustment */}
      <Modal
        isOpen={Boolean(adjustModalProduct)}
        onClose={() => setAdjustModalProduct(null)}
        title={t.modalAdjustTitle}
        subtitle={adjustModalProduct ? `${translateProductName(adjustModalProduct.name, lang)} (${adjustModalProduct.sku})` : undefined}
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAdjustModalProduct(null)}
            >
              {t.btnCancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdjustStock}
            >
              {t.btnSave}
            </Button>
          </>
        }
      >
        {adjustModalProduct && (
          <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
            <div className="bg-[#F5F7FA] p-3 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-700">{t.colInStock}: <span className="font-mono font-bold text-slate-900">{adjustModalProduct.stock_quantity}</span> {translateUnit(adjustModalProduct.unit, lang)}</p>
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
                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold font-mono text-center focus:outline-none focus:border-[#0D9488]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {t.modalNewStock} <span className="font-mono font-bold text-[#0D9488]">{adjustModalProduct.stock_quantity + adjustmentDelta}</span>
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.modalReason}</label>
              <select
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0D9488]"
              >
                <option value="Inventaire physique périodique">{lang === 'fr' ? 'Inventaire physique périodique' : 'Periodic physical audit'}</option>
                <option value="Avarie / Casse constatée">{lang === 'fr' ? 'Avarie / Casse constatée' : 'Damaged / Expired stock'}</option>
                <option value="Correction erreur de saisie">{lang === 'fr' ? 'Correction erreur de saisie' : 'Data entry correction'}</option>
              </select>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL: New Product */}
      <Modal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        title={t.modalNewProductTitle}
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowNewProductModal(false)}
            >
              {t.btnCancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateProduct}
            >
              {t.btnSave}
            </Button>
          </>
        }
      >
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
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
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Code-barres</label>
              <input
                type="text"
                placeholder="Ex: 6002001009"
                value={newProductData.barcode || ''}
                onChange={(e) => setNewProductData({ ...newProductData, barcode: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colCategory}</label>
              <select
                value={newProductData.category || 'Alimentation'}
                onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
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
                className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
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
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold text-[#0D9488] focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colStockQty}</label>
              <input
                type="number"
                required
                value={newProductData.stock_quantity ?? ''}
                onChange={(e) => setNewProductData({ ...newProductData, stock_quantity: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colMinThreshold}</label>
              <input
                type="number"
                required
                value={newProductData.minimum_stock ?? ''}
                onChange={(e) => setNewProductData({ ...newProductData, minimum_stock: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

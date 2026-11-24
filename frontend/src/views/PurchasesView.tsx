import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Purchase, Supplier, Product } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations, translateProductName } from '../i18n';
import {
  Truck,
  Plus,
  CheckCircle,
  PackageCheck,
  Building2,
  Clock,
  X,
  PlusCircle,
  Trash2
} from 'lucide-react';

interface PurchasesViewProps {
  currency: string;
  lang: Language;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New PO modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [poItems, setPoItems] = useState<Array<{ product_id: number; quantity: number; unit_cost: number }>>([
    { product_id: 1, quantity: 10, unit_cost: 15 }
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [purchasesData, suppliersData, productsData] = await Promise.all([
        api.getPurchases(),
        api.getSuppliers(),
        api.getProducts()
      ]);
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
      setProducts(productsData);
      if (suppliersData.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(suppliersData[0].id);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors du chargement des approvisionnements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReceiveGoods = async (purchaseId: number) => {
    const confirmMsg = lang === 'fr'
      ? 'Confirmez-vous la réception complète des marchandises en stock ?'
      : 'Do you confirm full goods delivery into inventory?';
    if (!confirm(confirmMsg)) return;

    try {
      await api.receivePurchase(purchaseId);
      alert(lang === 'fr' ? 'Marchandises réceptionnées avec succès ! Le stock a été incrémenté.' : 'Goods received successfully! Inventory incremented.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la réception');
    }
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || poItems.length === 0) return;

    try {
      await api.createPurchase({
        supplier_id: selectedSupplierId,
        currency,
        items: poItems
      });
      setShowModal(false);
      setPoItems([{ product_id: products[0]?.id || 1, quantity: 10, unit_cost: 15 }]);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création du bon de commande');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-700" />
            {t.purchasesTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.purchasesSubtitle}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow transition"
        >
          <Plus className="w-4 h-4" />
          {t.btnNewPo}
        </button>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchases.map((po) => {
          const isReceived = po.status === 'RECEIVED';
          return (
            <div key={po.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isReceived ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {isReceived ? <PackageCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{po.reference}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isReceived ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isReceived ? t.poReceived : t.poPending}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {t.poSupplier}: <strong className="text-slate-800">{po.supplier_name}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">{t.poTotalAmount}</p>
                    <p className="text-base font-bold text-teal-800">{formatMoney(po.total, currency)}</p>
                  </div>

                  {!isReceived && (
                    <button
                      onClick={() => handleReceiveGoods(po.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t.btnReceiveStock}
                    </button>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 bg-slate-50 border-y border-slate-100">
                    <tr>
                      <th className="py-2 px-3">{t.colOrderedItem}</th>
                      <th className="py-2 px-3 text-right">{t.colQty}</th>
                      <th className="py-2 px-3 text-right">{t.colUnitCost}</th>
                      <th className="py-2 px-3 text-right">{t.colLineTotal}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {po.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium text-slate-800">{translateProductName(item.product_name_snapshot, lang)}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2 px-3 text-right text-slate-600">{formatMoney(item.unit_cost, currency)}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">{formatMoney(item.line_total, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                <span>{t.poCreatedOn} {formatDate(po.created_at)}</span>
                {po.received_at && <span className="text-emerald-700 font-medium">{t.poReceivedOn} {formatDate(po.received_at)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: New Purchase Order */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">{t.modalPoTitle}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.modalSelectSupplier}</label>
                <select
                  value={selectedSupplierId || ''}
                  onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-medium"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (RCCM: {s.rccm || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items in PO */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-700">{lang === 'fr' ? "Lignes d'Articles" : 'Item Rows'}</label>
                  <button
                    type="button"
                    onClick={() => setPoItems([...poItems, { product_id: products[0]?.id || 1, quantity: 5, unit_cost: 10 }])}
                    className="text-teal-700 hover:text-teal-800 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> {t.btnAddLine}
                  </button>
                </div>

                {poItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <select
                      value={item.product_id}
                      onChange={(e) => {
                        const newProdId = Number(e.target.value);
                        const prod = products.find(p => p.id === newProdId);
                        const updated = [...poItems];
                        updated[idx].product_id = newProdId;
                        if (prod) updated[idx].unit_cost = prod.cost_price;
                        setPoItems(updated);
                      }}
                      className="flex-1 p-1.5 border border-slate-200 rounded text-xs"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{translateProductName(p.name, lang)}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...poItems];
                        updated[idx].quantity = Number(e.target.value);
                        setPoItems(updated);
                      }}
                      className="w-16 p-1.5 border border-slate-200 rounded text-center text-xs"
                    />

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Coût $"
                      value={item.unit_cost}
                      onChange={(e) => {
                        const updated = [...poItems];
                        updated[idx].unit_cost = Number(e.target.value);
                        setPoItems(updated);
                      }}
                      className="w-20 p-1.5 border border-slate-200 rounded text-right text-xs"
                    />

                    {poItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPoItems(poItems.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500"
                >
                  {t.btnValidatePo}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

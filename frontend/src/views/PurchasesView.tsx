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
import { Button, Badge, Card, Modal } from '../components/ui';

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
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0D9488]" />
            {t.purchasesTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.purchasesSubtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          {t.btnNewPo}
        </Button>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchases.map((po) => {
          const isReceived = po.status === 'RECEIVED';
          return (
            <Card key={po.id} padding="none" className="overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-[#F5F7FA]">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isReceived ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {isReceived ? <PackageCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{po.reference}</span>
                      <Badge variant={isReceived ? 'teal' : 'amber'} size="sm" dot>
                        {isReceived ? t.poReceived : t.poPending}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {t.poSupplier}: <strong className="text-slate-800">{po.supplier_name}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 font-medium">{t.poTotalAmount}</p>
                    <p className="text-base font-mono font-bold text-[#0D9488]">{formatMoney(po.total, currency)}</p>
                  </div>

                  {!isReceived && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => handleReceiveGoods(po.id)}
                    >
                      {t.btnReceiveStock}
                    </Button>
                  )}
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 bg-white border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">{t.colOrderedItem}</th>
                      <th className="py-2.5 px-3 font-semibold text-right">{t.colQty}</th>
                      <th className="py-2.5 px-3 font-semibold text-right">{t.colUnitCost}</th>
                      <th className="py-2.5 px-4 font-semibold text-right">{t.colLineTotal}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {po.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-medium text-slate-800">{translateProductName(item.product_name_snapshot, lang)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatMoney(item.unit_cost, currency)}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatMoney(item.line_total, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                <span>{t.poCreatedOn} {formatDate(po.created_at)}</span>
                {po.received_at && (
                  <span className="text-emerald-700 font-medium">{t.poReceivedOn} {formatDate(po.received_at)}</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL: New Purchase Order */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t.modalPoTitle}
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowModal(false)}
            >
              {t.btnCancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePO}
            >
              {t.btnSave}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.modalSelectSupplier}</label>
            <select
              value={selectedSupplierId || ''}
              onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#0D9488]"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (RCCM: {s.rccm || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-700">{lang === 'fr' ? 'Lignes de Commande' : 'Order Lines'}</label>
              <button
                type="button"
                onClick={() => setPoItems([...poItems, { product_id: products[0]?.id || 1, quantity: 5, unit_cost: 10 }])}
                className="text-xs text-[#0D9488] hover:text-[#0F766E] font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {t.btnAddLine}
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {poItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-[#F5F7FA] rounded-lg border border-slate-200">
                  <select
                    value={item.product_id}
                    onChange={(e) => {
                      const newItems = [...poItems];
                      newItems[idx].product_id = Number(e.target.value);
                      const prod = products.find(p => p.id === Number(e.target.value));
                      if (prod) newItems[idx].unit_cost = prod.cost_price;
                      setPoItems(newItems);
                    }}
                    className="flex-1 p-1.5 border border-slate-200 rounded text-xs bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {translateProductName(p.name, lang)} ({p.sku})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...poItems];
                      newItems[idx].quantity = Number(e.target.value);
                      setPoItems(newItems);
                    }}
                    placeholder="Qté"
                    className="w-16 p-1.5 border border-slate-200 rounded text-xs text-center font-mono bg-white"
                  />

                  <input
                    type="number"
                    step="0.1"
                    value={item.unit_cost}
                    onChange={(e) => {
                      const newItems = [...poItems];
                      newItems[idx].unit_cost = Number(e.target.value);
                      setPoItems(newItems);
                    }}
                    placeholder="Prix U"
                    className="w-20 p-1.5 border border-slate-200 rounded text-xs text-right font-mono bg-white"
                  />

                  {poItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPoItems(poItems.filter((_, i) => i !== idx))}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

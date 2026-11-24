import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Supplier } from '../types';
import { formatMoney } from '../utils';
import { Language, translations } from '../i18n';
import { Building2, Search, Plus, X } from 'lucide-react';

interface SuppliersViewProps {
  currency: string;
  lang: Language;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    phone: '',
    email: '',
    address: 'Kinshasa',
    nif: '',
    rccm: ''
  });

  const loadSuppliers = async () => {
    try {
      const data = await api.getSuppliers(search);
      setSuppliers(data);
    } catch (err: any) {
      alert(err.message || 'Erreur chargement fournisseurs');
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSupplier(newSupplier);
      setShowModal(false);
      loadSuppliers();
    } catch (err: any) {
      alert(err.message || 'Erreur création fournisseur');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            {t.suppliersTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.suppliersSubtitle}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          {t.btnNewSupplier}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'fr' ? "Rechercher par raison sociale, RCCM ou NIF..." : "Search by company name, RCCM or NIF..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">{lang === 'fr' ? 'Fournisseur / Raison Sociale' : 'Supplier / Company'}</th>
              <th className="py-3 px-3">{t.colRccm}</th>
              <th className="py-3 px-3">{t.colTaxNif}</th>
              <th className="py-3 px-3">{t.colPhone}</th>
              <th className="py-3 px-3">{t.colAddress}</th>
              <th className="py-3 px-3 text-right">{t.colSupplierBal}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{s.rccm || '-'}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-teal-800 font-semibold">{s.nif || '-'}</td>
                <td className="py-3 px-3 text-slate-600">{s.phone || '-'}</td>
                <td className="py-3 px-3 text-slate-500">{s.address || 'Kinshasa'}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-800">{formatMoney(s.current_balance, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">{t.btnNewSupplier}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">{lang === 'fr' ? 'Raison Sociale' : 'Company Name'}</label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">RCCM</label>
                  <input
                    type="text"
                    value={newSupplier.rccm}
                    onChange={e => setNewSupplier({ ...newSupplier, rccm: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">NIF</label>
                  <input
                    type="text"
                    value={newSupplier.nif}
                    onChange={e => setNewSupplier({ ...newSupplier, nif: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">{t.colPhone}</label>
                <input
                  type="text"
                  value={newSupplier.phone}
                  onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{t.colAddress}</label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={e => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 rounded-lg">{t.btnCancel}</button>
                <button type="submit" className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-bold">{t.btnSave}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

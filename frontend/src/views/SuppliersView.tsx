import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Supplier } from '../types';
import { formatMoney } from '../utils';
import { Language, translations } from '../i18n';
import { Building2, Search, Plus, X } from 'lucide-react';
import { Button, Badge, Card, Modal } from '../components/ui';

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
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0D9488]" />
            {t.suppliersTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.suppliersSubtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          {t.btnNewSupplier}
        </Button>
      </div>

      <Card padding="sm" className="bg-white">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'fr' ? "Rechercher par raison sociale, RCCM ou NIF..." : "Search by company name, RCCM or NIF..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D9488] transition"
          />
        </div>
      </Card>

      <Card padding="none" className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{lang === 'fr' ? 'Fournisseur / Raison Sociale' : 'Supplier / Company'}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colRccm}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colTaxNif}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colPhone}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colAddress}</th>
                <th className="py-2.5 px-4 font-semibold text-right">{t.colSupplierBal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div>{s.name}</div>
                    {s.email && <div className="text-[10px] font-normal text-slate-400">{s.email}</div>}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {s.rccm ? <span className="text-[11px]">{s.rccm}</span> : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                    {s.nif ? <Badge variant="slate" size="sm">{s.nif}</Badge> : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{s.phone || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{s.address || '-'}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatMoney(s.current_balance, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: New Supplier */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t.btnNewSupplier}
        maxWidth="md"
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
              onClick={handleCreate}
            >
              {t.btnSave}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Raison Sociale Fournisseur' : 'Supplier Business Name'}</label>
            <input
              type="text"
              required
              placeholder="Ex: Bralima RDC SA"
              value={newSupplier.name || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">RCCM</label>
              <input
                type="text"
                placeholder="Ex: CD/KIN/RCCM/14-B-2091"
                value={newSupplier.rccm || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, rccm: e.target.value.toUpperCase() })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIF (DGI)</label>
              <input
                type="text"
                placeholder="Ex: A0701234M"
                value={newSupplier.nif || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, nif: e.target.value.toUpperCase() })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:border-[#0D9488]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colPhone}</label>
              <input
                type="text"
                placeholder="+243 99 876 5432"
                value={newSupplier.phone || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="ventes@fournisseur.cd"
                value={newSupplier.email || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.colAddress}</label>
            <input
              type="text"
              placeholder="Ex: Av. des Brasseries, Barumbu, Kinshasa"
              value={newSupplier.address || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

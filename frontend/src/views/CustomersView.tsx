import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Customer } from '../types';
import { formatMoney } from '../utils';
import { Language, translations, translateCustomerName } from '../i18n';
import { Users, Search, Plus, X, Building, Phone, Mail, MapPin } from 'lucide-react';
import { Button, Badge, Card, Modal } from '../components/ui';

interface CustomersViewProps {
  currency: string;
  lang: Language;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: 'Kinshasa',
    nif: '',
    credit_limit: 1000,
    opening_balance: 0
  });

  const loadCustomers = async () => {
    try {
      const data = await api.getCustomers(search);
      setCustomers(data);
    } catch (err: any) {
      alert(err.message || 'Erreur chargement clients');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCustomer(newCustomer);
      setShowModal(false);
      loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Erreur création client');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0D9488]" />
            {t.customersTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.customersSubtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          {t.btnNewCustomer}
        </Button>
      </div>

      {/* Search Toolbar */}
      <Card padding="sm" className="bg-white">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'fr' ? "Rechercher par raison sociale, téléphone ou NIF fiscal..." : "Search by company name, phone or tax NIF..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#0D9488] transition"
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{lang === 'fr' ? 'Raison Sociale / Nom' : 'Business Name'}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colTaxNif}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colPhone}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colAddress}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colCreditLimit}</th>
                <th className="py-2.5 px-4 font-semibold text-right">{t.colBalanceDue}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div>{translateCustomerName(c.name, lang)}</div>
                    {c.email && <div className="text-[10px] font-normal text-slate-400">{c.email}</div>}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                    {c.nif ? (
                      <Badge variant="slate" size="sm">{c.nif}</Badge>
                    ) : (
                      <span className="text-slate-400 font-sans text-[11px]">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{c.phone || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{c.address || '-'}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatMoney(c.credit_limit, currency)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                    {c.current_balance > 0 ? (
                      <span className="text-amber-800">{formatMoney(c.current_balance, currency)}</span>
                    ) : (
                      <span className="text-emerald-700">{formatMoney(0, currency)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: New Customer */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t.btnNewCustomer}
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
            <label className="block font-semibold text-slate-700 mb-1">{lang === 'fr' ? 'Raison Sociale / Nom' : 'Business Name'}</label>
            <input
              type="text"
              required
              placeholder="Ex: Supermarché Kin-Express SARL"
              value={newCustomer.name || ''}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colTaxNif} (DGI RDC)</label>
              <input
                type="text"
                placeholder="Ex: A2109845X"
                value={newCustomer.nif || ''}
                onChange={(e) => setNewCustomer({ ...newCustomer, nif: e.target.value.toUpperCase() })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colPhone}</label>
              <input
                type="text"
                placeholder="+243 81 234 5678"
                value={newCustomer.phone || ''}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="contact@entreprise.cd"
              value={newCustomer.email || ''}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.colAddress}</label>
            <input
              type="text"
              placeholder="Kinshasa, Gombe, Blvd du 30 Juin"
              value={newCustomer.address || ''}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.colCreditLimit} ($)</label>
            <input
              type="number"
              step="50"
              value={newCustomer.credit_limit ?? 1000}
              onChange={(e) => setNewCustomer({ ...newCustomer, credit_limit: Number(e.target.value) })}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

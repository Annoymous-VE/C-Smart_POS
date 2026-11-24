import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Expense } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations, translateExpenseCategory } from '../i18n';
import { Receipt, Plus, X } from 'lucide-react';

interface ExpensesViewProps {
  currency: string;
  lang: Language;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'Groupe Électrogène & Carburant',
    description: '',
    amount: 50,
    currency: 'USD',
    payment_method: 'Cash'
  });

  const loadExpenses = async () => {
    try {
      const data = await api.getExpenses(categoryFilter || undefined);
      setExpenses(data);
    } catch (err: any) {
      alert(err.message || 'Erreur chargement dépenses');
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createExpense(newExpense);
      setShowModal(false);
      setNewExpense({
        category: 'Groupe Électrogène & Carburant',
        description: '',
        amount: 50,
        currency: 'USD',
        payment_method: 'Cash'
      });
      loadExpenses();
    } catch (err: any) {
      alert(err.message || 'Erreur création dépense');
    }
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-700" />
            {t.expensesTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.expensesSubtitle}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          {t.btnNewExpense}
        </button>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiTotalExpenses}</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{formatMoney(totalExpenses, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{expenses.length} {lang === 'fr' ? 'opérations imputées' : 'recorded entries'}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
        >
          <option value="">{lang === 'fr' ? 'Toutes les Catégories de Dépenses' : 'All Expense Categories'}</option>
          <option value="Groupe Électrogène & Carburant">{lang === 'fr' ? 'Groupe Électrogène & Carburant' : 'Generator & Fuel'}</option>
          <option value="Loyer & Charges">{lang === 'fr' ? 'Loyer & Charges' : 'Rent & Maintenance'}</option>
          <option value="Électricité & Eau">{lang === 'fr' ? 'Électricité SNEL & Eau' : 'Utilities (SNEL & Water)'}</option>
          <option value="Logistique & Transport">{lang === 'fr' ? 'Logistique & Transport' : 'Logistics & Transport'}</option>
          <option value="Télécoms & Internet">{lang === 'fr' ? 'Télécoms & Internet' : 'Telecom & Internet'}</option>
          <option value="Fournitures de Bureau">{lang === 'fr' ? 'Fournitures de Bureau' : 'Office Supplies'}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">{t.colDate}</th>
              <th className="py-3 px-3">{t.colExpenseCategory}</th>
              <th className="py-3 px-3">{t.colDescription}</th>
              <th className="py-3 px-3">{t.colPaymentMode}</th>
              <th className="py-3 px-3 text-right">{t.colAmount}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-500">{formatDate(e.expense_date)}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {translateExpenseCategory(e.category, lang)}
                  </span>
                </td>
                <td className="py-3 px-3 font-medium text-slate-800">{e.description}</td>
                <td className="py-3 px-3 text-slate-600">{e.payment_method}</td>
                <td className="py-3 px-3 text-right font-bold text-rose-600">{formatMoney(e.amount, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">{t.btnNewExpense}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">{t.colExpenseCategory}</label>
                <select
                  value={newExpense.category}
                  onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Groupe Électrogène & Carburant">{lang === 'fr' ? 'Groupe Électrogène & Carburant (Gasoil)' : 'Generator & Fuel (Diesel)'}</option>
                  <option value="Loyer & Charges">{lang === 'fr' ? 'Loyer & Charges Locatives' : 'Store Rent & Property'}</option>
                  <option value="Électricité & Eau">{lang === 'fr' ? 'Électricité SNEL & REGIDESO' : 'Utilities (SNEL & REGIDESO)'}</option>
                  <option value="Logistique & Transport">{lang === 'fr' ? 'Logistique & Transport' : 'Logistics & Transport'}</option>
                  <option value="Télécoms & Internet">{lang === 'fr' ? 'Télécoms & Internet Fibre' : 'Fiber Telecom & Internet'}</option>
                  <option value="Fournitures de Bureau">{lang === 'fr' ? 'Fournitures de Bureau / Rouleaux Caisse' : 'Office & Thermal Paper Rolls'}</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">{t.colDescription}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'fr' ? "Ex: 50L Gasoil pour délestage SNEL" : "e.g., 50L Diesel for power backup"}
                  value={newExpense.description}
                  onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">{t.colAmount} ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newExpense.amount ?? ''}
                    onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t.colPaymentMode}</label>
                  <select
                    value={newExpense.payment_method}
                    onChange={e => setNewExpense({ ...newExpense, payment_method: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Cash">Cash (Caisse)</option>
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Bank Transfer">{lang === 'fr' ? 'Virement Bancaire' : 'Bank Transfer'}</option>
                  </select>
                </div>
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

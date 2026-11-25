import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Expense } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations, translateExpenseCategory } from '../i18n';
import { Receipt, Plus, X, Fuel, Home, Zap, Truck, CreditCard, Banknote } from 'lucide-react';
import { Button, Badge, Card, StatCard, Modal } from '../components/ui';

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
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#0D9488]" />
            {t.expensesTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.expensesSubtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          {t.btnNewExpense}
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={t.kpiTotalExpenses}
          value={formatMoney(totalExpenses, currency)}
          subtitle={`${expenses.length} ${lang === 'fr' ? 'opérations imputées' : 'recorded entries'}`}
          icon={<Receipt className="w-4 h-4 text-rose-600" />}
        />
      </div>

      {/* Filter Toolbar */}
      <Card padding="sm" className="bg-white">
        <div className="flex items-center justify-between">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="">{lang === 'fr' ? 'Toutes les Catégories de Dépenses' : 'All Expense Categories'}</option>
            <option value="Groupe Électrogène & Carburant">{lang === 'fr' ? 'Groupe Électrogène & Carburant' : 'Generator & Fuel'}</option>
            <option value="Loyer & Charges">{lang === 'fr' ? 'Loyer & Charges' : 'Rent & Maintenance'}</option>
            <option value="Électricité & Eau">{lang === 'fr' ? 'Électricité SNEL & Eau' : 'Utilities (SNEL & Water)'}</option>
            <option value="Logistique & Transport">{lang === 'fr' ? 'Logistique & Transport' : 'Logistics & Transport'}</option>
          </select>

          <span className="text-[11px] text-slate-500 font-medium">
            {expenses.length} {lang === 'fr' ? 'dépenses enregistrées' : 'recorded expenses'}
          </span>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card padding="none" className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{t.colDate}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colCategory}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colDescription}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colPaymentMode}</th>
                <th className="py-2.5 px-4 font-semibold text-right">{t.colAmount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{formatDate(e.expense_date)}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="slate" size="sm">
                      {translateExpenseCategory(e.category, lang)}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium">{e.description}</td>
                  <td className="py-2.5 px-3 text-slate-600">{e.payment_method}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                    -{formatMoney(e.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: New Expense */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t.btnNewExpense}
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
            <label className="block font-semibold text-slate-700 mb-1">{t.colCategory}</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            >
              <option value="Groupe Électrogène & Carburant">{lang === 'fr' ? 'Groupe Électrogène & Carburant (SNEL)' : 'Generator & Fuel (SNEL Relay)'}</option>
              <option value="Loyer & Charges">{lang === 'fr' ? 'Loyer Magasin & Dépôt' : 'Store & Depot Rent'}</option>
              <option value="Électricité & Eau">{lang === 'fr' ? 'Facture SNEL & Regideso' : 'Electricity & Water'}</option>
              <option value="Logistique & Transport">{lang === 'fr' ? 'Logistique & Transport Kinshasa' : 'Logistics & Urban Transport'}</option>
              <option value="Salaires & Primes">{lang === 'fr' ? 'Salaires & Primes Caissiers' : 'Salaries & Staff Bonuses'}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.colAmount} ($)</label>
            <input
              type="number"
              required
              min="1"
              value={newExpense.amount ?? ''}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.colPaymentMode}</label>
            <select
              value={newExpense.payment_method}
              onChange={(e) => setNewExpense({ ...newExpense, payment_method: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            >
              <option value="Cash">Cash (Espèces Caisse)</option>
              <option value="M-Pesa">M-Pesa (Vodacom)</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Banque">Virement Rawbank USD</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.colDescription}</label>
            <textarea
              required
              rows={2}
              placeholder="Ex: Achat 40L gasoil pour groupe électrogène délestage"
              value={newExpense.description || ''}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

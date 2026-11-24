import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { formatMoney } from '../utils';
import { Language, translations } from '../i18n';
import { Landmark, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';

interface AccountingViewProps {
  currency: string;
  lang: Language;
}

export const AccountingView: React.FC<AccountingViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.getReportsSummary().then(setReport).catch(() => {});
  }, []);

  const totalSales = report?.total_sales || 0;
  const totalExpenses = report?.total_expenses || 0;
  const estimatedNet = report?.net_estimated_margin || 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Landmark className="w-5 h-5 text-teal-700" />
          {t.accountingTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.accountingSubtitle}
        </p>
      </div>

      {/* P&L Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase">{t.kpiRevenueAcc}</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{formatMoney(totalSales, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'Encaissements TTC confirmés' : 'Confirmed retail gross sales'}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase">{t.kpiExpensesAcc}</span>
            <ArrowDownLeft className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{formatMoney(totalExpenses, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'Dépenses opérationnelles payées' : 'Settled operational expenses'}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase">{t.kpiNetProfit}</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className={`text-2xl font-bold ${estimatedNet >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
            {formatMoney(estimatedNet, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'Solde de trésorerie disponible' : 'Available net margin'}</p>
        </div>
      </div>

      {/* Plan Comptable & Accounts Structure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">{t.accountingStructureTitle}</h2>
          <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-mono">
            SYSCOHADA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{t.colAccount}</th>
                <th className="py-2.5 px-3">{t.colAccountName}</th>
                <th className="py-2.5 px-3">{t.colAccountType}</th>
                <th className="py-2.5 px-3 text-right">{t.colDebit}</th>
                <th className="py-2.5 px-3 text-right">{t.colCredit}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">571100</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">{lang === 'fr' ? 'Caisse Centrale Siège Gombe' : 'Main Cash Register Gombe'}</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">Asset (Cash)</td>
                <td className="py-2.5 px-3 text-right text-slate-800">{formatMoney(2450.0, currency)}</td>
                <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">521100</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">{lang === 'fr' ? 'Banque Rawbank Compte Courant USD' : 'Rawbank Commercial Checking USD'}</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">Asset (Bank)</td>
                <td className="py-2.5 px-3 text-right text-slate-800">{formatMoney(15800.0, currency)}</td>
                <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">573100</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">{lang === 'fr' ? 'Compte Marchand M-Pesa / Vodacom' : 'M-Pesa Merchant Account'}</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">Mobile Money</td>
                <td className="py-2.5 px-3 text-right text-slate-800">{formatMoney(1890.0, currency)}</td>
                <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">411100</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">{lang === 'fr' ? 'Clients Ordinaires (Créances B2B)' : 'Trade Accounts Receivable'}</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">Receivable</td>
                <td className="py-2.5 px-3 text-right text-slate-800">{formatMoney(600.0, currency)}</td>
                <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">401100</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">{lang === 'fr' ? "Fournisseurs Dettes d'Achats (Bralima, MIDEMA)" : 'Trade Accounts Payable'}</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">Payable</td>
                <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                <td className="py-2.5 px-3 text-right text-slate-800">{formatMoney(1345.0, currency)}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">443100</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">{lang === 'fr' ? 'TVA Facturée Collectée (DGI 16%)' : 'Output VAT Collected (DGI 16%)'}</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">Tax Liability</td>
                <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                <td className="py-2.5 px-3 text-right text-teal-700 font-bold">{formatMoney(report?.total_tax_collected || 0, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

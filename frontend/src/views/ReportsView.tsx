import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { formatMoney } from '../utils';
import { Language, translations } from '../i18n';
import { BarChart3, Download } from 'lucide-react';

interface ReportsViewProps {
  branchId: number;
  currency: string;
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ branchId, currency, lang }) => {
  const t = translations[lang];
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.getReportsSummary(branchId)
      .then(setReport)
      .catch(err => alert(err.message));
  }, [branchId]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-700" />
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.reportsSubtitle}
          </p>
        </div>

        <a
          href={api.exportSalesCsvUrl}
          download="drc_smart_pos_sales.csv"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow transition"
        >
          <Download className="w-4 h-4" />
          {t.btnExportCsv}
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiTotalRevenue}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(report?.total_sales || 0, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{report?.total_transactions || 0} {lang === 'fr' ? 'ventes enregistrées' : 'transactions'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiVatCollected}</p>
          <p className="text-2xl font-bold text-teal-700 mt-1">{formatMoney(report?.total_tax_collected || 0, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'À déclarer au CDI Gombe' : 'Payable to CDI Gombe'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiExpensesAcc}</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{formatMoney(report?.total_expenses || 0, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'Carburant, SNEL, Loyer' : 'Fuel, Utilities, Rent'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">{t.kpiNetProfit}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatMoney(report?.net_estimated_margin || 0, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'fr' ? 'Après imputation dépenses' : 'Net operating margin'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm">{t.top5Products}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{t.colProduct}</th>
                  <th className="py-2.5 px-3 text-right">{t.colQtySold}</th>
                  <th className="py-2.5 px-3 text-right">{t.colTurnover}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(report?.top_selling_products || []).map((p: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{p.quantity_sold}</td>
                    <td className="py-2.5 px-3 text-right text-teal-700 font-bold">{formatMoney(p.revenue, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm">{t.expensesBreakdown}</h2>
          <div className="space-y-3 pt-2">
            {Object.entries(report?.expense_categories || {}).map(([cat, amount]: [string, any]) => {
              const totalExp = report?.total_expenses || 1;
              const percent = Math.round((amount / totalExp) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="font-bold text-slate-900">{formatMoney(amount, currency)} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

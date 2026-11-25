import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { formatMoney } from '../utils';
import { Language, translations, translateProductName, translateExpenseCategory } from '../i18n';
import { BarChart3, Download, TrendingUp, Percent, Receipt, CheckCircle2 } from 'lucide-react';
import { Button, Badge, Card, StatCard } from '../components/ui';

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
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0D9488]" />
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.reportsSubtitle}
          </p>
        </div>

        <a
          href={api.exportSalesCsvUrl}
          download="drc_smart_pos_sales.csv"
          className="inline-flex items-center justify-center font-semibold rounded-lg transition-colors px-3.5 py-2 text-xs gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>{t.btnExportCsv}</span>
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.kpiTotalRevenue}
          value={formatMoney(report?.total_sales || 0, currency)}
          subtitle={`${report?.total_transactions || 0} ${lang === 'fr' ? 'ventes confirmées' : 'confirmed sales'}`}
          icon={<TrendingUp className="w-4 h-4" />}
        />

        <StatCard
          title={t.kpiVatCollected}
          value={formatMoney(report?.total_tax_collected || 0, currency)}
          subtitle={lang === 'fr' ? 'À déclarer au CDI Gombe' : 'Payable to CDI Gombe'}
          icon={<Percent className="w-4 h-4 text-[#0D9488]" />}
        />

        <StatCard
          title={t.kpiExpensesAcc}
          value={formatMoney(report?.total_expenses || 0, currency)}
          subtitle={lang === 'fr' ? 'Carburant, SNEL, Loyers' : 'Fuel, Utilities, Rent'}
          icon={<Receipt className="w-4 h-4 text-rose-600 text-xs" />}
        />

        <StatCard
          title={t.kpiNetProfit}
          value={formatMoney(report?.net_estimated_margin || 0, currency)}
          subtitle={lang === 'fr' ? 'Après charges décaissées' : 'Net operating margin'}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          trend={{ value: 'Net', positive: (report?.net_estimated_margin || 0) >= 0 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card
          title={t.top5Products}
          subtitle={lang === 'fr' ? 'Classement par volume et chiffre d’affaires' : 'Ranked by volume and gross turnover'}
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{t.colProduct}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{t.colQtySold}</th>
                  <th className="py-2.5 px-4 font-semibold text-right">{t.colTurnover}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(report?.top_selling_products || []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-xs text-slate-400">
                      {lang === 'fr' ? 'Aucune vente enregistrée pour le moment' : 'No sales recorded yet'}
                    </td>
                  </tr>
                ) : (
                  (report?.top_selling_products || []).map((p: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{translateProductName(p.name, lang)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{p.quantity_sold}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#0D9488] font-bold">{formatMoney(p.revenue, currency)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Expenses by Category */}
        <Card
          title={lang === 'fr' ? 'Charges par Catégorie' : 'Expenses by Category'}
          subtitle={lang === 'fr' ? 'Dépenses courantes de fonctionnement' : 'Current operating expenses'}
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{t.colCategory}</th>
                  <th className="py-2.5 px-4 font-semibold text-right">{t.colAmount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(() => {
                  const expenseEntries = Object.entries(report?.expense_categories || report?.expenses_by_category || {});
                  if (expenseEntries.length === 0) {
                    return (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-xs text-slate-400">
                          {lang === 'fr' ? 'Aucune charge enregistrée pour cette succursale' : 'No expenses recorded for this branch'}
                        </td>
                      </tr>
                    );
                  }
                  return expenseEntries.map(([cat, amount]: [string, any], idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        <Badge variant="slate" size="sm">{translateExpenseCategory(cat, lang)}</Badge>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                        {formatMoney(amount, currency)}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

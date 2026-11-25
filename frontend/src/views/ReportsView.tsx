import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ReportSummary } from '../types';
import { formatMoney } from '../utils';
import { Language, translations, translateProductName, translateExpenseCategory } from '../i18n';
import { BarChart3, Download, TrendingUp, Percent, Receipt, CheckCircle2, Calendar, Loader2 } from 'lucide-react';
import { Badge, Card, StatCard } from '../components/ui';
import { TrendBarLineChart, DonutChart, HorizontalBarList } from '../components/charts/AnalyticsCharts';

interface ReportsViewProps {
  branchId: number;
  currency: string;
  lang: Language;
}

type DatePreset = 'all' | 'today' | '7d' | '30d';

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getPresetRange(preset: DatePreset): { startDate?: string; endDate?: string } {
  if (preset === 'all') return {};
  const today = new Date();
  const endDate = formatLocalDate(today);

  if (preset === 'today') {
    return { startDate: endDate, endDate };
  }
  const start = new Date(today);
  start.setDate(today.getDate() - (preset === '7d' ? 6 : 29));
  return { startDate: formatLocalDate(start), endDate };
}

export const ReportsView: React.FC<ReportsViewProps> = ({ branchId, currency, lang }) => {
  const t = translations[lang];
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [preset, setPreset] = useState<DatePreset>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const { startDate, endDate } = getPresetRange(preset);

    api.getReportsSummary(branchId, startDate, endDate)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((err) => {
        if (active) alert(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [branchId, preset]);

  const expenseCategories = report?.expense_categories || report?.expenses_by_category || {};
  const expenseEntries = Object.entries(expenseCategories);
  const paymentEntries = Object.entries(report?.payment_methods || {});
  const topProducts = report?.top_selling_products || [];
  const maxProductRevenue = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.revenue)) : 0;

  const presetButtons: Array<{ id: DatePreset; label: string }> = [
    { id: 'all', label: t.filterAllTime },
    { id: 'today', label: t.filterToday },
    { id: '7d', label: t.filter7Days },
    { id: '30d', label: t.filter30Days },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0D9488]" />
            {t.reportsTitle}
            {loading && <Loader2 className="w-4 h-4 text-[#0D9488] animate-spin ml-1" />}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.reportsSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Filter Pills */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mx-1.5" />
            {presetButtons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setPreset(btn.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  preset === btn.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
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

      {/* Sales vs Expenses Time-Series Chart */}
      <Card
        title={t.chartTrendTitle}
        subtitle={t.chartTrendSub}
      >
        <TrendBarLineChart
          data={report?.daily_trend || []}
          currency={currency}
          labels={{
            revenue: t.legendRevenue,
            expenses: t.legendExpenses,
            netMargin: t.legendNetMargin,
            noData: t.chartNoData,
          }}
        />
      </Card>

      {/* Visual Breakdowns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={t.chartPaymentTitle}
          subtitle={t.chartPaymentSub}
        >
          <DonutChart
            items={paymentEntries.map(([label, value]) => ({ label, value }))}
            currency={currency}
            totalLabel={t.chartTotalLabel}
            noDataLabel={t.chartNoData}
          />
        </Card>

        <Card
          title={t.chartExpenseTitle}
          subtitle={t.chartExpenseSub}
        >
          <HorizontalBarList
            items={expenseEntries.map(([cat, amount]) => ({
              label: translateExpenseCategory(cat, lang),
              value: amount,
            }))}
            currency={currency}
            noDataLabel={t.chartNoData}
            barColor="palette"
          />
        </Card>
      </div>

      {/* Detailed Tables Row */}
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
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-xs text-slate-400">
                      {lang === 'fr' ? 'Aucune vente enregistrée pour le moment' : 'No sales recorded yet'}
                    </td>
                  </tr>
                ) : (
                  topProducts.map((p, idx) => {
                    const barPct = maxProductRevenue > 0 ? Math.max(6, Math.round((p.revenue / maxProductRevenue) * 100)) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          <div>{translateProductName(p.name, lang)}</div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 align-top pt-3">
                          {p.quantity_sold}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#0D9488] font-bold align-top pt-3">
                          {formatMoney(p.revenue, currency)}
                        </td>
                      </tr>
                    );
                  })
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
                {expenseEntries.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-xs text-slate-400">
                      {lang === 'fr' ? 'Aucune charge enregistrée pour cette succursale' : 'No expenses recorded for this branch'}
                    </td>
                  </tr>
                ) : (
                  expenseEntries.map(([cat, amount], idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        <Badge variant="slate" size="sm">{translateExpenseCategory(cat, lang)}</Badge>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                        {formatMoney(amount, currency)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

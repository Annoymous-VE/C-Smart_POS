import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { DashboardSummary } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations, translateProductName, translateCategory, translateUnit, translateCustomerName } from '../i18n';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Building
} from 'lucide-react';
import { Button, Badge, Card, StatCard } from '../components/ui';

interface DashboardViewProps {
  branchId: number;
  currency: string;
  lang: Language;
  onNavigate: (tab: string, extra?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ branchId, currency, lang, onNavigate }) => {
  const t = translations[lang];
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<'today' | '7days' | 'month'>('today');

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardSummary(branchId, currency);
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [branchId, currency]);

  if (loading && !summary) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0D9488] mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-500">
            {lang === 'fr' ? 'Chargement des indicateurs commerciaux...' : 'Loading commercial metrics...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-xs">{lang === 'fr' ? 'Connexion impossible au serveur backend' : 'Cannot connect to backend server'}</p>
            <p className="text-[11px] text-rose-600 mt-0.5">{error}</p>
          </div>
          <Button variant="danger" size="sm" onClick={fetchSummary}>
            {lang === 'fr' ? 'Réessayer' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  // Calculate gross margin %
  const totalRevenue = summary?.total_revenue || 0;
  const grossProfit = summary?.gross_profit_estimate || 0;
  const marginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{t.dashboardTitle}</h1>
            <Badge variant="teal" size="sm">Kinshasa RDC</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center bg-[#F5F7FA] rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setPeriodFilter('today')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                periodFilter === 'today'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'fr' ? "Aujourd'hui" : 'Today'}
            </button>
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                periodFilter === '7days'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'fr' ? '7 Jours' : '7 Days'}
            </button>
            <button
              onClick={() => setPeriodFilter('month')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                periodFilter === 'month'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'fr' ? 'Ce Mois' : 'This Month'}
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<ShoppingCart className="w-4 h-4" />}
            onClick={() => onNavigate('pos')}
          >
            {t.openPos}
          </Button>
        </div>
      </div>

      {/* Standardized Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Sales */}
        <StatCard
          title={t.kpiTodaySales}
          value={formatMoney(summary?.today_sales || 0, currency)}
          subtitle={`${summary?.today_transactions_count || 0} ${t.kpiTransactionsToday}`}
          icon={<DollarSign className="w-4 h-4" />}
        />

        {/* Card 2: Total Revenue */}
        <StatCard
          title={t.kpiTotalRevenue}
          value={formatMoney(summary?.total_revenue || 0, currency)}
          subtitle={t.kpiRevenueDesc}
          icon={<TrendingUp className="w-4 h-4" />}
        />

        {/* Card 3: Gross Profit */}
        <StatCard
          title={t.kpiGrossProfit}
          value={formatMoney(summary?.gross_profit_estimate || 0, currency)}
          subtitle={`${t.kpiProfitDesc} (${marginPercent}% margin)`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          trend={{ value: `${marginPercent}%`, positive: marginPercent >= 20 }}
        />

        {/* Card 4: Stock Alerts */}
        <StatCard
          title={t.kpiStockAlerts}
          value={(summary?.low_stock_count || 0) + (summary?.out_of_stock_count || 0)}
          subtitle={`${summary?.out_of_stock_count || 0} ${t.kpiOutOfStock}, ${summary?.low_stock_count || 0} ${t.kpiLowStock}`}
          icon={<AlertTriangle className="w-4 h-4" />}
          onClick={() => onNavigate('inventory')}
        />
      </div>

      {/* Middle Row: Payment Methods Breakdown & Stock Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Breakdown */}
        <Card
          title={t.paymentBreakdownTitle}
          subtitle={t.paymentBreakdownSub}
          padding="md"
        >
          <div className="space-y-3 pt-1">
            {Object.entries(summary?.payment_methods_breakdown || {}).map(([method, amount]) => {
              const total = summary?.total_revenue || 1;
              const percent = Math.round((amount / total) * 100);
              let icon = Banknote;
              if (method.includes('M-Pesa') || method.includes('Airtel') || method.includes('Orange')) {
                icon = Smartphone;
              } else if (method.includes('Card') || method.includes('Carte')) {
                icon = CreditCard;
              }
              const IconComp = icon;

              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-[#0D9488]" />
                      {method}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatMoney(amount, currency)} <span className="text-[10px] text-slate-400 font-sans font-normal">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0D9488] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Low Stock Items preview */}
        <Card
          className="lg:col-span-2"
          title={t.lowStockTitle}
          subtitle={t.lowStockSub}
          action={
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 transition"
            >
              {t.viewAllStock} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{t.colProduct}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.colSku}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.colCategory}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{t.colInStock}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{t.colMinRequired}</th>
                  <th className="py-2.5 px-4 font-semibold text-center">{t.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(summary?.low_stock_products || []).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-900">{translateProductName(p.name, lang)}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{p.sku}</td>
                    <td className="py-2.5 px-3 text-slate-600">{translateCategory(p.category, lang)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {p.stock_quantity} <span className="text-[10px] font-sans font-normal text-slate-500">{translateUnit(p.unit, lang)}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-mono">{p.minimum_stock}</td>
                    <td className="py-2.5 px-4 text-center">
                      {p.stock_quantity <= 0 ? (
                        <Badge variant="rose" size="sm" dot>{t.statusOut}</Badge>
                      ) : (
                        <Badge variant="amber" size="sm" dot>{t.statusLow}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Bottom: Recent Transactions Feed */}
      <Card
        title={t.recentSalesTitle}
        subtitle={t.recentSalesSub}
        action={
          <button
            onClick={() => onNavigate('fiscal')}
            className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 transition"
          >
            {t.fiscalModuleBtn} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        }
        padding="none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{t.colInvoiceNum}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colDate}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colCustomer}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colPayment}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colSubtotal}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colVat}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t.colTotalTtc}</th>
                <th className="py-2.5 px-4 font-semibold text-center">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(summary?.recent_sales || []).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">{sale.invoice_number}</td>
                  <td className="py-2.5 px-3 text-slate-500">{formatDate(sale.created_at)}</td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium">{translateCustomerName(sale.customer_name, lang) || t.walkInCustomer}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="slate" size="sm">{sale.payment_method}</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatMoney(sale.subtotal, currency)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">{formatMoney(sale.tax_amount, currency)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatMoney(sale.total, currency)}</td>
                  <td className="py-2.5 px-4 text-center">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => onNavigate('fiscal', { saleId: sale.id })}
                    >
                      {t.btnFiscalPreview}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { DashboardSummary } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations } from '../i18n';
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
  RefreshCw
} from 'lucide-react';

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
          <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">{lang === 'fr' ? 'Chargement des indicateurs commerciaux de Kinshasa...' : 'Loading Kinshasa commercial metrics...'}</p>
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{lang === 'fr' ? 'Connexion impossible au serveur backend' : 'Cannot connect to backend server'}</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchSummary}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
          >
            {lang === 'fr' ? 'Réessayer' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{t.dashboardTitle}</h1>
            <span className="text-[11px] bg-teal-500/20 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full font-mono">
              Kinshasa RDC
            </span>
          </div>
          <p className="text-xs text-teal-100/80 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('pos')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl text-xs flex items-center gap-2 shadow transition"
          >
            <ShoppingCart className="w-4 h-4" />
            {t.openPos}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Sales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.kpiTodaySales}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(summary?.today_sales || 0, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            <span className="font-semibold text-emerald-600">{summary?.today_transactions_count || 0}</span> {t.kpiTransactionsToday}
          </p>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.kpiTotalRevenue}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(summary?.total_revenue || 0, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{t.kpiRevenueDesc}</p>
        </div>

        {/* Card 3: Gross Profit Estimate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.kpiGrossProfit}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {formatMoney(summary?.gross_profit_estimate || 0, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{t.kpiProfitDesc}</p>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className={`p-5 rounded-xl border shadow-sm ${
          (summary?.low_stock_count || 0) > 0 || (summary?.out_of_stock_count || 0) > 0
            ? 'bg-amber-50/60 border-amber-200'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.kpiStockAlerts}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {(summary?.low_stock_count || 0) + (summary?.out_of_stock_count || 0)}
          </div>
          <p className="text-[11px] text-amber-800 mt-1">
            <span className="font-semibold text-red-600">{summary?.out_of_stock_count || 0}</span> {t.kpiOutOfStock}, <span className="font-semibold">{summary?.low_stock_count || 0}</span> {t.kpiLowStock}
          </p>
        </div>
      </div>

      {/* Middle Row: Payment Methods Breakdown & Stock Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{t.paymentBreakdownTitle}</h2>
            <span className="text-[11px] text-slate-500">{t.paymentBreakdownSub}</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(summary?.payment_methods_breakdown || {}).map(([method, amount]) => {
              const total = summary?.total_revenue || 1;
              const percent = Math.round((amount / total) * 100);
              let icon = Banknote;
              if (method.includes('M-Pesa') || method.includes('Airtel') || method.includes('Orange')) {
                icon = Smartphone;
              } else if (method.includes('Card')) {
                icon = CreditCard;
              }
              const IconComp = icon;

              return (
                <div key={method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-teal-600" />
                      {method}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(amount, currency)} <span className="text-[10px] text-slate-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-600 h-1.5 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Items preview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.lowStockTitle}</h2>
              <p className="text-xs text-slate-500">{t.lowStockSub}</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              {t.viewAllStock} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">{t.colProduct}</th>
                  <th className="py-2 px-3">{t.colSku}</th>
                  <th className="py-2 px-3">{t.colCategory}</th>
                  <th className="py-2 px-3 text-right">{t.colInStock}</th>
                  <th className="py-2 px-3 text-right">{t.colMinRequired}</th>
                  <th className="py-2 px-3 text-center">{t.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(summary?.low_stock_products || []).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{p.sku}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{p.stock_quantity} {p.unit}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{p.minimum_stock}</td>
                    <td className="py-2.5 px-3 text-center">
                      {p.stock_quantity <= 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                          {t.statusOut}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          {t.statusLow}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Transactions Feed */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t.recentSalesTitle}</h2>
            <p className="text-xs text-slate-500">{t.recentSalesSub}</p>
          </div>
          <button
            onClick={() => onNavigate('fiscal')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            {t.fiscalModuleBtn} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{t.colInvoiceNum}</th>
                <th className="py-2.5 px-3">{t.colDate}</th>
                <th className="py-2.5 px-3">{t.colCustomer}</th>
                <th className="py-2.5 px-3">{t.colPayment}</th>
                <th className="py-2.5 px-3 text-right">{t.colSubtotal}</th>
                <th className="py-2.5 px-3 text-right">{t.colVat}</th>
                <th className="py-2.5 px-3 text-right">{t.colTotalTtc}</th>
                <th className="py-2.5 px-3 text-center">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(summary?.recent_sales || []).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{sale.invoice_number}</td>
                  <td className="py-2.5 px-3 text-slate-500">{formatDate(sale.created_at)}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{sale.customer_name || t.walkInCustomer}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{formatMoney(sale.subtotal, currency)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">{formatMoney(sale.tax_amount, currency)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatMoney(sale.total, currency)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onNavigate('fiscal', { saleId: sale.id })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-teal-700 rounded border border-slate-200 text-[11px] font-medium transition"
                    >
                      {t.btnFiscalPreview}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

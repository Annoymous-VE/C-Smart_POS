import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Building2,
  Receipt,
  Landmark,
  Percent,
  FileCheck2,
  ShieldCheck,
  Printer,
  BarChart3
} from 'lucide-react';
import { Language, translations } from '../i18n';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: string;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, userRole, lang }) => {
  const t = translations[lang];

  const groups = [
    {
      label: t.navCommercial,
      items: [
        { id: 'dashboard', label: t.tabDashboard, icon: LayoutDashboard },
        { id: 'pos', label: t.tabPos, icon: ShoppingCart, highlight: true },
        { id: 'inventory', label: t.tabInventory, icon: Package },
        { id: 'purchases', label: t.tabPurchases, icon: Truck },
        { id: 'customers', label: t.tabCustomers, icon: Users },
        { id: 'suppliers', label: t.tabSuppliers, icon: Building2 },
      ]
    },
    {
      label: t.navFinance,
      items: [
        { id: 'expenses', label: t.tabExpenses, icon: Receipt },
        { id: 'accounting', label: t.tabAccounting, icon: Landmark },
        { id: 'taxes', label: t.tabTaxes, icon: Percent },
        { id: 'fiscal', label: t.tabFiscal, icon: FileCheck2, highlight: true },
      ]
    },
    {
      label: t.navAdmin,
      items: [
        { id: 'admin', label: t.tabAdmin, icon: Printer },
      ]
    },
    {
      label: t.navReports,
      items: [
        { id: 'reports', label: t.tabReports, icon: BarChart3 },
      ]
    },
    {
      label: t.navSaas,
      items: [
        { id: 'saas', label: t.tabSaas, icon: ShieldCheck },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen flex-shrink-0 select-none border-r border-slate-800">
      {/* Brand Logo & Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-900/40 font-bold text-xl tracking-wider">
          POS
        </div>
        <div>
          <div className="font-bold text-white text-base leading-tight tracking-wide flex items-center gap-1.5">
            {t.appName}
            <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono font-normal">
              RDC
            </span>
          </div>
          <p className="text-xs text-slate-400">{t.appSubtitle}</p>
        </div>
      </div>

      {/* Module Navigation without module numbering */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs scrollbar-thin scrollbar-thumb-slate-700">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-2.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-950/50'
                      : item.highlight
                      ? 'text-teal-300 hover:bg-slate-800/80 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-xs">
        <div className="flex items-center justify-between text-slate-400 px-1">
          <div>
            <div className="font-medium text-slate-200 truncate">{userRole}</div>
            <div className="text-[10px] text-slate-500">Kinshasa CDI Gombe</div>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title={t.onlineBadge} />
        </div>
      </div>
    </aside>
  );
};

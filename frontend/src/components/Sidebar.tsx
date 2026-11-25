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
  BarChart3,
  Building
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

  // Extract short initials for the user avatar
  const initials = userRole.split('(')[0].trim().slice(0, 2).toUpperCase() || 'OP';

  return (
    <aside className="w-64 bg-[#101B30] text-slate-300 flex flex-col h-screen flex-shrink-0 select-none border-r border-[#182642]">
      {/* Brand Logo & Header */}
      <div className="h-14 px-4 border-b border-[#182642] flex items-center space-x-3 bg-[#0B1322]">
        <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center text-white font-black text-sm tracking-tight shadow-sm">
          POS
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm leading-none tracking-tight flex items-center gap-1.5">
            {t.appName}
            <span className="text-[9px] bg-[#0D9488]/20 text-[#5EEAD4] border border-[#0D9488]/30 px-1 py-0.2 rounded font-mono font-medium">
              RDC
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{t.appSubtitle}</p>
        </div>
      </div>

      {/* Module Navigation without module numbering */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                      ? 'bg-[#0D9488] text-white font-semibold shadow-sm'
                      : item.highlight
                      ? 'text-teal-300 hover:bg-[#182642] hover:text-white'
                      : 'text-slate-300 hover:bg-[#182642] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-[#2DD4BF]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom User Footer */}
      <div className="p-3 border-t border-[#182642] bg-[#0B1322] text-xs">
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <div className="w-8 h-8 rounded-lg bg-[#182642] text-teal-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-slate-700">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate text-xs">{userRole}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-500" />
              <span className="truncate">Kinshasa CDI Gombe</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 flex-shrink-0" title={t.onlineBadge} />
        </div>
      </div>
    </aside>
  );
};

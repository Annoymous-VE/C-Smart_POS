import React from 'react';
import { Store, Languages, UserCheck, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Language, translations } from '../i18n';

interface TopBarProps {
  branchId: number;
  onBranchChange: (id: number) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  lang: Language;
  onLangChange: (l: Language) => void;
  userRole: string;
  onUserRoleChange: (r: string) => void;
  isOfflineDemo: boolean;
  onToggleOffline: () => void;
  onRefreshData?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  branchId,
  onBranchChange,
  currency,
  onCurrencyChange,
  lang,
  onLangChange,
  userRole,
  onUserRoleChange,
  isOfflineDemo,
  onToggleOffline,
  onRefreshData
}) => {
  const t = translations[lang];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between text-sm shadow-sm select-none z-10">
      {/* Left: Branch selector & Store indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200">
          <Store className="w-4 h-4 text-teal-700" />
          <select
            value={branchId}
            onChange={(e) => onBranchChange(Number(e.target.value))}
            className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
          >
            <option value={1}>{t.branchGombe}</option>
            <option value={2}>{t.branchLimete}</option>
          </select>
        </div>

        {/* Refresh button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Rafraîchir / Refresh"
            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-md transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right: Language Switcher, Currency toggle, Offline simulation, Role selector */}
      <div className="flex items-center space-x-3">
        {/* Language Converter Toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
          <div className="pl-2 pr-1 text-slate-500 flex items-center">
            <Languages className="w-3.5 h-3.5" />
          </div>
          <button
            onClick={() => onLangChange('fr')}
            className={`px-2 py-1 rounded-md font-semibold transition ${
              lang === 'fr'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Français (RDC)"
          >
            FR
          </button>
          <button
            onClick={() => onLangChange('en')}
            className={`px-2 py-1 rounded-md font-semibold transition ${
              lang === 'en'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English"
          >
            EN
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              currency === 'USD'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.currencyUsd}
          </button>
          <button
            onClick={() => onCurrencyChange('CDF')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              currency === 'CDF'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.currencyCdf}
          </button>
        </div>

        {/* Demo Offline Toggle */}
        <button
          onClick={onToggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            isOfflineDemo
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Basculer le mode Hors-ligne / Toggle Offline Demo"
        >
          {isOfflineDemo ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.offlineModeActive}</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.onlineMode}</span>
            </>
          )}
        </button>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-slate-600" />
          <select
            value={userRole}
            onChange={(e) => onUserRoleChange(e.target.value)}
            className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="Caissier (Jeanne Kalala)">{t.roleCashier}</option>
            <option value="Directeur Commercial (Patrick Tshisekedi)">{t.roleOwner}</option>
            <option value="Gérant de Dépôt (Michel Mutombo)">{t.roleManager}</option>
            <option value="Comptable (Marie Mwamba)">{t.roleAccountant}</option>
          </select>
        </div>
      </div>
    </header>
  );
};
